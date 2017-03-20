const READ = 0
const EDIT = 1
const REMOVE = 2

function exchangeToken() {
  return async function (request, next) {
    await next
  }
}

function ensure(...permissions) {
  return async function (request, next) {

    await next
  }
}

exports.READER = [READ]
exports.EDITOR = [READ, EDIT]
exports.CREATOR = [READ, EDIT, REMOVE]
exports.ensure = ensure
