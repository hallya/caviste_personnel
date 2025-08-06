module.exports = {
  '**/*.{ts,tsx}': (filenames) => {
    // Run tests related to modified files
    return `jest --bail --findRelatedTests ${filenames.join(' ')}`;
  },
  
  // Run linting
  '**/*.{ts,tsx}': 'npx eslint --fix',
}; 