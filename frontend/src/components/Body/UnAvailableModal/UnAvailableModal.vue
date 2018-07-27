<template>
  <div id="modal-template">

      <transition name="modal">

        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">

              <div class="modal-body">
                <div class="inner-body">

                  <h2 class="oops-title">
                    Oops!
                  </h2>

                  <p class="oops-text">
                    Sorry our service is currently not available in your area.
                  </p>

                  <div class="oops-btn-container">
                    <a class="button-1" @click="returnToMew">Return to MyEtherWallet</a>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

      </transition>

    </div>
</template>
<script>

export default {
  name: 'UnAvailableModal',
  props: [],
  data () {
    return {
      show: true
    }
  },
  mounted () {
    this.showModal()
  },
  methods: {
    returnToMew () {
      this.hideModal()
    },
    showModal () {
      this.show = true
    },
    hideModal () {
      this.show = false
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '@/var.scss';
  @import 'UnAvailableModal.scss'
</style>
