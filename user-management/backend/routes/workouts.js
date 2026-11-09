const express = require('express')


const router = express.Router()

//GET all workouts (READ)
router.get('/', (req, res) => {
    res.json({mssg: 'GET all workouts'})
})

// GET single workout (READ)
router.get('/:id',(req, res) =>{
    res.json({mssg: 'GET single workouts'})
})

// POST a new workout (CREATE)
router.post('/', (req, res) => {
    res.json({mssg: 'POST a new workout'})
})

//DELETE a workout (DELETE)
router.delete('/:id', (req, res) => {
    res.json({mssg: 'DELETE a workout'})
})

//UPDATE a new workout (UPDATE)
router.patch('/:id', (req, res) => {
    res.json({mssg: 'UPDATE a workout'})
})




module.exports = router