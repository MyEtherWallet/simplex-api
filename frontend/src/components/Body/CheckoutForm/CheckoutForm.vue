<template>
    <form v-if="activateForm" id='payment_form' action='https://checkout.simplexcc.com/payments/new' method='POST' target='_self'>
        <!--{{$store.state.forPost}}-->
        <input type='hidden' name='version' value='1'>
        <input type='hidden' name='partner' value='myetherwallet'>
        <input type='hidden' name='payment_flow_type' value='wallet'>
        <input type='hidden' name='return_url' value='https://www.myetherwallet.com'>
        <input type='hidden' name='quote_id' v-bind:value='$store.state.forPost.transaction_details.payment_details.quote_id'>
        <input type='hidden' name='payment_id' :value='$store.state.forPost.transaction_details.payment_details.payment_id'>
        <input type='hidden' name='user_id' :value='$store.state.forPost.account_details.app_end_user_id'>
        <input type='hidden' name='destination_wallet[address]' :value='$store.state.forPost.transaction_details.payment_details.destination_wallet.address'>
        <input type='hidden' name='destination_wallet[currency]' :value='$store.state.forPost.transaction_details.payment_details.destination_wallet.currency'>
        <input type='hidden' name='fiat_total_amount[amount]' :value='$store.state.forPost.transaction_details.payment_details.fiat_total_amount.amount'>
        <input type='hidden' name='fiat_total_amount[currency]' :value='$store.state.forPost.transaction_details.payment_details.fiat_total_amount.currency'>
        <input type='hidden' name='digital_total_amount[amount]' :value='$store.state.forPost.transaction_details.payment_details.requested_digital_amount.amount'>
        <input type='hidden' name='digital_total_amount[currency]' :value='$store.state.forPost.transaction_details.payment_details.requested_digital_amount.currency'>
        <button type="submit" class="button-1">Continue<i class="fa fa-long-arrow-right" aria-hidden="true"></i></button>
    </form>
</template>
<script>
export default {
  name: 'CheckoutForm',
  props: [
    'formData'
  ],
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
@import '@/var.scss';
@import 'CheckoutForm.scss'
</style>
