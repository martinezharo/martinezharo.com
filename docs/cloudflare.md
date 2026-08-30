# Cloudflare deployment

The production site runs as the `martinezharo` Worker and uses
`https://martinezharo.com` as its canonical origin. The Worker is the origin for
that hostname; `wrangler.jsonc` owns the custom-domain declaration.

Workers Builds uses the repository root with these commands:

```text
Build command: pnpm build
Deploy command: pnpm exec wrangler deploy -c dist/server/wrangler.json
Preview deploy command: pnpm exec wrangler versions upload -c dist/server/wrangler.json
```

## Legacy domain redirects

The `olivermartinezharo.com` zone owns permanent redirect rules that preserve
the query string and translate the former language layout to the canonical
one:

| Legacy path | Canonical path |
| --- | --- |
| `/` | `https://martinezharo.com/es` |
| `/en` | `https://martinezharo.com/` |
| `/en/*` | `https://martinezharo.com/*` |
| `/es` and `/es/*` | The same path on `https://martinezharo.com` |
| Any other path | The path below `https://martinezharo.com/es` |

`www.martinezharo.com` redirects permanently to the apex while preserving the
path and query string. Both redirecting hostnames must keep proxied placeholder
DNS records so Cloudflare can evaluate the rules without an origin server.

## Retired resources

The former `olisite` Worker and `oliweb` Pages project are retired after the
new Worker, custom domain, Git build triggers, and redirects have been verified.
The `oliweb` D1 database is not retired: it remains the production data source
through the `DB` binding in `wrangler.jsonc`.
