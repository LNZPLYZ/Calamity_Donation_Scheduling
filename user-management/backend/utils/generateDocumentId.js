const { randomUUID } = require('crypto')

// Create readable prefixed IDs for collections that use string IDs instead of ObjectIds.
// The year helps identify when an ID was generated; the UUID portion makes it unique.
const generateDocumentId = (prefix) =>
    `${prefix}${new Date().getFullYear()}${randomUUID().replace(/-/g, '').toUpperCase()}`

module.exports = generateDocumentId
