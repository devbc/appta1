'Use Strict';
angular.module('App').controller('forgotController', function ($scope, $state, $cordovaOauth, $localStorage, $location, $http, $ionicPopup, $firebaseObject, Auth, FURL, Utils, $rootScope) {

    $scope.user = {};
    $rootScope.currentState = "forgot";

    jq('.inputbox').each(function() {
        if (this.value) {
            jq(this).addClass('not_empty');
        } else {
            jq(this).removeClass('not_empty');
        }
    });

    $scope.onchangeEmail = function() {
        if (jq("#email").val()) {
            jq("#email").addClass('not_empty');
        } else {
            jq("#email").removeClass('not_empty');
        }
    }

    $scope.validateEmail = function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    $scope.resetpassword = function(user) {
        if (jq("#email").val() == "" || jq("#email").val() == undefined) {
            jq("#email").parent().addClass('error');
            jq("#email").parent().removeClass('success');
            return false;
        }

        if (!$scope.validateEmail(user.email)) {
            jq("#email").parent().addClass('error');
            jq("#email").parent().removeClass('success');
            Utils.alertshow("Error", "Please enter proper email.");
            return false;
        }
        if (angular.isDefined(user)) {
            Auth.resetpassword(user.email)
                .then(function() {
                    console.log("Password reset email sent successfully!");
                    $location.path('/login');
                }, function(err) {
                    //console.error("Error: ", err);
                    Utils.alertshow("Error", err);
                });
        }
    };
});