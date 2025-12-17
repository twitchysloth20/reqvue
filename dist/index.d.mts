import { BeforeFetchContext, AfterFetchContext, OnFetchErrorContext, UseFetchOptions, useFetch } from '@vueuse/core';

interface IReqVueGlobalConfig {
    auth_token?: string;
    base_url: string;
    headers?: Record<string, any>;
    timeout?: number;
}
interface IReqVueEndpointShape {
    body?: any;
    path_params?: any;
    query_params?: any;
}
interface IReqVuePathObject<E extends IReqVueEndpointShape> {
    url: string;
    body?: E['body'];
    path_params?: E['path_params'];
    query_params?: E['query_params'];
}
interface IReqVueRequestConfig<E extends IReqVueEndpointShape> {
    auth_token?: string;
    base_url?: string;
    headers?: Record<string, any>;
    path: string | IReqVuePathObject<E>;
    timeout?: number;
    beforeFetch?: (ctx: BeforeFetchContext) => Promise<Partial<BeforeFetchContext> | void> | Partial<BeforeFetchContext> | void;
    afterFetch?: (ctx: AfterFetchContext) => Promise<Partial<AfterFetchContext>> | Partial<AfterFetchContext>;
    onFetchError?: (ctx: OnFetchErrorContext) => Promise<Partial<OnFetchErrorContext>> | Partial<OnFetchErrorContext>;
}

/**
 * Set the global API configuration.
 *
 * @param { IReqVueGlobalConfig } config Config object that will affect all future requests
 */
declare function setApiConfig(config: IReqVueGlobalConfig): void;
declare function defineEndpoint<TBody = undefined, TPathParams = undefined, TQueryParams = undefined>(): {
    body: TBody;
    pathParams: TPathParams;
    queryParams: TQueryParams;
};
/**
 *
 * @param { IReqVueRequestConfig } config Config object for this specific request
 */
declare function reqvue<E extends IReqVueEndpointShape>(config: IReqVueRequestConfig<E>, options?: UseFetchOptions): ReturnType<typeof useFetch>;

export { type IReqVueEndpointShape, type IReqVueGlobalConfig, type IReqVuePathObject, type IReqVueRequestConfig, defineEndpoint, reqvue, setApiConfig };
