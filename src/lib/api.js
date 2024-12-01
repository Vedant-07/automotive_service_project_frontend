const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:9008'

async function request(path, options = {}){
  const res = await fetch(API_BASE + path, options)
  const text = await res.text()
  let json = null
  try{ json = text ? JSON.parse(text) : null }catch(e){ json = text }
  if(!res.ok) {
    const err = new Error(json?.message || res.statusText || 'Network error')
    err.status = res.status
    err.body = json
    throw err
  }
  return json
}

async function get(path){
  return request(path, { method: 'GET', headers: { 'Accept':'application/json' } })
}

async function post(path, body){
  return request(path, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(body) })
}

async function put(path, body){
  return request(path, { method: 'PUT', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(body) })
}

export default { get, post, put, API_BASE }
