'Use Strict';
angular.module('App').controller('splashController', function($rootScope, $scope, $state, $cordovaOauth, $localStorage, $log, $location, $http, $ionicPopup, $firebaseObject, $ionicSideMenuDelegate, Auth, FURL, Utils, $firebaseArray, $ionicScrollDelegate, $cordovaPreferences, $ionicPlatform) {
    jq(document).ready(function(e) {
        // jq('.splash_logo').addClass('is-active');
        window.localStorage["splash"] = "false";

        //No this is silly
        // Check if the user already did the tutorial and skip it if so
        if (window.localStorage['splash'] != undefined && window.localStorage['splash'] === "true") {
            console.log("inside if");
            document.getElementById("splash").style.display = "none";
            $location.path("/app/home");
        } else {
            console.log("inside else");
            //splash logo

            setTimeout(function() {
                jq('.splash_logo').addClass('is-active');
                console.log("inside timeout");
                window.localStorage['splash'] = "true";
                //       document.getElementById("splash").style.display = "none";
                setTimeout(function() {
                    $state.go("app.home");
                }, 1000);
                //  document.getElementById("mainContent").style.display = "block";

            }, 1200);
        }
    });
});