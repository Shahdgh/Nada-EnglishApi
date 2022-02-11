const express = require("express")
const jwt = require("jsonwebtoken")
const router = express.Router()
const bcrypt = require("bcrypt")
const { Admin, signupJoi, loginJoi } = require("../models/Admin")
const checkAdmin = require("../middleware/checkAdmin")
const validateBody = require("../middleware/validateBody")
const checkId = require("../middleware/checkId")
const { Word ,wordAddJoi,wordEditJoi} = require("../models/Word")
const { Listening,listeningAddJoi,listeningEditJoi } = require("../models/Listening")
const { Reading,readingAddJoi,readingEditoi } = require("../models/Reading")
const { Speaking,speakingAddJoi,speakingEditJoi } = require("../models/Speaking")

///Signup admin
router.post("/signup", validateBody(signupJoi), async (req, res) => {
  try {
    const { firstName, lastName, email, password, avatar } = req.body
    const adminFound = await Admin.findOne({ email })
    if (adminFound) return res.status(400).send(result.error.details[10].message)

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const admin = new Admin({
      firstName,
      lastName,
      email,
      password: hash,
      avatar,
    })

    await admin.save()
    delete admin._doc.password

    res.json(admin)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
///////////LOGIN ADMIN
router.post("/login", validateBody(loginJoi), async (req, res) => {
  try {
    const { email, password } = req.body

    const admin = await Admin.findOne({ email })
    if (!admin) return res.status(404).send("admin not found")

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) return res.status(400).send(" password incorrect")

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
    res.send(token)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

/////get Word
router.get("/words",  async (req, res) => {
    const word = await Word.find().select("-__v").populate("genres")
    res.json(word)
  })
  //Add Ingredients
  router.post("/words", checkAdmin, validateBody(wordAddJoi), async (req, res) => {
    try {
      const { word, image, translation ,genres} = req.body
  
      const words = new Word({
        word, 
        image,
         translation ,
         genres,
      })
      await words.save()
      res.json(words)
    } catch (error) {
      res.status(500).send(error.message)
    }
  })
  ///Edit word
  router.put("/words/:id", checkAdmin, checkId, validateBody(wordEditJoi), async (req, res) => {
    try {
        const { word, image, translation ,genres} = req.body
  
      const words = await Word.findByIdAndUpdate(
        req.params.id,
        { $set: { word, image, translation,genres } },
        { new: true }
      )
  
      if (!words) return res.status(404).send("word not found")
      res.json(words)
    } catch (error) {
      res.status(500).send(error.message)
    }
  })
  
  /////////// Delete Word
  
  router.delete("/words/:id", checkAdmin, checkId, async (req, res) => {
    try {
      const words = await Word.findByIdAndRemove(req.params.id)
      if (!words) return res.status(404).send("word is not Found")
  
      res.json("word is removed")
    } catch (error) {
      res.status(500).send(error.message)
    }
  })
  
  /////get video listing
// router.get("/listening",  async (req, res) => {
//   const listening = await Listening.find().select("-__v")
//   res.json(listening)
// })
//Add listening
// router.post("/listening", checkAdmin, validateBody(listeningAddJoi), async (req, res) => {
//   try {
//     const {video } = req.body

//     const listening = new Listening({
//       video,
//     })
//     await listening.save()
//     res.json(listening)
//   } catch (error) {
//     res.status(500).send(error.message)
//   }
// })
// router.delete("/listening/:id", checkAdmin, checkId, async (req, res) => {
//   try {
//     const listenings = await Listening.findByIdAndRemove(req.params.id)
//     if (!listenings) return res.status(404).send("Listening video is not Found")

//     res.json("video is removed")
//   } catch (error) {
//     res.status(500).send(error.message)
//   }
// })

  /////get video listing
  router.get("/reading",  async (req, res) => {
    const reading = await Reading.find().select("-__v").populate("genres")
    res.json(reading)
  })
//Add Reading
router.post("/reading", checkAdmin, validateBody(readingAddJoi), async (req, res) => {
  try {
    const {video,genres } = req.body

    const reading = new Reading({
      video,
      genres,
    })
    await reading.save()
    res.json(reading)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
////Reading Edit
router.put("/reading/:id", checkAdmin, checkId, validateBody(readingEditoi), async(req,res)=>{
  try{
      const { video, genres} = req.body
      
      const reading =await Reading.findByIdAndUpdate( req.params.id 
          ,{$set: {video,genres }},{new:true})
       
      if(!reading) return res.status(404).send("video reading not found")
      res.json(reading)
  }catch (error) {
  res.status(500).send(error.message)
}
}) 
router.delete("/reading/:id", checkAdmin, checkId, async (req, res) => {
  try {
    const reading = await Reading.findByIdAndRemove(req.params.id)
    if (!reading) return res.status(404).send("reading video is not Found")

    res.json("video reading is removed")
  } catch (error) {
    res.status(500).send(error.message)
  }
})
/////get video listing
router.get("/listening",  async (req, res) => {
  const listening = await Listening.find().select("-__v").populate("genres")
  res.json(listening)
})
//Add listening
router.post("/listening", checkAdmin, validateBody(listeningAddJoi), async (req, res) => {
  try {
    const {video,genres } = req.body

    const listening = new Listening({
      video,
      genres,
    })
    await listening.save()
    res.json(listening)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
////Listening Edit
router.put("/listening/:id", checkAdmin, checkId, validateBody(listeningEditJoi), async(req,res)=>{
  try{
      const { video, genres} = req.body
      
      const listening =await Listening.findByIdAndUpdate( req.params.id 
          ,{$set: {video,genres }},{new:true})
       
      if(!listening) return res.status(404).send("video listening not found")
      res.json(listening)
  }catch (error) {
  res.status(500).send(error.message)
}
}) 
router.delete("/listening/:id", checkAdmin, checkId, async (req, res) => {
  try {
    const listenings = await Listening.findByIdAndRemove(req.params.id)
    if (!listenings) return res.status(404).send("Listening video is not Found")

    res.json("video is removed")
  } catch (error) {
    res.status(500).send(error.message)
  }
})

  /////get video Speaking
  router.get("/speaking",  async (req, res) => {
    const speaking = await Speaking.find().select("-__v").populate("genres")
    res.json(speaking)
  })
//Add Speaking
router.post("/speaking", checkAdmin, validateBody(speakingAddJoi), async (req, res) => {
  try {
    const {video,genres } = req.body

    const speaking = new Speaking({
      video,
      genres,
    })
    await speaking.save()
    res.json(speaking)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
////speaking Edit
router.put("/speaking/:id", checkAdmin, checkId, validateBody(speakingEditJoi), async(req,res)=>{
  try{
      const { video, genres} = req.body
      
      const speaking =await Speaking.findByIdAndUpdate( req.params.id 
          ,{$set: {video,genres }},{new:true})
       
      if(!speaking) return res.status(404).send("video speaking not found")
      res.json(speaking)
  }catch (error) {
  res.status(500).send(error.message)
}
}) 
router.delete("/speaking/:id", checkAdmin, checkId, async (req, res) => {
  try {
    const speaking = await Speaking.findByIdAndRemove(req.params.id)
    if (!speaking) return res.status(404).send("Speaking video is not Found")

    res.json("video speaking is removed")
  } catch (error) {
    res.status(500).send(error.message)
  }
})


  module.exports = router
