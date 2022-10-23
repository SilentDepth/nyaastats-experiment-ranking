import * as acorn from 'acorn'

export default class Parser {
  ast: any

  constructor (public input: string) {
    this.parse()
  }

  parse () {
    this.ast = acorn.parseExpressionAt(this.input, 0, { ecmaVersion: 3 })
  }

  evaluate (context: any, node: any = this.ast) {
    try {
      switch (node.type) {
        case 'Literal':
          return node.value
        case 'Identifier':
          return context?.[node.name]
        case 'MemberExpression':
          if (node.computed) {
            throw new SyntaxError(`Computed property is not supported`)
          }
          return this.evaluate(this.evaluate(context, node.object), node.property)
        case 'CallExpression':
          return this.evaluate(context, node.callee)?.(...node.arguments.map(node => this.evaluate(context, node)))
        case 'BinaryExpression':
          switch (node.operator) {
            case '+':
              return this.evaluate(context, node.left) + this.evaluate(context, node.right)
            case '-':
              return this.evaluate(context, node.left) - this.evaluate(context, node.right)
            case '*':
              return this.evaluate(context, node.left) * this.evaluate(context, node.right)
            case '/':
              return this.evaluate(context, node.left) / this.evaluate(context, node.right)
            default:
              throw new SyntaxError(`Unexpected operator ${node.operator}`)
          }
        case 'UnaryExpression':
          switch (node.operator) {
            case '+':
              return this.evaluate(context, node.argument)
            case '-':
              return this.evaluate(context, node.argument) * -1
            default:
              throw new SyntaxError(`Unexpected operator ${node.operator}`)
          }
        default:
          throw new SyntaxError(`Unexpected token ${this.input.slice(node.start, node.end)}`)
      }
    } catch (e) {
      console.log(node)
      console.error(e)
    }
  }
}
