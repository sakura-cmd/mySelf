import {
  get,
  post
} from './http'
// post
const abc = data => post('url', data)
// get
const efg = data => get('url', data)

export {
  abc,
  efg
}
