# AI Tools & Automation Platform

A React + Vite website that demonstrates AI tools for business workflows, including an AI chatbot, email drafting and summarization, social post generation, AI content writing, and automation workflow planning.

**Live website:** https://sales-chatbot-3-mu.vercel.app/

## Features

- **AI Chatbot** — business-knowledge-based customer support demo.
- **Email Sender & Reader** — draft emails and summarize pasted messages; sending requires a configured Resend account and approved recipient allowlist.
- **Auto Post Generator** — create social captions and hashtags, with optional AI-generated images.
- **AI Automation Builder** — prepare workflow plans and example outputs. Actual execution requires a secure HTTPS workflow webhook.
- **AI Content Writer** — prepare business copy from a supplied brief.
- **Supabase Edge Function** — server-side API for AI generation and protected actions.

Some integrations require provider credentials and setup before they can run. A visible demo or generated workflow plan does not mean an external email, post, or automation has been executed.

## Requirements

- Node.js 20 or newer (Node.js 22 LTS recommended)
- npm
- A Supabase project for backend actions
- A Gemini API key for AI generation
- Optional: Resend account for email sending and an HTTPS automation webhook for workflow execution

## Run locally

1. Clone the repository and enter the project folder:

   ```bash
   git clone https://github.com/naseerudddinn204-maker/sales-chatbot-3.git
   cd sales-chatbot-3
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a local environment file from the example:

   ```bash
   cp .env.example .env.local
   ```

4. Set the public Supabase values in `.env.local` (see Environment variables below).

5. Start the development server:

   ```bash
   npm run dev
   ```

   Vite prints the local URL in the terminal (the configured port is 3000).

6. Check the production build and TypeScript:

   ```bash
   npm run build
   npm run lint
   ```

## Environment variables

### Frontend variables

Set these in local `.env.local` and in **Vercel → Project → Settings → Environment Variables** for the environments you use.

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL, e.g. `https://YOUR_PROJECT_REF.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable/anon key used by the browser |
| `VITE_SUPABASE_API_URL` | Edge Function endpoint, e.g. `https://YOUR_PROJECT_REF.supabase.co/functions/v1/sales-chatbot-api` |

Vite bundles `VITE_*` values into browser code. **Only put public values here. Never put service-role keys, Gemini keys, email-provider keys, or webhook secrets in a `VITE_*` variable.**

### Supabase Edge Function secrets

Configure server-side values in **Supabase Dashboard → Edge Functions → Secrets** (or the equivalent secrets area for your project).

| Secret | Required for |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL used by the function |
| `SUPABASE_ANON_KEY` | Supabase anon/publishable key used by the function |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only privileged operations such as saving public order requests and authenticated client data |
| `GEMINI_API_KEY` | AI text generation, chatbot answers, PDF knowledge extraction, and image generation |
| `RESEND_API_KEY` | Sending email through Resend |
| `RESEND_FROM_EMAIL` | Verified sender address configured with Resend |
| `RESEND_ALLOWED_RECIPIENTS` | Comma-separated allowlist of approved test recipients |
| `AUTOMATION_WEBHOOK_URL` | HTTPS endpoint for a connected workflow runner |
| `AUTOMATION_WEBHOOK_SECRET` | Secret sent to the workflow runner as a Bearer token |

Set only the secrets required by the features you enable. Keep all secrets out of Git, browser code, screenshots, and public issue reports. Do not commit `.env.local` or a real `.env` file.

## Supabase Edge Function

The API function source is:

`supabase/functions/sales-chatbot-api/index.ts`

Deploy it to your own Supabase project using the Supabase CLI after installing and authenticating the CLI:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy sales-chatbot-api
```

Then configure the Edge Function secrets listed above. The application also depends on the required database tables and policies in the connected Supabase project; deploying the function alone does not create or migrate those tables.

## Vercel deployment

1. Import or open the GitHub repository in Vercel.
2. Confirm the correct project root and build command. The standard build command is `npm run build`.
3. Add the three frontend `VITE_*` variables in Vercel Project Settings for Preview and Production as appropriate.
4. Deploy the matching branch and review the build logs after each deployment.
5. Configure the Supabase Edge Function secrets in Supabase, not in frontend variables.
6. Test AI generation, email sending, and automation execution individually. Email and automation actions remain unavailable until their provider settings and allowlists/webhook are configured.

## Security notes

- Never commit API keys, access tokens, service-role keys, or webhook secrets.
- Keep privileged Supabase keys and provider credentials server-side only.
- Email sending is intentionally restricted to addresses in `RESEND_ALLOWED_RECIPIENTS`.
- Only use an HTTPS webhook URL for automation execution.
- Review generated content before sending or publishing it.

## Contributing

Work on a feature branch and open a pull request into `main`. Review the changes and confirm the Preview deployment passes before merging. Protecting `main` with pull-request reviews and required status checks is recommended where the repository plan supports those settings.
