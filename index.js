const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/postgres'
const sequelize = new Sequelize(connectionString, { define: { timestamps: false } });
const port = process.env.PORT || 4000

app.use(bodyParser.json())

//create the houses table in your database when your app starts
const House = sequelize.define('house', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    size: Sequelize.INTEGER,
    price: Sequelize.INTEGER
}, {
        tableName: 'houses'
    }
)

House.sync()

//Read all the houses in the databse = GET
app.get('/houses', function (req, res, next) {
    House.findAll()
        .then(houses => {
            res.json({ houses: houses })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Something went wrong',
                error: err
            })
        })
})

//Read the house by its id = GET
app.get('/houses/:id', function (req, res, next) {
    const id = req.params.id
    House.findById(id)
        .then(house => {
            if (!house) {
                return res
                    .status(404)
                    .json({message: 'Not found!'})
            }
            res.json(house)
        })
        .catch(err => {
            res
                .status(500)
                .json({
                    message: 'Something went wrong',
                    error: err
                })
        })
})

//Create a new house = POST
app.post('/houses', function (req, res) {
    
    House
        .create(req.body)
        .then(house => {
            res
            .status(201)
            .json(house)
        })
        .catch(err => {
            res
                .status(500)
                .json({
                message: 'Something went wrong',
                error: err
                })
        })
})

//Update information of a house = PUT or PATCH
app.put('/houses/:id', function (req, res) {
    const id = req.params.id
    House.findById(id)
        .then(house => {
            if (!house) {
                return res
                    .status(404)
                    .json({message: 'The house is not existed!'})
            }
            house.update(req.body)
                .then(updatedHouse => res
                    .status(200)
                    .json({ house: updatedHouse })
                )
        })
        .catch(error => {
            res
                .status(500)
                .json({ 
                    message: 'Something went wrong',
                    error: error
                })
        })
})

//Delete a house = DELETE
app.delete('/houses/:id', function (req, res) {
    const id = req.params.id
    House.findById(id)
        .then(house => {
            if (!house) {
                return res
                    .status(404)
                    .json({ message: 'House not found'})
            }
            house.destroy()
                .then(_ => res
                    .status(204)
                    .json({ message: 'House destroyed' })
                )
        })
        .catch(err => {
            res
                .status(500)
                .json({
                    message: 'Something wrong',
                    error: err
                })
        })
})

app.listen(port, function () {
    console.log('Web server listening on port')
})