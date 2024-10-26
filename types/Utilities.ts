export type SearchParams = Promise<{
  [key: string]: string | string[] | undefined
}>

export type Params = Promise<{ slug: string }>

export type BasicPageProps = { params: Params; searchParams: SearchParams }
