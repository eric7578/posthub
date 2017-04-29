<template>
  <span class='text-input'>
    <label :class='labelClass' :for='id'>{{ label }}</label>
    <input :type='type' :value='value' :inputClass='inputClass' :id='id'></input>
  </span>
</template>

<script>
export default {
  props: {
    id: String,
    labelClass: String,
    inputClass: String,
    label: String,
    type: {
      type: String,
      default: 'text'
    },
    value: [String, Number]
  }
}
</script>
