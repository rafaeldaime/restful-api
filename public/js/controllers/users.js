angular.module('mean.users').controller('UsersController', ['$scope', '$routeParams', '$location', 'Global', 'Users', function ($scope, $routeParams, $location, Global, Users) {
    $scope.global = Global;

    $scope.create = function() {
        var user = new Users({
            title: this.title,
            content: this.content
        });
        user.$save(function(response) {
            $location.path("users/" + response._id);
        });

        this.title = "";
        this.content = "";
    };

    $scope.remove = function(user) {
        user.$remove();  

        for (var i in $scope.users) {
            if ($scope.users[i] == user) {
                $scope.users.splice(i, 1);
            }
        }
    };

    $scope.update = function() {
        var user = $scope.user;
        alert('UPDATE USER NOT UTILIZED');
        /*
        if (!user.updated) {
            user.updated = [];
        }
        user.updated.push(new Date().getTime());

        user.$update(function() {
            $location.path('users/' + user._id);
        });*/
    };
    
    // It is used to add a new friend.
    $scope.addFriend = function() {
        var user = $scope.global.user;
        
        
        if (!user.updated) {
            user.updated = [];
        }
        user.updated.push(new Date().getTime());
        
        
        user.friends.push($scope.profile._id);
        

        user.$update(function(user) {
            console.log("You have a new friend now!");
            // UPDATE THE CURRENT PROFILE
            $scope.findOne();
            
        });
                
    };
    
    
    
    // It is used to remove a friend.
    $scope.removeFriend = function() {
        profile = $scope.profile;
        var user = $scope.global.user;
        
        
        if (!user.updated) {
            user.updated = [];
        }
        user.updated.push(new Date().getTime());
        
        
        var friends = [];
        for (var i in user.friends) {
            if (user.friends[i] != profile._id) {
                friends.push(user.friends[i]);
            }
        }
        user.friends = friends;
        
        
        
        user.$update(function () {
            console.log("He is not your friend anymore!");
            // UPDATE THE CURRENT PROFILE
            $scope.findOne();
        });
        
        
    };

    

    $scope.find = function(query) {
        Users.query(query, function(users) {
            $scope.users = users;
        });
    };

    
    $scope.findOne = function() {
        Users.get({
            userId: $routeParams.userId
        }, function(profile) {
            $scope.profile = profile;
            console.log("PROFILE BY USERCONTROLE.FINDONE!");
            console.log($scope.profile);
            
            var user = $scope.global.user;
            
            // ADDING THE FRIENDS IN COMMON AT .commonFriends
            common = [];
            if (user){ // We don't know if USER is already ready
                for (var i=0; i<user.friends.length; i++){
                    for (var j=0; j<profile.friends.length; j++){
                        //console.log(String(user.friends[i])+' == '+String(profile.friends[j]));
                        if (String(user.friends[i]) == String(profile.friends[j])){
                            common.push(String(user.friends[i]));
                            break;
                        }
                    }
                }
            }
            $scope.profile.commonFriends = common;
            
            
            
        });
    };
}]);