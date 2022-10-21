import { parse, evaluate } from './parser'

export default function useQuery (query: string) {
  const ast = parse(query)
  return (context: any) => evaluate(ast, context)
}
