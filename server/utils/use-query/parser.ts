import * as acorn from 'acorn'

export function parse (input: string) {
  return acorn.parseExpressionAt(input, 0, { ecmaVersion: 3 })
}

export function evaluate (node: any, context: any): number {
  try {
    switch (node.type) {
      case 'Literal':
        if (typeof node.value === 'number') {
          return node.value
        } else {
          throw new SyntaxError(`Expected a number but got ${node.raw}`)
        }
      case 'Identifier':
        return context?.[node.name]
      case 'MemberExpression':
        if (node.computed) {
          throw new SyntaxError(`Computed property is not supported`)
        }
        return evaluate(node.property, evaluate(node.object, context))
      case 'BinaryExpression':
        switch (node.operator) {
          case '+':
            return evaluate(node.left, context) + evaluate(node.right, context)
          case '-':
            return evaluate(node.left, context) - evaluate(node.right, context)
          case '*':
            return evaluate(node.left, context) * evaluate(node.right, context)
          case '/':
            return evaluate(node.left, context) / evaluate(node.right, context)
          default:
            throw new SyntaxError(`Unexpected operator ${node.operator}`)
        }
      case 'UnaryExpression':
        switch (node.operator) {
          case '+':
            return evaluate(node.argument, context)
          case '-':
            return evaluate(node.argument, context) * -1
          default:
            throw new SyntaxError(`Unexpected operator ${node.operator}`)
        }
      default:
        throw new SyntaxError(`Unexpected token ${input.slice(node.start, node.end)}`)
    }
  } catch (e) {
    console.log(node)
    console.error(e)
  }
}
