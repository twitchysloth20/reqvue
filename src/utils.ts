import type { IReqVueEndpointShape, IReqVuePathObject } from './types'

export function replaceEndpointPlaceholders<E extends IReqVueEndpointShape>(
  { url, path_params }: IReqVuePathObject<E>,
): string {
  if (!path_params)
    return url

  if (Object.keys(path_params).length < 1)
    throw new Error('Path parameters object is empty at replaceEndpointPlaceholders.')

  for (const key in path_params) {
    const placeholder = `{${key}}`

    if (url.includes(placeholder))
      url = url.replace(placeholder, encodeURIComponent(String(path_params[key])))
    else throw new Error(`Placeholder ${placeholder} not found in URL at replaceEndpointPlaceholders.`)
  }

  return url.replace(/\{(.*?)\}/g, '').replace('//', '/')
}

export function addQueryParams<E extends IReqVueEndpointShape>(
  { url, query_params }: IReqVuePathObject<E>,
): string {
  if (!query_params)
    return url

  if (Object.keys(query_params).length < 1)
    throw new Error('Query parameters object is empty at addQueryParams.')

  let query_string = '?'
  for (const key in query_params) {
    if (query_string !== '?')
      query_string += '&'
    query_string += `${encodeURIComponent(key)}=${encodeURIComponent(String(query_params[key]))}`
  }

  return (url + query_string).replace(/\{(.*?)\}/g, '').replace('//', '/')
}
