import {
  host
} from '@/config'
import axios from 'axios'

let getQuote = (reqObj) => {
  return axios.post(`${host.url}/quote`, reqObj)
}

export {
  getQuote
}
