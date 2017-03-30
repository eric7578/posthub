import Vue from 'vue'
import 'es6-promise/auto'
import { app, store, router } from './app'
import VueSocket from './plugins/VueSocket'
import socket from 'socket.io-client'

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
  // actually mount to DOM
  app.$mount('#app')
})

// service worker
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
}

Vue.use(VueSocket, socket(`http://localhost:8080`), store)
