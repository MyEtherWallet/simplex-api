<template>
    <div>
      <pre>{{status}}</pre>
    </div>
</template>
<script>
import {getStatus} from '../../../simplex-api'
export default {
  name: 'OrderStatus',
  props: [
    'userId'
  ],
  data () {
    return {
      status: {}
    }
  },
  mounted () {
    this.getOrderStatus()
  },
  methods: {
    getOrderStatus () {
      getStatus(this.userId)
        .then(result => {
          this.status = JSON.stringify(result.data.result, null, 2)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/var.scss';
@import 'OrderStatus';
</style>
