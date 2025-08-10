# Architecture Guidelines

## Overview

This document outlines the architectural patterns and best practices for the Caviste Personnel project to ensure maintainability, testability, and scalability.

## Core Principles

### 1. Separation of Concerns
- **Business Logic**: Handled in custom hooks
- **UI Logic**: Handled in presentational components
- **Data Management**: Handled in hooks and services
- **Container Logic**: Minimal, only for connecting hooks to views

### 2. Container/Presentational Pattern
We follow the Container/Presentational pattern (also known as Smart/Dumb Components) to separate business logic from UI rendering.

## Directory Structure

```
app/
├── components/
│   └── [feature]/
│       ├── containers/          # Minimal container components
│       │   └── [Feature]Container.tsx
│       ├── views/               # Presentational components
│       │   ├── [Feature]View.tsx
│       │   ├── [Feature]Content.tsx
│       │   ├── [Feature]Empty.tsx
│       │   └── [Feature]Loading.tsx
│       ├── hooks/               # Custom hooks (business logic)
│       │   ├── use[Feature].ts
│       │   ├── use[Feature]Actions.ts
│       │   └── use[Feature]Logic.ts
│       ├── types.ts             # TypeScript interfaces
│       ├── constants.ts         # Constants and configuration
│       ├── utils.ts             # Utility functions
│       └── __tests__/           # Test files
└── [feature]/
    └── page.tsx                 # Next.js page (minimal)
```

## Component Types

### 1. Container Components (`containers/`)
**Purpose**: Connect hooks to presentational components. Should be minimal and contain no business logic.

**Characteristics**:
- Import and use hooks
- Pass data and callbacks to presentational components
- No complex business logic
- No direct UI rendering
- Simple data flow orchestration

**Example**:
```tsx
// containers/CartContainer.tsx
export default function CartContainer() {
  const { cart, loading, error, onQuantityChange, onRemoveItem } = useCartLogic();

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
**Purpose**: Next.js pages that should be minimal and import containers for complex logic or views directly for simple pages.

**Complex Pages (with business logic)**:
```tsx
// app/cart/page.tsx
import CartContainer from '../components/cart/containers/CartContainer';

export default function CartPage() {
  return <CartContainer />;
}
```

**Simple Pages (static content)**:
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
- **Business logic should be in hooks, not containers**

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

## Migration Guidelines

When refactoring existing components:

1. **Identify the component type** (container or presentational)
2. **Extract business logic** into containers
3. **Create presentational components** for UI
4. **Update imports** and file structure
5. **Update tests** to match new structure
6. **Verify functionality** remains the same

## Example Migration

### Before (Mixed Logic)
```tsx
// CartPage.tsx
export default function CartPage() {
  const { cart, loading, error } = useCart();
  const { updateQuantity } = useCartActions();

  const handleQuantityChange = async (lineId: string, quantity: number) => {
    // Business logic here
  };

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {/* UI rendering here */}
    </div>
  );
}
```

### After (Separated)
```tsx
// containers/CartContainer.tsx
export default function CartContainer() {
  const { cart, loading, error } = useCart();
  const { updateQuantity } = useCartActions();

  const handleQuantityChange = async (lineId: string, quantity: number) => {
    // Business logic here
  };

  return (
    <CartView
      cart={cart}
      loading={loading}
      error={error}
      onQuantityChange={handleQuantityChange}
    />
  );
}

// views/CartView.tsx
export default function CartView({ cart, loading, error, onQuantityChange }: CartViewProps) {
  if (loading) return <CartLoading />;
  
  return (
    <div>
      {/* UI rendering here */}
    </div>
  );
}

// page.tsx
export default function CartPage() {
  return <CartContainer />;
}
```

## Conclusion

Following these architectural guidelines ensures:
- **Clean code** that's easy to understand and maintain
- **Testable components** that can be verified independently
- **Scalable architecture** that grows with the project
- **Team collaboration** with consistent patterns
- **Future-proof code** that's easy to modify and extend

Always prioritize these principles when creating new features or refactoring existing code. 