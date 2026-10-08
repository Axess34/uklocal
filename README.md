# UK Local: "Get your free website draft" landing page

English-only landing page for UK Local (https://uklocal.online/), a website rental service for local businesses across the UK.
Price: £29/month, all inclusive. Contact: hello@uklocal.online (Cloudflare Email Routing forwards to james@axess34.com).
Built from the thailocal.online page by /workspace/uk-oz-launch/landing/build.py (assets: assets.py).

## Example sites (fictional)
- https://littlewren.uklocal.online/ (Little Wren Café, repo Axess34/uk-example-littlewren)
- https://anchorandoak.uklocal.online/ (The Anchor & Oak, repo Axess34/uk-example-anchorandoak)
- https://kingfisher.uklocal.online/ (Kingfisher Plumbing, repo Axess34/uk-example-kingfisher)

## Form submissions
`app.js` POSTs to Supabase (project ivleheagpnenoaevpcjv), table `public.thailocal_draft_requests`, with `country = 'UK'`
(policy `ukau_anon_insert_only`; thailocal rows default to country 'TH').

```sql
select created_at at time zone 'Asia/Bangkok' as received_th, country, shop_name, fb_url, contact, email, city, status
from public.thailocal_draft_requests where country = 'UK' and status = 'new' order by created_at desc;
```
