export type SearchParams = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

export type Params = { params: Promise<{ major: string }> }

export type BasicPageProps = SearchParams & Params
