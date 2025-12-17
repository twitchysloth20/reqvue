import type { AfterFetchContext, BeforeFetchContext, OnFetchErrorContext, useFetch, UseFetchOptions } from '@vueuse/core'
import type { IReqVueEndpointShape, IReqVueGlobalConfig, IReqVueRequestConfig } from './types'
import { createFetch } from '@vueuse/core'
import { addQueryParams, replaceEndpointPlaceholders } from './utils'

let reqvue_config: IReqVueGlobalConfig = {} as IReqVueGlobalConfig

/**
 * Set the global API configuration.
 *
 * @param { IReqVueGlobalConfig } config Config object that will affect all future requests
 */
export function setApiConfig(config: IReqVueGlobalConfig) {
  reqvue_config = config
}

/**
 * Define the shape of an API endpoint.
 */
export function defineEndpoint<
  TBody = undefined,
  TPathParams = undefined,
  TQueryParams = undefined,
>() {
  return {} as {
    body: TBody
    path_params: TPathParams
    query_params: TQueryParams
  }
}

/**
 * Make an API request using the reqvue wrapper.
 *
 * @param { IReqVueRequestConfig } config Config object for this specific request
 */
export function reqvue<E extends IReqVueEndpointShape>(
  config: IReqVueRequestConfig<E>,
  options: UseFetchOptions = {},
): ReturnType<typeof useFetch> {
  const base_url = config.base_url || reqvue_config.base_url

  if (!base_url)
    throw new Error('Base URL is not defined. Please set it in the global config or request config.')

  const endpoint = typeof config.path === 'string'
    ? config.path
    : addQueryParams<E>({
        url: replaceEndpointPlaceholders<E>(config.path),
        query_params: config.path.query_params,
      })

  const body = typeof config.path !== 'string' ? config.path.body : undefined
  options = {
    ...options,
    ...{ body: body ? JSON.stringify(body) : undefined },
  }

  const customBeforeFetch = config.beforeFetch
  const customAfterFetch = config.afterFetch
  const customOnFetchError = config.onFetchError
  const timeout = config.timeout || reqvue_config.timeout || 30_000

  const apiCall = createFetch({
    baseUrl: base_url,
    options: {
      async beforeFetch(ctx: BeforeFetchContext) {
        const { options } = ctx
        const token = config.auth_token || reqvue_config.auth_token

        if (token) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          }
        }

        if (customBeforeFetch) {
          const modified = await customBeforeFetch(ctx)
          return { options: { ...options, ...modified } }
        }

        return { options }
      },

      async afterFetch(ctx: AfterFetchContext) {
        if (customAfterFetch) {
          return await customAfterFetch(ctx)
        }

        return ctx
      },

      async onFetchError(ctx: OnFetchErrorContext) {
        if (customOnFetchError) {
          return await customOnFetchError(ctx)
        }

        return ctx
      },
      timeout,
    },
    fetchOptions: {
      headers: (() => {
        const headers = { ...config.headers || reqvue_config.headers || {} }
        const hasContentType = Object.keys(headers).some(key => key.toLowerCase() === 'content-type')

        if (!hasContentType && body) {
          headers['Content-Type'] = 'application/json'
        }

        return headers
      })(),
    },
  })

  return apiCall(endpoint, options)
}
