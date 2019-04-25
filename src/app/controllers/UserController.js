const User = require('../models/User')

class UserController {
  async store (req, res) {
    const { email } = req.body

    if (await User.findOne({ email })) {
      return res.status(400).json({
        error: 'Já existe esse e-mail cadastrado'
      })
    }

    const user = await User.create(req.body)

    return res.json(user)
  }
}

module.exports = new UserController()
