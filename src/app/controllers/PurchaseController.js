const Ad = require('../models/Ad')
const User = require('../models/User')
const Purchase = require('../models/Purchase')

const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async accept (req, res) {
    const purchase = await Purchase.findById(req.params.purchase).populate({
      path: 'ad',
      populate: {
        path: 'author'
      }
    })

    if (!purchase.ad.author._id.equals(req.userId)) {
      return res.status(401).json({ error: 'Você não é o autor do anúncio' })
    }

    if (purchase.ad.purchaseBy) {
      return res.status(400).json({
        error: 'Este anúncio já foi vendido'
      })
    }

    purchase.sold = true
    purchase.ad.purchaseBy = req.params.purchase

    purchase.save({
      new: true
    })

    res.json(purchase)
  }
  async requests (req, res) {
    const filters = {
      user: req.params.user
      // sold: null
    }

    const ads = await Purchase.paginate(filters, {
      page: req.query.page || 1,
      limit: 20,
      populate: ['ad', 'user'],
      sort: '-createAt'
    })
    return res.json(ads)
  }
  async store (req, res) {
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    // Cria a solicitação de Compra
    const purchase = await Purchase.create({
      ad,
      user: req.userId,
      content
    })

    // Envia mensagem para a fila, para envio do e-mail da intenção de compra
    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    return res.json(purchase)
  }
}
module.exports = new PurchaseController()
