<template>
  <div class="other-modal-content">
    <b-modal
             ref="UnAvailable"
             id="modal-center"
             title="Bootstrap-Vue"
             :modal-footer="handleCancel"
             :no-close-on-esc="true"
             :no-close-on-backdrop="true"
             :hide-header-close="true"
             @ok="handleOk"
             @cancel="handleCancel">
      <a class="button-1" @click="returnToMew">Return to MyEtherWallet</a>
      <p class="my-4">Hello from modal!</p>
    </b-modal>
  </div>
</template>
<script>

import bModal from 'bootstrap-vue/es/components/modal/modal'
import bModalDirective from 'bootstrap-vue/es/directives/modal/modal'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export default {
  name: 'UnAvailableModal',
  props: [],
  components: {
    'b-modal': bModal
  },
  directives: {
    'b-modal': bModalDirective
  },
  data () {
    return {}
  },
  mounted () {
    this.showModal()
  },
  methods: {
    returnToMew () {
      this.hideModal()
    },
    handleOk (evt) {
      evt.preventDefault()
    },
    handleCancel (evt) {
      evt.preventDefault()
    },
    showModal () {
      this.$refs.UnAvailable.show()
    },
    hideModal () {
      this.$refs.UnAvailable.hide()
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '@/var.scss';
  @import 'UnAvailableModal.scss'
</style>
