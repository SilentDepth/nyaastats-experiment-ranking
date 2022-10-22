interface Advice {
  title: string
  query: string
  contributor?: string
}

declare module '~/assets/data/advices.json' {
  const advices: Advice[]
  export default advices
}
