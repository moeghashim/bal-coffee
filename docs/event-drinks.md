# Event drink ordering

In-person ordering for a weekend event. Customers use `/event`. The team uses
`/event/board`. Nothing here is linked from the shop nav, both routes are
`noindex, nofollow`, and neither is in `sitemap.xml`.

This does not change Shopify products, publications, or Vercel settings. The
steps below are for Moe to approve and apply.

## How an order gets on the board

The store already verifies Shopify webhooks at `POST /api/shopify/webhooks`
with `SHOPIFY_WEBHOOK_SECRET`. Event intake uses that route and the
`orders/paid` topic.

That is the smallest change that still means "this was paid":

- The receiver, HMAC check, and `orders/paid` allowlist already exist. No new
  public URL and no new secret name.
- There is no Admin API client. The launch checklist skipped
  `SHOPIFY_ADMIN_ACCESS_TOKEN`. Polling orders would mean a new custom app,
  `read_orders`, and a token, then a poll on every board refresh.
- `orders/create` also fires for unpaid checkouts, so those would land on the
  board before anyone paid. `orders/paid` does not.
- The Storefront cart is created with attributes `order_source=event`,
  `customer_name`, `customer_phone`, `sms_consent`, and `event_ref`. Shopify
  copies those onto the order as note attributes. The webhook ignores every
  paid order that is not `order_source=event`.
- The board polls our store every 5 seconds. It does not poll Shopify.

Shopify will not deliver a webhook to a domain attached to the same shop
(`balcoffee.com` / `www`). Register it on the Vercel host you are actually
testing (the preview URL or `https://bal-coffee.vercel.app`), path
`/api/shopify/webhooks`.

## Storage (not provisioned)

The app has no database. Orders and the "text already sent" lock live in
Upstash Redis (Vercel Marketplace Redis, which replaced Vercel KV). Install it
on the Vercel project and it injects:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

`KV_REST_API_URL` and `KV_REST_API_TOKEN` are also read, for a legacy KV store.

Keys are prefixed `bal:event:v1:`. Without those variables the app keeps orders
in process memory so local dev and unit tests work. On Vercel that memory is
per lambda and is not shared, so the board will miss orders until Redis is
connected. The board shows a banner in that case. Do not add the Redis REST
token to any `NEXT_PUBLIC_` variable.

## Setup checklist

1. **Upstash Redis** on the Vercel project (Marketplace). Production and the
   Preview environment you will use this weekend. Variables:
   `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
2. **`EVENT_BOARD_PASSCODE`** on that same environment. Server-only. Share it
   with the people working the event. Open `/event/board` and enter it.
3. **Twilio**, server-only:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_FROM_NUMBER` in E.164, for example `+17135551212`
4. **`SHOPIFY_WEBHOOK_SECRET`** set to the signing secret of the webhook below.
   It is already the secret the existing receiver expects.
5. **Shopify webhook** (admin action, not done in this PR): topic `orders/paid`,
   format JSON, URL `https://<the-host-you-are-testing>/api/shopify/webhooks`.
   Do not use `www.balcoffee.com` if that domain is attached to the Shopify
   shop. Shopify refuses those destinations.
6. **Publish the drink products to the Headless sales channel** that owns this
   storefront token (Shopify admin: the headless channel named in the launch
   notes as `Bal Coffee Store Headless`, shop `balcoffee-store.myshopify.com`).
   See the publication note below. Leave them off the Online Store channel.
7. **Shipping.** If a drink variant requires shipping, Shopify checkout will ask
   for an address and a rate. For counter pickup, either mark the variant as
   not requiring shipping or add a $0 local-pickup rate. This PR does not
   change that.
8. **Inventory.** If a drink is tracked and the available quantity is 0, the
   menu shows it as sold out and checkout will refuse it. Continue selling when
   out of stock, or stock the location the headless channel uses.

Redeploy the preview after the env vars exist so the serverless functions can
read them. This repo does not set Vercel env vars.

## Publication: what has to change in Shopify

Code can already build the menu and the checkout cart from the Storefront API.
It cannot see products that are not published to the channel behind the
storefront token.

What the code does today:

- Public `products.json` on `balcoffee-store.myshopify.com` (Online Store
  channel) returns only DateSpresso, GrounDate, and Eastern Brew.
- `lib/catalog.ts` treats café drinks as event/POS items and removes them from
  `/products`, product pages, the sitemap, and JSON-LD. That behavior is
  unchanged.
- `/event` reads the Storefront catalog, keeps products the existing drink
  heuristic marks as drinks, and also asks for the historical handles
  `caramel-glow`, `pistachio`, `pistachio-caramel`, `brown-sugar`,
  `honey-iced-lattee`, `honey-iced-latte`, and `hot-latte`.
- A product counts as a drink when it is not one of the three bagged coffees
  and its title, type, or tags match latte / café / pistachio / caramel glow /
  brown sugar / honey iced / drink / beverage, or it has a Milk option. A new
  drink should use product type `Drink` (or one of those words) so it shows up
  without a code change.
- Checkout is Storefront `cartCreate` → `checkoutUrl`, with the attributes
  above. Payment and the order record stay in Shopify.

**Approve this in Shopify admin:** for each active drink, Sales channels →
publish to the Headless channel that issued `SHOPIFY_STOREFRONT_ACCESS_TOKEN`.
Do not publish them to Online Store. They will still 404 on `/products/<handle>`
because the storefront hides `category: "drink"`.

If a drink was archived in the earlier catalog cleanup, set it back to Active
as well as publishing it. Archived products are not readable or sellable.

**Alternative if those products must stay off the Headless channel:** an Admin
API token with `read_products` and `write_draft_orders`, then create a draft
order and send the customer to the draft-order invoice URL. That needs the
Admin app this project deliberately does not have, and it is a larger change
than publishing the existing products to Headless. This PR does not implement
it.

## Try it on a preview

1. Open `https://<preview>/event` on a phone. Confirm the drink list is the
   POS drinks, not the bags. If the list says nothing is on the menu, the
   publication step above is still pending.
2. Add a drink, enter a first name and your mobile number, tick the SMS box,
   continue, then pay with a Shopify test tender (Bogus gateway or a real
   card you can refund).
3. Leave the status tab open. After `orders/paid` arrives, it shows the order
   number. Shopify's own confirmation page is the receipt if you close the tab;
   the cart attribute `event_ref` is what this page matches.
4. Open `/event/board`, enter the passcode. The order should appear at the
   bottom within a few seconds.
5. Press Making, then Ready. The phone that opted in should get: `Hi {name},
your BAL Coffee order #{number} is ready for pickup!` Pressing Ready again
   must not send a second text.
6. Confirm `/`, `/products`, and the nav still have no Event link, and
   `https://<preview>/robots.txt` disallows `/event`.

## SMS risk

A US local Twilio number (10DLC long code) will filter or block application
messages until the brand and campaign are registered with A2P 10DLC. A verified
toll-free number is the other path. Until one of those is done, Ready can
return a Twilio error and the order stays unsent so you can retry. Texts go
only to orders whose `sms_consent` attribute is yes. The consent line on the
form is: "Text me when my order is ready. Msg & data rates may apply. Reply
STOP to opt out."

STOP handling is Twilio's opt-out on the number. This app does not keep a
separate suppression list; it simply never texts an order that did not check
the box, and it will not text the same order twice.

There is a short crash window: if the function dies after Twilio accepts the
message and before the order is marked sent, a retry after the 120-second lock
expires could send a second text. A normal double-tap cannot.
