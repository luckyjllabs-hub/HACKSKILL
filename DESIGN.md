---
name: Aura Systematic
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dcdddd'
  on-secondary-container: '#5f6161'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#151c27'
  on-tertiary-container: '#7d8492'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#dce2f3'
  tertiary-fixed-dim: '#c0c7d6'
  on-tertiary-fixed: '#151c27'
  on-tertiary-fixed-variant: '#404754'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 80px
    letterSpacing: -0.04em
  display-sm:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  section-gap: 120px
---

## Brand & Style

The design system is rooted in a **Minimalist** and **Corporate Modern** aesthetic, prioritizing clarity, efficiency, and professional rigor. It is designed for high-stakes environments like ProjectMatch AI, where information density must be balanced with extreme legibility.

The visual narrative is "Information First." By utilizing a restricted monochromatic palette and generous whitespace, the interface recedes to allow the content—projects, matches, and data—to take center stage. The mood is confident, calm, and hyper-organized. It avoids decorative flourishes in favor of structural integrity and precise typographic hierarchy.

## Colors

The palette is strictly neutral to ensure a high-contrast, professional look. 

- **Primary:** A deep, near-black (#121212) used for primary actions, headings, and core brand elements.
- **Secondary:** A soft cool gray (#F5F5F5) used for secondary backgrounds, input fields, and subtle containers.
- **Tertiary:** A medium slate gray (#6B7280) reserved for secondary text, icons, and metadata to create a clear visual hierarchy.
- **Surface:** Pure white (#FFFFFF) is the foundational background color to maximize the "breathability" of the layout.

## Typography

This design system utilizes **Inter** across all levels to maintain a systematic and utilitarian feel. 

Headlines use tight letter-spacing and heavy weights to create "visual anchors" on the page. Body text is optimized for long-form reading with a generous line-height. Labels use a slightly heavier weight and, in the smallest instances, uppercase tracking to ensure they are distinct from body content.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop to maintain a premium, editorial feel, while transitioning to a fluid model for mobile devices.

- **Grid:** A 12-column grid with 24px gutters.
- **Whitespace:** Emphasize large vertical gaps between sections (up to 120px) to signify a change in context.
- **Alignment:** Use consistent left-alignment for all text blocks to reinforce the professional, structured look. 
- **Density:** Keep content density low. Elements should never feel cramped; if in doubt, increase the padding.

## Elevation & Depth

This system avoids traditional shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

- **Surfaces:** Depth is communicated by placing white cards on top of light gray (#F5F5F5) backgrounds.
- **Borders:** Use a subtle 1px border (#E5E7EB) to define containers. 
- **Shadows:** If elevation is required (e.g., for modals), use a very large, soft, and faint gray shadow (0px 20px 50px rgba(0,0,0,0.05)) to suggest floating without adding visual "weight."

## Shapes

The shape language is defined by **Pill-shaped** elements for interactive components and soft, rounded corners for structural containers. 

Buttons always use a full-radius (pill) shape to provide a friendly, modern contrast against the rigid, structured grid. Cards and larger containers should use `rounded-lg` or `rounded-xl` to maintain a contemporary, approachable aesthetic.

## Components

### Buttons
- **Primary:** Solid dark (#121212) fill with white text. Pill-shaped. 16px horizontal padding.
- **Secondary:** Outlined (1px #E5E7EB) with dark text. Pill-shaped.
- **Ghost:** No border or fill, dark text. Used for low-priority navigation.

### Input Fields
- **Style:** Light gray (#F5F5F5) background, no border, 12px padding. 
- **Focus:** 1px solid black border on focus.

### Cards
- **Style:** White background, subtle 1px border, `rounded-xl` corners. 
- **Padding:** Minimum 32px padding to maintain the minimalist feel.

### Chips & Badges
- **Style:** Small, pill-shaped, light gray background with dark gray text. Used for project tags or status indicators.

### Lists
- **Style:** Clean rows separated by thin 1px lines. Avoid alternating row colors; use whitespace and typography to distinguish items.