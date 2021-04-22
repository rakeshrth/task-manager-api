const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})



//task model



// //creating instance of task
// const task = new Task({
//     description : '    eat lunch',
//     completed: false
// })

// task.save().then((task) => {
//     console.log(task)
// }).catch((error) => {
//     console.log(error)
// })

