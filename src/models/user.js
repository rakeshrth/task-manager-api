const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')


const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type : String,
        unique: true,
        required : true,
        trim: true,
        lowercase: true, 
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('EMAIL IS NOt valid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')){
                throw new Error('password cannot contain "PASSWORD')
            }
        }
    },
    age: {
        type: Number,
        default : 0,
        validate(value) {
            if (value <0) {
                throw new Error('age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

//virtual property. it is a relation btw two collections.first arg is property name.
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// userSchema.methods.getPublicProfile = function () {
    //used to remove password and token from response
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user){
        throw new Error('unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error("Unable to login")
    }

    return user
}

//hashes the plain text password before saving
// mongoose middleware. pre means before.cant use arrow function here since arrow function doesnt bind "this"
userSchema.pre('save', async function (next){
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    // is called to tell the program that running is over.
    next()
})

//Deelte user tasks when user is deleted.
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id})
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User