const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const PurchaseSchema = new mongoose.Schema({
  ad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ad',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: false
  },
  sold: {
    type: Boolean,
    required: false,
    default: false
  },
  createAt: {
    type: Date,
    default: Date.now
  }
})
PurchaseSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Purchase', PurchaseSchema)
