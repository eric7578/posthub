<template>
  <div>
    <div>
      <login-form v-if="!isLogin" @submit="onLogin"></login-form>
      <user-status v-if="isLogin" :mail="user.mail"></user-status>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LoginForm from '../userStatus/LoginForm.vue'
import UserStatus from '../userStatus/UserStatus.vue'
import { LOGIN } from '../../store/user'

export default {
  components: {
    'login-form': LoginForm,
    'user-status': UserStatus
  },
  computed: mapState({
    isLogin: state => !!state.user.token,
    user: state => state.user
  }),
  methods: {
    async onLogin(formData) {
      await this.$store.dispatch(LOGIN, formData)
      if (this.isLogin) {
        this.$router.push('/')
      }
    }
  }
}
</script>
