var express = require('express');
var router = express.Router();

const Room = require('../models/Room')

const { isLoggedIn } = require('../middleware/route-guard')

const isOwner = require('../middleware/isOwner')

const canEdit = require('../middleware/canEdit')


router.get('/all', (req, res, next) => {

    Room.find()
    .populate('owner')
    .then((rooms) => {
        console.log("Found rooms ===>", rooms)
        res.render('rooms/all-rooms.hbs', { rooms })
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

router.get('/new', isLoggedIn, (req, res, next) => {

    res.render('rooms/new-room.hbs')
    
})

router.post('/new', isLoggedIn, (req, res, next) => {

    const { name, description, imageUrl } = req.body

    Room.create({
        name,
        description,
        imageUrl,
        owner: req.session.user._id
    })
    .then((createdRoom) => {
        console.log("New room ===>", createdRoom)
        res.redirect('/rooms/all')
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

router.get('/details/:roomId', isLoggedIn, canEdit, (req, res, next) => {

    Room.findById(req.params.roomId)
    .populate('owner')
    .populate({
        path: 'reviews',
        populate: {path: 'user'}
    })
    .then((room) => {

        console.log("Found room ===>", room)
        res.render('rooms/room-details.hbs', {room, canEdit: req.session.user.canEdit, reviews: room.reviews})
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

router.get('/edit/:roomId', isLoggedIn, isOwner, (req, res, next) => {

    Room.findById(req.params.roomId)
    .then((room) => {
        console.log("Found room ===>", room)
        res.render('rooms/edit-room.hbs', room)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

router.post('/edit/:roomId', isLoggedIn, isOwner, (req, res, next) => {

    Room.findByIdAndUpdate(
        req.params.roomId,
        req.body,
        {new: true}
        )
        .then((updatedRoom) => {
            console.log("Room after update", updatedRoom)
            res.redirect(`/rooms/details/${updatedRoom._id}`)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

router.get('/delete/:roomId', isLoggedIn, isOwner, (req, res, next) => {

    Room.findByIdAndRemove(req.params.roomId)
        .then((deletedRoom) => {
            console.log("Deleted room ==>", deletedRoom)
            res.redirect('/rooms/all')
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

module.exports = router;