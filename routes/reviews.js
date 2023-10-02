var express = require('express');
var router = express.Router();

const Review = require('../models/Review')
const Room = require('../models/Room')

const { isLoggedIn } = require('../middleware/route-guard')

const isNotOwner = require('../middleware/isNotOwner')

router.post('/new/:roomId', isLoggedIn, isNotOwner, (req, res, next) => {

    Review.create({
        user: req.session.user._id,
        comment: req.body.comment
    })
    .then((newReview) => {
        return Room.findByIdAndUpdate(
            req.params.roomId,
            {
                $push: {reviews: newReview._id}
            },
            {new: true}
        )
    })
    .then((roomAfterReview) => {
        console.log("Room after review ===>", roomAfterReview)
        res.redirect(`/rooms/details/${roomAfterReview._id}`)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })


})

module.exports = router;