const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

const secretKey = 'yoursecrectkey(fgreg)'


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




// App Gets
app.get('/allecommerces', (req, res) => {
    res.send('All Ecommerces')
})

// App Posts
app.post('/newUser', async (req, res) => {
    if (req.body.name === null || req.body.password === null || req.body.name.length < 5 || req.body.password.length < 3) {
        return res.json({ status: 'Very short name or password' })
    }
    // Criptografando a senha
    await bcrypt.hash(req.body.password, 10, (errBcrypt, passHash) => {
        if (errBcrypt) { return res.send('Error with crypt') }

        const User = new newUser({
            userName: req.body.name,
            userPassword: passHash
        }).save()
            .then(() => {
                res.status(200).json({ status: "User Created" });
            })
            .catch(() => {
                res.json({ status: "Already have a user with that name" });
            })
    })
})
// Login
app.post('/login', async (req, res) => {
    const name = req.body.name
    const password = req.body.password

    const user = await newUser.findOne({ userName: name })

    if (user) {
        const validPass = await bcrypt.compare(password, user.userPassword)
        if (!validPass) {
            return res.json({ message: "Invalid Password" });
        } else {
            let token = jwt.sign({ userId: user._id }, secretKey)

            return res.status(200).json({
                message: "Login successfully",
                token,
                user: user.userName
            });
        }
    } else {
        return res.json({ message: "User does not exist" });
    }
})

app.post('/userverify', async (req, res) => {
    const token = req.body.token

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.json(err)
        }

        newUser.findOne({ _id: decoded.userId }, (err, user) => {
            if (err) {
                return
            }
            return res.json({
                title: 'User Logado!',
                user: user.userName
            })
        })
    })
})

app.post('/myecommerce', async (req, res) => {
    if (req.body.token === null) {
        return
    }

    let token = req.body.token

    await jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.json(err)
        }

        newUser.findOne({ _id: decoded.userId }, (err, user) => {
            if (err) {
                return
            } else {
                res.status(200).json({
                    myecommerces: user.userEcommerces
                })
            }
        })
    })
})
app.post('/newecommerce', async (req, res) => {
    if (req.body.token === null) {
        return
    }

    let token = req.body.token

    let nameCommerce = req.body.nameCommerce
    let descriptionCommerce = req.body.descriptionCommerce
    let typeCommerce = req.body.typeCommerce
    let lastUpdate = req.body.lastUpdate
    let urlPhoto = req.body.urlPhoto


    await jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.json(err)
        }

        newUser.findOne({ _id: decoded.userId }, (err, user) => {
            if (err) {
                return
            } else {

                const Ecommerce = new newEcommerce({
                    nameCommerce,
                    descriptionCommerce,
                    typeCommerce,
                    lastUpdate,
                    urlPhoto,
                    user: user.userName

                }).save()

                newUser.updateOne({ _id: decoded.userId },
                    {
                        userEcommerces: [
                            ...user.userEcommerces,
                            {
                                nameCommerce,
                                descriptionCommerce,
                                typeCommerce,
                                urlPhoto
                            }
                        ]
                    })
                    .then(() => res.json({status: 'New Ecommerce Created!'}))
            }
        })
    })
})


























// Mongoose Connect
mongoose.connect('mongodb://localhost/ecommerce')
    .then(() => console.log('Mongo Connect!'))
    .catch(() => console.log('Error Mongo'))


// Escutar na porta 8888
app.listen(8888, () => {
    console.log('Server Run!')
})