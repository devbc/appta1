'Use Strict';
angular.module('App').controller('registerController', function($scope, $state, $cordovaOauth, $localStorage, $location, $http, $ionicPopup, $firebaseObject, Auth, FURL, Utils, $firebaseArray) {
    //  alert(JSON.stringify(FURL));
    $scope.user = {};
    // firebase.initializeApp(FURL);
    jq('.inputbox').each(function() {
        if (this.value) {
            jq(this).addClass('not_empty');
        } else {
            jq(this).removeClass('not_empty');
        }
    });

    $scope.onchangeName = function() {
        if (jq("#name").val()) {
            jq("#name").addClass('not_empty');
        } else {
            jq("#name").removeClass('not_empty');
        }
    }

    $scope.onchangeHandle = function() {
        if (jq("#handle").val()) {
            jq("#handle").addClass('not_empty');
        } else {
            jq("#handle").removeClass('not_empty');
        }
    }

    $scope.onchangeEmail = function() {
        if (jq("#corporate-id").val()) {
            jq("#corporate-id").addClass('not_empty');
        } else {
            jq("#corporate-id").removeClass('not_empty');
        }
    }

    $scope.onchangeCompany = function() {
        if (jq("#corporate-id").val()) {
            jq("#corporate-id").addClass('not_empty');
        } else if (jq("#corporate-id").val() === 'none') {
            jq("#corporate-id").removeClass('not_empty');
        }
    }

    $scope.onchangePassword = function() {
        if (jq("#pass").val()) {
            jq("#pass").addClass('not_empty');
        } else {
            jq("#pass").removeClass('not_empty');
        }
    }

    $scope.onchangePhone = function() {
        if (jq("#phone").val()) {
            jq("#phone").addClass('not_empty');
        } else {
            jq("#phone").removeClass('not_empty');
        }
    }

    $scope.domainList = [];
    var orgs = $firebaseArray(firebase.database().ref().child("organizations"));
    orgs.$loaded().then(function(res) {
        $scope.domainList = res;
    });

    $scope.addToken = function(key) {

        FCMPlugin.getToken(
            function(token) {
                alert(token);
                alert($rootScope.currentUserKey);
                var obj = $firebaseObject(ref.child("users").child($rootScope.currentUserKey));
                obj.$loaded().then(function(data) {
                    alert("loaded   " + token);
                    obj.uToken = token;
                    obj.$save().then(function(ref) {
                        //     console.log(ref);
                        alert("Token Updated Successfully.");
                        //    $state.go('app.home');
                        return;
                    }, function(error) {
                        Utils.alertshow("Error:", error);
                    });
                });
            },
            function(err) {
                alert('error retrieving token: ' + err);
            }
        );

    }

    $scope.register = function(user) {
        if (angular.isDefined(user)) {
            Utils.show();
            if (!$scope.validateForm(user)) {
                Utils.hide();
                return false;
            } else {
                $scope.handleExists(user);
            }
        }
    };

    $scope.registerUser = function(user) {
        user.email = user.email + '@' + JSON.parse(user.emailDomain).domain;
        Auth.register(user)
            .then(function() {
                Utils.hide();
                console.log("Antes de loguear:" + JSON.stringify(user));
                Utils.alertshow("Successfully", "The User was Successfully Created. Please verify your email to login.");
                $location.path('/login');
            }, function(err) {
                Utils.hide();
                Utils.errMessage(err);
            });
    }

    function findElement(arr, propValue) {
        for (var i = 0; i < arr.length; i++) {
            alert(arr[i].domain + " .. " + propValue);
            if (arr[i].domain == propValue) {
                return arr[i];
            }
        }
    }

    $scope.handleExists = function(user) {
        var x = firebase.database().ref('/users').orderByChild("handle").equalTo(user.handle).once('value', function(snapshot) {
            var userData = snapshot.val();
            if (userData) {
                Utils.alertshow("Error:", "There is already a handle that matches yours: " + user.handle);
                console.log("Handle Exists!");
                Utils.hide();
                return false;
            } else {
                $scope.registerUser(user)

            }
        });

        return true;
    }

    $scope.validateForm = function(user) {

        if (jq("#name").val() == "" || jq("#name").val() == undefined) {
            jq("#name").parent().addClass('error');
            jq("#name").parent().removeClass('success');
            return false;
        }
        if (jq("#handle").val() == "" || jq("#handle").val() == undefined) {
            jq("#handle").parent().addClass('error');
            jq("#handle").parent().removeClass('success');
            return false;
        }
        if (jq("#corporate-id").val() == "" || jq("#corporate-id").val() == undefined) {
            jq("#corporate-id").parent().addClass('error');
            jq("#corporate-id").parent().removeClass('success');
            return false;
        }
        if (jq("#pass").val() == "" || jq("#pass").val() == undefined) {
            jq("#pass").parent().addClass('error');
            jq("#pass").parent().removeClass('success');
            return false;
        }
        if (jq("#phone").val() == "" || jq("#phone").val() == undefined) {
            jq("#phone").parent().addClass('error');
            jq("#phone").parent().removeClass('success');
            return false;
        }
        if (user.emailDomain === 'none') {
            Utils.alertshow("Error", "Please select email domain.");
            return false;
        }
        if (!$scope.validateEmail(user.email + '@' + JSON.parse(user.emailDomain).domain)) {
            Utils.alertshow("Error", "Please enter proper email.");
            return false;
        }
        return true;
    }
    $scope.validateEmail = function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

});