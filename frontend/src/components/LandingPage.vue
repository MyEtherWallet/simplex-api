<template>
  <div class="landing-page">
    <page-header />
    <buy-btc />
    <promo1 />
    <promo2 />
    <promo3 />
    <page-footer />
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/var.scss';
  @import 'LandingPage.scss'
</style>
