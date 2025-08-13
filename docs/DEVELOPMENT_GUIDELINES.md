# Development Guidelines - Caviste Personnel

## 🎯 Project Context

This document defines the development standards and best practices for the **Caviste Personnel** project, a Next.js wine e-commerce application with Shopify integration.

## 🏗️ Architecture Standards

### **Component Structure**

**For complex features (with business logic)**:
```
app/components/
├── featureName/              # camelCase naming
│   ├── containers/
│   │   └── FeatureContainer.tsx
│   ├── views/
│   │   └── FeatureView.tsx
│   ├── hooks/
│   │   └── useFeature.ts
│   ├── types.ts
│   ├── constants.ts
|   ├── index.ts # export container here
│   └── __tests__/
```

**For simple features (presentation only)**:
```
app/featureName/              # camelCase naming
├── views/
│   └── FeatureView.tsx
├── types.ts
├── constants.ts
├── FeatureName.tsx
|   index.ts                 # export view here
└── __tests__/
```

#### **Naming Conventions**
- ✅ **Use camelCase** for component folder names: `pageHeader`, `cartFloatingButton`
- ✅ **Use PascalCase** for component files: `PageHeader.tsx`, `CartFloatingButton.tsx`
- ✅ **Use kebab-case** for page routes: `contact`, `formations`
- ❌ **Avoid PascalCase** for folders: `PageHeader/` → `pageHeader/`
- ❌ **Avoid snake_case** for folders: `page_header/` → `pageHeader/`

### **Binary Architecture Decision**

**Simple rule**: 
- **Has business logic** → Use Container/View pattern
- **No business logic** → Use Direct View pattern

**Use Container/View pattern when**:
- Form handling with API calls
- State management
- Data fetching and transformations
- User interactions with side effects
- Multiple hooks coordination

**Use Direct View pattern when**:
- Static content only
- No API calls
- No state management
- No user interactions with side effects
- Presentation-only components

**Important**: Business logic should always be in hooks, containers only orchestrate hooks, never in pages or views.

### **Examples of Our Architecture**

**Example 1: Contact (Static Content)**:
```tsx
// app/contact/page.tsx
import ContactView from './views/ContactView';

export default function ContactPage() {
  return <ContactView />;
}
```

**Example 2: Formations (Business Logic + Hook)**:
```tsx
// app/formations/hooks/useFormations.ts
export function useFormations() {
  const [formData, setFormData] = useState(...);
  const handleSubmit = (e) => { /* API logic */ };
  return { formData, handleSubmit, ... };
}

// app/formations/page.tsx
export default function FormationsPage() {
  const props = useFormations();
  return <FormationsView {...props} />;
}
```

**Example 3: Layout (Direct View - Simple Composition)**:
```tsx
// app/components/layout/Layout.tsx
import { NotificationProvider } from "../../contexts/NotificationContext";
import { CartProvider } from "../../contexts/CartContext";

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <NotificationProvider>
        <CartProvider>
          {children}
          <CartFloatingButton />
        </CartProvider>
      </NotificationProvider>
    </div>
  );
}
```

**Example 4: PageHeader (Direct View - UI Content)**:
```tsx
// app/components/pageHeader/PageHeader.tsx
interface PageHeaderProps {
  isHomePage?: boolean;
}

export default function PageHeader({ isHomePage = false }: PageHeaderProps) {
  // Use H1 for homepage SEO, div for other pages to avoid multiple H1s
  const HeaderElement = isHomePage ? 'h1' : 'div';
  
  return (
    <div className="bg-primary-50 pt-8 pb-4">
      <HeaderElement className="text-center text-title text-primary-600">
        Edouard, Caviste personnel
      </HeaderElement>
    </div>
  );
}
```

**Note**: UI content (text, CSS classes) doesn't need constants - only business logic values do.

**Key Principle**: No business logic in page components, always in hooks.

### **Decision Flow**

When creating a new feature, ask:

1. **Does this feature have business logic?**
   - API calls? → Container/View
   - State management? → Container/View
   - Form handling? → Container/View
   - User interactions with side effects? → Container/View

2. **Is this purely presentational?**
   - Static content? → Direct View
   - No API calls? → Direct View
   - No state management? → Direct View

**No subjective "complexity" evaluation needed.**

### **Common Anti-Patterns to Avoid**

**❌ Business Logic in Pages**:
```tsx
// Bad: Logic in page
export default function FormationsPage() {
  const [formData, setFormData] = useState({});
  const handleSubmit = async (e) => {
    // Business logic here
  };
  return <FormationsView formData={formData} onSubmit={handleSubmit} />;
}
```

**❌ Redundant Containers**:
```tsx
// Bad: Container for static content
export default function ContactContainer() {
  return <ContactView />; // No logic needed
}
```

**❌ Mixed Responsibilities**:
```tsx
// Bad: View with business logic
export default function FormationsView() {
  const handleSubmit = async (e) => {
    // Business logic in view
  };
  return <form onSubmit={handleSubmit}>...</form>;
}
```

**❌ Redundant handleSubmit functions**:
```tsx
// Bad: Double event handling
function FormPage() {
  const handleSubmit = async (formData) => { /* API logic */ };
  return <FormView onSubmit={handleSubmit} />;
}

function FormView({ onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault(); // Just a wrapper!
    onSubmit(formData);
  };
  return <form onSubmit={handleSubmit}>...</form>;
}
```

**✅ Single responsibility**:
```tsx
// Good: Hook handles business logic, View handles events
function useForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // API logic here
  };
  return { handleSubmit };
}

function FormPage() {
  const { handleSubmit } = useForm();
  return <FormView onSubmit={handleSubmit} />;
}

function FormView({ onSubmit }) {
  return <form onSubmit={onSubmit}>...</form>; // Direct binding
}
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
5. ✅ **Use custom utility classes** for common patterns

### **Typography System**
```typescript
// ✅ Use custom typography classes
className="text-heading"    // Prata font + primary color
className="text-body"       // Geist font + neutral color
className="text-caption"    // Small text + gray color
className="text-button"     // Medium weight + small size
className="text-title"      // Prata font + xl size
className="text-subtitle"   // Prata font + lg size

// ✅ Use extended font sizes
className="text-2xs"        // 10px
className="text-xs"         // 12px
className="text-sm"         // 14px
className="text-base"       // 16px
className="text-lg"         // 18px
className="text-xl"         // 20px
className="text-2xl"        // 24px
className="text-3xl"        // 30px
className="text-4xl"        // 36px
className="text-5xl"        // 48px
className="text-6xl"        // 60px

// ✅ Use font families
className="font-prata"      // Serif font for headings
className="font-sans"       // Geist font for body text
className="font-mono"       // Monospace font for code
```

### **Color System**
```typescript
// ✅ Use theme colors
className="bg-primary-50 text-primary-600"
className="text-neutral-700 border-neutral-200"

// ❌ Avoid arbitrary colors
className="bg-[#f4f1ee] text-[#7a2d2d]"
```

**Available color palettes:**
- `primary-50` to `primary-900` - Wine theme colors
- `neutral-50` to `neutral-900` - Grayscale colors
- `background` and `foreground` - CSS variables for theming

### **Z-Index System**
```typescript
// ✅ Use Tailwind z-index classes (preferred)
className="z-modal"
className="z-notification"
className="z-tooltip"

// ✅ Use centralized z-index system for dynamic values
import { Z_INDEX } from '../../styles/z-index';
className={`z-[${Z_INDEX.MODAL}]`}

// ❌ Avoid arbitrary z-index values
className="z-[10000]"
```

**Available z-index classes:**
- `z-modal` (3000) - Main modal containers
- `z-modal-header` (3100) - Modal headers
- `z-modal-footer` (3200) - Modal footers
- `z-notification` (4000) - Notifications and toasts
- `z-tooltip` (300) - Tooltips and overlays

### **Responsive Design**
```typescript
// ✅ Mobile-first approach
className="w-full md:w-auto lg:w-1/2"
className="text-sm md:text-base lg:text-lg"

// ✅ Use semantic breakpoints
className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"

// ✅ Use extended line heights
className="leading-tight"    // 1.25
className="leading-snug"     // 1.375
className="leading-normal"   // 1.5
className="leading-relaxed"  // 1.625
className="leading-loose"    // 2.0

// ✅ Use letter spacing
className="tracking-tighter" // -0.05em
className="tracking-tight"   // -0.025em
className="tracking-normal"  // 0em
className="tracking-wide"    // 0.025em
className="tracking-wider"   // 0.05em
className="tracking-widest"  // 0.1em
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

### **Testing Examples (Real Project)**
```typescript
// ✅ Good: Accessible selectors
expect(screen.getByRole('heading', { name: 'Formations en Œnologie', level: 1 })).toBeInTheDocument();
expect(screen.getByRole('textbox', { name: 'Nom complet *' })).toBeInTheDocument();
await user.type(screen.getByRole('textbox', { name: 'Email *' }), 'test@example.com');

// ✅ Good: User behavior testing  
await user.click(screen.getByRole('button', { name: 'Envoyer ma demande' }));
expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
  preventDefault: expect.any(Function)
}));

// ❌ Avoid: Implementation details
// expect(wrapper.find('.form-submit')).toHaveBeenCalled();
// expect(component.state.isSubmitting).toBe(true);
```

### **Testing Guidelines**
- ✅ **Use `userEvent`** instead of `fireEvent`
- ✅ **Use `waitFor`** for async assertions
- ✅ **Use `act()`** for state updates in timers
- ✅ **Prioritize accessible selectors**: `getByRole`, `getByLabelText`, `getByText`
- ❌ **Avoid `getByTestId`** except for exceptional cases
- ✅ **Test user behavior** not implementation details
- ✅ **Use `within()` for hierarchical queries**
- ✅ **Mock only what's necessary**
- ✅ **Test error and loading states**

### **Test Coverage**
- ✅ **Component rendering** and content
- ✅ **User interactions** and callbacks
- ✅ **Styling** and CSS classes
- ✅ **Conditional rendering** and states
- ✅ **Error handling** and edge cases
- ✅ **Accessibility** attributes

### **Constants Usage in Tests**
```typescript
// ❌ Hardcoded strings in tests
expect(mockTrack).toHaveBeenCalledWith({
  name: "cart_add",
  properties: { variant_id: "variant-123" }
});

// ✅ Use constants from the application
import { ANALYTICS_EVENTS } from "../../../analytics/constants/analytics";

expect(mockTrack).toHaveBeenCalledWith({
  name: ANALYTICS_EVENTS.CART_ADD,
  properties: { variant_id: "variant-123" }
});

// ✅ Use constants for API endpoints
import { API_ENDPOINTS } from "../../../constants/api";

expect(mockFetch).toHaveBeenCalledWith(API_ENDPOINTS.CART, {
  method: "GET",
  headers: { "Content-Type": "application/json" }
});

// ✅ Use constants for test data
import { TEST_CONSTANTS } from "../../../__tests__/constants";

const mockCart = TEST_CONSTANTS.MOCK_CART;
const mockProduct = TEST_CONSTANTS.MOCK_PRODUCT;
```

#### **Constants in Tests Guidelines**
- ✅ **Import and use constants** from the application code
- ✅ **Use analytics event constants** (`ANALYTICS_EVENTS`) in tracking tests
- ✅ **Use API endpoint constants** (`API_ENDPOINTS`) in API tests
- ✅ **Use test data constants** for consistent mock data
- ✅ **Maintain consistency** between implementation and tests
- ❌ **Avoid hardcoded strings** that duplicate application constants
- ❌ **Avoid magic numbers** in test assertions

## 🔧 Code Quality Standards

### **Dead Code Elimination**
```typescript
// ❌ Unused imports
import { useState, useEffect, useCallback } from 'react';
import { formatPrice, validateInput } from './utils'; // validateInput not used

function Component() {
  const [count, setCount] = useState(0); // count not used
  
  useEffect(() => {
    // effect logic
  }, []);
  
  return <div>{formatPrice(25.99)}</div>;
}

// ✅ Clean imports and variables
import { useEffect } from 'react';
import { formatPrice } from './utils';

function Component() {
  useEffect(() => {
    // effect logic
  }, []);
  
  return <div>{formatPrice(25.99)}</div>;
}
```

#### **Dead Code Guidelines**
- ✅ **Remove unused imports** - imports that are never referenced
- ✅ **Remove unused variables** - variables declared but never used
- ✅ **Remove unused functions** - functions that are never called
- ✅ **Remove unused types** - TypeScript interfaces/types with no usage
- ✅ **Remove commented code** - old code blocks that serve no purpose
- ✅ **Simplify overly complex mocks** - test mocks with unnecessary complexity
- ❌ **Never leave console.log** in production code
- ❌ **Avoid dead conditional branches** - unreachable code paths

### **TypeScript**
```typescript
// ✅ Strict typing
interface ComponentProps {
  title: string;
  onClose: () => void;
  autoClose?: boolean;
}

// ✅ Reuse existing types instead of creating inline ones
interface ComponentProps {
  title: string;
  onClose: () => void;
  autoClose?: boolean;
}

// ✅ Type imports with 'import type'
import type { 
  ShopifyCartQueryVars, 
  ShopifyCart,
  ShopifyCartLine 
} from "../../types/shopify";

// ✅ Type guards
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

// ✅ Generic types
type ApiResponse<T> = {
  data: T;
  error?: string;
};

// ❌ Avoid complex inline types
// const lines = cart?.lines?.edges?.map((edge: { node: { id: string; quantity: number; merchandise: { ... } } }) => {
// ✅ Reuse existing types instead
const lines = cart?.lines?.edges?.map((edge) => {
  const node = edge.node as ShopifyCartLine;
  // ...
});
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

### **Magic Values and Constants**

#### **What to Eliminate (Magic Values)**
```typescript
// ❌ Magic strings to eliminate
const apiUrl = "https://api.shopify.com/admin/api/2023-10/products.json";
const errorMessage = "Failed to load products";
const apiKey = "shpat_1234567890abcdef";
const businessValue = "premium_tier";

// ❌ Magic numbers to eliminate
const maxProducts = 250;
const timeout = 5000;
const retryAttempts = 3;
```

#### **What NOT to Eliminate (UI Content)**
```typescript
// ✅ These are NOT magic strings - they're UI content
const title = "Edouard, Caviste personnel";
const className = "bg-primary-50 pt-8 pb-4";
const buttonText = "Add to Cart";

// ✅ These are NOT magic numbers - they're styling
const padding = "pt-8 pb-4";
const fontSize = "text-lg";
```

#### **Guidelines for Constants**
```typescript
// ✅ Use constants for business logic and configuration
export const API_CONFIG = {
  BASE_URL: "https://api.shopify.com/admin/api/2023-10",
  MAX_PRODUCTS_PER_COLLECTION: 250,
  TIMEOUT_MS: 5000,
  RETRY_ATTEMPTS: 3,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Erreur de connexion",
  VALIDATION_ERROR: "Données invalides",
  NOT_FOUND: "Produit non trouvé",
} as const;

// ✅ Group related constants
export const TIMING = {
  MILLISECONDS_PER_SECOND: 1000,
  SECONDS_PER_MINUTE: 60,
  MINUTES_PER_HOUR: 60,
} as const;
```

#### **Magic Value Guidelines**
- ✅ **Eliminate magic strings** for:
  - URLs d'API
  - Messages d'erreur
  - Clés de configuration
  - Valeurs métier
- ✅ **Eliminate magic numbers** for:
  - Limites d'API
  - Timeouts
  - Tentatives de retry
  - Valeurs de configuration
- ❌ **Don't over-engineer** UI content:
  - Text content des balises HTML
  - Classes CSS/Tailwind
  - Labels et placeholders
- ✅ **Use descriptive names** that explain the purpose
- ✅ **Group related constants** in objects
- ✅ **Use `as const`** for type safety
- ✅ **Import constants** from dedicated files

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

// ✅ Comment only when necessary - explain complex business logic
const isAvailable = product.variantId && cartQuantity < (product.quantityAvailable || 0);

// ✅ Comment workarounds or non-obvious solutions
// Shopify's availableForSale flag doesn't reflect real-time stock, 
// so we need to check quantityAvailable and cart contents

// ❌ Don't comment obvious code
// const title = product.title; // This is obvious
// const price = product.price; // This is obvious

// ✅ Comment complex calculations or business rules
// Calculate remaining stock considering items already in cart
const remainingStock = (product.quantityAvailable || 0) - cartQuantity;
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

### **Comment Guidelines**

#### **✅ When to Comment**
- **Complex business logic** that isn't immediately obvious
- **Workarounds** for API limitations or third-party issues
- **Non-obvious calculations** or algorithms
- **Important architectural decisions** that affect the codebase
- **Temporary solutions** that need to be revisited

#### **❌ When NOT to Comment**
- **Obvious variable assignments** (`const title = product.title`)
- **Simple function calls** (`addToCart(product.id)`)
- **Standard React patterns** (`useState`, `useEffect`)
- **Self-explanatory code** that reads like English
- **Redundant explanations** of what the code obviously does

#### **📝 Comment Style**
- **Always in English** - no French comments
- **Explain the "why"** not the "what"
- **Be concise** but informative
- **Use present tense** for ongoing explanations
- **Reference external constraints** when relevant

## 🎯 Specific Project Requirements

### **Tailwind Configuration**
- ✅ **Extended color palette** with wine theme colors
- ✅ **Custom typography system** with Prata and Geist fonts
- ✅ **Z-index scale** for consistent layering
- ✅ **Custom utility classes** for common patterns
- ✅ **Responsive design** with mobile-first approach

### **Shopify Integration**
- ✅ **Type-safe API calls** with comprehensive types
- ✅ **Reuse existing types** instead of creating inline ones
- ✅ **Centralized type definitions** in dedicated files
- ✅ **Error handling** for network and API errors
- ✅ **Cart persistence** in localStorage
- ✅ **Checkout flow** integration

### **API Route Structure**
For Next.js API routes with validation schemas:

```
app/api/feature/
├── route.ts              # Main route handler
├── schemas.ts            # Zod validation schemas (shared)
└── __tests__/
    └── route.test.ts     # Tests (import schemas from schemas.ts)
```

**Key principles**:
- ✅ **Extract schemas** to separate `schemas.ts` file
- ✅ **Import schemas** in both route handler and tests
- ✅ **Avoid redefining schemas** in test files
- ✅ **Prevent Jest environment issues** by isolating server-side imports
- ✅ **Use Zod for validation** with proper error handling
- ✅ **Return consistent JSON responses** with status codes

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

## 🔧 Configuration Best Practices

### **Tailwind Configuration Updates**
When updating `tailwind.config.ts`:
1. ✅ **Add new colors** to the `colors` object
2. ✅ **Extend font families** in `fontFamily`
3. ✅ **Add custom utilities** in `globals.css` with `@layer utilities`
4. ✅ **Use semantic naming** for custom classes
5. ✅ **Test configuration** with `npm run build`
6. ✅ **Update documentation** with new classes

### **CSS Organization**
```css
/* ✅ Structure in globals.css */
@import "tailwindcss";

:root {
  /* CSS variables for theming */
}

@layer base {
  /* Base styles and resets */
}

@layer utilities {
  /* Custom utility classes */
}
```

## 🔄 Future Development Guidelines

### **When Adding New Features**
1. ✅ **Follow component structure** guidelines
2. ✅ **Write comprehensive tests** first
3. ✅ **Use Tailwind classes** for styling
4. ✅ **Add TypeScript types** for all data
5. ✅ **Document the feature** with comments
6. ✅ **Test accessibility** and mobile responsiveness
7. ✅ **Use custom typography classes** for consistent text styling
8. ✅ **Use z-index classes** for proper layering

### **When Refactoring**
1. ✅ **Maintain existing tests** or update them
2. ✅ **Preserve accessibility** features
3. ✅ **Update documentation** if needed
4. ✅ **Ensure mobile compatibility**
5. ✅ **Run full test suite** before committing
6. ✅ **Update typography classes** to use new system
7. ✅ **Replace arbitrary values** with theme classes

### **When Debugging**
1. ✅ **Check console errors** first
2. ✅ **Verify TypeScript types** are correct
3. ✅ **Test on mobile devices** if UI-related
4. ✅ **Check accessibility** with screen readers
5. ✅ **Verify performance** with React DevTools
6. ✅ **Check Tailwind classes** are properly generated
7. ✅ **Verify z-index layering** is correct

## 📋 Quality Checklist

Before any commit, ensure:
- ✅ **ESLint passes** with no warnings
- ✅ **TypeScript compiles** without errors
- ✅ **Reuse existing types** instead of creating inline ones
- ✅ **Avoid complex inline type definitions** in API routes or components
- ✅ **All tests pass** including new ones
- ✅ **Mobile responsive** design works
- ✅ **Accessibility** features are intact
- ✅ **Performance** is not degraded
- ✅ **Documentation** is updated if needed
- ✅ **Tailwind classes** are properly configured
- ✅ **Typography system** is used consistently
- ✅ **Z-index layering** follows the established system

---

*This document should be updated as the project evolves and new patterns emerge.* 