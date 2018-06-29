import wav from 'wallet-address-validator'
import {
  simplex
} from '@/config.js'
import {
  getQuote
} from '@/simplex-api'

var quoteChanges = Object.freeze({
  fiat_amount: 1,
  digital_amount: 2,
  fiat_currency: 3,
  digital_currency: 4
})
let canQuote = (state) => !state.status.invalidFiatAmount || !state.invalidDigitalAmount
let canOrder = (state) => !state.status.invalidFiatAmount && !state.invalidDigitalAmountcanQuote && !state.invalidAddress
let updateValues = (qChange, {
  state,
  dispatch,
  commit
}) => {
  let onSuccess = (result) => {
    console.log(result)
  }
  let onError = (err) => {
    console.log(err)
  }
  if (canQuote(state)) {
    switch (qChange) {
      case quoteChanges.fiat_amount:
      case quoteChanges.fiat_currency:
        getQuote({
          digital_currency: state.orderInfo.digitalCurrency,
          fiat_currency: state.orderInfo.fiatCurrency,
          requested_currency: state.orderInfo.fiatCurrency,
          requested_amount: state.orderInfo.fiatAmount
        }).then(onSuccess).catch(onError)
        break
      case quoteChanges.digital_amount:
      case quoteChanges.digital_currency:
        getQuote({
          digital_currency: state.orderInfo.digitalCurrency,
          fiat_currency: state.orderInfo.fiatCurrency,
          requested_currency: state.orderInfo.digitalCurrency,
          requested_amount: state.orderInfo.digitalAmount
        }).then(onSuccess).catch(onError)
        break
    }
  }
}
export default {
  setDigitalAddress ({
    commit,
    state
  }, address) {
    if (wav.validate(address, state.digitalCurrency)) {
      commit('setDigitalAddress', address)
      commit('setInvalidAddress', false)
    } else {
      commit('setInvalidAddress', true)
      commit('setDigitalAddress', '')
    }
  },
  setFiatAmount ({
    commit,
    state
  }, amount) {
    commit('setFiatAmount', amount)
    if (amount >= simplex.minFiat && amount <= simplex.maxFiat) {
      commit('setInvalidFiatAmount', false)
      updateValues(quoteChanges.fiat_amount, {
        commit,
        state
      })
    } else {
      commit('setInvalidFiatAmount', true)
    }
  },
  setDigitalAmount ({
    commit,
    state
  }, amount) {
    commit('setDigitalAmount', amount)
    if (amount > 0) {
      commit('setInvalidDigitalAmount', false)
      updateValues(quoteChanges.digital_amount, {
        commit,
        state
      })
    } else {
      commit('setInvalidDigitalAmount', true)
    }
  },
  setFiatCurrency ({
    commit,
    state
  }, currency) {
    commit('setFiatCurrency', currency)
    updateValues(quoteChanges.fiat_currency, {
      commit,
      state
    })
  },
  setDigitalCurrency ({
    commit,
    state
  }, currency) {
    commit('setDigitalCurrency', currency)
    updateValues(quoteChanges.digital_currency, {
      commit,
      state
    })
  }
}
