const mongoose = require("mongoose")
const Joi = require("joi")

const readingSchema = mongoose.Schema({
    video: String,
    genres: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Genre",
      },
    ],
    likees: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
})

const readingAddJoi = Joi.object({
  video: Joi.string().uri().min(6).max(1000).required(),
  genres: Joi.array().items(Joi.objectid()).min(1).required(),

})
const readingEditoi = Joi.object({
  video: Joi.string().uri().min(6).max(1000),
  genres: Joi.array().items(Joi.objectid()).min(1),

})


const Reading = mongoose.model("Reading", readingSchema)

module.exports.Reading = Reading
module.exports.readingAddJoi = readingAddJoi
module.exports.readingEditoi = readingEditoi


