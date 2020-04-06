export default {
  setMinFiat (state, _minFiat) {
    state.minFiat = _minFiat
  },
  setMaxFiat (state, _maxFiat) {
    state.maxFiat = _maxFiat
  },
  setFiatCurrency (state, _fiatCurrency) {
    state.orderInfo.fiatCurrency = _fiatCurrency
  },
  setDigitalCurrency (state, _digitalCurrency) {
    state.orderInfo.digitalCurrency = _digitalCurrency
  },
  setFiatAmount (state, _fiatAmount) {
    state.orderInfo.fiatAmount = _fiatAmount
  },
  setFiatTotal (state, _fiatTotal) {
    state.orderInfo.fiatTotal = _fiatTotal
  },
  setDigitalAmount (state, _digitalAmount) {
    state.orderInfo.digitalAmount = _digitalAmount
  },
  setDigitalAddress (state, _address) {
    state.orderInfo.digitalAddress = _address
  },
  setInvalidAddress (state, _isInvalid) {
    state.status.invalidAddress = _isInvalid
  },
  setInvalidFiatAmount (state, _isInvalid) {
    state.status.invalidFiatAmount = _isInvalid
  },
  setInvalidFiatAbove (state, _isInvalidAbove) {
    state.status.invalidFiatAbove = _isInvalidAbove
  },
  setInvalidFiatBelow (state, _isInvalidBelow) {
    state.status.invalidFiatBelow = _isInvalidBelow
  },
  setInvalidDigitalAmount (state, _isInvalid) {
    state.status.invalidDigitalAmount = _isInvalid
  },
  setRequestedCurrency (state, _currency) {
    state.orderInfo.requestedCurrency = _currency
  },
  setUserId (state, _id) {
    state.orderInfo.userId = _id
  },
  setQuoteId (state, _id) {
    state.orderInfo.quoteId = _id
  },
  saveQueryValue (state, newQuery) {
    state.linkQuery = newQuery
  }
}
