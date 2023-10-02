const Room = require('../models/Room')

const canEdit = (req, res, next) => {

    Room.findById(req.params.roomId)
        .populate('owner')
        .then((foundRoom) => {
            console.log('Found room ===>', foundRoom)
            console.log("User in session ===>", req.session.user)
            if (foundRoom.owner._id.toString() === req.session.user._id) {
                console.log("Match")
                req.session.user.canEdit = true
                console.log("User after edit check", req.session.user)
                next()
            } else {
                req.session.user.canEdit = false
                console.log("User after edit check", req.session.user)
                next()
            }
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

}

module.exports = canEdit