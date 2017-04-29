<template>
  <table>
    <thead>
      <tr>
        <th v-for="track in tracks">{{track.name}}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td v-for="track in tracks">
          
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  props: {
    tracks: Array
  },
  components: {
    draggable
  }
}
</script>
