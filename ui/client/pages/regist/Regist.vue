<template>
  <div>
    <regist-form @submit="submitRegist"></regist-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { REGIST } from '../../store/user.js'
import RegistForm from './RegistForm.vue'

export default {
  components: {
    'regist-form': RegistForm
  },
  computed: mapState({
    isLogin: state => !!state.user.token
  }),
  methods: {
    async submitRegist(formData) {
      await this.$store.dispatch(REGIST, formData)
      if (this.isLogin) {
        this.$router.push('/')
      }
    }
  }
}
</script>
