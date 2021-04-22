const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description : {
        type: String,
        required: true,
        trim: true
    },
    completed : {
        type: Boolean,
        default: false
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'  // we are creating a reference to tanother model. User is the name of model is used inside mongoose.model('User', userSchema)
    }
}, {
    timestamps: true
})


const Task = mongoose.model('Task', taskSchema)

module.exports = Task