/**
 * @flow
 * @file Simple fetch wrapper
 */
import fetch from 'isomorphic-fetch'

// USAGE:
export const get = requestWrapper('GET')
// get('https://www.google.com', options)
export const post = requestWrapper('POST')
// post('https://www.google.com', data)

// Create request wrapper for certain method
function requestWrapper (method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH') {
	// Creates request to `url` with `data`
	return async (url: string, data: any = null) => {
		const body = data ? {body: JSON.stringify(data)} : {}

		const request = {
			method,
			headers: {},
			mode: process.env.NODE_ENV === 'development' ? 'cors' : 'same-origin',
			...body
		}

		return fetch(url, request)
			.then(checkStatus)
			.then(parseJSON)
			.catch((err: any) => err)
	}
}

async function parseJSON (res: Response): Object {
	let json: Object
	const {status} = res
	// status response field in return object
	try {
		json = await res.json()
	} catch (e) {
		if (res.status === 204) {
			return {ok: true, data: {}, status}
		}
		return {ok: false, status}
	}
	if (!res.ok) {
		return {data: json, ok: false, status}
	}
	return {data: json, ok: true, status}
}

function checkStatus (response: Response): Response {
	const {status} = response
	if (status >= 200 && status < 300) {
		// Everything is ok
	} else if (status >= 300 && status < 400) {
		// 300 - Multiple Choices
		// 301 - Moved Permanently,
		// 302 - Found, Moved Temporarily
		// 304 - not modified
		// 307 - Temporary Redirect
	} else if (status === 400) {
		// Probably is a validation error
	} else if (status === 403 || status === 401) {
		// 401 - Forbidden
		// 403 - Unauthorized
	} else if (status === 404) {
		// Not Found
	} else if (status >= 500) {
		// Server error
	}
	return response
}
