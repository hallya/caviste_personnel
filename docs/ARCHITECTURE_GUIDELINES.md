# Architecture Guidelines

## Overview

This document outlines the architectural patterns and best practices for the Caviste Personnel project to ensure maintainability, testability, and scalability.

## Core Principles

### 1. Separation of Concerns
- **Business Logic**: Handled in custom hooks
- **UI Logic**: Handled in presentational components
- **Data Management**: Handled in hooks and services
- **Container Logic**: Minimal, only for connecting hooks to views

### 2. Binary Architecture Decision
**Simple rule**: 
- **Has business logic** → Use Container/View pattern
- **No business logic** → Use Direct View pattern

No subjective "complexity" evaluation needed - it's binary and objective.

## Architecture Patterns

### Pattern 1: Container/View (When Business Logic Exists)
Use this pattern when your feature has:
- Form handling with API calls
- State management
- Data fetching and transformations
- User interactions with side effects
- Multiple hooks coordination

**Structure**:
```
app/components/
├── featureName/
│   ├── containers/
│   │   └── FeatureContainer.tsx    # Orchestrates hooks and views
│   ├── views/
│   │   └── FeatureView.tsx         # Pure UI component
│   ├── hooks/
│   │   └── useFeature.ts           # Business logic
│   ├── types.ts
│   ├── constants.ts
│   └── __tests__/
```

**Example**:
```tsx
// hooks/useFormations.ts (contains business logic)
export function useFormations() {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // API logic here
  };
  
  return { formData, isSubmitting, handleSubmit };
}

// containers/FormationsContainer.tsx (orchestrates hooks)
export default function FormationsContainer() {
  const props = useFormations(); // Hook contains business logic
  return <FormationsView {...props} />;
}

// views/FormationsView.tsx
export default function FormationsView({ formData, isSubmitting, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit}>
      {/* UI only */}
    </form>
  );
}

// page.tsx
export default function FormationsPage() {
  return <FormationsContainer />;
}
```

### Pattern 2: Direct View (When No Business Logic)
Use this pattern when your feature has:
- Static content only
- No API calls
- No state management
- No user interactions with side effects
- Presentation-only components

**Structure**:
```
app/featureName/
├── views/
│   └── FeatureView.tsx             # Pure UI component
├── types.ts
├── constants.ts
└── __tests__/
```

**Example**:
```tsx
// views/ContactView.tsx
export default function ContactView() {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>Static content only</p>
    </div>
  );
}

// page.tsx
export default function ContactPage() {
  return <ContactView />;
}
```

## Component Types

### 1. Container Components (`containers/`)
**Purpose**: Orchestrate hooks (which contain business logic) and connect them to presentational components. Should be minimal and contain no business logic themselves.

**Characteristics**:
- Import and use hooks (which contain the business logic)
- Pass data and callbacks from hooks to presentational components
- No business logic - only orchestration
- No direct UI rendering
- Simple data flow orchestration

**Example**:
```tsx
// containers/CartContainer.tsx (orchestrates hooks)
export default function CartContainer() {
  const { cart, loading, error, onQuantityChange, onRemoveItem } = useCartLogic(); // Hook contains business logic

  return (
    <CartView
      cart={cart}
      loading={loading}
      error={error}
      onQuantityChange={onQuantityChange}
      onRemoveItem={onRemoveItem}
    />
  );
}
```

### 2. Presentational Components (`views/`)
**Purpose**: Render UI based on props, no business logic.

**Characteristics**:
- Receive data via props
- Handle UI interactions only
- No direct API calls or state management
- Pure functions when possible
- Easy to test and style

**Example**:
```tsx
// views/CartView.tsx
interface CartViewProps {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  onQuantityChange: (lineId: string, quantity: number) => void;
}

export default function CartView({ cart, loading, error, onQuantityChange }: CartViewProps) {
  if (loading) return <CartLoading />;
  if (error || !cart) return <CartEmpty error={error} />;
  
  return <CartContent cart={cart} onQuantityChange={onQuantityChange} />;
}
```

### 3. Page Components
**Purpose**: Next.js pages that should be minimal and follow the binary rule.

**With Business Logic (Container/View)**:
```tsx
// app/cart/page.tsx
import CartContainer from '../components/cart/containers/CartContainer';

export default function CartPage() {
  return <CartContainer />;
}
```

**Without Business Logic (Direct View)**:
```tsx
// app/contact/page.tsx
import ContactView from './views/ContactView';

export default function ContactPage() {
  return <ContactView />;
}
```

## Custom Hooks

### Structure
- **Data Hooks**: `use[Feature].ts` - Fetch and manage data
- **Action Hooks**: `use[Feature]Actions.ts` - Handle user actions
- **Logic Hooks**: `use[Feature]Logic.ts` - Complex business logic and state management

### Guidelines
- One hook per file
- Clear naming convention
- Return consistent interfaces
- Handle loading and error states
- Use TypeScript for all interfaces
- **Business logic should be in hooks, containers only orchestrate hooks**

**Example**:
```tsx
// hooks/useCartLogic.ts
export function useCartLogic() {
  const { cart, loading, error, updateCart } = useCart();
  const { updateQuantity, removeItem } = useCartActions();

  const handleQuantityChange = async (lineId: string, quantity: number) => {
    const updatedCart = await updateQuantity(lineId, quantity);
    if (updatedCart) {
      updateCart(updatedCart);
    }
  };

  const handleRemoveItem = async (lineId: string) => {
    const updatedCart = await removeItem(lineId);
    if (updatedCart) {
      updateCart(updatedCart);
    }
  };

  return { 
    cart, 
    loading, 
    error, 
    onQuantityChange: handleQuantityChange,
    onRemoveItem: handleRemoveItem
  };
}
```

## TypeScript Guidelines

### 1. Interfaces
- Define interfaces in `types.ts`
- Use descriptive names
- Export all interfaces
- Use strict typing

```tsx
// types.ts
export interface Cart {
  id: string;
  totalQuantity: number;
  totalAmount: string;
  checkoutUrl: string;
  lines: CartItem[];
}

export interface CartItem {
  id: string;
  title: string;
  price: string;
  quantity: number;
  image?: string;
  availableForSale: boolean;
  quantityAvailable: number;
}
```

### 2. Props Interfaces
- Define props interfaces in the same file as the component
- Use descriptive names ending with `Props`
- Make optional props explicit

```tsx
interface CartViewProps {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  onQuantityChange: (lineId: string, quantity: number) => void;
}
```

## Testing Strategy

### 1. Container Tests
- Test business logic
- Mock hooks and dependencies
- Test event handlers
- Verify data flow

### 2. Presentational Tests
- Test UI rendering
- Test user interactions
- Test prop changes
- Use React Testing Library

### 3. Hook Tests
- Test state changes
- Test async operations
- Test error handling
- Mock external dependencies

## File Naming Conventions

### Components
- **Containers**: `[Feature]Container.tsx`
- **Views**: `[Feature]View.tsx`
- **Content**: `[Feature]Content.tsx`
- **States**: `[Feature]Empty.tsx`, `[Feature]Loading.tsx`

### Hooks
- **Data**: `use[Feature].ts`
- **Actions**: `use[Feature]Actions.ts`

### Utilities
- **Types**: `types.ts`
- **Constants**: `constants.ts`
- **Utils**: `utils.ts`

## Benefits of This Architecture

### 1. Maintainability
- Clear separation of concerns
- Easy to locate and modify specific functionality
- Reduced coupling between components

### 2. Testability
- Business logic can be tested independently
- UI components can be tested in isolation
- Hooks can be tested separately

### 3. Reusability
- Presentational components can be reused
- Business logic can be shared between components
- Hooks can be used across different features

### 4. Scalability
- Easy to add new features
- Clear structure for team collaboration
- Consistent patterns across the codebase

## Decision Flow

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

## Common Anti-Patterns to Avoid

### ❌ Business Logic in Pages
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

### ❌ Redundant Containers
```tsx
// Bad: Container for static content
export default function ContactContainer() {
  return <ContactView />; // No logic needed
}
```

### ❌ Mixed Responsibilities
```tsx
// Bad: View with business logic
export default function FormationsView() {
  const handleSubmit = async (e) => {
    // Business logic in view
  };
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Conclusion

Following these architectural guidelines ensures:
- **Clean code** that's easy to understand and maintain
- **Testable components** that can be verified independently
- **Scalable architecture** that grows with the project
- **Team collaboration** with consistent patterns
- **Future-proof code** that's easy to modify and extend

**Remember**: Binary decision - logic = Container/View, no logic = Direct View. 