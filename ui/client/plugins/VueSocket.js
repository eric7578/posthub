import Vue from 'vue'

const defaultBaseEvents = [
  'error',
  'connect',
  'disconnect',
  'disconnecting'
]

export default {
  install(Vue, connection, store, baseEvents = defaultBaseEvents) {
    baseEvents.forEach(event => {
      const mutationName = `SOCKET_${event.toUpperCase()}`
      connection.on(event, data => store.commit(mutationName, data))
    })

    Vue.prototype.$socket = connection
  }
}
