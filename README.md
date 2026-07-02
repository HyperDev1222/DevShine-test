# DevShine-test — KNR Product Page Theme

Custom Shopify product page built on Dawn (default theme) with `knr-` prefixed template and sections.

## Tech stack

- Liquid templating
- Vanilla CSS (scoped per section)
- Vanilla JavaScript (`defer`, non-blocking)
- Inter font (Google Fonts, loaded on KNR product template only)

## Local development

1. Install [Shopify CLI](https://shopify.dev/docs/api/shopify-cli)
2. Clone this repository
3. From the theme root, run:

```bash
shopify theme dev
```

4. Open the preview URL and navigate to a product using the **knr-product** template

## Product template

- Template file: `templates/product.knr-product.json`
- Assign in Shopify Admin: **Products → [your product] → Theme template → knr-product**

## Store setup checklist

Complete these steps in your Shopify development store:

### 1. Test product

Create a product with:

| Field | Requirement |
|-------|-------------|
| Title | Any product name |
| Description | Rich text description |
| Variants | At least 2 (e.g. **15 mL** and **150 mL**) with different prices |
| Compare-at price | Set on at least one variant to show strikethrough pricing |
| Images | At least 4 product images |
| Template | Assign **knr-product** |

### 2. Collection

- Create a collection and add the test product
- Used for breadcrumb navigation (collection → product)

### 3. Navigation menus

Create menus in **Online Store → Navigation**:

| Menu handle | Used by |
|-------------|---------|
| `main-menu` | KNR Header |
| `footer` | KNR Footer |

Assign links in the theme editor under each section's menu settings if handles differ.

### 4. Blog (Latest news)

1. Create a blog (e.g. **News**)
2. Publish 2–3 articles with title, excerpt, and featured image
3. In the theme editor, open **KNR Latest News** section and select the blog

### 5. Theme editor content

All non-product content is editable without code changes:

| Section | Editable via |
|---------|-------------|
| KNR Header | Logo, navigation menu |
| KNR Breadcrumb | Home label, fallback collection |
| KNR Product Main | Button labels (product data is automatic) |
| KNR Reassurance | Heading + reassurance blocks |
| KNR Before After | Heading + before/after image pairs |
| KNR How To Use | Heading + step blocks |
| KNR FAQ | Heading + question/answer blocks |
| KNR Latest News | Blog picker, article count |
| KNR Footer | Logo, tagline, menus, copyright |

## File structure

```
templates/
  product.knr-product.json     # Dedicated product template

sections/
  knr-header.liquid
  knr-breadcrumb.liquid
  knr-product-main.liquid
  knr-reassurance.liquid
  knr-before-after.liquid
  knr-how-to-use.liquid
  knr-faq.liquid
  knr-latest-news.liquid
  knr-footer.liquid

snippets/
  knr-price.liquid             # Shared price + compare-at renderer

assets/
  knr-*.css                    # Scoped section styles
  knr-variant-picker.js        # Variant selection + live price
  knr-cart.js                  # Add to cart + badge update
  knr-faq.js                   # FAQ accordion
```

## Dynamic data sources

- **Product name, description, images, variants, prices** — Shopify `product` object
- **Strikethrough price** — `variant.compare_at_price`
- **Cart badge** — `cart.item_count` (updates via AJAX after add to cart)
- **Breadcrumb** — collection context + `product.title`
- **Navigation** — Shopify menus (`link_list` settings)
- **FAQ, reassurance, before/after, how to use** — section blocks in theme editor
- **Latest news** — blog articles from selected blog

## GitHub

Repository: https://github.com/HyperDev1222/DevShine-test.git

Push theme changes:

```bash
shopify theme push
```

Or commit and push manually after local changes.

## Figma design updates

Sections use placeholder styling until Figma screenshots are provided. Send desktop/mobile screenshots section by section to refine layout, typography, and colors.
