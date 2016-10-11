'Use Strict';

angular.module('App').controller('loginController', function($rootScope, $scope, $state, $cordovaOauth, $localStorage, $location, $http, $ionicPopup, $firebaseAuth, $firebaseObject, $log, Auth, FURL, Utils, $stateParams) {
    //var ref = new Firebase(FURL);
    // jq('.wrapper').css('min-height', window.innerHeight);

    $scope.transition = ""
    if ($rootScope.currentState == null) {
        $scope.transition = "app.home";
    } else {
        $scope.transition = $rootScope.currentState;
    }
    $rootScope.currentState = "login";
    $scope.user = {};
    //inputbox not_empty
    jq('.inputbox').each(function() {
        if (this.value) {
            jq(this).addClass('not_empty');
        } else {
            jq(this).removeClass('not_empty');
        }
    });
    /*$scope.inputChange = function() {
    
        if (this.value) {
            jq(this).addClass('not_empty');
        } else {
            jq(this).removeClass('not_empty');
        }
    };*/
    $scope.onchangeEmail = function() {
        if (jq("#email").val()) {
            jq("#email").addClass('not_empty');
        } else {
            jq("#email").removeClass('not_empty');
        }
    }

    $scope.onchangePassword = function() {
        if (jq("#pass").val()) {
            jq("#pass").addClass('not_empty');
        } else {
            jq("#pass").removeClass('not_empty');
        }
    }

    var auth = $firebaseAuth();
    var ref = firebase.database().ref();
    var userkey = "";

    $scope.validateEmail = function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    $scope.signIn = function(user) {

        if (jq("#email").val() == "" || jq("#email").val() == undefined) {
            jq("#email").parent().addClass('error');
            jq("#email").parent().removeClass('success');
            return false;
        }
        if (jq("#pass").val() == "" || jq("#pass").val() == undefined) {
            jq("#pass").parent().addClass('error');
            jq("#pass").parent().removeClass('success');
            return false;
        }
        if (!$scope.validateEmail(user.email)) {
            jq("#email").parent().addClass('error');
            jq("#email").parent().removeClass('success');
            Utils.alertshow("Error", "Please enter proper email.");
            return false;
        }

        if (angular.isDefined(user)) {
            Utils.show();
            Auth.login(user)
                .then(function(authData) {
                    $log.log("id del usuario:" + authData);
                    if (authData.emailVerified) {
                        Utils.hide();

                        var userId = authData.uid;

                        var x = firebase.database().ref('/users').orderByChild("email").equalTo(authData.email).once('value').then(function(snapshot) {
                            var user1 = snapshot.val();
                            var usr;
                            for (var key in user1) {
                                if (user1.hasOwnProperty(key)) {
                                    usr = user1[key];
                                    $rootScope.currentUserKey = key;
                                    break;
                                }
                            }
                            $rootScope.currentUser = usr;
                            FCMPlugin.getToken(
                                function(token) {
                                    alert(token + " ... " + $rootScope.currentUserKey);
                                    var obj = $firebaseObject(ref.child("users").child($rootScope.currentUserKey));
                                    obj.$loaded().then(function(data) {

                                        obj.uToken = token;
                                        obj.$save().then(function(ref) {
                                            //     console.log(ref);
                                            alert("Token Updated Successfully.");
                                            //   $state.go('app.home');
                                            $state.go($scope.transition);

                                        }, function(error) {
                                            Utils.alertshow("Error:", error);
                                        });
                                    });
                                },
                                function(err) {
                                    alert('error retrieving token: ' + err);
                                }
                            );

                            FCMPlugin.onNotification(
                                function(data) {
                                    alert(JSON.stringify(data));
                                    if (data.wasTapped) {
                                        //Notification was received on device tray and tapped by the user. 
                                        alert(JSON.stringify(data));
                                    } else {
                                        //Notification was received in foreground. Maybe the user needs to be notified. 
                                        alert(JSON.stringify(data));
                                        if (data.type == "offerQuestion") {
                                            alert("inside if");
                                            $location.go(data.url);
                                        }
                                    }
                                },
                                function(msg) {
                                    alert('onNotification callback successfully registered: ' + msg);
                                },
                                function(err) {
                                    alert('Error registering onNotification callback: ' + err);
                                }
                            );

                        });

                        //  $state.go('app.home');
                        $state.go($scope.transition);
                        $log.log("Starter page", "Home");
                    } else {
                        Utils.hide();
                        Utils.alertshow("Error", "Please verify your email.");
                        Auth.logout();
                    }
                }, function(err) {
                    Utils.hide();
                    Utils.errMessage(err);
                });
        }
    };
});