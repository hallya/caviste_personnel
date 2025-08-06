# Z-Index System - Reference Guide

## 🎯 Objective

This centralized system prevents z-index conflicts and ensures consistent hierarchy throughout the application.

## 📊 Z-Index Scale

### Base Layer (0-99)
- **Z_INDEX.BASE**: 0 - Base element

### Content Layers (100-999)
- **Z_INDEX.CONTENT**: 100 - Normal content
- **Z_INDEX.CARD**: 200 - Cards and floating elements
- **Z_INDEX.TOOLTIP**: 300 - Local tooltips

### Navigation Layers (1000-1999)
- **Z_INDEX.NAVIGATION**: 1000 - Main navigation
- **Z_INDEX.DROPDOWN**: 1100 - Dropdown menus
- **Z_INDEX.STICKY_HEADER**: 1200 - Sticky headers
- **Z_INDEX.STICKY_FOOTER**: 1300 - Sticky footers

### Overlay Layers (2000-2999)
- **Z_INDEX.OVERLAY**: 2000 - Generic overlays
- **Z_INDEX.BACKDROP**: 2100 - Modal backgrounds

### Modal Layers (3000-3999)
- **Z_INDEX.MODAL**: 3000 - Main modals
- **Z_INDEX.MODAL_HEADER**: 3100 - Modal headers
- **Z_INDEX.MODAL_FOOTER**: 3200 - Modal footers
- **Z_INDEX.MODAL_CONTENT**: 3300 - Modal content

### Notification Layers (4000-4999)
- **Z_INDEX.NOTIFICATION**: 4000 - Notifications
- **Z_INDEX.TOAST**: 4100 - Toasts

### Top Priority Layers (5000+)
- **Z_INDEX.TOOLTIP_GLOBAL**: 5000 - Global tooltips
- **Z_INDEX.LOADING_OVERLAY**: 6000 - Loading overlays
- **Z_INDEX.DEBUG**: 9999 - Debug elements

## 🚀 Usage

### Import
```typescript
import { Z_INDEX } from '../../styles/z-index';
```

### In Tailwind classes
```tsx
// ❌ Old method (avoid)
className="z-[10000]"

// ✅ New method
className={`z-[${Z_INDEX.MODAL}]`}
```

### In inline styles
```tsx
// ✅ Inline style
style={{ zIndex: Z_INDEX.NOTIFICATION }}
```

## 📋 Usage by component

### Notifications
```tsx
// CartNotification.tsx
z-[${Z_INDEX.NOTIFICATION}] // 4000
```

### Modals/Popups
```tsx
// Popup.tsx
z-[${Z_INDEX.MODAL}] // 3000

// PopupHeader.tsx
z-[${Z_INDEX.MODAL_HEADER}] // 3100

// PopupFooter.tsx
z-[${Z_INDEX.MODAL_FOOTER}] // 3200
```

### Tooltips
```tsx
// ProductCard.tsx (price)
z-[${Z_INDEX.TOOLTIP}] // 300
```

### Carousel (dynamic z-index)
```tsx
// CarouselItem.tsx
// Uses calculated z-index: 100 - abs(offset)
// Compatible with system as < 1000
```

## 🔧 Maintenance

### Adding a new level
1. Choose an appropriate interval
2. Add to `app/styles/z-index.ts`
3. Document the usage
4. Update this guide

### Important rules
- ✅ Use system constants
- ✅ Leave intervals of 100
- ✅ Document new use cases
- ❌ Avoid arbitrary values
- ❌ Don't exceed 9999

## 🐛 Debugging

### Check for conflicts
```javascript
// In browser console
document.querySelectorAll('[class*="z-"]').forEach(el => {
  const zIndex = window.getComputedStyle(el).zIndex;
  if (zIndex !== 'auto') {
    console.log(el, zIndex);
  }
});
```

### Recommended tools
- Chrome DevTools > Elements > Computed > z-index
- Firefox DevTools > Inspector > Layout > z-index 