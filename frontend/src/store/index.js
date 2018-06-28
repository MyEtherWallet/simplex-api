import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import wav from 'wallet-address-validator'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    endpoint: 'https://apiccswap.myetherwallet.com',
    paymentPost: 'https://www.simplexcc.com/payments/new',
    canProceed: false,
    activateForm: false,
    invalidPrice: false,
    invalidAmount: false,
    invalidAddress: false,
    user_id: '',
    quote_id: '',
    payment_id: '',
    valid_until: '',
    price: 0,
    total_price: 0,
    fiatCurrency: 'USD',
    amount: 0,
    digitalCurrency: 'ETH',
    address: '',
    forPost: {}
  },
  actions: {
    updateAddress ({dispatch, commit, state}, address) {
      commit('addressChange', address)
      if (wav.validate(address, state.digitalCurrency)) {
        commit('addressInvalid', false)
        dispatch('updateFromResult', ['address'])
      } else {
        commit('addressInvalid', true)
        commit('activateForm', false)
      }
    },
    updatePrice ({dispatch, commit, state}, price) {
      // Change to use vee-validate
      console.log('price', price) // todo remove dev item
      commit('priceChange', price)
      if (price >= 50 && price <= 20000) {
        commit('priceInvalid', false)
        commit('amountInvalid', false)
        // endpoint is just merging in the body
        axios.post(`${state.endpoint}/quote`, {
          digital_currency: state.digitalCurrency,
          fiat_currency: state.fiatCurrency,
          requested_currency: state.fiatCurrency,
          requested_amount: price
        })
          .then(_result => {
            dispatch('updateFromResult', ['price', _result])
          })
          .catch(_error => {
            console.error(_error) // todo replace with proper error
          })
      } else {
        commit('priceInvalid', true)
        commit('activateForm', false)
      }
    },
    updateAmount ({dispatch, commit, state}, amount) {
      commit('amountChange', amount)
      if (amount > 0) {
        commit('amountInvalid', false)
        axios.post(`${state.endpoint}/quote`, {
          digital_currency: state.digitalCurrency,
          fiat_currency: state.fiatCurrency,
          requested_currency: state.digitalCurrency,
          requested_amount: amount
        })
          .then(_result => {
            dispatch('updateFromResult', ['amount', _result])
          })
          .catch(_error => {
            console.error(_error) // todo replace with proper error
          })
      } else {
        commit('priceChange', 0)
        commit('priceInvalid', true)
        commit('amountInvalid', true)
        commit('activateForm', false)
      }
    },
    updateFiat ({dispatch, commit, state}, fiat) {
      axios.post(`${state.endpoint}/quote`, {
        digital_currency: state.digitalCurrency,
        fiat_currency: fiat,
        requested_currency: fiat,
        requested_amount: state.price
      })
        .then(_result => {
          dispatch('updateFromResult', ['fiat', _result, fiat])
        })
        .catch(_error => {
          console.error(_error) // todo replace with proper error
        })
    },
    updateDigital ({dispatch, commit, state}, digital) {
      axios.post(`${state.endpoint}/quote`, {
        digital_currency: digital,
        fiat_currency: state.fiatCurrency,
        requested_currency: digital,
        requested_amount: state.amount
      })
        .then(_result => {
          dispatch('updateFromResult', ['digital', _result, digital])
        })
        .catch(_error => {
          console.error(_error) // todo replace with proper error
        })
    },
    updateFromResult ({dispatch, commit, state}, resArray) {
      let _result, stringValue, type
      type = resArray[0]
      if (resArray.length === 2) {
        _result = resArray[1]
        console.log(_result) // todo remove dev item
      } else if (resArray.length === 3) {
        _result = resArray[1]
        stringValue = resArray[2]
      }

      switch (type) {
        case 'amount':
          commit('priceChange', _result.data.result.fiat_money.base_amount)
          let newPrice = _result.data.result.fiat_money.total_amount
          if (newPrice >= 50 && newPrice <= 20000) {
            commit('priceInvalid', false)
          } else {
            commit('activateForm', false)
            commit('priceInvalid', true)
          }
          break
        case 'price':
          commit('amountChange', _result.data.result.digital_money.amount)
          break
        case 'fiat':
          commit('priceChange', _result.data.result.fiat_money.base_amount)
          commit('amountChange', _result.data.result.digital_money.amount)
          commit('fiatChange', stringValue)
          break
        case 'digital':
          commit('priceChange', _result.data.result.fiat_money.base_amount)
          commit('amountChange', _result.data.result.digital_money.amount)
          commit('digitalChange', stringValue)
          break
        default:
          // console.log('default switch') // todo remove dev item
          break
      }
      dispatch('updateInfo', _result)
    },
    updateInfo ({dispatch, commit, state}, _result) {
      // Update info fields
      if (_result) {
        commit('totalChange', _result.data.result.fiat_money.total_amount)
        commit('updateUserId', _result.data.result.user_id)
        console.log(_result.data.result.valid_until) // todo remove dev item
        commit('updateExpiry', _result.data.result.valid_until)
        commit('updateQuoteId', _result.data.result.quote_id)
      }

      let validAddress = wav.validate(state.address, state.digitalCurrency)
      let validMaxMin = (state.price >= 50 && state.price <= 20000)
      let canProceed = (validAddress && validMaxMin)
      commit('canProceed', canProceed)
      if (canProceed) {
        dispatch('buildOrderObject')
      } else {
        commit('activateForm', false)
      }
    },
    buildOrderObject ({dispatch, commit, state}) {
      if (state.canProceed) {
        console.log('buildOrderObject') // todo remove dev item

        let detailObject
        axios.post(`${state.endpoint}/quote`, {
          digital_currency: state.digitalCurrency,
          fiat_currency: state.fiatCurrency,
          requested_currency: state.digitalCurrency,
          requested_amount: state.amount
        })
          .then(_result => {
            console.log(_result) // todo remove dev item

            detailObject = {
              account_details: {
                app_end_user_id: _result.data.result.user_id
              },
              transaction_details: {
                payment_details: {
                  quote_id: _result.data.result.quote_id,
                  fiat_total_amount: {
                    currency: state.fiatCurrency,
                    amount: _result.data.result.fiat_money.total_amount
                  },
                  requested_digital_amount: {
                    currency: state.digitalCurrency,
                    amount: _result.data.result.digital_money.amount
                  },
                  destination_wallet: {
                    currency: state.digitalCurrency,
                    address: state.address
                  }
                }
              }
            }
            commit('amountChange', _result.data.result.digital_money.amount)
            commit('totalChange', _result.data.result.fiat_money.total_amount)
            commit('updateQuoteId', _result.data.result.quote_id)
            commit('updateUserId', _result.data.result.user_id)
            return axios.post(`${state.endpoint.toString()}/order`, detailObject)
          })
          .then(_result => {
            console.log(_result) // todo remove dev item
            commit('updatePaymentId', _result.data.result.payment_id)
            detailObject.transaction_details.payment_details.payment_id = _result.data.result.payment_id
            commit('updateFormData', detailObject)
            commit('activateForm', true)
          })
          .catch(_error => {
            console.error(_error) // todo replace with proper error
          })
      }
    }
  },
  mutations: {
    addressChange (state, newAddress) {
      state.address = newAddress
    },
    priceChange (state, newAmount) {
      state.price = newAmount
    },
    amountChange (state, newAmount) {
      state.amount = newAmount
    },
    fiatChange (state, newFiat) {
      state.fiatCurrency = newFiat
    },
    digitalChange (state, newDigital) {
      state.digitalCurrency = newDigital
    },
    totalChange (state, newTotal) {
      state.total_price = newTotal
    },
    updateUserId (state, newUserId) {
      state.user_id = newUserId
    },
    updatePaymentId (state, newPaymentId) {
      state.payment_id = newPaymentId
    },
    updateExpiry (state, newExpiry) {
      state.valid_until = newExpiry
    },
    updateQuoteId (state, newQuoteId) {
      state.quote_id = newQuoteId
    },
    updateFormData (state, formData) {
      state.forPost = {...formData}
    },
    activateForm (state, activate) {
      state.activateForm = activate
    },
    canProceed (state, newCanProceed) {
      state.canProceed = newCanProceed
    },
    priceInvalid (state, newValidity) {
      state.invalidPrice = newValidity
    },
    amountInvalid (state, newValidity) {
      state.invalidAmount = newValidity
    },
    addressInvalid (state, newValidity) {
      state.invalidAddress = newValidity
    }

  },
  getters: {}
})

export default store
