angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', 'Users', function ($scope, Global, Users) {
    $scope.global = Global;

    $scope.menu = [{
        "title": "Users",
        "link": "users"
    }];
    
    
    $scope.findMe = function() {
        Users.get({
            userId: 'me'
        }, function(user) {
            if (typeof user._id != 'undefined'){
                $scope.global.user = user;
                $scope.global.authenticated = true;
                console.log("GET USER BY HEADERCONTROLLER!");
                console.log($scope.global.user);
            }
        });
    };
}]);