'Use Strict';
angular.module('App').controller('AppCtrl', function ($scope, $rootScope, $state, $timeout, $ionicSideMenuDelegate, $ionicLoading, $ionicModal, $ionicPopup, Auth, $location, $cordovaInAppBrowser, $cordovaSms, $cordovaSocialSharing, $cordovaPreferences, $ionicPlatform, $cordovaSQLite) {

    $scope.showLeftMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $rootScope.currentState = "app";
 /*   try {
        firebase.auth().onAuth(function (authData) {
            if (authData) {
                console.log("User " + authData.uid + " is logged in with " + authData.provider);
            } else {
                console.log("User is logged out");
            }
        });
    } catch (e) {
        alert("onauth " + e);
    }*/
  
  /*  $ionicPlatform.ready(function () {
        if (!$rootScope.currentUser) {
            $cordovaPreferences.fetch('userDetails')
            .success(function (value) {
                alert("inside SUCCESS");
                var userJSON = JSON.parse(value);
                $rootScope.currentUser = userJSON.user;
                $rootScope.currentUserKey = userJSON.key;
            })
            .error(function (error) {
                $rootScope.currentUser = null;
                $rootScope.currentUserKey = null;
                alert("Error no user in preferences: " + error);
            })
        }
    });
    $ionicPlatform.ready(function () {
        try {
            db = $cordovaSQLite.openDB({ name: "my.db" });
          //  db = $cordovaSQLite.openDB({ name: "appta.db", location: 2, createFromLocation: 1 });
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS USER_DETAILS (user text, key text)");
            alert("aap.js: " + db);
        } catch (e) {
            alert(e);
        }
    });
    */
    $scope.openLegalPrivacyPage = function () {
        var options = {
            "location": "yes",
            "zoom": "yes",
            "hardwareback": "yes"
        }
        $cordovaInAppBrowser.open('http://ngcordova.com', '_self', options)
      .then(function(event) {
          // success
      })
      .catch(function(event) {
          // error
      });
    }

  
    $scope.sms = {
        number: 6692342497,//4085972146,
        message: 'Type https://www.google.com for GOOGLE.'
    };
 
    var smsoptions = {
        replaceLineBreaks: true, // true to replace \n by a new line, false by default
        android: {
            intent: 'INTENT'  // send SMS with the default SMS app
            //intent: ''        // send SMS without open any other app
        }
    };
        $scope.sendSms=function(){
        console.log($scope.sms.number);
        console.log($scope.sms.message);

        $cordovaSocialSharing
        .share('Type https://www.google.com for GOOGLE.', 'Appta: Invite', null, null) // Share via native share sheet
        .then(function (result) {
            alert(result);
            // Success!
        }, function (err) {
            alert(err);
            // An error occured. Show a message to the user
        });

    
   /*     $cordovaSms
            .send($scope.sms.number, $scope.sms.message, smsoptions)
              .then(function() {
                  // Success! SMS was sent
                 alert('Success');
              }, function(error) {
                  // An error occurred
                  alert(error);
              });//then*/
    }//sendSms
    
    $scope.signOut = function () {
        Auth.logout();
        firebase.auth().signOut().then(function () {
            console.log('Signed Out');
            $rootScope.currentUser = null;
            $rootScope.currentUserKey = null;
        }, function (error) {
            console.error('Sign Out Error', error);
        });
       
        $location.path("/app");
        $ionicSideMenuDelegate.toggleLeft();
    };
}
);