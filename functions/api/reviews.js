/**
 * GET /api/reviews
 *
 * Returns Google reviews for the Fanny Pack Home Services listing.
 *
 * Bindings (set in Cloudflare dashboard, Settings > Variables and Secrets):
 *   GOOGLE_PLACES_API_KEY  Encrypted secret. Never commit this.
 *   GOOGLE_PLACE_ID        Plain variable. Place IDs are exempt from
 *                          Google's caching restrictions and may be
 *                          stored indefinitely.
 *   REVIEWS_KV             KV namespace binding. Optional. If absent the
 *                          function still works, it just calls the API on
 *                          every request.
 *
 * Billing: the `reviews` field puts this on the Place Details
 * Enterprise + Atmosphere SKU, 1,000 free calls per month, then $25 per
 * 1,000. With CACHE_TTL_SECONDS at six hours this runs about 120 calls a
 * month, inside the free allowance.
 *
 * Caching: Google's Places API policies prohibit storing Places content
 * beyond the allowed exceptions. A short refresh window is the
 * conservative posture. Do not raise CACHE_TTL_SECONDS into days and do
 * not persist review text anywhere else.
 */

const CACHE_TTL_SECONDS = 6 * 60 * 60;
const CACHE_KEY = 'google-reviews-v1';

const FIELD_MASK = [
  'id',
  'rating',
  'userRatingCount',
  'googleMapsUri',
  'reviews',
].join(',');

export async function onRequestGet(context) {
  const { env } = context;

  const apiKey = env.GOOGLE_PLACES_API_KEY;
  const placeId = env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    // Fail through the status code, not through a 200 with an error body.
    // The front end gates on response.ok and falls back to static markup.
    return json(
      { error: 'GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID is not bound' },
      500
    );
  }

  const kv = env.REVIEWS_KV || null;

  if (kv) {
    try {
      const cached = await kv.get(CACHE_KEY, { type: 'json' });
      if (cached) {
        return json(cached, 200, 'HIT');
      }
    } catch (err) {
      // A KV read failure is not a request failure. Fall through to the
      // API and let the response below repopulate the cache.
      console.log('reviews: KV read failed:', err && err.message);
    }
  }

  let upstream;
  try {
    upstream = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': FIELD_MASK,
        },
      }
    );
  } catch (err) {
    console.log('reviews: upstream fetch threw:', err && err.message);
    return json({ error: 'upstream request failed' }, 502);
  }

  if (!upstream.ok) {
    const body = await upstream.text();
    console.log('reviews: upstream', upstream.status, body.slice(0, 500));
    return json(
      { error: 'places api error', status: upstream.status },
      502
    );
  }

  const place = await upstream.json();
  const payload = normalize(place);

  // An empty review array is a real answer, not a failure, but it must not
  // be cached as if it were good data. Surface it and let the front end
  // decide.
  if (kv && payload.reviews.length > 0) {
    try {
      await kv.put(CACHE_KEY, JSON.stringify(payload), {
        expirationTtl: CACHE_TTL_SECONDS,
      });
    } catch (err) {
      console.log('reviews: KV write failed:', err && err.message);
    }
  }

  return json(payload, 200, 'MISS');
}

function normalize(place) {
  const reviews = Array.isArray(place.reviews) ? place.reviews : [];

  return {
    rating: typeof place.rating === 'number' ? place.rating : null,
    userRatingCount:
      typeof place.userRatingCount === 'number' ? place.userRatingCount : 0,
    googleMapsUri: place.googleMapsUri || null,
    fetchedAt: new Date().toISOString(),
    reviews: reviews.map((r) => {
      const author = r.authorAttribution || {};
      return {
        rating: typeof r.rating === 'number' ? r.rating : null,
        text: (r.originalText && r.originalText.text) || (r.text && r.text.text) || '',
        // Google may return a machine translation in `text`. Flag it so the
        // UI can say so, per the Places attribution guidance.
        translated: Boolean(
          r.originalText &&
            r.text &&
            r.originalText.text !== r.text.text
        ),
        relativeTime: r.relativePublishTimeDescription || '',
        publishTime: r.publishTime || null,
        // Attribution is mandatory: author name, photo, and a link back to
        // the review on Google Maps.
        authorName: author.displayName || '',
        authorPhotoUri: author.photoUri || '',
        authorUri: author.uri || '',
        reviewUri: r.googleMapsUri || '',
        flagContentUri: r.flagContentUri || '',
      };
    }),
  };
}

function json(body, status, cacheState) {
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    // Let Cloudflare's edge hold it briefly too. Short, for the same
    // policy reason as the KV TTL.
    'cache-control': 'public, max-age=300',
  };
  if (cacheState) headers['x-reviews-cache'] = cacheState;
  return new Response(JSON.stringify(body), { status, headers });
}
