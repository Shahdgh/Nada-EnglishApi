const express = require("express")
const router = express.Router()
const validateBody = require("../middleware/validateBody")
const checkId = require("../middleware/checkId")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const checkUser = require("../middleware/checkUser")
const { User,signupJoi,loginJoi,profileJoi } = require("../models/User")



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
      if (userFound) return res.status(400).send("Patient already registered")

      
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
  
      const user = new User({
        firstName,
        lastName,
        email,
        password: hash,
        claass,
        avatar,
       
      })
      await user.save()
    delete user._doc.password

    res.json(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
///////////LOGIN Companions
router.post("/login", validateBody(loginJoi), async (req, res) => {
    try {
      const { email, password } = req.body
  
      const user = await User.findOne({ email })
      if (!user) return res.status(404).send("User  not found")
  
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) return res.status(400).send(" password incorrect")
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
      res.send(token)
    } catch (error) {
      res.status(500).send(error.message)
    }
  })
//////// Profile
  router.get("/profile", checkUser, async (req, res) => {
    const user = await User.findById(req.userId).select("-__v")
    res.json(user)
  })

//   //put companion
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
  module.exports = router
