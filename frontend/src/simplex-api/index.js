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
let getStatus = (userId) => {
  return axios.get(`${host.url}/status/${userId}`)
}
let exchangeRates = (userId) => {
  return axios.get(`${host.url}/exchange-rates/`)
}
export {
  getQuote,
  getOrder,
  getStatus,
  exchangeRates
}
