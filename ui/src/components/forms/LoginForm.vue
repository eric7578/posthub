<template>
  <form>
    <text-input label='email' class='email' id='regist-email'></text-input>
    <text-input label='password' type='password' class='password' id='regist-pwd'></text-input>
    <input type='submit' value='login'></input>
  </form>
</template>

<script>
import TextInput from './TextInput'

export default {
  components: {
    TextInput
  }
}
</script>
