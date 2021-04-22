const express =  require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelEmail} = require('../emails/accounts')

const router = new express.Router()



//writing to db using post. get is used to read from db
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
})

// login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        // res.send({user: user.getPublicProfile(), token})
        res.send({user, token})
    } catch(e) {
        res.status(400).send()
    }
})

//logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) =>{
            console.log(token.token != req.token)
            return token.token != req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//logout all session
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens =[]
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me',auth , async (req, res) => {
    // try {
    //     const users = await User.find({})
    //     res.send(users)
    // }catch (e) {
    //     res.status(500).send()
    // }

    res.send(req.user)
})

//for fetching single item by its id
// router.get('/users/:id', async (req,res) => {
//     const _id = req.params.id       //req.params hold the values we provided through express route  parameters.

//     try {
//         const user = await User.findById(_id)

//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch(e) {
//         res.status(500).send()
//     }
// })

//updating user
//patch is an http method used for updating an existing resource
//every returns false if any one match is flase
router.patch('/users/me', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if (!isValidOperation) {
        return res.status(400).send({error : 'invalid updates!'})
    }

    try {
        const user = await User.findById(req.user._id)

        updates.forEach((update) => {
            req.user[update] =req.body[update]
        })

        await req.user.save()

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

        // if (!user) {
        //     return res.status(404).send()
        // }
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Deleting user
router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id) // here we are able to access user from req, since we pass auth middleware. we have added user objct to req in auth function.

        // if(!user) {
        //     return res.status(404).send()
        // }

        await req.user.remove()
        sendCancelEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e){
        res.status(500).send()
    }
})

const upload = multer({   
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('only jpg, jpeg, png allowed'))
        }

        cb(undefined, true)
    }
})

//upload image
router.post('/users/me/avatar', auth, upload.single('avatar') , async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width:250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

//delete image
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//image router
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar) {
            throw new Error()
        }
        //setting response header
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router