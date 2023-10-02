const Room = require('../models/Room')

const isOwner = (req, res, next) => {

    Room.findById(req.params.roomId)
        .populate('owner')
        .then((foundRoom) => {
            console.log('Found room ===>', foundRoom)
            console.log("User in session ===>", req.session.user)
            if (foundRoom.owner._id.toString() === req.session.user._id) {
                console.log("Match")
                next()
            } else {
                res.redirect('/rooms/all')
            }
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

}

module.exports = isOwner