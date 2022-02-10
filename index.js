const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()
const Joi = require("joi")
const JoiObjectId = require("joi-objectid")
Joi.objectid = JoiObjectId(Joi)
const admins = require("./routes/admins")
const geners = require("./routes/genres")
const users = require("./routes/users")

mongoose
  .connect(`mongodb+srv://shahadgh:${process.env.MONOGDB_PASSWORD}@cluster0.nbouy.mongodb.net/nadaDB`)
  // .connect(`mongodb://localhost:27017/restaurantDB`)
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch(error => {
    console.log("Error conneceting to MongoDB", error)
  })

  
const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/admins", admins)
app.use("/api/users", users )
app.use("/api/geners", geners )












const port = process.env.PORT || 5000

app.listen(port, () => console.log("server is listening on port " + port))