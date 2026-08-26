# Barton Moving Website Action Summary

Date: 2026-07-28

This note consolidates the most relevant action points for the Barton Moving website work with Matthew and Evan based on the existing transcript notes and the current quote-wizard implementation.

## Source material used
- [docs/matthew-voice-notes-2026-06-11.md](docs/matthew-voice-notes-2026-06-11.md)
- [src/QuoteWizard.tsx](src/QuoteWizard.tsx)
- [FINDINGJOBS.md](FINDINGJOBS.md)

## Highest-priority website actions

### 1. Quote-game / estimate flow
- Keep the core choice simple: "contact us" vs. "build your move".
- Use a small set of predefined area tiles for common routes such as Austin, South Austin, North Austin, Georgetown, San Marcos, San Antonio, and a custom-location option for places like Wimberley.
- Make the flow feel like a lightweight game rather than a long form.

### 2. Property-type screen
- Use apartment vs. house visuals with a playful, gamified feel.
- For houses, capture bedrooms and stories.
- For apartments, capture elevator, stairs, and access difficulty because those strongly affect time and price.

### 3. Item selection and packing input
- Let customers choose representative items from categories like furniture, appliances, and specialty items.
- Add a box estimator with clear stack sizes and rough counts.
- Treat the item selection as a shopping-cart-like experience rather than a plain form.

### 4. Crew and pricing guidance
- Use the "salamanders" idea: show how many movers the job likely needs.
- If the selected home size and contents suggest a bigger crew, warn the customer that the move may require more manpower.
- Continue using a pricing model that reflects square footage, distance, stairs, elevator access, parking distance, and specialty items.

### 5. Partner and promo-code support
- Preserve the partner-building promo concept.
- Support apartment-complex discounts such as a code for Windsor on the Lake.
- Keep the promo code flow simple and visible in the estimate experience.

### 6. Brand and UX direction
- Match the site tone and color palette.
- Keep the experience playful and approachable, but still trustworthy.
- A Duolingo-like gamified interaction is a good direction if it remains clear and fast.

## Workstreams for Matthew and Evan

### Immediate implementation priorities
1. Finalize the area-selection set and custom-location fallback.
2. Confirm the apartment/house visual treatment and the property detail inputs.
3. Make the box estimator and crew-suggestion logic feel intuitive instead of overly technical.
4. Ensure promo codes and discounts are wired into the estimate.

### Medium-term growth priorities
1. Add review-request and referral-program flows.
2. Build a lightweight video-content system for local SEO and trust-building.
3. Use short-form video and testimonials to support lead volume and brand visibility.

## Bottom line
The main theme is clear: the Barton Moving website should feel more like a guided, playful quote experience while still producing a realistic estimate. The work should stay focused on making the move planning easier for customers without becoming too complicated.
