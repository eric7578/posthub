<template>
  <!-- <form @submit.prevent="onSubmit()"> -->
  <form method="post" action="/api/auth/login">
    <input placeholder="Mail" type="mail" v-model="mail"></input>
    <input placeholder="Password" type="password" v-model="password"></input>
    <button type="submit">Login</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      mail: '',
      password: ''
    }
  },
  methods: {
    onSubmit() {
      this.$emit('submit', {
        mail: this.mail,
        password: this.password
      })
    }
  }
}
</script>
