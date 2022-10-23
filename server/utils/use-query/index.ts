import Parser from './parser'

export default function useQuery (query: string) {
  const parser = new Parser(query)
  return (context: any) => parser.evaluate(context)
}
