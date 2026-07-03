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
| Unit price | Set per-variant unit pricing (e.g. per 100 mL) for the unit price line |
| Images | At least 4 product images |
| Variant featured images | Assign a featured image per variant (15 mL / 150 mL bottles) |
| Tags | Add product tags (e.g. UNIFIE, PROTÈGE) for badge display |
| Template | Assign **knr-product** |

Optional: attach lifestyle images to specific variants in Shopify admin, or leave them shared across variants.

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
| KNR Header | Navigation menu, overlay mode |
| KNR Product Main | Intro text, certification line, accordion blocks, rating block, ritual collection, stock message, button labels (product data is automatic) |
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
  knr-product-main.liquid
  knr-reassurance.liquid
  knr-before-after.liquid
  knr-how-to-use.liquid
  knr-faq.liquid
  knr-latest-news.liquid
  knr-footer.liquid

snippets/
  knr-price.liquid              # Shared price + compare-at renderer
  knr-unit-price.liquid         # Unit price line
  knr-product-breadcrumb.liquid # Inline breadcrumb in info panel
  knr-product-media-grid.liquid # Hero + secondary media grid
  knr-product-accordions.liquid # Accordion blocks
  knr-product-ritual.liquid     # Collection upsell carousel

assets/
  knr-*.css                    # Scoped section styles
  knr-product-gallery.js       # Media grid, lightbox, accordions
  knr-variant-picker.js        # Variant selection + live price/media
  knr-cart.js                  # Add to cart + badge update
```

## KNR Product Main — metafield setup

Create these **product** metafield definitions in **Settings → Custom data → Products → Add definition**, or sync from `.shopify/metafields.json` via Shopify CLI. Use namespace `knr` for all keys.

| Namespace & key | Type | Used for |
|-----------------|------|----------|
| `knr.text_above_variant` | **Multi-line text** | **Short text above variant picker** (highlighted intro) |
| `knr.tags` | List · Single line text | Badge tags (e.g. UNIFIE, PROTÈGE) |
| `knr.rating_score` | Decimal | Star rating number (e.g. 4.7) |
| `knr.rating_count` | Single line text | Review count label (e.g. 200 avis) |
| `knr.certification` | Rich text | Yuka / INCI line (supports bold) |
| `knr.stock_message` | Single line text | Text below Add to cart button |
| `knr.description` | Rich text | Description accordion body (falls back to native product description if empty) |
| `knr.description_image` | File · Image | Optional image shown in Description accordion |
| `knr.benefits` | Rich text | Bienfaits accordion |
| `knr.key_ingredients` | Rich text | Ingrédients clés accordion |
| `knr.skin_types` | Rich text | Adapté aux peaux accordion |

**Still from Shopify product data (not metafields):** title, variants, prices, unit price, compare-at price, media gallery.

**Still from theme editor:** ritual upsell collection, layout settings, accordion heading labels, button labels.

### Media dots (below stock message)

One dot is rendered per visible product image for the selected variant. Clicking a dot sets that image as the hero and updates the secondary grid — this controls the left-hand gallery from the info panel.

## Dynamic data sources

- **Product name, description, images, variants, prices** — Shopify `product` object
- **Strikethrough price** — `variant.compare_at_price`
- **Cart badge** — `cart.item_count` (updates via AJAX after add to cart)
- **Breadcrumb** — inline in product info panel (collection context + `product.title`)
- **Tags, rating, intro, certification, stock, accordions** — `product.metafields.knr.*`
- **Media grid** — `product.media` filtered by variant; hero uses variant featured image
- **Ritual upsell** — products from selected collection in theme editor
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
