# Sena ERP Design Principles

**Last Updated:** 2025-10-30

A comprehensive guide to the visual language, interaction patterns, and design philosophy of the Sena ERP platform.

---

## Core Philosophy

**Classy. Subtle. Professional.**

Sena's design embodies restraint and sophistication. We avoid flashy, "bling-bling" aesthetics in favor of refined, purposeful design that earns trust through clarity and consistency. Every element serves a function, and nothing demands attention unnecessarily.

---

## Color System

### Primary Palette (3 Colors Only)

| Color | Hex | Usage |
|-------|-----|-------|
| **Cream** | `#FAF9F5` | Primary background, card backgrounds |
| **Light Blue** | `#EEF2FF` | Secondary background, containers, dividers, hover states |
| **Orange** | `#F59E0B` | Accent color, CTAs, interactive highlights |

### Usage Principles

- **Orange is an accent, not a dominant color**
  - Use sparingly for emphasis (icons on hover, initials, active states)
  - Never fill entire backgrounds with orange
  - Default to gray/neutral colors; reveal orange on interaction

- **Cream provides warmth without distraction**
  - Default background for all pages
  - Creates a softer alternative to stark white

- **Light Blue for subtle structure**
  - Containers, navigation backgrounds
  - Dividers and borders
  - Hover state backgrounds

### Supporting Neutrals

| Color | Hex | Usage |
|-------|-----|-------|
| Gray 200 | `#E5E7EB` | Default borders |
| Gray 300 | `#D1D5DB` | Hover borders |
| Gray 500 | `#6B7280` | Secondary text, default icons |
| Gray 700 | `#374151` | Primary text |

---

## Typography

### Font Families

We use two carefully selected fonts that balance modernity with professionalism:

#### **SpaceGrotesk** (Primary UI Font)
- **Usage:** Navigation, buttons, UI elements, body text
- **Weights:** Regular (400), Medium (500), Semibold (600), Bold (700)
- **Character:** Modern, geometric, tech-forward
- **Why:** High readability, professional without being boring, perfect for ERP systems

#### **Rockwell** (Brand Font)
- **Usage:** Logo only ("Sena")
- **Weights:** Normal, Bold
- **Character:** Classic serif, authoritative
- **Why:** Creates distinction and brand recognition while SpaceGrotesk handles UI

### Font Scale & Hierarchy

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Logo | Rockwell | 20-36px | Normal |
| Sidebar Nav Items | SpaceGrotesk | 11-12px | Semibold |
| Sidebar Numbers | SpaceGrotesk | 9px | Semibold |
| Button Labels | SpaceGrotesk | 14px | Semibold |
| Profile Initials | SpaceGrotesk | 14-24px | Bold |
| Dropdown Items | SpaceGrotesk | 14px | Medium |

---

## Navigation Patterns

### Left Sidebar

**Purpose:** Primary page navigation with visual feedback

**Design Specifications:**
- Width: `9.2rem` (mobile) → `9.5rem` (desktop)
- Background: Light Blue (`#EEF2FF`)
- Border: Same as background for seamless look
- Padding: Tight (`px-2.5`) to minimize wasted space
- Font: SpaceGrotesk Semibold
- Shadow: Subtle `0 1px 3px rgba(0,0,0,0.1)`

**Interaction:**
- Default: Gray text (#6B7280), gray numbers
- Hover: White background overlay, orange text
- Active: Orange gradient background, white text
- Smooth 500ms transitions with easing

**Active Indicator:**
- Orange gradient background (`from-waygent-orange to-waygent-orange/90`)
- Slides smoothly to active item
- Slight translation on text (`translateX(2px)`)

**Key Principle:** Single-line labels only. No wrapping. Extend width or shorten labels if needed.

### Top Navbar

**Purpose:** Authentication, environment switching, user profile

**Design Specifications:**
- Background: Light Blue (`#EEF2FF`)
- Rounded: `rounded-b-3xl` for visual softness
- Border: Matches background
- Shadow: Same subtle shadow as sidebar
- Font: SpaceGrotesk

**Components:**

#### Logo
- Font: Rockwell
- Icon: 28-36px depending on screen size
- Text: Responsive 16-20px
- Color: Primary text black

#### Login Button (Unauthenticated)
- Background: Cream (`#FAF9F5`)
- Border: 1px solid `#E5E7EB`
- Text: Gray 500
- Hover: Orange text, orange border tint

#### Sign Up Button (Unauthenticated)
- Background: Orange
- Border: 2px solid orange
- Text: White
- Hover: Slightly darker orange, enhanced shadow

#### ERP Environment Button (Authenticated)
- Background: `white/70` (semi-transparent)
- Border: 1px solid `#E5E7EB`
- Icon: Gray 500 by default
- Hover: Icon and text turn orange, brighter background, darker border
- Shadow: `0 1px 2px rgba(0,0,0,0.05)`

#### Profile Button (Authenticated)
- Shape: Circular (`w-9 h-9`)
- Background: `white/70`
- Border: 1px solid `#E5E7EB`
- Initials: Orange, SpaceGrotesk Bold
- Hover: Brighter background, darker border, shadow

**Key Principle:** Uniform styling between ERP and Profile buttons. Gray by default, orange on hover.

### Profile Dropdown

**Purpose:** User information and account actions

**Design Specifications:**
- Background: Cream (`#FAF9F5`)
- Border: 1px solid `#E5E7EB`
- Shadow: `shadow-lg` for elevation
- Width: Fixed `14rem`
- Font: SpaceGrotesk

**Structure:**
1. User Info Header
   - Large orange initials (no background circle)
   - Name in gray 700
   - Email in gray 400
   - Bottom divider: Light blue

2. Menu Items
   - Default: Gray 500 text
   - Hover: Light blue background, orange text
   - Icons: 16px, match text color
   - Padding: `px-4 py-2`

3. Sign Out
   - Top divider: Light blue
   - Same hover treatment as other items

**Key Principle:** Clean, text-focused. No circles around initials in dropdown.

---

## Button Design

### Philosophy

Buttons should be **obviously clickable** without being aggressive. Use subtle borders, light shadows, and thoughtful hover states.

### Base Button Anatomy

```
Background: white/70 (semi-transparent)
Border: 1px solid #E5E7EB
Shadow: 0 1px 2px rgba(0,0,0,0.05)
Padding: px-3 py-1.5
Rounded: rounded-lg
Font: SpaceGrotesk Semibold
```

### Hover State

```
Background: white/90 (more opaque)
Border: 1px solid #D1D5DB (darker)
Shadow: Enhanced slightly
Text/Icons: Orange if applicable
```

### Primary CTA (Orange)

```
Background: #F59E0B
Border: 2px solid #F59E0B
Text: White
Hover: Darker orange, enhanced shadow
```

### Key Principles

- **Borders must be visible but not thick** — 1px is standard, 2px for CTAs only
- **Balance is key** — Not too subtle (invisible borders) nor too bold (thick borders)
- **Uniform styling** — Adjacent buttons should look like they belong together
- **Icons reveal on interaction** — Gray by default, orange on hover

---

## Spacing & Layout

### Spacing Scale

We use a tight, efficient spacing system to maximize content density without feeling cramped.

| Size | Value | Usage |
|------|-------|-------|
| `0.5` | 2px | Minimal gaps |
| `1` | 4px | Tight spacing |
| `1.5` | 6px | Default gaps |
| `2` | 8px | Small padding |
| `2.5` | 10px | Sidebar padding |
| `3` | 12px | Medium padding |
| `4` | 16px | Standard padding |
| `6` | 24px | Section spacing |

### Key Principles

- **Minimize wasted space** — Especially in navigation components
- **No second lines** — Labels must fit on one line or be shortened
- **Balanced padding** — Enough to breathe, not so much it looks empty
- **Responsive adjustments** — Tighten spacing on mobile

---

## Interaction Design

### Hover Effects

**Philosophy:** Subtle, smooth transitions that enhance feedback without startling users.

**Standard Transition:**
```css
transition: all 300ms ease-out
```

**Typical Hover Behavior:**
1. Background slightly brighter
2. Border slightly darker
3. Shadow slightly enhanced
4. Accent colors (orange) appear
5. Optional slight scale or translation

### Active States

**Sidebar Active Item:**
- Orange gradient background
- White text
- Slight text translation (2px right)
- Delayed transition (500ms)

**Button Active:**
- Slightly darker than hover
- Enhanced shadow
- Maintained orange accent

### Focus States

- Outline removed (`outline-none`)
- Replaced with `focus-visible:outline-none`
- Visual focus maintained through other cues (shadow, border)

---

## Component Patterns

### Cards

```
Background: Cream or Light Blue
Border: 1px solid Light Blue/60
Rounded: rounded-2xl or rounded-3xl
Padding: p-6 to p-10
Shadow: shadow-sm default, shadow-lg for elevated cards
Hover: -translate-y-1, enhanced shadow
```

### Containers

```
Background: Light Blue
Border: Matches background
Rounded: rounded-3xl
Padding: Generous (p-10)
Shadow: shadow-xl for hero sections
```

### Dividers

```
Color: Light Blue (#EEF2FF)
Width: 1px
Usage: Between sections, in dropdowns
```

---

## Accessibility

### Contrast

- All text meets WCAG AA standards
- Orange on white: 3.5:1 (adequate for large text)
- Gray 700 on cream: 10:1 (excellent)
- White on orange: 4.5:1 (good)

### Interactive Elements

- Minimum touch target: 36x36px
- Keyboard navigation supported
- Focus indicators present
- Hover states clear

### Motion

- Smooth transitions (300-500ms)
- Respect `prefers-reduced-motion`
- No jarring animations

---

## Don'ts

**❌ Never do these:**

1. **Make everything orange** — It's an accent, not a primary color
2. **Use thick borders everywhere** — 2px borders are for emphasis only
3. **Add unnecessary circles/backgrounds** — Keep it clean and minimal
4. **Allow text to wrap in navigation** — Shorten labels or extend width
5. **Create excessive padding** — Space efficiently
6. **Use flashy animations** — Smooth and subtle only
7. **Mix font families in UI** — SpaceGrotesk for all interface elements
8. **Ignore hover states** — Every interactive element needs clear feedback
9. **Use pure white backgrounds** — Cream (#FAF9F5) is our white
10. **Create inconsistent button styles** — Adjacent buttons must look uniform

---

## Design Checklist

When creating a new component, ask:

- [ ] Does it use only our 3-color palette?
- [ ] Is SpaceGrotesk used for all UI text?
- [ ] Are borders subtle (1px) unless it's a primary CTA?
- [ ] Is orange used sparingly as an accent?
- [ ] Do hover states feel smooth (300ms transitions)?
- [ ] Is spacing tight but not cramped?
- [ ] Are interactive elements obviously clickable?
- [ ] Does it match the aesthetic of adjacent components?
- [ ] Is text single-line in navigation contexts?
- [ ] Does it feel classy, not "bling-bling"?

---

## Future Considerations

### Dark Mode
Currently not implemented, but if needed:
- Maintain the 3-color system
- Swap cream for dark gray
- Keep orange as accent
- Ensure WCAG AAA contrast

### Mobile Optimization
- Sidebar collapses or disappears on mobile
- Buttons maintain touch-friendly sizes (min 44px)
- Spacing may tighten further on small screens
- Font sizes scale responsively

### Internationalization
- SpaceGrotesk supports extended Latin characters
- Consider font loading strategies for CJK languages
- Ensure spacing accommodates longer translations

---

## Version History

- **v1.0** (2025-10-30): Initial design system documentation
  - Established 3-color palette
  - Defined typography system (SpaceGrotesk + Rockwell)
  - Documented navigation patterns
  - Codified button design principles
  - Set spacing and interaction standards

---

**Maintained by:** Sena Design Team
**Questions?** Refer to this document first, then reach out to design leads.
