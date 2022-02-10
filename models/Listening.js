const mongoose = require("mongoose")
const Joi = require("joi")

const listeningSchema = mongoose.Schema({
    video: String,
    likess: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
})

const listeningAddJoi = Joi.object({
  video: Joi.string().uri().min(6).max(1000).required(),
})


const Listening = mongoose.model("Listening", listeningSchema)

module.exports.Listening = Listening
module.exports.listeningAddJoi = listeningAddJoi

