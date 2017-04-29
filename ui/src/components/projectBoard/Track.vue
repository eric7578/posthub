<template>
  <ul>
    <li v-for="task in tasks">

    </li>
  </ul>
</template>

<script>
import TaskCard from './TaskCard'

export default {
  props: {
    tasks: Array
  },
  components: {
    TaskCard
  }
}
</script>
