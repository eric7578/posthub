<template>
  <form @submit.prevent="onSubmit()">
    <input placeholder="Mail" type="mail" v-model="mail"></input>
    <input placeholder="Password" type="password" v-model="password"></input>
    <button type="submit">Submit</button>
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
