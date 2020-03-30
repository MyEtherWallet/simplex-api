<template>
  <div class="submit-button-container">
    <form v-if="formData" id='payment_form' ref="payment_form" :action="formData.payment_post_url" method='POST'
          target='_self'>
      <input type='hidden' name='version' :value='formData.version'>
      <input type='hidden' name='partner' :value='formData.partner'>
      <input type='hidden' name='payment_flow_type' value='wallet'>
      <input type='hidden' name='return_url' :value='formData.return_url'>
      <input type='hidden' name='quote_id' :value='formData.quote_id'>
      <input type='hidden' name='payment_id' :value='formData.payment_id'>
      <input type='hidden' name='user_id' :value='formData.user_id'>
      <input type='hidden' name='destination_wallet[address]' :value='formData.destination_wallet_address'>
      <input type='hidden' name='destination_wallet[currency]' :value='formData.destination_wallet_currency'>
      <input type='hidden' name='fiat_total_amount[amount]' :value='formData.fiat_total_amount_amount'>
      <input type='hidden' name='fiat_total_amount[currency]' :value='formData.fiat_total_amount_currency'>
      <input type='hidden' name='digital_total_amount[amount]' :value='formData.digital_total_amount_amount'>
      <input type='hidden' name='digital_total_amount[currency]' :value='formData.digital_total_amount_currency'>
    </form>
    <a :class="['button-1', validInputs? '' : 'cant-continue' ]" @click="continueAction(submit)">Continue<i
      class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
  </div>
</template>
<script>
export default {
  name: 'CheckoutForm',
  props: [
    'formData',
    'continueAction',
    'validInputs'
  ],
  data () {
    return {};
  },
  methods: {
    submit () {
      document.querySelector('#payment_form').submit();
    }
  }
};
</script>
<style lang="scss" scoped>
  @import '@/var.scss';
  @import 'CheckoutForm.scss'
</style>
