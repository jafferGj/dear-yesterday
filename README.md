# Dear Yesterday V3 FINAL

Retro social/dating web experience: Chennai 2001 → Spencer Plaza → Net Cafe → DearMail.

## Included in this build
- Guest exploration of Spencer Plaza
- Yamaha RX 100 arrival for guy profile
- Maruti 800 + two accompanying NPCs for girl profile
- Existing retro NPC population
- 120-second flyer discovery (the UI shows the countdown)
- Net Cafe with exactly 20 CRT computers
- Fictional in-world DearMail (not real Gmail)
- Auth, profiles, connection requests, mutual-consent chat
- Realtime DearMail and realtime notifications
- Notification inbox + mark read/all read
- Private WhatsApp/Instagram links revealed only after accepted connection
- Block/report flow
- Passport visits
- Passport+ Razorpay checkout/verification
- Retro shop/commerce hub with external discovery links for clothing, books, music and photography
- Admin moderation dashboard (role-protected by Supabase RLS)
- Editable username, display name, bio, arrival style and private social links
- Locked future-world shelf

## Environment variables
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
NEXT_PUBLIC_SITE_URL

Never commit secrets.

## Supabase setup
1. Open the existing Supabase project.
2. Run `supabase/schema.sql` in SQL Editor.
3. Confirm Auth email settings/redirect URL match your Vercel domain.
4. Create/login with your normal member account.
5. To make yourself the admin, copy your Auth user UUID and run:
   `update public.profiles set role='admin' where id='YOUR-AUTH-USER-UUID';`
6. Sign out/in again. The ADMIN tab will then appear.

## Razorpay
Use Test Mode first. Add the Razorpay environment variables in Vercel.
Webhook endpoint: `https://YOUR-DOMAIN/api/webhook`
The checkout amount in this build is ₹199 for Passport+.
India payment methods are presented by Razorpay Checkout. International methods depend on the methods enabled for your merchant account.

## Deployment
This is a Next.js project. Push the project contents to the root of the existing GitHub repository and let the connected Vercel project redeploy.
