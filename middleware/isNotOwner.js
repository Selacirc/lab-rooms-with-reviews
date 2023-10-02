const Room = require('../models/Room')

const isNotOwner = (req, res, next) => {

    Room.findById(req.params.roomId)
        .populate('owner')
        .then((foundRoom) => {
            console.log('Found room ===>', foundRoom)
            console.log("User in session ===>", req.session.user)
            if (foundRoom.owner._id.toString() !== req.session.user._id) {
                console.log("Can review")
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

module.exports = isNotOwner