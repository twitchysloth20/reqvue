import { describe, expect, it } from 'vitest'
import { addQueryParams, replaceEndpointPlaceholders } from '../utils'

describe('replaceEndpointPlaceholders', () => {
  it('should return the same URL if no path parameters are provided', () => {
    const result = replaceEndpointPlaceholders({
      url: '/users/list',
    })
    expect(result).toBe('/users/list')
  })

  it('should throw an error if path parameters object is empty', () => {
    expect(() => {
      replaceEndpointPlaceholders({
        url: '/users/{userId}',
        path_params: {},
      })
    }).toThrow('Path parameters object is empty at replaceEndpointPlaceholders.')
  })

  it('should throw an error if a placeholder is not found in the URL', () => {
    expect(() => {
      replaceEndpointPlaceholders({
        url: '/users/{userId}',
        path_params: { postId: 123 },
      })
    }).toThrow('Placeholder {postId} not found in URL at replaceEndpointPlaceholders.')
  })

  it('should replace placeholders with path parameters', () => {
    const result = replaceEndpointPlaceholders({
      url: '/users/{userId}/posts/{postId}',
      path_params: { userId: 123, postId: 456 },
    })
    expect(result).toBe('/users/123/posts/456')
  })
})

describe('addQueryParams', () => {
  it('should return the same URL if no query parameters are provided', () => {
    const result = addQueryParams({
      url: '/users/list',
    })
    expect(result).toBe('/users/list')
  })

  it('should throw an error if query parameters object is empty', () => {
    expect(() => {
      addQueryParams({
        url: '/users/list',
        query_params: {},
      })
    }).toThrow('Query parameters object is empty at addQueryParams.')
  })

  it('should append query parameters to the URL', () => {
    const result = addQueryParams({
      url: '/users/list',
      query_params: { page: 2, limit: 10 },
    })
    expect(result).toBe('/users/list?page=2&limit=10')
  })
})
