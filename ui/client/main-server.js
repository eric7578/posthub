import { app, router, store } from './app'

const isDev = process.env.NODE_ENV !== 'production'

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default context => {
  const s = isDev && Date.now()

  return new Promise((resolve, reject) => {
    // set router's location
    router.push(context.url)

    // wait until router has resolved possible async hooks
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // no matched routes
      if (!matchedComponents.length) {
        const err = new Error('Not found')
        err.status = 404
        return reject(err)
      }

      // Prefetch
      Promise.all(matchedComponents.map(component => {
        return component.preFetch && component.preFetch(store)
      })).then(() => {
        isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
        context.state = store.state
        context.state.user = context.user
        resolve(app)
      }).catch(reject)
    })
  })
}
