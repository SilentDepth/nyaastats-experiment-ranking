export default function useAdvices () {
  const config = useRuntimeConfig()

  const { data, pending } = useLazyFetch<Advice[]>(
    `${config.app.baseURL}/advices.json`.replaceAll('//', '/'),
    { default: () => [] },
  )

  return {
    data,
    pending,
  }
}
