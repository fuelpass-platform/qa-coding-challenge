# FuelPass Design System

> _Powering Aviation_

FuelPass is a **HeroUI/NextUI-based, light, blue-tinted web app** for fuel search, RFQ, and offer workflows. This document is the source of truth for its visual and interaction contract: design tokens, typography, and components.

The goal is two-fold:

1. **Be consistent** — every screen reuses the same tokens, type, and components.
2. **Feel breathable, airy, and aviation-grade** — more whitespace, lighter surfaces, calm depth, and a sense of altitude — so FuelPass reads unmistakably as a platform built for the aviation industry.

When elevating, **never break the token contract**. Add air through spacing, hierarchy, and restraint — not by inventing new colors, type, or radii.

---

## Design goal

FuelPass should feel like a **trustworthy, transparent, and precise aviation-grade trading platform**.

It must stay calm and confident under density — fuel procurement involves tables of offers, prices, RFQs, locations, and documents — while feeling **light, breathable, and airy** rather than heavy or cramped. Every screen should make airlines and suppliers feel they are looking at a single, reliable source of truth.

It should feel closer to a refined aviation operations console than a generic enterprise dashboard.

---

## Product personality

FuelPass should feel:

- **breathable & airy** — open whitespace, light surfaces, a sense of altitude and clarity
- trustworthy
- transparent
- precise & accurate
- neutral & professional (a marketplace, not a reseller)
- data-confident (comfortable with dense tables, prices, and offers)
- calm under density
- aviation-grade
- efficient & responsive
- structured

FuelPass should **not** feel:

- cramped, heavy, or boxed-in
- opaque or untrustworthy
- playful, childish, or gimmicky
- loud or over-saturated
- consumer-fintech flashy
- like a legacy enterprise ERP
- cluttered with decorative effects that compete with data

### The "breathable, airy" direction

This is the elevation lens for every screen:

- Prefer **generous vertical rhythm** and white space around dense data clusters.
- Lean on the **light blue-tinted canvas** (`--background-app`) and **translucent white surfaces** to create a layered, atmospheric, sky-like depth — never flat grey enterprise chrome.
- Keep chrome (nav, toolbars, filters) **quiet**; let the data and the next action carry the color.
- Use soft, low elevation. Avoid heavy borders and hard shadows that make panels feel sealed.
- When a screen feels dense, the fix is **more space and clearer hierarchy**, not smaller text or tighter packing.

---

## Visual references

FuelPass can be inspired by the qualities of:

- HeroUI / NextUI (its component foundation — the design is built on it)
- Modern aviation & ops consoles (clear, instrument-like, legible at a glance)
- Linear, Vercel dashboards (calm density, restraint, precise typography)
- Stripe (trust, transparency, data clarity in a financial context)

Use these as **quality references only**. Do not copy them directly, and never adopt a reference at the expense of the FuelPass token contract.

---

## Design principles

### 1. Transparency through clarity
The product's promise is transparency. The UI must make prices, offers, and statuses **instantly comparable and unambiguous**. Never hide the number that matters.

### 2. Calm under density
Tables, RFQs, and offer lists are inherently dense. Create calm through hierarchy, spacing, and alignment — not by removing information.

### 3. Breathable & airy
Default to space. Let surfaces float on a light canvas. Air is a feature: it signals quality and reduces cognitive load for procurement users working all day in the tool.

### 4. Precision & trust
Numbers, units, dates, and locations must be exact, aligned, and consistently formatted. Misalignment or sloppy formatting erodes trust in a financial marketplace.

### 5. Neutral marketplace voice
FuelPass is a neutral platform. Visual treatment should never favor one party (buyer vs. supplier) or imply hidden margin. Keep accents functional, not persuasive.

### 6. Clear next action
On every screen the user should know where they are, what the current status is, what needs attention, and what to do next.

---

## Color system

FuelPass uses a **deep aviation navy** as its brand identity color and a **bright accessible blue** as the interactive accent, on top of a neutral zinc scale and standard semantic colors.

### Brand — FuelPass Navy

The signature brand color. Used for primary text, the brand mark, key headings, and deep brand surfaces.

```css
--fuelpass-50:  #E9EFFB;  /* airy canvas tint */
--fuelpass-100: #C9D8F6;
--fuelpass-200: #96B3ED;
--fuelpass-300: #5C87E0;
--fuelpass-400: #2C5FBE;
--fuelpass-500: #002366;  /* BRAND / primary text */
--fuelpass-600: #001E5A;
--fuelpass-700: #00184A;
--fuelpass-800: #001336;
--fuelpass-900: #000D26;
```

### Interactive — Accent Blue (HeroUI primary)

The functional interactive color: primary buttons, links, focus rings, selected states, active nav.

```css
--primary-50:  #E6F1FE;
--primary-100: #CCE3FD;
--primary-200: #99C7FB;
--primary-300: #66AAF9;
--primary-400: #338EF7;
--primary-500: #4168E9;  /* base interactive primary + focus */
--primary-600: #005BC4;
--primary-700: #004493;
--primary-800: #002E62;
--primary-900: #001731;

--accent-primary: #4168E9;   /* alias: colors/base/primary */
--focus: #4168E9;
--focus-ring-20: rgba(0, 111, 238, 0.20);
```

### Neutral — Zinc (default scale)

Backgrounds, borders, muted text, disabled states.

```css
--default-50:  #FAFAFA;
--default-100: #F4F4F5;
--default-200: #E4E4E7;
--default-300: #D4D4D8;
--default-400: #A1A1AA;
--default-500: #71717A;
--default-600: #52525B;
--default-700: #3F3F46;
--default-800: #27272A;
--default-900: #18181B;
```

### Secondary — Purple

Reserved supporting accent (use rarely; not a primary brand color).

```css
--secondary-500: #7828C8;
```

### Semantic colors

Use semantic colors sparingly and only for meaningful state. Each has a strong tone, a soft tint for backgrounds, and a 20%-opacity "flat" fill for chips/badges.

```css
/* Success */
--success:        #17C964;
--success-soft:   #E8FAF0;   /* success-50 */
--success-flat:   rgba(23, 201, 100, 0.20);

/* Warning */
--warning:        #F5A524;
--warning-soft:   #FEFCE8;   /* warning-50 */
--warning-flat:   rgba(245, 165, 36, 0.20);

/* Danger / Error */
--danger:         #F31260;
--danger-soft:    #FEE7EF;   /* danger-50 */
--danger-flat:    rgba(243, 18, 96, 0.20);
```

### Text colors (theme)

```css
--text-primary:     #002366;  /* FuelPass navy — primary text */
--text-secondary:   #5B6C8E;  /* muted slate-blue */
--text-placeholder: #A1A1AA;
--text-disabled:    #E4E4E7;
--text-error:       #F31260;
--text-inverse:     #FFFFFF;

/* HeroUI content foregrounds (for tinted content surfaces) */
--content1-foreground: #11181C;
--content2-foreground: #27272A;
--content3-foreground: #3F3F46;
--content4-foreground: #52525B;
```

### Surfaces, strokes & layout

The designs layer **translucent white surfaces** over a light canvas — this is the foundation of the airy, atmospheric feel. Preserve and lean into it.

```css
/* App canvas — light blue-tinted wash (elevate the airiness here) */
--background-app:  #E9EFFB;   /* fuelpass-50 wash; pairs with translucent cards */
--background-page: #FFFFFF;   /* layout/background token */

/* Content surfaces (solid → muted) */
--content-1: #FFFFFF;   /* primary cards / panels */
--content-2: #F4F4F5;   /* nested / inset surfaces */
--content-3: #D4D4D8;
--content-4: #D4D4D8;

/* Glass / translucent surfaces — the airy layer */
--surface-01:    rgba(255, 255, 255, 0.60);
--surface-02:    rgba(255, 255, 255, 0.40);
--surface-hover: #F2F4F7;

/* Strokes & dividers */
--stroke-01:  rgba(255, 255, 255, 0.60);
--stroke-02:  rgba(255, 255, 255, 0.40);
--divider:    rgba(17, 17, 17, 0.15);

/* Overlay (modals, scrims) */
--overlay: rgba(0, 0, 0, 0.30);
```

---

## Color usage rules

- **Brand navy (`--text-primary` / `--fuelpass-500`)** is the default for primary text and headings, the brand mark, and deep brand moments. It signals trust and seriousness.
- **Accent blue (`--accent-primary` / `#4168E9`)** is the only color for primary actions, links, focus, selected states, and active navigation. Do not use brand navy as a button fill where an interactive accent is expected.
- **Secondary text** uses `--text-secondary` (`#5B6C8E`) — the muted slate-blue, not grey — to keep the calm aviation tone.
- **Semantic colors** appear only on real state: success (confirmed/accepted), warning (attention/expiring), danger (error/rejected/expired). Use soft/flat variants for badge backgrounds, full tone for icons and text.
- Most of a screen should be **navy text + neutral zinc + white/translucent surfaces on the blue canvas**. Color marks the value and the next action, never the chrome.
- Do not introduce new colors. The purple secondary is reserved and should be rare.

---

## Typography

**Primary typeface: Montserrat.** Use one family across the entire product. Weights in use: Regular, Medium, SemiBold, Bold.

Montserrat's geometric, open letterforms reinforce the precise, modern, aviation feel. Do not mix in another family without explicit approval.

### Type scale

| Role | Size | Weight | Tracking | Use |
| --- | --- | --- | --- | --- |
| **Page Title** | 48 | Bold | +0.25% | Top-level page identity |
| **Title 1** | 32 | SemiBold | 0 | Major page / section headers |
| **Title 2** | 24 | SemiBold | 0 | Sub-section / card cluster titles |
| **Headline** | 20 | Medium | 0 | Panel / card titles |
| **Body — SemiBold** | 16 | SemiBold | 0 | Emphasized body, values, labels |
| **Body — Medium** | 16 | Medium | 0 | Default body text |
| **Subtext** | 14 | Medium | 0 | Supporting text, table cells, inputs |
| **Caption** | 12 | Medium | −2% | Metadata, helper text, small labels |
| **Marketing / Hero** | 80 | Regular | −4.5px | Marketing hero only |
| **Marketing / Page Title** | 48 | Regular | −3px | Marketing page titles only |

```css
/* App roles */
--font-page-title:   700 48px/1.1 "Montserrat";   /* +0.25% tracking */
--font-title-1:      600 32px/40px "Montserrat";
--font-title-2:      600 24px/32px "Montserrat";
--font-headline:     500 20px/28px "Montserrat";
--font-body-semibold:600 16px/24px "Montserrat";
--font-body:         500 16px/24px "Montserrat";
--font-subtext:      500 14px/20px "Montserrat";
--font-caption:      500 12px/16px "Montserrat";  /* -2% tracking */

/* Base font-size tokens (HeroUI layout) */
--text-tiny:   12px;
--text-small:  14px;
--text-medium: 16px;
--text-large:  18px;

/* Line-height tokens */
--leading-tiny:   16px;
--leading-small:  20px;
--leading-medium: 24px;
--leading-large:  28px;
```

### Typography rules

- Headings use Montserrat SemiBold/Bold; body uses Medium. Avoid Regular for dense UI body (reserve Regular for marketing).
- Numeric/tabular data (prices, volumes) should be aligned and consistently formatted; prefer tabular figures where available.
- Use color **and** size for hierarchy — navy primary text vs. `#5B6C8E` secondary.
- All-caps only for small structural labels/eyebrows and badges, never for body.
- Don't shrink important values (prices, totals) to fit — give them room (the airy principle).

---

## Spacing system

Base unit: **4px**. Use the token scale; avoid arbitrary values.

```
4 · 8 · 12 · 14 · 16 · 20 · 24 · 28 · 32 · 36 · 40 · 44 · 48 · 52 · 56 · 60 · 64 · 68 · 72 · 80 · 96 · 112 · 128 …
```

Semantic spacing aliases:

```css
--space-xs:  8px;
--space-sm:  12px;
--space-md:  16px;
--space-lg:  22px;
--space-xl:  36px;
--space-2xl: 48px;
--space-3xl: 80px;
```

- Lean **generous** — for the breathable/airy direction, prefer the next step up (e.g. 24 over 16) for section padding and gaps between data clusters.
- Keep spacing **inside** dense tables tighter and consistent; keep spacing **around** and **between** groups generous.

---

## Layout

### App layout
Authenticated app pages use a structured workspace on the light blue canvas:

- left navigation sidebar
- spacious main content area on `--background-app`
- white/translucent floating panels (`--content-1` / `--surface-01`) with soft borders
- toolbars and filters kept quiet; primary action and key data carry emphasis

Content should breathe: comfortable max content width, generous gutters, and clear separation between filter, results (table/map), and detail regions.

### Data-dense screens (Fuel Search / Offers / RFQ)
The core screens combine **filters + results table + map + detail/offer panels**.

- Align columns; right-align numeric columns (price, volume).
- Use the divider token (`rgba(17,17,17,0.15)`) for row separation, not heavy borders.
- Give the table room to breathe — adequate row height and padding.
- Map surfaces sit as peers to tables in white panels; keep markers and controls restrained and on-brand (accent blue).

### Mobile
Mobile variants exist for the core flows. Preserve hierarchy: stack filter → results → detail, keep the same tokens, and protect tap-target sizes and legibility over density.

### Marketing
Marketing pages use the Marketing/Hero (80) and Marketing/Page Title (48) Regular styles with tight negative tracking — open, spacious, and confident. This is where the airy aviation feel is most expressed.

---

## Border radius

```css
--radius-none:   0px;
--radius-small:  8px;   /* inputs, compact controls, chips */
--radius-medium: 12px;  /* buttons, cards, panels */
--radius-large:  14px;  /* large containers, modals */
--radius-full:   9999px;/* pills, avatars, status dots */
```

Use medium/large radius for cards and panels to support the soft, breathable feel; small radius for inputs and compact controls.

---

## Borders, dividers & elevation

```css
--border-small:  1px;
--border-medium: 2px;
--border-large:  3px;
--divider-weight: 1px;
--disabled-opacity: 0.5;
```

- Default border is **1px**, low-contrast. Prefer translucent white strokes (`--stroke-01/02`) on the blue canvas to keep panels feeling light and layered.
- Use the **divider** token for internal separation (table rows, list items).
- **Elevation should be soft and minimal.** Use gentle, large, low-opacity shadows to lift floating panels and popovers — never hard or heavy shadows that seal a panel. Most surfaces stay flat or softly bordered; reserve elevation for modals, popovers, and hover affordances.

> Keep shadows quiet and consistent (a single soft panel shadow + a slightly deeper popover shadow).

---

## Components

The component foundation is **HeroUI/NextUI**, themed with the tokens above. Reuse HeroUI components and theme them; do not rebuild primitives from scratch.

### Buttons

Radius `--radius-medium` (12px). Label is Body SemiBold (16) or Subtext (14) for compact; labels never wrap.

- **Primary** — fill `--accent-primary` (`#4168E9`), white text. The main action on a screen (e.g. *Request quote*, *Submit RFQ*, *Accept offer*).
- **Secondary** — neutral surface (`--default-100/200`) with navy text, 1px border. Supporting actions (*Save*, *Compare*, *Export*).
- **Ghost / tertiary** — transparent, navy or secondary text, subtle hover (`--surface-hover`). Low-emphasis (*Cancel*, *Back*).
- **Danger** — `--danger` fill or text, only for destructive actions, with confirmation where needed.

Disabled buttons use `--disabled-opacity` (0.5).

### Inputs & forms

- Surface white (`--content-1`), 1px border (`--default-200`), radius `--radius-small`/`--radius-medium`.
- Placeholder `--text-placeholder` (`#A1A1AA`); value text navy.
- Focus: border + ring in `--focus` (`#4168E9`) using `--focus-ring-20` glow.
- Error: `--danger` border + `--danger` message (no new error color).
- Each field: clear label (Subtext/Body), helper text (Caption), visible focus, error state with message.
- Keep forms breathable — group related fields, use generous vertical spacing, and break long RFQ/intake forms into clear steps.

### Cards & panels

- Surface `--content-1` (white) or `--surface-01` (translucent) on the blue canvas.
- 1px soft border (`--default-200` or `--stroke-01`), radius `--radius-medium`/`--radius-large`.
- Comfortable padding (16–24px); no heavy default shadow — optional soft hover lift for interactive cards.

### Tables (offers, RFQs, search results)

- Header row in Subtext SemiBold, secondary text color; body cells in Subtext/Body.
- Row separators use `--divider`; avoid full grid borders.
- Right-align numeric columns; keep units consistent and adjacent to values.
- Use status chips (see Badges) for offer/RFQ state.
- Adequate row height for legibility; the table should feel scannable, not packed.

### Badges & chips

Status and category tags, radius `--radius-full` or `--radius-small`, Caption/Subtext weight.

- Use semantic **soft/flat** backgrounds with the matching tone for text/icon:
  - success → confirmed / accepted / available
  - warning → expiring / pending / attention
  - danger → rejected / expired / error
  - neutral (default-100/200) → draft / informational
- Keep chips subtle — they label state, they don't shout.

### Maps

- Map panels sit in white cards as peers to data.
- Markers, clusters, and controls use accent blue (`#4168E9`) and brand navy; avoid third-party default colors that clash with the palette.
- Keep map chrome minimal so the data (locations, coverage) reads clearly.

---

## States

### Empty states
Helpful and action-oriented, on the airy canvas: a small line icon or light illustration, a clear title (Title 2 / Headline), a short description (Body, secondary), and a primary action. Example: *"No offers yet — submit an RFQ to start receiving supplier quotes."*

### Loading states
Calm: skeletons for tables/cards, subtle spinners, clear progress copy for longer operations (e.g. fetching/comparing offers). Avoid jarring or bouncy loaders.

### Error states
Plain language, no technical jargon: clear title, explanation, and a recovery action. Example: *"We couldn't load offers. The connection may have dropped — try again or refresh."*

---

## Status system

Statuses must be visible, consistent, and tied to a recommended next action. Core domain statuses (fuel pricing/RFQ):

- **Draft** (neutral) — RFQ not yet submitted → *Complete & submit*
- **Submitted / Open** (accent/primary) — RFQ sent, awaiting offers → *Await supplier offers*
- **Offer received** (primary) — quotes available → *Compare offers*
- **Accepted / Confirmed** (success) — offer accepted → *View confirmation*
- **Expiring** (warning) — price/offer window closing → *Act before expiry*
- **Rejected / Expired** (danger) — declined or lapsed → *Re-request / re-quote*

Each status uses a consistent chip color (semantic soft/flat) and a short explanation. Keep labels, colors, and next actions consistent.

---

## Icons

Simple, minimal **line icons**, consistent stroke width, rounded, low detail. Icons support comprehension (status, actions, fuel/location/document concepts) — they don't decorate. Don't mix icon styles or stroke weights.

---

## Motion

Motion supports clarity, never spectacle. FuelPass should feel responsive and precise — calm, not theatrical.

Allowed:
- soft fade / slight rise for content and panels
- gentle hover lift on interactive cards/rows
- subtle button hover/press
- progress transitions and calm loading feedback
- smooth table/filter updates

Avoid: playful bounce, springy easing (unless approved), parallax, spinning decoration, heavy route transitions, hover effects on non-interactive surfaces.

Timing: micro-interactions 120–180ms; UI state 180–240ms; entrances 220–320ms; avoid >400ms. Ease-out for entrances, ease-in-out for state changes. Respect `prefers-reduced-motion` and never communicate state through motion alone.

---

## Accessibility

- Sufficient contrast — verify accent blue (`#4168E9`) and semantic colors meet AA against their backgrounds; navy text on the light canvas is high-contrast by design.
- Visible focus states everywhere (use `--focus` ring), keyboard-navigable forms and tables.
- Labels for all fields; clear, specific error messages.
- Never communicate status by color alone — pair with label/icon (critical for offer/RFQ states).
- Readable sizes — don't drop below Caption (12) for meaningful content; prefer Subtext (14)+ in dense tables.
- Semantic HTML; accessible tables with proper headers.

---

## Design rules for AI coding agents

When building FuelPass, do **not** introduce, without explicit approval:

- new colors (use the FuelPass / primary / default / semantic tokens)
- new type styles or font families (Montserrat + the defined scale only)
- new spacing values (use the 4px scale)
- new border-radius values
- new shadow styles (keep elevation soft)
- new button, input, or component variants
- new navigation or layout systems

Always:

- Reuse HeroUI components themed with these tokens before building new ones.
- Map every value to a token; avoid arbitrary inline values.
- Default to the **breathable, airy** direction — more space, lighter surfaces, calm depth — while staying 1:1 with the token contract.
- If a new component is needed, it must follow this system.

---

## Overall design summary

FuelPass should feel like a **trustworthy, transparent, aviation-grade marketplace**: deep navy brand identity, a bright accessible blue for action, neutral zinc structure, and white/translucent surfaces floating on a light blue canvas — all set in Montserrat.

It must stay **calm and precise under dense data** (offers, RFQs, prices, locations) while feeling **breathable and airy**, so it reads unmistakably as built for aviation. Elevate through space, hierarchy, and restraint.

Every screen should help airlines and suppliers understand:

- where they are
- what the current status is
- what needs attention
- what the next action is

— with total confidence in the numbers in front of them.
