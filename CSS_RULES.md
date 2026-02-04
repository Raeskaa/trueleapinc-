# Defensive CSS Rules

> **Source:** Based on [DefensiveCSS.dev](https://defensivecss.dev/) by Ahmad Shadeed
> 
> Defensive CSS is a set of practices to write future-proof CSS that prevents unexpected layout behaviors and accounts for edge cases before they become bugs.

---

## Core Principles

1. **Never assume content length** - Account for both short and long content
2. **Use min-height/min-width** instead of fixed dimensions
3. **Set min-width: 0** on flex/grid items to allow proper shrinking
4. **Always use flex-wrap: wrap** unless single-line is explicitly required
5. **Use object-fit: cover** on images to prevent distortion
6. **Provide CSS variable fallbacks** for values that may be undefined
7. **Test viewport height**, not just width
8. **Use the hover media query** for touch-safe hover states

---

## Rules by Category

### 1. Flexbox Rules

#### 1.1 Always Enable Flex Wrapping
```css
/* BAD: Items overflow on small screens */
.container {
  display: flex;
}

/* GOOD: Items wrap gracefully */
.container {
  display: flex;
  flex-wrap: wrap;
}
```

#### 1.2 Prevent Flex Item Overflow
Flex items won't shrink below content size by default (`min-width: auto`).

```css
/* REQUIRED on flex items with text/images */
.flex-item {
  min-width: 0;
  overflow-wrap: break-word;
}
```

#### 1.3 Control Flex Item Alignment
Items stretch by default, which can distort images.

```css
/* Prevent image distortion in flex containers */
.flex-item {
  align-self: start; /* or center */
}
```

#### 1.4 Prefer Gap Over Space-Between
`space-between` creates uneven gaps with varying item counts.

```css
/* BAD: Uneven spacing with fewer items */
.container {
  display: flex;
  justify-content: space-between;
}

/* GOOD: Consistent spacing */
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
```

---

### 2. CSS Grid Rules

#### 2.1 Prevent Grid Item Overflow
```css
/* Option 1: min-width on item */
.grid-item {
  min-width: 0;
}

/* Option 2: Use minmax() in template */
.grid {
  grid-template-columns: minmax(0, 1fr) 248px;
}

/* Option 3: Hidden overflow */
.grid-item {
  overflow: hidden;
}
```

#### 2.2 Use Auto-fill Over Auto-fit
`auto-fit` expands items too wide when there are few items.

```css
/* BAD: Items stretch when few */
.grid {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

/* GOOD: Maintains consistent sizing */
.grid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
```

#### 2.3 Wrap Fixed Grid Values in Media Queries
```css
/* BAD: Breaks on mobile */
.wrapper {
  display: grid;
  grid-template-columns: 250px 1fr;
}

/* GOOD: Responsive */
@media (min-width: 600px) {
  .wrapper {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 1rem;
  }
}
```

#### 2.4 Sticky Positioning in Grid
Grid items stretch by default, breaking sticky behavior.

```css
aside {
  align-self: start;
  position: sticky;
  top: 1rem;
}
```

---

### 3. Image Rules

#### 3.1 Prevent Image Distortion
```css
img {
  object-fit: cover;
}
```

#### 3.2 Constrain Image Width
```css
img {
  max-width: 100%;
  height: auto;
}
```

#### 3.3 Add Fallback Background for Text Over Images
```css
.card-with-image-bg {
  background-color: grey; /* Shows when image fails */
  background-image: url('...');
}
```

#### 3.4 Prevent Background Repeat
```css
.hero {
  background-image: url('...');
  background-repeat: no-repeat;
}
```

#### 3.5 Inner Border for Light Avatars
Light avatars blend into white backgrounds.

```css
.avatar-wrapper {
  position: relative;
}

.avatar-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 2px solid #000;
  border-radius: 50%;
  opacity: 0.1;
  pointer-events: none;
}
```

---

### 4. Text & Content Rules

#### 4.1 Truncate Long Text
```css
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

#### 4.2 Break Long Words
```css
h1, h2, h3, h4, h5, h6, p {
  overflow-wrap: break-word;
}
```

#### 4.3 Add Proactive Spacing
Even when current content fits, add spacing for future content.

```css
.section-title {
  margin-right: 1rem; /* Prevents collision with neighbors */
}
```

---

### 5. Sizing Rules

#### 5.1 Use Min-Height Instead of Fixed Height
```css
/* BAD: Content overflows */
.hero {
  height: 350px;
}

/* GOOD: Expands with content */
.hero {
  min-height: 350px;
}
```

#### 5.2 Use Min-Width for Buttons
Short labels (especially in other languages) can be too small.

```css
.button {
  min-width: 90px;
}
```

---

### 6. Scrolling Rules

#### 6.1 Prevent Scroll Chaining
Stop parent scroll when modal/nested scroll reaches end.

```css
.modal-content {
  overflow-y: auto;
  overscroll-behavior-y: contain;
}
```

#### 6.2 Reserve Space for Scrollbar
Prevent layout shift when scrollbar appears.

```css
.element {
  scrollbar-gutter: stable;
}
```

#### 6.3 Use Auto Over Scroll
Don't show scrollbars when content doesn't overflow.

```css
/* BAD: Always shows scrollbar */
.element {
  overflow-y: scroll;
}

/* GOOD: Scrollbar only when needed */
.element {
  overflow-y: auto;
}
```

---

### 7. CSS Variables Rules

#### 7.1 Always Provide Fallbacks
```css
.element {
  max-width: calc(100% - var(--sidebar-width, 70px));
  background-color: var(--brand-color, #5a2d82);
}
```

---

### 8. Responsive & Device Rules

#### 8.1 Test Vertical Viewport
```css
@media (min-height: 600px) {
  .sticky-nav {
    position: sticky;
    bottom: 0;
  }
}
```

#### 8.2 Use Hover Media Query
Prevent accidental hover on touch devices.

```css
@media (hover: hover) {
  .card:hover {
    transform: scale(1.05);
  }
}
```

#### 8.3 Prevent iOS Input Zoom
iOS Safari zooms when input font-size < 16px.

```css
input, textarea, select {
  font-size: 16px;
}
```

---

### 9. Vendor Prefix Rules

#### 9.1 Never Group Vendor Selectors
One invalid selector invalidates the entire rule.

```css
/* BAD: Entire rule fails if one selector is unknown */
input::-webkit-input-placeholder,
input:-moz-placeholder {
  color: #222;
}

/* GOOD: Separate rules */
input::-webkit-input-placeholder {
  color: #222;
}

input:-moz-placeholder {
  color: #222;
}
```

---

## Defensive CSS Checklist

Before shipping, verify:

- [ ] Flex containers have `flex-wrap: wrap` (unless intentionally single-line)
- [ ] Flex/grid items have `min-width: 0` when containing text/images
- [ ] Images have `max-width: 100%` and `object-fit: cover`
- [ ] Buttons have `min-width` for touch targets
- [ ] Fixed heights are replaced with `min-height`
- [ ] CSS variables have fallback values
- [ ] Scrollable areas have `overflow: auto` (not `scroll`)
- [ ] Modals use `overscroll-behavior-y: contain`
- [ ] Hover effects use `@media (hover: hover)`
- [ ] Inputs have `font-size: 16px` minimum (iOS)
- [ ] Background images have `background-repeat: no-repeat`
- [ ] Long text has truncation or word-break handling
- [ ] Vendor prefixes are in separate rules
- [ ] Layout tested at various viewport heights (not just widths)

---

## Quick Reference Reset

Add to your base styles:

```css
/* Defensive CSS Reset */
*, *::before, *::after {
  box-sizing: border-box;
}

h1, h2, h3, h4, h5, h6, p {
  overflow-wrap: break-word;
}

img {
  max-width: 100%;
  height: auto;
  object-fit: cover;
}

input, textarea, select {
  font-size: 16px;
}

button, .btn {
  min-width: 90px;
}

@media (hover: hover) {
  /* Place all hover styles inside this query */
}
```
