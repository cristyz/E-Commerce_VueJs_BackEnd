const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const app = express()

// Models
    const newEcommerce = require('./model/modelEcommerce')
    const newUser = require('./model/modelUser')

// Middleware
    app.use(express.urlencoded({ extended: false }))
    app.use(express.json());
    app.use(cors());

// Routes
    // Admin Router
        const routerAdmin = require('./routes/admin')
        app.use('/admin', routerAdmin)

// Mongoose Connect
    mongoose.connect('mongodb://localhost/ecommerce')
        .then(() => console.log('Mongo Connect!'))
        .catch(() => console.log('Error Mongo'))


// App Gets
app.get('/allecommerces', (req, res) => {
    res.send('All Ecommerces')
})
// App Posts
app.post('/newEcommerce', (req, res) => {
    const Ecommerce = new newEcommerce({
        nameCommerce: req.body.name,
        descriptionCommerce: req.body.description,
        typeCommerce: req.body.type,
        lastUpdate: req.body.dateNow,
        urlPhoto: req.body.urlPhoto,

    }).save()
        .then(() => {
            res.send('New Ecommerce Save!')
        })
        .catch((err) => {
            res.send('Error in new Ecommerce ' + err)
        })
})
app.post('/newUser', async(req, res) => {
    if (req.body.name === null || req.body.password === null || req.body.name.length < 5 || req.body.password.length < 3) {
        return res.json({status: 'Very short name or password'})
    }
    // Criptografando a senha
    await bcrypt.hash(req.body.password, 15, (errBcrypt, passHash) => {
        if (errBcrypt) {return res.json('Error with crypt')}

        const User = new newUser({
            userName: req.body.name,
            userPassword: passHash
        }).save()
            .then(() => {
                res.status(200).json({ status: "User Created" });
            })
            .catch((err) => {
                res.json({ status: "Already have a user with that name" });
            })
    })
})
// Login
app.post('/login', async(req, res) => {
    const name = req.body.name
    const password = req.body.password

    const user = await newUser.findOne({userName: name})

    if (user) {
        const validPass = await bcrypt.compare(password, user.userPassword)
        if (validPass) {
            res.status(200).json({ message: "Valid password" });
        } else {
            res.status(400).json({ error: "Invalid Password" });
        }
    } else {
        res.status(401).json({ error: "User does not exist" });
    }
})
































app.listen(8888, () => {
    console.log('Server Run!')
})