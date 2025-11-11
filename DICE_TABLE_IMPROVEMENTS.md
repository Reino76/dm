# Dice Table Lookup - Coherent Visual Design Improvements

## Overview
All dice throwing/table lookup sections have been redesigned with a unified, coherent visual presentation system. Each section now features consistent styling, prominent table display options, and improved visual hierarchy.

## Key Improvements

### 1. **Unified Dice Roll Container (`.dice-roll-section`)**
- Consistent visual styling across all generators
- Light surface background with border
- Hover effects for interactivity feedback
- Responsive padding and sizing

**Features:**
- Title section with icon support
- Centered dice roller area
- Result display with consistent formatting
- Table toggle button always visible

### 2. **Coherent Component Structure**

Each dice/table lookup now contains:
```
┌─ dice-roll-section ────────────────────┐
│  ┌─ Title with icon                  │
│  ├─ dice-roller section              │
│  │  ├─ dice-indicator (d20/d100)    │
│  │  ├─ dice-inputs (input fields)   │
│  │  └─ result-display (result area) │
│  └─ table-toggle-section             │
│     └─ "Näytä Taulukko" button      │
└────────────────────────────────────────┘
```

### 3. **Responsive Dice Input Fields**
- Desktop: 120x120px with 3rem font
- Tablet: 100x100px with 2.5rem font
- Mobile: 80x80px with 2rem font
- Smooth transitions between sizes

### 4. **Result Display Area**
- Consistent min-height (80px on desktop, 70px tablet, 60px mobile)
- Centered, prominent result text
- Color-coded results (primary color)
- Adequate padding for visual breathing room

### 5. **Enhanced Table Display**

#### Table Visual Hierarchy
- **Caption**: Large, bold, sticky header with red underline
- **Headers**: Sticky with red text on dark background
- **Rows**: Alternating subtle background colors
- **Hover**: Interactive row highlighting on desktop
- **Responsive**: Adjusts text size and padding on mobile

#### Table Organization
- Guild Name: 2-column layout (Table 1 + Table 2)
- Character Names: Single column
- Occupations: Single table
- Virtues: Single d20 table
- Vices: Single d20 table

#### Table Features
- **Max Height**: 60vh with scrollable overflow
- **Sticky Captions**: Always visible when scrolling
- **Sticky Headers**: Row headers stay in view
- **Border Styling**: 2px solid borders with hover effects
- **Responsive Wrapping**: Single column on mobile

### 6. **Dice Indicators**
- Small background pill with dice notation
- Examples: "d20", "d100", "d100 x 2"
- Color-coded with primary color border
- Min-width for consistency

### 7. **Occupation Result Cards**
- Consistent card styling
- Title and benefit/description layout
- Hover effects for visual feedback
- Reroll section for double rolls (roll 50)
- Responsive grid layout for double rerolls

### 8. **Table Toggle Section**
- Consistent positioning below results
- Icon: Book icon for visual reference
- Text: "Näytä Taulukko" (Show Table)
- Always available, never hidden
- Responsive button sizing

### 9. **Visual Consistency Improvements**

**Color Scheme:**
- Primary color: Red (#E53E3E) for headings
- Hover color: Lighter red (#FC8181)
- Surface color: Slightly lighter containers
- Text color: Light gray (#f0f0f0)
- Border color: Medium gray (#4a4a4a)

**Typography:**
- Headings: Merriweather serif font
- Body: Lato sans-serif
- Weights: 700 for titles, 400 for content

**Spacing:**
- Section padding: 20px desktop, 15px tablet, 12px mobile
- Input gap: 20px desktop, 15px tablet, 10px mobile
- Consistent use of `gap` property for modern spacing

## Implementation Details

### HTML Structure Changes
- Replaced `name-generator-container` with `dice-roll-section`
- Renamed `name-generator-inputs` to `dice-inputs`
- Renamed `dice-indicator` (now consistent across all types)
- Added `result-display` wrapper for results
- Added `table-toggle-section` container
- Added table modals for Virtue and Vice

### CSS Additions
```css
.dice-roll-section        /* Main container */
.dice-roller             /* Flex container */
.dice-indicator          /* Badge styling */
.dice-inputs            /* Input field container */
.result-display         /* Result area */
.table-toggle-section   /* Button area */
.name-table-wrapper     /* Enhanced table styling */
```

### JavaScript Enhancements
- Added virtue table modal setup
- Added vice table modal setup
- Created `createVirtueViceTableHtml()` function
- Updated `populateGeneratorTables()` to include virtue/vice
- Modal setup unified for all 5 generator types

## Responsive Breakpoints

### Desktop (1024px+)
- Full-width generators
- 2-column table layout where applicable
- Large dice inputs (120x120px)
- All controls visible

### Tablet (768px - 1023px)
- Adjusted spacing and padding
- Single-column table layout
- Medium dice inputs (100x100px)
- Optimized for touch

### Mobile (375px - 767px)
- Stacked layout with full-width buttons
- Vertical scrolling tables
- Small dice inputs (80x80px)
- Large touch targets (44px+ buttons)

## User Experience Benefits

1. **Visual Coherence**: All dice/table sections look and feel the same
2. **Easy Discovery**: Table toggle button always visible and obvious
3. **Consistent Navigation**: Same structure everywhere
4. **Better Mobile**: Touch-friendly sizing and layout
5. **Responsive**: Adapts beautifully to all screen sizes
6. **Accessible**: Proper color contrast and readable text sizes
7. **Interactive**: Hover effects and smooth transitions

## Table Display Features

### Always Available
- No hidden tables that users must discover
- "Näytä Taulukko" button prominently displayed
- Easy to reference while rolling

### Organized Tables
- **Guild Names**: Color-coded tables for visual distinction
- **Occupations**: d50 roll reference with benefits
- **Virtues**: d20 roll with descriptions
- **Vices**: d20 roll with descriptions

### Scrollable Design
- Max height prevents overwhelming display
- Sticky headers for reference while scrolling
- Smooth scrolling on all devices

## CSS Classes Reference

```css
.dice-roll-section     /* Container for entire roll section */
.dice-roller           /* Contains dice indicator and inputs */
.dice-indicator        /* d20/d100 badge */
.dice-inputs           /* Flexbox container for input fields */
.d-input-square        /* Individual die input field */
.result-display        /* Container for rolled result */
.table-toggle-section  /* Container for table button */
.name-table-wrapper    /* Enhanced table styling */
```

## Accessibility Features

- ✅ Sufficient color contrast (WCAG AA)
- ✅ Touch targets 44px+ on mobile
- ✅ Clear visual hierarchy
- ✅ Descriptive labels
- ✅ Keyboard navigable
- ✅ Responsive text sizing

## Files Modified

1. **public/index.html**
   - Updated all generator sections with new structure
   - Added virtue and vice table modals
   - Simplified and unified container hierarchy

2. **public/main.js**
   - Added virtue and vice modal setup
   - Created `createVirtueViceTableHtml()` function
   - Updated `populateGeneratorTables()` with new tables

3. **public/style.css**
   - Added `.dice-roll-section` styling
   - Added `.dice-roller` and related styles
   - Enhanced `.name-table-wrapper` with better styling
   - Added responsive media queries for all new elements

## Future Enhancements

1. **Inline Table Toggle**: Collapsible table within same section
2. **Dice History**: Show previous rolls
3. **Quick Copy**: Copy results to clipboard
4. **Favorites**: Mark and quick-access common results
5. **Custom Tables**: User-defined generator tables

## Testing Recommendations

### Visual Testing
- [ ] Desktop browser (1920px+) - All sections properly styled
- [ ] Tablet (768px) - Responsive layout working
- [ ] Mobile (375px) - Touch-friendly sizing
- [ ] Dark theme - All colors legible
- [ ] Hover states - All interactive elements responsive

### Functional Testing
- [ ] Dice inputs work on all sections
- [ ] Results display correctly
- [ ] Table modals open/close
- [ ] Tables scroll properly
- [ ] All data displays correctly

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] Touch targets adequate (44px+)
- [ ] Text resizable

---

**Result:** A coherent, intuitive, and visually unified dice/table lookup system that's accessible across all device sizes and screen orientations.
