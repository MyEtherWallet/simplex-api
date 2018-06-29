import {
  host
} from '@/config'
import axios from 'axios'

let getQuote = (reqObj) => {
  return axios.post(`${host.url}/quote`, reqObj)
}
let getOrder = (reqObj) => {
  return axios.post(`${host.url}/order`, reqObj)
}
export {
  getQuote,
  getOrder
}
