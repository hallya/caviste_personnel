# Known Issues & Technical Debt

This document tracks known issues, technical debt, and areas for improvement in the project.

## Test Issues

### VideoBackground.test.tsx
- **Status**: Failing
- **Issue**: Component not found or import issues
- **Impact**: Low - component may not be used in production
- **Priority**: Low
- **Solution**: Investigate if component is actually used, remove test if not needed

### layout.test.tsx  
- **Status**: Failing
- **Issue**: Layout component test failures
- **Impact**: Medium - layout is critical component
- **Priority**: Medium
- **Solution**: Review layout component structure and update tests accordingly

### API Cart Route Tests
- **Status**: Failing
- **Issue**: Cart API route test failures
- **Impact**: High - cart functionality is critical
- **Priority**: High
- **Solution**: Review cart API implementation and fix test expectations

## Performance Considerations

### Web Vitals Tracking
- **Status**: Implemented with lazy loading
- **Issue**: Potential performance impact on low-end devices
- **Impact**: Low - mitigated by lazy loading
- **Priority**: Low
- **Solution**: Monitor performance in production, consider Web Workers if needed

### Bundle Size
- **Status**: Acceptable
- **Issue**: web-vitals library adds to bundle size
- **Impact**: Low - lazy loaded
- **Priority**: Low
- **Solution**: Monitor bundle size, consider code splitting if needed

## Accessibility

### Color Contrast
- **Status**: Warning in Lighthouse
- **Issue**: Some elements may not meet contrast requirements
- **Impact**: Medium - affects accessibility compliance
- **Priority**: Medium
- **Solution**: Audit all text elements, update colors as needed

## Future Improvements

### Consent Management
- **Status**: Basic implementation
- **Issue**: Limited granularity (all-or-nothing)
- **Impact**: Low - meets current requirements
- **Priority**: Low
- **Solution**: Implement granular consent categories if needed

### Analytics Integration
- **Status**: Internal endpoint only
- **Issue**: No integration with external analytics services
- **Impact**: Low - can be added later
- **Priority**: Low
- **Solution**: Add integration points for Google Analytics, etc.

## Maintenance Notes

- **Last Updated**: 2024-08-11
- **Next Review**: 2024-09-11
- **Owner**: Development Team

## Resolution Guidelines

1. **High Priority**: Fix immediately or create blocking ticket
2. **Medium Priority**: Plan for next sprint
3. **Low Priority**: Add to backlog for future consideration

## Adding New Issues

When adding new issues:
1. Use the template above
2. Include impact assessment
3. Suggest potential solutions
4. Update the "Last Updated" date
