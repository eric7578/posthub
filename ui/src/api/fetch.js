import window from 'global/window'
import { parse, format } from 'url'

function normalizeParams (url, opt) {
  opt.method = (opt.method || 'get').toUpperCase()
  opt.headers = {
    ...opt.headers,
    credentials: 'same-origin'
  }

  const token = window.localStorage.getItem('token')
  if (token) {
    opt.headers['PJH-TOKEN'] = token
  }

  switch (opt.method) {
    case 'POST':
    case 'PUT':
      opt.headers['Content-Type'] = 'application/json'
      opt.body = typeof opt.body === 'object'
        ? JSON.stringify(opt.body)
        : opt.body.toString()
      break
    case 'GET':
    case 'DELETE':
      const urlObj = parse(url)
      urlObj.query = opt.query || urlObj.query
      url = format(url)
      delete opt.body
      break
    default:
      throw new Error(`Invalid HTTP method: ${opt.method}`)
  }

  return {
    url,
    opt
  }
}

async function runPromises (...funcs) {
  let res
  for (let func of funcs) {
    res = await func(res)
  }

  return res
}

function handleJSON () {
  return function (response) {
    if (response.ok) {
      return response.json()
    } else {
      return Promise.reject(response.json())
    }
  }
}

export function fetchJSON (url, option = {}) {
  const params = normalizeParams(url, option)

  return runPromises(
    window.fetch(params.url, params.opt),
    handleJSON(),

  )
}
