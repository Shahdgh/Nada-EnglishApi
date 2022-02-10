const mongoose = require("mongoose")

const validateId = (...idArry) => {
  return async (req, res, next) => {
    try {
      idArry.forEach(idName => {
        const id = req.params[idName]
        if (!mongoose.Types.ObjectId.isValid(id))
          return res.status(400).send(`the path ${idName} is not a valid object id`)
      })
      next()
    } catch (error) {
      console.log(error)
      return res.status(500).send(error.message)
    }
  }
}

module.exports = validateId