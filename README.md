# Littlest Spire Customs — Gallery, Shop & Custom Commissions (No Backend)

A beautiful dark-themed site for **gallery orders + custom commissions**, running entirely without a backend or database.

Customers can:
- Browse a **Gallery & Shop** of your past work and order a similar (or available) piece
- Request a **fully custom commission**
- Receive a unique tracking code for either type of order
- Look up status by code and see a public waitlist

Gallery orders and custom commissions share the **same queue**.

You manage statuses by updating a **Google Sheet**.

---

## Features

- Fully static / frontend-only (host free on Netlify, Cloudflare Pages, GitHub Pages, Vercel, etc.)
- Dark aesthetic UI
- Gallery/Shop with clickable pieces that pre-fill the order form
- Separate custom commission path
- Prominent PayPal + Ko-fi buttons
- Client-side tracking code generation
- Public queue + personal status lookup
- Zero server costs, no database to maintain

---

## How it works

1. Customer either picks a gallery item or starts a custom request.
2. **Request form** posts to [Formspree](https://formspree.io). You get an email with details + tracking code (and gallery item name if applicable).
3. **You** add the tracking code to your Google Sheet and update status / notes.
4. **Status page** reads the published Google Sheet (CSV) and shows personal status + public queue.

---

## Setup (about 10 minutes)

### 1. Formspree (for the request form)

1. Sign up free at [formspree.io](https://formspree.io)
2. Create a new form
3. Copy the endpoint URL (e.g. `https://formspree.io/f/xyzabcde`)

### 2. Google Sheet (for status tracking)

Create a sheet with **exactly these column headers** in row 1:

| tracking_code | status              | progress_notes                  | created_at   |
|---------------|---------------------|---------------------------------|--------------|
| LSP-A3K9P2    | queued              | Request received, under review  | 2026-10-03   |
| LSP-B7M2X1    | in_progress         | Materials ordered, sewing soon  | 2026-10-01   |

**Recommended status values** (use these exact strings for nice colored badges):

`queued` · `accepted` · `materials_ordered` · `in_progress` · `quality_check` · `shipped` · `completed` · `cancelled`

Then:
1. **File → Share → Publish to web**
2. Select the sheet / “Comma-separated values (.csv)”
3. Click **Publish**
4. Copy the link

### 3. Configure the site

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
NEXT_PUBLIC_STATUS_SHEET_CSV=https://docs.google.com/spreadsheets/d/e/XXXX/pub?output=csv
NEXT_PUBLIC_PAYPAL_LINK=https://paypal.me/yourusername
NEXT_PUBLIC_KOFI_LINK=https://ko-fi.com/yourusername
```

### 4. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

### 5. Deploy (free)

- **Vercel / Netlify / Cloudflare Pages**: connect your GitHub repo, add the same environment variables, deploy.
- Or use any static host after running `npm run build`.

---

## Daily workflow

1. New request arrives in your email (Formspree) with a tracking code.
2. Add a new row in your Google Sheet with that code, status `queued`, and any notes.
3. Update the `status` and `progress_notes` columns as you progress.
4. Customers refresh the status page and see the latest info.

That’s it — no admin panel, no database, no server to babysit.

---

## Adding / editing gallery pieces

Edit the list in **`src/lib/gallery.ts`**.

Each item needs: `id`, `title`, `description`, `tag`, `priceHint`, `emoji`, and `orderType` (`"similar"` or `"available"`).

### Adding real photos

1. Drop images into **`public/gallery/`** (e.g. `plush-companion.jpg`)
2. In `gallery.ts`, set:
   ```ts
   image: "/gallery/plush-companion.jpg",
   ```
3. If `image` is missing, the emoji placeholder is used automatically.

Recommended size: ~800–1200px wide, square or 4:3, JPG/WebP.

### Gallery filters

The gallery page includes:
- **Category** chips (auto-built from your tags)
- **Type** filter: All / Available now / Made to order

---

## Project Structure

```
src/
  app/
    page.tsx          → Home
    gallery/          → Full Gallery & Shop (with filters)
    request/          → Order form (gallery prefill + custom)
    status/           → Status lookup + public queue
  components/
    GalleryCard.tsx   → Reusable product card
  lib/
    gallery.ts        → Your shop/gallery items (edit this!)
    utils.ts          → Tracking codes + CSV parser
public/
  gallery/            → Drop your product photos here
```

Enjoy crafting! 🏰
"# littlest-spire-customs" 
