# Dear Yesterday — Spencer Plaza Step 3

This build advances the Spencer Plaza world from a static production reference into a motion-comic style interactive scene.

## Step 3 changes
- Reworked `ComicWorldProduction.jsx` into the Step 3 living-world component.
- Uses the approved illustrated Spencer Plaza scene as the base visual.
- Added transparent cutout sprites for vehicles, NPC crowd and foreground props.
- Added animated RX-100 arrival sequence.
- Added moving traffic loops.
- Added subtle NPC/crowd movement.
- Added tap-to-walk controls and left/center/right controls.
- Added camera follow/parallax movement.
- Added NPC talk hotspots.
- Added flyer reveal and Net Café interaction.
- Preserved existing Supabase, DearMail, commerce, payment and account code.

## Important
The visual sheets supplied for the environment are reference/production artwork. Some environment source panels are not fully separated transparent layers, so the build uses the cleanest available base scene plus transparent cutouts. Further art separation can improve the parallax depth in the next pass.

## Verification
The project source was edited and asset references were checked. A full `next build` was not completed in the build environment because dependency installation timed out; run `npm install` and `npm run build` locally/Vercel before replacing the live deployment.
