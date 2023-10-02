var express = require('express');
var router = express.Router();

const Room = require('../models/Room')

const { isLoggedIn } = require('../middleware/route-guard')

router.get('/profile', isLoggedIn, (req, res, next) => {

  Room.find({
    owner: req.session.user._id
  })
  .then((rooms) => {
    console.log("Found rooms ==>", rooms)
    res.render('user/profile.hbs', {user: req.session.user, rooms: rooms})
  })
  .catch((err) => {
    console.log(err)
    next(err)
  })

})

module.exports = router;