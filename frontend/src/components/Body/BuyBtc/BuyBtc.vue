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
                    <input v-model.number.lazy="price" type="number" name="fiat_currency"
                           :class="{'invalid-field': invalidPrice}">
                  </div>
                  <div>
                    <select v-model.lazy="fiatCurrency">
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
                    <input v-model.number.lazy="amount" type="number" name="digital_currency"
                           :class="{'invalid-field': invalidAmount}">
                  </div>
                  <div>
                    <select v-model.lazy="digitalCurrency">
                      <option value="BTC">BTC</option>
                      <option value="ETH">ETH</option>
                    </select>
                  </div>
                </div>
              </div>
            </div> <!-- .price-amount -->

            <div class="btc-address">
              <h4 v-if="digitalCurrency === 'BTC'">BTC Address <span>Do you have one?</span></h4>
              <h4 v-if="digitalCurrency === 'ETH'">ETH Address <span>Do you have one?</span></h4>
              <input v-model.lazy="digitalAddress" type="text" name=""
                     placeholder="Please enter the address"
                     :class="{'invalid-field': invalidAddress}">
            </div> <!-- .btc-address -->
                   <!--{{activateForm}}-->
            <div class="submit-button-container">
              <form v-if="activateForm" id='payment_form'
                    action='https://checkout.simplexcc.com/payments/new'
                    method='POST' target='_self'>
                <!--{{$store.state.forPost}}-->
                <input type='hidden' name='version' value='1'>
                <input type='hidden' name='partner' value='myetherwallet'>
                <input type='hidden' name='payment_flow_type' value='wallet'>
                <input type='hidden' name='return_url' value='https://www.myetherwallet.com'>
                <input type='hidden' name='quote_id'
                       v-bind:value='$store.state.forPost.transaction_details.payment_details.quote_id'>
                <input type='hidden' name='payment_id'
                       :value='$store.state.forPost.transaction_details.payment_details.payment_id'>
                <input type='hidden' name='user_id'
                       :value='$store.state.forPost.account_details.app_end_user_id'>
                <input type='hidden' name='destination_wallet[address]'
                       :value='$store.state.forPost.transaction_details.payment_details.destination_wallet.address'>
                <input type='hidden' name='destination_wallet[currency]'
                       :value='$store.state.forPost.transaction_details.payment_details.destination_wallet.currency'>
                <input type='hidden' name='fiat_total_amount[amount]'
                       :value='$store.state.forPost.transaction_details.payment_details.fiat_total_amount.amount'>
                <input type='hidden' name='fiat_total_amount[currency]'
                       :value='$store.state.forPost.transaction_details.payment_details.fiat_total_amount.currency'>
                <input type='hidden' name='digital_total_amount[amount]'
                       :value='$store.state.forPost.transaction_details.payment_details.requested_digital_amount.amount'>
                <input type='hidden' name='digital_total_amount[currency]'
                       :value='$store.state.forPost.transaction_details.payment_details.requested_digital_amount.currency'>
                <button type="submit" class="button-1">Continue<i
                  class="fa fa-long-arrow-right"
                  aria-hidden="true"></i></button>
              </form>
              <div v-if="!activateForm" class="button-1 disable">Continue<i
                class="fa fa-long-arrow-right"
                aria-hidden="true"></i></div>
              <p>You will be redirected to the partner's site</p>
            </div>
          </div> <!-- .buy-form-container -->

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

        </div> <!-- .block-2 -->
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'BuyBtc',
  data () {
    return {
      // enableForm: false
    }
  },
  mounted () {
    this.$store.dispatch('updateAmount', 1)
  },
  watch: {
    'activateForm': (newVal, oldVal) => {
      // console.log('watch old: ', oldVal, 'new: ', newVal) // todo remove dev item
      // this.enableForm = newVal
      // console.log('this.enableForm', this.enableForm); // todo remove dev item
    }
  },
  computed: {
    digitalAddress: {
      get () {
        return this.$store.state.address
      },
      set (value) {
        this.$store.dispatch('updateAddress', value)
      }
    },
    price: {
      get () {
        return this.$store.state.price
      },
      set (value) {
        this.$store.dispatch('updatePrice', value)
      }
    },
    amount: {
      get () {
        return this.$store.state.amount
      },
      set (value) {
        this.$store.dispatch('updateAmount', value)
      }
    },
    fiatCurrency: {
      get () {
        return this.$store.state.fiatCurrency
      },
      set (value) {
        this.$store.dispatch('updateFiat', value)
      }
    },
    digitalCurrency: {
      get () {
        return this.$store.state.digitalCurrency
      },
      set (value) {
        this.$store.dispatch('updateDigital', value)
      }
    },
    invalidPrice: {
      get () {
        return this.$store.state.invalidPrice
      }
    },
    invalidAmount: {
      get () {
        return this.$store.state.invalidAmount
      }
    },
    invalidAddress: {
      get () {
        return this.$store.state.invalidAddress
      }
    },
    activateForm: {
      get () {
        return this.$store.state.activateForm
      }
    }

  }
}
</script>

<style lang="scss" scoped>
  @import '~@/var.scss';
  @import 'BuyBtc.scss'
</style>
