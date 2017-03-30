Vue.config.optionMergeStrategies.preFetch = function (toVal, fromVal) {
  return function () {
    toVal()
    fromVal()
  }
}
