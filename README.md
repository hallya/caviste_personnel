# 🍷 Edouard - Personal Wine Merchant

> **One wine, one face. One bottle, one story.**  
> A modern e-commerce platform showcasing thoughtful development practices and user-centered design.

![Edouard Caviste](./public/edouard.png)

## 🎯 Project Context

**This project demonstrates practical approaches to building e-commerce solutions** by solving real-world challenges for an online wine merchant. Each feature is developed with attention to code quality, user experience, and maintainable architecture.

### 💼 What This Shows for Recruiters

This is an **actively developed project** that demonstrates:
- **Modern React patterns**: Container/Presentational architecture, custom hooks, TypeScript discipline
- **UX innovation**: iOS-inspired notification system with 3D animations and smart grouping
- **Real API integration**: Shopify GraphQL with proper error handling and type safety
- **Testing approach**: Focus on critical user paths with Jest and React Testing Library
- **Performance awareness**: Measured results with Lighthouse integration

## 🚀 Current Implementation Status

### ✅ **Completed Features**

#### **iOS-Style Notification System**
```typescript
// Smart grouping prevents notification spam
const getStackedStyle = (index: number) => ({
  transform: `translateZ(${-2 * index}px) translateY(${4 * index}px)`,
  opacity: Math.max(0.2, 1 - index * 0.25),
  zIndex: 10 - index,
});
```
- **Progressive stacking**: Similar notifications group with 3D depth effects
- **Smooth animations**: Hardware-accelerated CSS transforms
- **Loading states**: Progressive feedback with spinner-to-success transitions
- **Mobile responsive**: Adaptive width and touch-friendly interactions

#### **Shopify E-commerce Integration**
- **Product catalog**: Collections and individual product fetching
- **Shopping cart**: Add, update, remove operations with persistence
- **Error handling**: Graceful degradation and user feedback
- **Type safety**: Comprehensive TypeScript interfaces for all Shopify data

#### **Video Carousel System**
- **Touch navigation**: Swipe gestures and keyboard controls
- **Device detection**: Optimized experience for mobile vs desktop
- **Video management**: Safari/iOS compatibility with playback controls
- **3D perspective**: Depth effects and smooth transitions

### 🧪 **Quality Metrics**

#### **Test Coverage: 56.73%**
- **Strong coverage**: Cart functionality (92%), Design system (88%), Core hooks (100%)
- **50+ test files**: Jest + React Testing Library with user-centric testing
- **Focus areas**: Critical user paths, business logic validation, error scenarios

#### **Performance (Lighthouse Audit)**
- ✅ **Performance**: **98/100**
- ✅ **Accessibility**: **99/100**  
- ✅ **Best Practices**: **96/100**
- ✅ **SEO**: **100/100**

#### **Core Web Vitals**
- ✅ **First Contentful Paint**: **0.9s**
- ✅ **Largest Contentful Paint**: **2.3s**
- ✅ **Total Blocking Time**: **10ms**
- ✅ **Cumulative Layout Shift**: **0** (perfect score)
- ✅ **Speed Index**: **0.9s**

### 🔧 **Technical Architecture**

#### **Code Organization**
- **Container/Presentational pattern**: Consistent separation of concerns
- **Custom hooks**: Reusable business logic (`useCart`, `useNotificationGroup`, `useCarouselNav`)
- **TypeScript strict mode**: Zero `any` types in core application logic
- **Design system**: Centralized icon components and utility functions

#### **Performance Optimizations**
- **Dynamic imports**: Code splitting for notifications and complex components
- **Vercel Speed Insights**: Integrated performance monitoring
- **Image optimization**: Next.js Image component with proper sizing
- **CSS transforms**: Hardware acceleration for smooth animations

## 🛠️ Technology Stack

### **Core Technologies**
- **Next.js 15**: Latest App Router features with React 19
- **TypeScript**: Strict mode for comprehensive type safety
- **Tailwind CSS 4**: Utility-first styling with custom design tokens
- **Shopify Storefront API**: GraphQL integration for e-commerce backend

### **Quality Tools**
- **Jest + React Testing Library**: Component and hook testing
- **Lighthouse CLI**: Automated performance auditing
- **ESLint**: Code quality enforcement
- **Husky + lint-staged**: Pre-commit and pre-push quality checks

## 📊 **Quality Metrics**

### **Test Coverage**
- **418 test cases** across 38 test suites
- **83.7% statement coverage** with focus on critical business logic
- **67.7% branch coverage** ensuring edge case handling
- **80.1% function coverage** with comprehensive API testing

### **Test Strategy**
- **API Integration**: Complete Shopify GraphQL endpoint testing
- **Component Testing**: React Testing Library best practices
- **Hook Testing**: Custom hook behavior and edge cases
- **Page Testing**: Full user journey validation

### **Performance Standards**
- **TypeScript**: 0 compilation errors with strict configuration
- **ESLint**: Clean codebase with enforced quality standards
- **Lighthouse**: Automated performance monitoring
- **CI/CD**: Pre-commit and pre-push hooks ensuring code quality

## 💡 **Problem-Solving Examples**

### **Challenge: Notification UX Chaos**
**Problem**: Multiple cart additions creating overwhelming notification spam  
**Solution**: iOS-inspired grouping with progressive stacking and smart replacement
```typescript
// Grouping logic prevents notification overload
const groupedNotifications = useMemo(() => {
  const groups: Record<string, NotificationGroup> = {};
  notifications.forEach(notification => {
    if (notification.groupId) {
      // Smart grouping and replacement logic
    }
  });
  return groups;
}, [notifications]);
```

### **Challenge: Mobile Video Performance**
**Problem**: Video carousel causing performance issues on mobile devices  
**Solution**: Device detection with optimized rendering and Safari-specific handling
```typescript
// Adaptive performance based on device capabilities
const style = useMemo(() => {
  const z = isMobile ? -(abs * abs) * 400 : -(abs * abs) * 220;
  const scale = isMobile ? 1 - abs * 0.15 : 1 - abs * 0.05;
  return { transform: `translate3d(${x}px,0,0) translateZ(${z}px) scale(${scale})` };
}, [index, current, isMobile]);
```

## 🛠️ **Development Setup**

```bash
# Clone and setup
git clone https://github.com/hallya/caviste_personnel.git
cd caviste-personnel
npm install

# Environment configuration
cp .env.example .env.local
# Add your Shopify store credentials

# Development commands
npm run dev          # Start development server
npm run test         # Run test suite
npm run test:coverage # Test coverage report
npm run build        # Production build
npm run audit        # Lighthouse performance audit
npm run perf         # Full build + audit + report
```

### **Project Structure**
```
app/
├── api/                     # Shopify GraphQL integration
├── components/
│   ├── notification/        # iOS-style grouped notifications
│   ├── cart/               # Shopping cart functionality  
│   ├── carousel/           # Video carousel with touch controls
│   └── design-system/      # Reusable UI components and icons
├── contexts/               # React Context providers
└── types/                  # TypeScript definitions
```

## 🎯 **What This Demonstrates**

### **For Frontend Roles**
- Modern React patterns with performance optimization
- Complex CSS animations and 3D transforms
- TypeScript expertise with strict configuration
- User experience innovation and responsive design

### **For Full-Stack Roles**  
- GraphQL API integration with comprehensive error handling
- Real-time state management across components
- Testing strategy balancing coverage with meaningful assertions
- Performance monitoring and optimization techniques

### **For Technical Leadership**
- Architecture decisions with clear reasoning and documentation
- Code organization for team scalability and maintainability
- Pragmatic approach to testing (quality over quantity)
- Business-technical requirement translation in e-commerce context

## 🚀 **Current Development Focus**

### **Active Improvements**
- Enhanced search and filtering capabilities
- Extended test coverage for API integration layers
- Performance optimization for mobile video playback
- User authentication and account management system

### **Architecture Evolution**
- Exploring micro-frontend patterns for feature scalability
- Implementing comprehensive logging and error tracking
- Evaluating headless CMS integration for content management
- Planning GraphQL schema evolution strategies

## 📞 **Let's Connect**

**Interested in discussing development approaches or exploring opportunities?**

- 💼 **LinkedIn**: [🚴🏼‍♂️ Lucien Dulac](https://www.linkedin.com/in/%F0%9F%9A%B4%F0%9F%8F%BC%E2%80%8D%E2%99%82%EF%B8%8F-lucien-dulac-7197b6ab/)
- 🌐 **Live Demo**: [Edouard - Caviste Personnel](https://caviste-personnel.vercel.app)

---

<p align="center">
  <strong>Built with attention to real-world problem solving and code craftsmanship</strong><br>
  <em>Demonstrating practical development skills through a meaningful business context</em>
</p>