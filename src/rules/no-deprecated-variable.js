module.exports = {
  meta: {
    docs: {
      description: 'Disallow usage of deprecated variable by suggesting the matching one',
      category: 'Variables',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          deprecate: {
            type: 'string',
          },
          matchingVariable: {
            type: 'string'
          },
          matchObject: {
            type: 'object',
          }
        },
      },
    ],
    messages: {
      shouldNotUseDeprecated: '{{ deprecatedVariable }} is deprecated, please do not use it',
      shouldNotUseDeprecatedWithMatching: '{{ deprecatedVariable }} is deprecated, please use {{ matchingVariable }}'
    }
  },
  create(context) {
    const options = context.options[0]
    if (!options || !options.properties || !Array.isArray(options.properties)) {
      return {}
    }
    return {
      Identifier(node) {
        const matchPropertyWithDeprecatedName = (property) => property.deprecate === node.name
        const isDeprecatedVariableUsed = options.properties.some(matchPropertyWithDeprecatedName)
				if (!isDeprecatedVariableUsed) {
					return
				}
        const propertyRule = options.properties.find(matchPropertyWithDeprecatedName)
        if (propertyRule.matchingVariable && !propertyRule.matchObject) {
          context.report({
            node,
            messageId: 'shouldNotUseDeprecatedWithMatching',
            data: {
              deprecatedVariable: `${node.name}`,
              matchingVariable: `${propertyRule.matchingVariable}`,
            },
            fix(fixer) {
              return fixer.replaceText(node, `${propertyRule.matchingVariable}`)
            },
          })
          return
        }

        if (!propertyRule || !node || !node.parent || !node.parent.property) {
          return
        }
        const usedVariable = node.parent.property.name
        if (!usedVariable) {
          return
        }
        if (usedVariable && (!propertyRule.matchObject || !propertyRule.matchingVariable || !propertyRule.matchObject[usedVariable])) {
          context.report({
            node,
            messageId: 'shouldNotUseDeprecated',
            data: {
              deprecatedVariable: `${node.name}.${usedVariable}`,
            },
          })
          return
        }
        const matchingVariables = propertyRule.matchObject[usedVariable]
        context.report({
          node,
          messageId: 'shouldNotUseDeprecatedWithMatching',
          data: {
            deprecatedVariable: `${node.name}.${usedVariable}`,
            matchingVariable: `${propertyRule.matchingVariable}.${matchingVariables}`,
          },
          fix(fixer) {
            return fixer.replaceText(node.parent, `${propertyRule.matchingVariable}.${matchingVariables}`)
          },
        })
      }
    }
  }
}
