import { describe, expect, it } from 'vitest'
import { defineEndpoint, reqvue, setApiConfig } from '../reqvue'
import { spinUpTestServer } from './server'

spinUpTestServer()

describe('reqvue integration tests', () => {
  setApiConfig({
    base_url: 'http://localhost:3000',
    timeout: 10000,
  })

  // Add integration tests here to test reqvue with the test server
  it('should perform basic get with no params', async () => {
    const _endpointShape = defineEndpoint<undefined, undefined, undefined>()
    const request = reqvue<typeof _endpointShape>({
      path: '/test',
    })

    const { data } = await request.get().json()
    expect(data.value).toEqual({ message: 'GET request successful' })
  })

  it('should perform get with path params', async () => {
    const _endpointShape = defineEndpoint<undefined, { id: string }, undefined>()
    const request = reqvue<typeof _endpointShape>({
      path: {
        url: '/test/{id}',
        path_params: { id: '123' },
      },
    })

    const { data } = await request.get().json()
    expect(data.value).toEqual({ message: 'GET request successful for ID: 123' })
  })

  it('should perform get with query params', async () => {
    const _endpointShape = defineEndpoint<undefined, undefined, { search: string }>()
    const request = reqvue<typeof _endpointShape>({
      path: {
        url: '/test',
        query_params: { search: 'example' },
      },
    })

    const { data } = await request.get().json()
    expect(data.value).toEqual({ message: 'GET request successful with search: example' })
  })

  it('should perform post with body', async () => {
    const _endpointShape = defineEndpoint<{ user: string, pass: string }, undefined, undefined>()
    const request = reqvue<typeof _endpointShape>({
      path: {
        url: '/test',
        body: {
          user: 'alice',
          pass: 'secret',
        },
      },
    })

    const { data } = await request.post().json()
    expect(data.value).toEqual({ message: 'POST request successful for user: alice with pass: secret' })
  })

  it('should handle fetch errors', async () => {
    const _endpointShape = defineEndpoint<undefined, undefined, undefined>()
    const request = reqvue<typeof _endpointShape>({
      path: '/error',
    })

    const { error, statusCode } = await request.get().json()
    expect(statusCode.value).toBe(500)
    expect(error.value).toBeInstanceOf(Error)
    expect(error.value.message).toBe('Internal Server Error')
  })
})
