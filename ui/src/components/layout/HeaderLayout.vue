<template>
  <div>
    <header>
      <login-form></login-form>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
import { LoginForm } from '../forms'

export default {
  components: {
    LoginForm
  }
}
</script>
