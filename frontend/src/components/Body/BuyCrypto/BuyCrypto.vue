<template>
    <div class="buy-btc">
        <div class="page-container">
            <div class="block-division">
                <div class="block-1">
                    <div class="mew-logo-container">
                        <img class="mew-logo-image" src="~@/assets/images/logo.png">
                    </div>
                    <div class="text-contents">
                        <h1 class="large-title">Buy Ethereum, Bitcoin at Lower Rates</h1>
                    </div>
                    <div class="powered-by">
                        <div class="simplex">
                            <span>Powered by</span>
                            <img class="mew-logo-image" src="~@/assets/images/simplex.png">
                        </div>
                        <div class="visa-master">
                            <span>We accept Visa and MasterCard</span>
                            <img class="mew-logo-image" src="~@/assets/images/visa-master.png">
                        </div>
                    </div>
                </div>
                <div class="block-2">
                    <div class="buy-form-container">
                        <div class="price-amount">
                            <div class="price">
                                <h4>Price</h4>
                                <div class="input-form">
                                    <div>
                                        <input v-model.number.lazy="fiatAmount" type="number" min="0" name="fiat_amount" :class="{'invalid-field': isInvalidFiatAmount}">
                                    </div>
                                    <div>
                                        <select v-model="fiatCurrency">
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="amount">
                                <h4>Amount</h4>
                                <div class="input-form">
                                    <div>
                                        <input v-model.number.lazy="digitalAmount" type="number" min="0" name="digital_amount" :class="{'invalid-field': isInvalidDigitalAmount}">
                                    </div>
                                    <div>
                                        <select v-model="digitalCurrency">
                                            <option value="BTC">BTC</option>
                                            <option value="ETH">ETH</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- .price-amount -->
                        <div class="btc-address">
                            <h4 v-if="digitalCurrency === 'BTC'">BTC Address <span>Do you have one?</span></h4>
                            <h4 v-if="digitalCurrency === 'ETH'">ETH Address <span>Do you have one?</span></h4>
                            <input v-model="digitalAddress" type="text" name="" placeholder="Please enter the address" :class="{'invalid-field': isInvalidAddress}">
                        </div>
                        <!-- .btc-address -->
                        <!--{{activateForm}}-->
                        <div class="submit-button-container">
                            <div v-if="canOrder" class="button-1 disable">Continue<i class="fa fa-long-arrow-right" aria-hidden="true"></i></div>
                            <p>You will be redirected to the partner's site</p>
                        </div>
                    </div>
                    <!-- .buy-form-container -->
                    <div class="powered-by-mobile">
                        <div class="simplex">
                            <span>Powered by</span>
                            <img class="mew-logo-image" src="~@/assets/images/simplex.png">
                        </div>
                        <div class="visa-master">
                            <span>We accept Visa and MasterCard</span>
                            <img class="mew-logo-image" src="~@/assets/images/visa-master.png">
                        </div>
                    </div>
                </div>
                <!-- .block-2 -->
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'BuyCrypto',
  data () {
    return {
      // enableForm: false
    }
  },
  mounted () {
    this.$store.dispatch('setDigitalAmount', 1)
  },
  watch: {
    'activateForm': (newVal, oldVal) => {}
  },
  computed: {
    digitalAddress: {
      get () {
        return this.$store.state.orderInfo.digitalAddress
      },
      set (value) {
        this.$store.dispatch('setDigitalAddress', value)
      }
    },
    fiatAmount: {
      get () {
        return this.$store.state.orderInfo.fiatAmount
      },
      set (value) {
        this.$store.dispatch('setFiatAmount', value).finally(() => {
          console.log('fiat done')
        })
      }
    },
    digitalAmount: {
      get () {
        return this.$store.state.orderInfo.digitalAmount
      },
      set (value) {
        this.$store.dispatch('setDigitalAmount', value).finally(() => {
          console.log('digital done')
        })
      }
    },
    fiatCurrency: {
      get () {
        return this.$store.state.orderInfo.fiatCurrency
      },
      set (value) {
        this.$store.dispatch('setFiatCurrency', value)
      }
    },
    digitalCurrency: {
      get () {
        return this.$store.state.orderInfo.digitalCurrency
      },
      set (value) {
        this.$store.dispatch('setDigitalCurrency', value)
      }
    },
    isInvalidFiatAmount: {
      get () {
        return this.$store.state.status.invalidFiatAmount
      }
    },
    isInvalidDigitalAmount: {
      get () {
        return this.$store.state.status.invalidDigitalAmount
      }
    },
    isInvalidAddress: {
      get () {
        return this.$store.state.status.invalidAddress
      }
    },
    canOrder: {
      get () {
        return !this.isInvalidAddress && !this.isInvalidDigitalAmount && !this.isInvalidFiatAmount
      }
    }

  }
}
</script>
<style lang="scss" scoped>
@import '@/var.scss';
@import 'BuyCrypto.scss'
</style>
