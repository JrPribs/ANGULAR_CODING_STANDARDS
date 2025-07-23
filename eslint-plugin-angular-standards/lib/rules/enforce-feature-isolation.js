/**
 * @fileoverview Enforce feature isolation - features should not import from other features (CS-F01/F02)
 */
'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce feature isolation - features should not import from other features (CS-F01/F02)',
      category: 'Best Practices',
      recommended: true,
      url: 'https://github.com/your-org/angular-standards/blob/main/docs/CS-F01-F02.md'
    },
    fixable: null, // Requires architectural changes
    schema: [
      {
        type: 'object',
        properties: {
          featureRoot: {
            type: 'string',
            description: 'Root path for features (default: src/app)'
          },
          sharedPaths: {
            type: 'array',
            items: { type: 'string' },
            description: 'Allowed shared paths'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      crossFeatureImport: 'Feature "{{ currentFeature }}" should not import from feature "{{ importedFeature }}". Features must be isolated (CS-F01)',
      importFromShared: 'Feature "{{ feature }}" is importing "{{ service }}" which should be in the feature folder, not in shared (CS-F02)',
      sharedOveruse: 'Consider moving "{{ module }}" to a specific feature if it\'s not used by 3+ features (CS-F03)'
    }
  },

  create(context) {
    const options = context.options[0] || {};
    const featureRoot = options.featureRoot || 'src/app';
    const sharedPaths = options.sharedPaths || ['shared', 'core'];
    
    // Helper to extract feature name from file path
    function getFeatureName(filePath) {
      // Normalize the path
      const normalizedPath = filePath.replace(/\\/g, '/');
      
      // Check if it's in a feature folder
      const featureMatch = normalizedPath.match(new RegExp(`${featureRoot}/([^/]+)/`));
      if (featureMatch) {
        const folder = featureMatch[1];
        // Exclude shared/core folders
        if (!sharedPaths.includes(folder)) {
          return folder;
        }
      }
      return null;
    }

    // Helper to check if import is from shared
    function isSharedImport(importPath) {
      return sharedPaths.some(shared => 
        importPath.includes(`/${shared}/`) || importPath.startsWith(`${shared}/`)
      );
    }

    // Helper to detect service/model/guard/store imports
    function isArchitecturalImport(importPath) {
      const patterns = [
        /\/services?\//,
        /\/models?\//,
        /\/guards?\//,
        /\/stores?\//,
        /\.service$/,
        /\.model$/,
        /\.guard$/,
        /\.store$/
      ];
      
      return patterns.some(pattern => pattern.test(importPath));
    }

    return {
      ImportDeclaration(node) {
        const currentFile = context.getFilename();
        const importPath = node.source.value;
        
        // Skip external modules
        if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
          return;
        }

        const currentFeature = getFeatureName(currentFile);
        
        // Only check files within features
        if (!currentFeature) {
          return;
        }

        // Resolve relative imports to absolute paths
        let absoluteImportPath = importPath;
        if (importPath.startsWith('.')) {
          const path = require('path');
          const currentDir = path.dirname(currentFile);
          absoluteImportPath = path.resolve(currentDir, importPath);
          absoluteImportPath = absoluteImportPath.replace(/\\/g, '/');
        }

        const importedFeature = getFeatureName(absoluteImportPath);

        // Check for cross-feature imports
        if (importedFeature && importedFeature !== currentFeature) {
          context.report({
            node,
            messageId: 'crossFeatureImport',
            data: {
              currentFeature,
              importedFeature
            }
          });
        }

        // Check for architectural imports from shared
        if (isSharedImport(importPath) && isArchitecturalImport(importPath)) {
          // Extract the service/model name
          const matches = importPath.match(/\/([^/]+)\.(service|model|guard|store)/);
          const serviceName = matches ? matches[1] : 'module';
          
          context.report({
            node,
            messageId: 'importFromShared',
            data: {
              feature: currentFeature,
              service: serviceName
            }
          });
        }
      },

      // Additional check for shared modules that might be overused
      'ImportDeclaration[source.value=/shared/]'(node) {
        const importPath = node.source.value;
        
        // Extract what's being imported from shared
        const sharedModuleMatch = importPath.match(/shared\/([^/]+)/);
        if (sharedModuleMatch) {
          const moduleName = sharedModuleMatch[1];
          
          // This is more of a warning - can't determine actual usage count statically
          if (isArchitecturalImport(importPath)) {
            context.report({
              node,
              messageId: 'sharedOveruse',
              data: { module: moduleName }
            });
          }
        }
      }
    };
  }
};