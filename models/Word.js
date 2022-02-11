const mongoose = require("mongoose")
const Joi = require("joi")


const wordSchema = new mongoose.Schema({
word: String,
image: String,
translation: String,
genres: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Genre",
    },
  ],    
liikes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
})

const  wordAddJoi = Joi.object({
    word:Joi.string().min(1).max(50),
    translation:Joi.string().min(1).max(100),
    image:Joi.string().uri().min(6).max(1000).required(),
    genres: Joi.array().items(Joi.objectid()).min(1).required(),

   
})
const  wordEditJoi = Joi.object({
    word:Joi.string().min(1).max(50),
    translation:Joi.string().min(1).max(100),
    image:Joi.string().uri().min(6).max(1000),
    genres: Joi.array().items(Joi.objectid()).min(1),
})

const Word = mongoose.model("Word", wordSchema)
module.exports.Word = Word 
module.exports.wordAddJoi= wordAddJoi
module.exports.wordEditJoi= wordEditJoi


