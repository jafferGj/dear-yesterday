# Dear Yesterday — Final Production / QA Pass

## Scope
Step 6 project reviewed as the accumulated production build for:

Spencer Plaza 2001 → flyer → Net Café → computer selection → DearMail.

## Checks completed

- JavaScript/JSX syntax transpilation check: PASS
- `page.js`: PASS
- `ComicWorldProduction.jsx`: PASS
- `NetCafeProduction.jsx`: PASS
- CSS brace-balance check: PASS
- Referenced production asset existence: PASS
- Character assets checked for RGBA transparency: PASS
- Existing Supabase schema and API route presence reviewed: PASS for source-level consistency
- Final Net Café production sheet included as a reference asset
- Clean Spencer Plaza main-scene crop added; the previous flattened crop containing the layer guide is retained only as a reference backup
- Clean Net Café main-scene crop added from the approved final Net Café production sheet

## Corrections made in this pass

1. Removed the layer-guide strip from the active Spencer Plaza background.
2. Removed the production-sheet heading from the active Net Café background.
3. Corrected the malformed production-world pointer-events selector in the CSS.
4. Added a proper flyer story beat: the player reads the flyer before entering the Net Café.
5. Added a small flyer close-up/story card with `GO TO NET CAFÉ` and `KEEP EXPLORING` choices.
6. For the girl route, the arrival uses Meera's approved with-bag asset instead of incorrectly showing Arjun on the RX-100.
7. Kept the existing RX-100 arrival for the guy route.
8. Preserved the existing Supabase/DearMail/payment code rather than replacing it.

## Remaining limitations / last-minute recommendations

### 1. Full Next.js production build
A complete `next build` could not be certified in this environment because npm dependency installation repeatedly timed out. The source-level checks above pass, but the final Vercel build must still be run after deployment.

### 2. Girl arrival
The current approved asset set does not contain a Meera-in-Maruti-800 entrance asset. The girl route therefore uses Meera-with-bag for the opening. If the exact Maruti-800 arrival is important, create that asset later; it is not required to complete the current story flow.

### 3. Spencer Plaza artwork authenticity
The supplied production artwork is an illustrated reference, not a historically verified reconstruction. Period signage should be fact-checked before marketing the scene as historically exact.

### 4. Net Café asset granularity
The final production sheet is now the visual source of truth, and the active background uses its clean main-scene crop. For a later high-fidelity animation pass, individual CRTs, chairs, NPCs, ceiling fans and foreground props can be separated into transparent assets. This is an enhancement, not a blocker for the current playable flow.

### 5. Real-device QA still required
Before public launch, test on:
- iPhone Safari
- iPad Safari
- desktop Chrome/Safari
- logged-out guest flow
- logged-in user flow
- email-confirmation flow
- Supabase realtime DearMail
- Razorpay test/live configuration

## Recommended launch order

1. Upload this final ZIP to a new GitHub commit/branch first.
2. Deploy to Vercel preview.
3. Run the complete story manually.
4. Verify Supabase environment variables.
5. Verify Razorpay environment variables/webhook URL.
6. Only then promote to production.
