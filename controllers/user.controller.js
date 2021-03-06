/* user.controller.js - User object controller functions
    - get a user's details
    - update a user's details (NOT USED)
    - delete a user (NOT USED)

    Author: Austin Hess
*/

const User                  = require ("../models/user.model"),
      Movie                 = require('../models/movie.model'),
      UserRating            = require('../models/user_rating.model'),
      request               = require('request-promise-native');
module.exports = {

    get_user_profile: function (req, res) {
        console.log(req.user);
        User.findOne({'_id': req.user._id})
        .populate('ratings')
        .exec(function (err, user) {
            if (err) return res.send(err);
            var movieIds = [];
            user.ratings.forEach(function(obj) {
                movieIds.push(obj.movie);
            });
            Movie.find({'_id': {$in: movieIds}})
            .exec(function(err, movs) {
                if(err) return res.send(err);
                console.log(movs);
                return res.render('pages/profile', {user: req.user, movies: movs});
            });
        });

    },

    update_user: function (req, res) {
        User.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, user) {
            if (err) return next(err);
            res.send('User updated');
        });
    },

    delete_user: function (req, res) {
        User.findByIdAndRemove(req.params.id, function(err) {
            if (err) return next(err);
            res.send('Deleted user succesfully');
        });
    },
}
