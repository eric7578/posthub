<template>
  <div>
    <span>{{ mail }}</span>
    <button @click="toggleMenu">More</button>
    <div>
      <ul v-if="isMenuOpened">
        <li @click="onClickLogout">Logout</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mail: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isMenuOpened: false
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpened = !this.isMenuOpened
    },
    onClickLogout() {
      this.$emit('onLogout')
    }
  }
}
</script>
