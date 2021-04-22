//this is where we initialize the express server.

const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT 


//this automatically parse incoming json to an object so we can access it in our request handlers
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Server is up at port : ' + port)
})


// const Task = require('./models/task')
// const User =  require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('606715293c9e0e0590b33404')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)
//     const user = await User.findById('606713bcbde35922a89e2064')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()

//middleware
// app.use((req,res, next) =>{
//     if (req.method == "GET"){
//         res.send("get is disabled")
//     } else {
//         next()
//     }
// })

// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error('please upload a word'))
//         } 

//         cb(undefined, true)


//         // cb(new Error('File must be a pdf'))
//         // cb(undefined, true)
//         // cb(undefined, false)
//     }
// })


// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({error: error.message})
// })