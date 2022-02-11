const mongoose = require("mongoose")
const Joi = require("joi")

const listeningSchema = mongoose.Schema({
    video: String,
    genres: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Genre",
      },
    ],
    likess: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
})

const listeningAddJoi = Joi.object({
  video: Joi.string().uri().min(6).max(1000).required(),
  genres: Joi.array().items(Joi.objectid()).min(1).required(),

})
const listeningEditJoi = Joi.object({
  video: Joi.string().uri().min(6).max(1000),
  genres: Joi.array().items(Joi.objectid()).min(1),

})


const Listening = mongoose.model("Listening", listeningSchema)

module.exports.Listening = Listening
module.exports.listeningAddJoi = listeningAddJoi
module.exports.listeningEditJoi = listeningEditJoi


