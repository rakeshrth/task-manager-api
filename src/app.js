//this is where we initialize the express server. for testing purpose we use app.js

const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()



//this automatically parse incoming json to an object so we can access it in our request handlers
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


module.exports = app