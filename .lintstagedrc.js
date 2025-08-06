module.exports = {
  '**/*.{ts,tsx}': (filenames) => {
    // Run tests related to modified files
    return `jest --bail --findRelatedTests ${filenames.join(' ')}`;
  },
  
  // Run linting
  '**/*.{ts,tsx}': 'eslint --fix',
  
  // Run type checking
  '**/*.{ts,tsx}': 'tsc --noEmit',
}; 