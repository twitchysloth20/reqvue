# reqvue

Small TypeScript helper around createFetch (@vueuse/core) to define typed endpoints and call HTTP APIs easily in tests and apps.

## Features
- Typed endpoint shapes with `defineEndpoint`
- Global config via `setApiConfig`
- Sends request body defined on the endpoint shape
- Forwards auth header, custom hooks (beforeFetch/afterFetch/onFetchError) and timeout to underlying fetch
- Returns the same shape as `useFetch` (you can call `.get()`, `.post()`, then `.json()` / `.text()` etc.)

## Quick start

```ts
import { defineEndpoint, reqvue, setApiConfig } from './src/reqvue'

// set global API config
setApiConfig({ base_url: 'http://localhost:3000', timeout: 10000 })

// define endpoints (generics are optional)
const _endpoint = defineEndpoint<{ user: string, pass: string }, undefined, undefined>()

// create a request
const request = reqvue<typeof _endpoint>({
  path: {
    url: '/test',
    body: { user: 'alice', pass: 'secret' },
  },
})

// call it
const { data } = await request.post().json()
```

## API

- setApiConfig(config: IReqVueGlobalConfig)
  - base_url, timeout, auth_token, headers
- defineEndpoint<TBody, TPathParams, TQueryParams>()
  - returns a typed endpoint shape for `reqvue` generics
- reqvue(config: IReqVueRequestConfig, options?: UseFetchOptions)
  - config.path can be:
    - string: `'/path'`
    - object: `{ url: '/path/{id}', path_params: { id: '1' }, query_params: { q: 'x' }, body: {...} }`
  - If `path.body` exists it's forwarded as the request body. Non-string bodies are JSON.stringified and Content-Type header is set to `application/json` when missing.
  - Returns the same value as `useFetch` (call `.get()`, `.post()`, `.json()` etc).

## Error handling
`reqvue` surfaces fetch errors as Error objects. Inspect message with:

```ts
const { error, statusCode } = await request.get().json()
if (error.value) {
  // error.value is an Error
  console.error((error.value as Error).message)
  console.error((error.value as Error).stack)
}
```
