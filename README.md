# FC27 Meta Score

## Signup email service

The signup form uses the Vercel serverless function in `api/signup.js`. Configure these
private environment variables in the Vercel project before enabling signups:

- `RESEND_API_KEY` — a Resend API key with permission to send mail.
- `RESEND_FROM_EMAIL` — a sender address verified with Resend.
- `UPSTASH_REDIS_REST_URL` — the Upstash Redis REST endpoint.
- `UPSTASH_REDIS_REST_TOKEN` — the Upstash Redis REST token.
- `SIGNUP_HASH_SECRET` — a private random secret of at least 32 bytes used to HMAC email addresses for duplicate detection.

The API stores only an HMAC-SHA-256 fingerprint of each normalized email in Redis for duplicate
detection; names are not retained. Welcome emails are sent by Resend and contain the
confirmation text shown after successful signup. No private credentials belong in
frontend environment variables.

## Development

Run `npm run dev` to start the Vite development server and `npm run build` to build the
static frontend.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
