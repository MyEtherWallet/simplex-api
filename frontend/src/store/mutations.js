export default {
  setFiatCurrency (state, _fiatCurrency) {
    state.orderInfo.fiatCurrency = _fiatCurrency
  },
  setDigitalCurrency (state, _digitalCurrency) {
    state.orderInfo.digitalCurrency = _digitalCurrency
  },
  setFiatAmount (state, _fiatAmount) {
    state.orderInfo.fiatAmount = _fiatAmount
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
  setInvalidDigitalAmount (state, _isInvalid) {
    state.status.invalidDigitalAmount = _isInvalid
  }
}
