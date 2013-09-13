/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('underscore'),
    randomString = require('random-string'),
    path = require('path'),
    fs = require('fs');

/**
 * Auth callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
    res.render('users/signin', {
        title: 'Signin',
        message: req.flash('error')
    });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User()
    });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
    res.redirect('/');
};

/**
 * Create user
 */
exports.create = function(req, res) {
    var user = new User(req.body);

    //user.provider = 'local';
    user.save(function(err) {
        if (err) {
            return res.render('users/signup', {
                errors: err.errors,
                user: user
            });
        }
        req.logIn(user, function(err) {
            if (err) {//res.render('error', {status: 500});
                console.log('ERROR:'+err);
                res.end(err);
            }
            return res.redirect('/');
        });
    });
};

/**
 * Common Friends with 2 users.
 */
exports.commonFriends = function(req, res) {
    //var user = new req.body;
    
    console.log('Common Friends');
    console.log(req.params.userId2);
    
    User
      .findOne({
          _id: req.params.userId
      })
      .exec(function(err, user) {
          if (err) return res.send(err);
          if (!user) return res.send('Failed to load User1 id = ' + id);
    
      User
        .findOne({
            _id: req.params.userId2
        })
        .exec(function(err, user2) {
            if (err) return res.send(err);
            if (!user2) return res.send('Failed to load User2 id = ' + id);
            req.profile = user2;
            console.log('U2');
            console.log(user2.friends);
            console.log('U1');
            console.log(req.user.friends);
            
            common = [];
            for (var i=0; i<user.friends.length; i++){
                for (var j=0; j<user2.friends.length; j++){
                    console.log(String(user.friends[i])+' == '+String(user2.friends[j]));
                    if (String(user.friends[i]) == String(user2.friends[j])){
                        common.push(String(user.friends[i]));
                        break;
                    }
                }
            }
            res.jsonp(common);
        });
        
      });
};


/**
 * Save one User's pic
 */
exports.addPic = function(req, res) {
  var user = req.user;
  var image =  req.files.userPhoto;
  var name = randomString();
  name = name + image.name;
  
  console.log('Pic name:' + name);
  
  console.log(image);
  //res.end();
  //return;
  var newImageLocation = path.join(__dirname, '../../public/pics', name);
  
  fs.readFile(image.path, function(err, data) {
        if (err) console.log('ERRO AO CARREGAR A IMAGEM'+err);
        fs.writeFile(newImageLocation, data, function(err) {
              if (err) console.log('ERRO AO SALVAR IMAGEM'+err);
              res.json(200, { 
                  src: 'pics/' + name,
                  size: image.size
              });
              
              user.pics.push(name);
              user.save();
              
        });
  });
};


/**
 * Update a user
 */
exports.update = function(req, res) {
    // The requested profile on HTTP Put will be replaced
    var old_user = req.profile;
    var old_friends = _.reduce(old_user.friends, 
                          function(last, now){
                            return last.concat(String(now));
                          }, []);
    
    var new_user = req.body;
    var new_friends = _.reduce(new_user.friends, 
                          function(last, now){
                            return last.concat(String(now));
                          }, []);
    

    
    user = _.extend(old_user, new_user);
    //console.log("USER:");
    //console.log(user)
    
    
    console.log("OLD_FRIENDS:");
    console.log(old_friends);
    console.log("NEW_FRIENDS:");
    console.log(new_friends);
    
    // CREATE A LIST WITH FRIENDS ADDED
    var added = [];
    for (var j=0; j<new_friends.length; j++){
      //console.log(new_friends[j]+'='+old_friends.indexOf(new_friends[j]))
      
      if (old_friends.indexOf(new_friends[j]) == -1)
        added.push(new_friends[j]);
    }
    console.log("ADDED:");
    console.log(added);
    // ADDING ME TO FRIENDLIST OF MY NEW FRIENDS
    _.each(added, function(id){
        User
          .findOne({
              _id: id
          })
          .exec(function(err, friend) {
              if (err) return console.log(err);
              if (!friend) return console.log('Failed to load User ' + id);
              console.log("ADDING ME TO:"+friend._id);
              friend.friends.push(user._id);
              friend.save(function(err) {
                  if (err) {
                      console.log('ERROR WHEN ADDINGM E TO:'+friend._id);
                      console.log(err);
                  }
                  else
                      console.log('WE ARE NEW FRIENDS!');
              });
          });
    });
    
    
    // CREATE A LIST WITH FRIENDS REMOVED
    var removed = [];
    for (var i=0; i<old_friends.length; i++){
      //console.log(old_friends[i]+'='+new_friends.indexOf(old_friends[i]))
      
      if (new_friends.indexOf(old_friends[i]) == -1)
        removed.push(old_friends[i]);
    }
    console.log("REMOVED:");
    console.log(removed);
    // REMOVING ME TO FRIENDLIST OF MY OLD FRIENDS
    _.each(removed, function(id){
        User
          .findOne({
              _id: id
          })
          .exec(function(err, friend) {
              if (err) return console.log(err);
              if (!friend) return console.log('Failed to load User ' + id);
              console.log("REMOVING ME TO:"+friend._id);
              
              new_friendlist = [];
              for (var i=0; i<friend.friends.length; i++){
                  if (String(friend.friends[i]) != String(user._id))
                    new_friendlist.push(friend.friends[i]);
              }
              friend.friends = new_friendlist;
              
              friend.save(function(err) {
                  if (err) {
                      console.log('ERROR WHEN REMOVING ME TO:'+friend._id);
                      console.log(err);
                  }
                  else
                      console.log('WE NO MORE FRIENDS!');
              });
          });
    });
    
    
    user.save(function(err) {
      if (err) {//res.render('error', {status: 500});
          console.log('ERROR:');
          console.log(err);
          res.end(err);
        }
        res.jsonp(user);
        console.log('TUDO OK!');
        //console.log(user);
    });
};


/**
 * All users
 */

exports.all = function(req, res) {
    User.find().sort('-created').exec(function(err, users) {
      if (err) {
          res.render('error', {
              status: 500
          });
      } else {
          res.jsonp(users);
      }
    });
};


/**
 *  Show profile
 */
exports.show = function(req, res) {
    var user = req.profile;
    res.jsonp(user || null);
};

/**
 * Send User
 */
exports.me = function(req, res) {
    var user = req.user;
    res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            console.log('DEBUG');
            //console.log(user.friends);
            //console.log(req.user.friends);
            
            // Check if is your friend. IT STILL STATELESS =)
            if (req.user.friends.indexOf(req.profile._id)!=-1){
              req.profile.yourFriend = true;
              console.log('Its your friend');
            }
            // Check if it is you.
            if (String(req.user._id) == String(req.profile._id)){
              req.profile.itsYou = true;
              console.log('Its you!');
            }
            
            next();
        });
};