# Development Guidelines - Caviste Personnel

## 🎯 Project Context

This document defines the development standards and best practices for the **Caviste Personnel** project, a Next.js wine e-commerce application with Shopify integration.

## 🏗️ Architecture Standards

### **Component Structure**
```
app/components/
├── componentName/
│   ├── __tests__/
│   │   └── ComponentName.test.tsx
│   ├── hooks/
│   │   └── useComponentName.ts
│   ├── types.ts
│   ├── constants.ts
│   └── ComponentName.tsx
```

### **File Organization**
- ✅ **Dedicated folders** for complex components
- ✅ **Tests alongside** components in `__tests__/` folders
- ✅ **Types and constants** in separate files
- ✅ **Custom hooks** in dedicated `hooks/` folders
- ✅ **Consistent naming** with PascalCase for components

### **Import Structure**
```typescript
// 1. React imports
import { useState, useEffect, useCallback } from "react";

// 2. Next.js imports
import Image from "next/image";
import type { Metadata } from "next";

// 3. Third-party libraries
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// 4. Internal utilities and types
import { Z_INDEX } from "../../styles/z-index";
import type { ComponentProps } from "./types";

// 5. Internal components
import { ComponentName } from "./ComponentName";
```

## 🎨 Styling Standards

### **Tailwind CSS Priority**
1. ✅ **Use Tailwind classes** whenever possible
2. ✅ **Avoid arbitrary values** (`[#color]`) - use theme colors
3. ✅ **Use CSS variables** for dynamic values only
4. ✅ **Keep CSS modules** for complex 3D transforms only

### **Color System**
```typescript
// ✅ Use theme colors
className="bg-primary-50 text-primary-600"
className="text-neutral-700 border-neutral-200"

// ❌ Avoid arbitrary colors
className="bg-[#f4f1ee] text-[#7a2d2d]"
```

### **Z-Index System**
```typescript
// ✅ Use centralized z-index system
import { Z_INDEX } from '../../styles/z-index';
className={`z-[${Z_INDEX.MODAL}]`}

// ❌ Avoid arbitrary z-index values
className="z-[10000]"
```

### **Responsive Design**
```typescript
// ✅ Mobile-first approach
className="w-full md:w-auto lg:w-1/2"
className="text-sm md:text-base lg:text-lg"

// ✅ Use semantic breakpoints
className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
```

## 🧪 Testing Standards

### **React Testing Library Best Practices**
```typescript
// ✅ Setup
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('ComponentName', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });
});
```

### **Test Structure**
```typescript
// ✅ Descriptive test names
it('renders notification with correct content', () => {
  // Test implementation
});

it('calls onClose when close button is clicked', async () => {
  // Test implementation
});

it('applies correct styling for success type', () => {
  // Test implementation
});
```

### **Testing Guidelines**
- ✅ **Use `userEvent`** instead of `fireEvent`
- ✅ **Use `waitFor`** for async assertions
- ✅ **Use `act()`** for state updates in timers
- ✅ **Use semantic selectors** (`getByRole`, `getByText`)
- ✅ **Use `data-testid`** for specific elements
- ✅ **Test accessibility** with ARIA attributes

### **Test Coverage**
- ✅ **Component rendering** and content
- ✅ **User interactions** and callbacks
- ✅ **Styling** and CSS classes
- ✅ **Conditional rendering** and states
- ✅ **Error handling** and edge cases
- ✅ **Accessibility** attributes

## 🔧 Code Quality Standards

### **TypeScript**
```typescript
// ✅ Strict typing
interface ComponentProps {
  title: string;
  onClose: () => void;
  autoClose?: boolean;
}

// ✅ Type guards
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

// ✅ Generic types
type ApiResponse<T> = {
  data: T;
  error?: string;
};
```

### **Error Handling**
```typescript
// ✅ Comprehensive error logging
console.error("Cart error:", {
  product: product.title,
  variantId: product.variantId,
  error: error instanceof Error ? error.message : error,
  status: errorWithStatus.status || "N/A (network error)",
  isNetworkError: errorWithStatus.isNetworkError || false,
  timestamp: new Date().toISOString()
});
```

### **Performance**
```typescript
// ✅ Memoization for expensive calculations
const className = useMemo(() => `...`, [dependencies]);

// ✅ Callback optimization
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);

// ✅ React.memo for components
export const ComponentName = memo(function ComponentName({ ... }) {
  // Component logic
});
```

## 🚀 Git Workflow

### **Pre-commit Hooks**
```javascript
// .lintstagedrc.js
module.exports = {
  '**/*.{js,jsx,ts,tsx}': 'npx eslint --fix',
};
```

### **Pre-push Hooks**
```bash
#!/usr/bin/env sh
# TypeScript checking
npm run type-check

# Jest tests for changed files
CHANGED_FILES=$(git diff --name-only origin/main...HEAD | grep -E '\.(js|jsx|ts|tsx)$' | grep -v -E '\.(test|spec)\.(js|jsx|ts|tsx)$')
npx jest --bail --findRelatedTests --passWithNoTests $CHANGED_FILES
```

## 📚 Documentation Standards

### **Code Comments**
```typescript
/**
 * Z-Index System - Centralized scale to avoid conflicts
 * 
 * Best practices:
 * - Use intervals of 100 to leave space for future additions
 * - Document each level
 * - Avoid arbitrary values
 */

// ✅ English comments only
// ✅ JSDoc for functions and components
// ✅ Inline comments for complex logic
```

### **Component Documentation**
```typescript
/**
 * CartNotification - Displays cart-related notifications
 * 
 * @param type - Notification type (success/error)
 * @param title - Notification title
 * @param message - Notification message
 * @param onClose - Callback when notification closes
 * @param autoClose - Whether to auto-close
 * @param checkoutUrl - URL for checkout button
 */
```

## 🎯 Specific Project Requirements

### **Shopify Integration**
- ✅ **Type-safe API calls** with comprehensive types
- ✅ **Error handling** for network and API errors
- ✅ **Cart persistence** in localStorage
- ✅ **Checkout flow** integration

### **Accessibility**
- ✅ **ARIA attributes** for screen readers
- ✅ **Keyboard navigation** support
- ✅ **Focus management** in modals
- ✅ **Semantic HTML** structure

### **Mobile-First Design**
- ✅ **Touch-friendly** interactions
- ✅ **Responsive breakpoints** for all devices
- ✅ **Performance optimization** for mobile
- ✅ **Progressive enhancement**

## 🔄 Future Development Guidelines

### **When Adding New Features**
1. ✅ **Follow component structure** guidelines
2. ✅ **Write comprehensive tests** first
3. ✅ **Use Tailwind classes** for styling
4. ✅ **Add TypeScript types** for all data
5. ✅ **Document the feature** with comments
6. ✅ **Test accessibility** and mobile responsiveness

### **When Refactoring**
1. ✅ **Maintain existing tests** or update them
2. ✅ **Preserve accessibility** features
3. ✅ **Update documentation** if needed
4. ✅ **Ensure mobile compatibility**
5. ✅ **Run full test suite** before committing

### **When Debugging**
1. ✅ **Check console errors** first
2. ✅ **Verify TypeScript types** are correct
3. ✅ **Test on mobile devices** if UI-related
4. ✅ **Check accessibility** with screen readers
5. ✅ **Verify performance** with React DevTools

## 📋 Quality Checklist

Before any commit, ensure:
- ✅ **ESLint passes** with no warnings
- ✅ **TypeScript compiles** without errors
- ✅ **All tests pass** including new ones
- ✅ **Mobile responsive** design works
- ✅ **Accessibility** features are intact
- ✅ **Performance** is not degraded
- ✅ **Documentation** is updated if needed

---

*This document should be updated as the project evolves and new patterns emerge.* 