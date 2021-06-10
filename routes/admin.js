const express = require('express')

const routerAdmin = express.Router()

routerAdmin.get('/', (req, res) => {
    res.send('Admin Router')
})
routerAdmin.get('/ecommerce/:id', (req, res) => {
    res.send(`Ecommerce ${req.params.id}`)
})

module.exports = routerAdmin