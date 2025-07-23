/**
 * @fileoverview Enforce that all components are standalone (CS-C01)
 */
'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce that all components are standalone (CS-C01)',
      category: 'Best Practices',
      recommended: true,
      url: 'https://github.com/your-org/angular-standards/blob/main/docs/CS-C01.md'
    },
    fixable: 'code',
    schema: [],
    messages: {
      notStandalone: 'Components must be standalone. Add "standalone: true" to the component decorator (CS-C01)',
      standaloneNotTrue: 'Components must have standalone: true, not {{ value }} (CS-C01)',
      noNgModule: 'Do not import NgModules. Components should be standalone (CS-C01)'
    }
  },

  create(context) {
    return {
      // Check @Component decorators
      'Decorator[expression.callee.name="Component"]'(node) {
        const args = node.expression.arguments;
        
        if (args.length === 0 || args[0].type !== 'ObjectExpression') {
          return;
        }

        const metadata = args[0];
        const standaloneProp = metadata.properties.find(
          prop => prop.key && prop.key.name === 'standalone'
        );

        // Check if standalone property is missing
        if (!standaloneProp) {
          context.report({
            node: metadata,
            messageId: 'notStandalone',
            fix(fixer) {
              // Find a good place to insert the property
              if (metadata.properties.length === 0) {
                return fixer.replaceText(metadata, '{ standalone: true }');
              } else {
                // Insert after selector if it exists, otherwise as first property
                const selectorProp = metadata.properties.find(
                  p => p.key && p.key.name === 'selector'
                );
                
                if (selectorProp) {
                  const comma = context.getSourceCode().getTokenAfter(selectorProp);
                  if (comma && comma.value === ',') {
                    return fixer.insertTextAfter(comma, '\n  standalone: true,');
                  } else {
                    return fixer.insertTextAfter(selectorProp, ',\n  standalone: true');
                  }
                } else {
                  const firstProp = metadata.properties[0];
                  return fixer.insertTextBefore(firstProp, 'standalone: true,\n  ');
                }
              }
            }
          });
        } 
        // Check if standalone is not true
        else if (
          standaloneProp.value.type === 'Literal' &&
          standaloneProp.value.value !== true
        ) {
          context.report({
            node: standaloneProp.value,
            messageId: 'standaloneNotTrue',
            data: { value: standaloneProp.value.value },
            fix(fixer) {
              return fixer.replaceText(standaloneProp.value, 'true');
            }
          });
        }
      },

      // Check for NgModule imports
      ImportDeclaration(node) {
        const importPath = node.source.value;
        
        // Check for common NgModule imports
        const ngModulePatterns = [
          'CommonModule',
          'BrowserModule',
          'FormsModule',
          'ReactiveFormsModule',
          'HttpClientModule',
          'RouterModule'
        ];

        // Check if importing from @angular packages
        if (importPath.startsWith('@angular/')) {
          node.specifiers.forEach(specifier => {
            if (specifier.type === 'ImportSpecifier') {
              const importedName = specifier.imported.name;
              
              if (ngModulePatterns.includes(importedName)) {
                context.report({
                  node: specifier,
                  messageId: 'noNgModule'
                });
              }
            }
          });
        }
      }
    };
  }
};