<template>
    <div class="promo3">
        <div class="page-container">
            <div class="text-button-container">
                <div class="text-block">
                    <h1>Buy Ethereum at Lower Rates</h1>
                </div>
                <div class="button-block">
                    <div class="submit-button-container">
                        <div v-on:click="scrolltop" class="button-2">Buy Now</div>
                    </div>
                </div>
            </div>
            <div class="footer-container">
                <div class="terms">
                    <p></p>
                </div>
                <div class="copyright">
                    <p>© 2018 MyEtherWallet Inc.</p>
                    <p>All rights reserved</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'Footer',
  data () {
    return {}
  },
  methods: {
    scrolltop: function () {
      window.scrollTo(0, 0)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/var.scss';
@import 'Footer.scss';
</style>
