import type { AfterFetchContext, BeforeFetchContext, OnFetchErrorContext } from '@vueuse/core'

export interface IReqVueGlobalConfig {
  auth_token?: string
  base_url: string
  headers?: Record<string, any>
  timeout?: number
}

export interface IReqVueEndpointShape {
  body?: any
  path_params?: any
  query_params?: any
}

export interface IReqVuePathObject<E extends IReqVueEndpointShape> {
  url: string
  body?: E['body']
  path_params?: E['path_params']
  query_params?: E['query_params']
}

export interface IReqVueRequestConfig<E extends IReqVueEndpointShape> {
  auth_token?: string
  base_url?: string
  headers?: Record<string, any>
  path: string | IReqVuePathObject<E>
  timeout?: number

  beforeFetch?: (ctx: BeforeFetchContext) =>
    Promise<Partial<BeforeFetchContext> | void> | Partial<BeforeFetchContext> | void
  afterFetch?: (ctx: AfterFetchContext) => Promise<Partial<AfterFetchContext>> | Partial<AfterFetchContext>
  onFetchError?: (ctx: OnFetchErrorContext) => Promise<Partial<OnFetchErrorContext>> | Partial<OnFetchErrorContext>
}
