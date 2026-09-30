# 03 — Storefront QA as software

The storefront is not treated as a static merchandising page.

It has automated customer-facing acceptance behavior.

## QA target

The live-storefront QA path uses Playwright against either:

- an unpublished Shopify theme mirror for routine always-on QA;
or
- a deliberately opened live storefront during a pre-launch verification window.

The default test order is **mobile first**.

## Viewports

The QA skill exercises:

- iPhone 14;
- Pixel 7;
- desktop 1440×900.

The mobile checks are not an afterthought because the product's visual presentation has to work where most browsing friction is likely to be highest.

## Representative assertions

| Area | Example assertion |
|---|---|
| Homepage | returns content successfully |
| Hero | locked product copy is present |
| Merchandising grid | expected style tiles render |
| Images | every sampled image actually loads |
| Mobile layout | no horizontal overflow |
| Mobile accessibility | primary tap targets are at least 44×44 px |
| Navigation | mobile menu opens and exposes links |
| Collections | style pages load |
| PDPs | sampled product pages load |
| Metadata | OG title/image/description present |
| Structured data | Product schema present |
| Browser quality | no error-severity console messages |

The run emits a structured JSON report with pass/warn/fail outcomes and actionable detail.

## Mirror-first release workflow

~~~mermaid
flowchart LR
    D["Theme / image change"] --> M["Sync unpublished theme mirror"]
    M --> Q["Playwright mobile + desktop QA"]
    Q -->|"fail"| F["Fix underlying cause"]
    F --> M
    Q -->|"pass"| L["Pre-launch live-window verification"]
~~~

The unpublished mirror lets automated QA run without exposing the password-protected storefront.

The short live window is reserved for real DNS/CDN/live-path verification.

## A useful rule in the skill

The QA instructions explicitly say:

> Do not paper over a failure.

If a selector fails because the product changed, the response should not automatically be “change the selector.”

The underlying cause has to be understood first.

That prevents the QA system from becoming a rubber stamp.

## Why this belongs in a product-engineering portfolio

The storefront checks combine:

- product copy;
- responsive design;
- browser behavior;
- accessibility;
- merchandising;
- SEO/social metadata;
- structured data;
- operational deployment.

Those are customer-facing product concerns expressed as executable acceptance criteria.

## Human/automated boundary

Automation can prove:

- the page loads;
- images render;
- targets are large enough;
- metadata exists;
- responsive overflow is absent.

It cannot fully decide whether the art, brand treatment, or composition is good enough.

Those remain human judgment gates.
