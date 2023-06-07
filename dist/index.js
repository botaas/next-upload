
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./next-upload.cjs.production.min.js')
} else {
  module.exports = require('./next-upload.cjs.development.js')
}
