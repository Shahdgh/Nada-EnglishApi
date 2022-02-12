const express = require("express")
const router = express.Router()
const validateBody = require("../middleware/validateBody")
const nodemailer = require("nodemailer")
const checkId = require("../middleware/checkId")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const checkUser = require("../middleware/checkUser")
const { User,signupJoi,loginJoi,profileJoi } = require("../models/User")
const validateId = require("../middleware/validateId")
const { Speaking } = require("../models/Speaking")
const checkToken = require("../middleware/checkToken")
const { Listening } = require("../models/Listening")
const { Reading } = require("../models/Reading")
const { Word } = require("../models/Word")



/////get User
router.get("/",  async (req, res) => {
  const user = await User.find().select("-__v -password")
  res.json(user)
})
///Signup 
router.post("/signup",validateBody(signupJoi), async (req, res) => {
    try {
      const { firstName, lastName,claass , email, password, avatar } = req.body
      const userFound = await User.findOne({ email })
      if (userFound) return res.status(400).send("User already registered")

      
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
  
      const user = new User({
        firstName,
        lastName,
        email,
        password: hash,
        // emailVerified:false,
        claass,
        avatar,
       
      })
      const transporter = nodemailer.createTransport({
        service:"gmail",
        port:587,
        secure:false,
        auth:{
          user: process.env.SENDER_EMAIL,
          pass:process.env.SENDER_PASSWORD,
        },
      })
  
      const token = jwt.sign({id: user._id }, process.env.JWT_SECRET_KEY,{expiresIn:"15d"})
  
      await transporter.sendMail({
        from:` "Nada-English website" <${process.env.SENDER_EMAIL}`,
        to:email, //list of receivers
        subject:"Email verification", // Subject line
        html: `Hello , please click on this link to verify your email.
        <a href="https://nada-english-api.herokuapp.com/email_verified/${token}"> Verify email</a>`, //html body
        
      })
      await user.save()
      delete user._doc.password
  
      res.send("تم ارسال رسالة تحقق الى الأيميل")
    //   await user.save()
    // delete user._doc.password

    // res.json(user)
    
  } catch (error) {
    res.status(500).send(error.message)
  }
})
router.get("/verify_email/:token", async (req,res)=>{
  try{
    const decryptedToken = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY)
    const userId = decryptedToken.id

    const user = await User.findByIdAndUpdate(userId, {$set:{emailVerified:true}})
    if (!user) return res.status(404).send("user not found")
   
    res.send("user verified")
  }catch (error){
    res.status(500).send(error.message)
  }
})
///////////LOGIN 
router.post("/login", validateBody(loginJoi), async (req, res) => {
    try {
      const { email, password } = req.body
  
      const user = await User.findOne({ email })
      if (!user) return res.status(404).send("User  not found")
  
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) return res.status(400).send(" password incorrect")
  
      if(!user.emailVerified) return res.status(403).send("user not verified, please check your email")
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
      res.send(token)
    } catch (error) {
      res.status(500).send(error.message)
    }
  })
//////// Profile
  router.get("/profile", checkUser, async (req, res) => {
    const user = await User.findById(req.userId).select("-__v").populate("likes").populate("likess").populate("likees").populate("liikes")
    res.json(user)
  })

//   //put profile
router.put("/profile/:id",checkId, checkUser, validateBody(profileJoi), async (req, res) => {
    try {
        const { firstName, lastName,claass, email, password, avatar } = req.body

        let hash
      if(password){
        const salt = await bcrypt.genSalt(10)
       hash = await bcrypt.hash(password, salt)
        }
 
     
        const user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: { firstName, lastName,claass, email, password:hash, avatar } },
        { new: true }
      )
  
      if (!user) return res.status(404).send("User not found")
      res.json(user)
    } catch (error) {
      res.status(500).send(error.message)
    }
  })

  /**********LIkes************* */
  //////like speaking
router.get("/:speakingId/likes", checkToken, validateId("speakingId"), async (req, res) => {
  try {
    let speaking = await Speaking.findById(req.params.speakingId)
    if (!speaking) return res.status(404).send("video  not Found")

    const userFound = speaking.likes.find(like => like == req.userId)
    if (userFound) {
      await Speaking.findByIdAndUpdate(req.params.speakingId, { $pull: { likes: req.userId } })
      // await User.findByIdAndUpdate(req.userId, { $pull: { likes: params.speakingId } })
      await User.findByIdAndUpdate(req.userId, { $pull: { likes: req.params.speakingId } })
      res.send("removed like from video")
    } else {
      await Speaking.findByIdAndUpdate(req.params.speakingId, { $push: { likes: req.userId } })
      await User.findByIdAndUpdate(req.userId, { $push: { likes: req.params.speakingId } })
      res.send("video liked")
    }
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})
///////Like listening
router.get("/:listeningId/listening/likes", checkToken, validateId("listeningId"), async (req, res) => {
  try {
    let listening = await Listening.findById(req.params.listeningId)
    if (!listening) return res.status(404).send("video  not Found")

    const userFound = listening.likess.find(like => like == req.userId)
    if (userFound) {
      await Listening.findByIdAndUpdate(req.params.listeningId, { $pull: { likess: req.userId } })
      await User.findByIdAndUpdate(req.userId, { $pull: { likess: req.params.listeningId } })
      res.send("removed like from video")
    } else {
      await Listening.findByIdAndUpdate(req.params.listeningId, { $push: { likess: req.userId } })
      await User.findByIdAndUpdate(req.userId, { $push: { likess: req.params.listeningId } })
      res.send("video liked")
    }
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})
///////Like Reaging
router.get("/:readingId/reading/likes", checkToken, validateId("readingId"), async (req, res) => {
  try {
    let reading = await Reading.findById(req.params.readingId)
    if (!reading) return res.status(404).send("video  not Found")

    const userFound = reading.likees.find(like => like == req.userId)
    if (userFound) {
      await Reading.findByIdAndUpdate(req.params.readingId, { $pull: { likees: req.userId } })
      await User.findByIdAndUpdate(req.userId, { $pull: { likees: req.params.readingId } })
      res.send("removed like from video")
    } else {
      await Reading.findByIdAndUpdate(req.params.readingId, { $push: { likees: req.userId } })
      await User.findByIdAndUpdate(req.userId, { $push: { likees: req.params.readingId } })
      res.send("video liked")
    }
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})
///////Like Words
router.get("/:wordId/word/likes", checkToken, validateId("wordId"), async (req, res) => {
  try {
    let word = await Word.findById(req.params.wordId)
    if (!word) return res.status(404).send("word  not Found")

    const userFound = word.liikes.find(like => like == req.userId)
    if (userFound) {
      await Word.findByIdAndUpdate(req.params.wordId, { $pull: { liikes: req.userId } })
      await User.findByIdAndUpdate(req.userId, { $pull: { liikes: req.params.wordId } })
      res.send("removed like from word")
    } else {
      await Word.findByIdAndUpdate(req.params.wordId, { $push: { liikes: req.userId } })
      await User.findByIdAndUpdate(req.userId, { $push: { liikes: req.params.wordId } })
      res.send("word liked")
    }
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message)
  }
})
  module.exports = router
