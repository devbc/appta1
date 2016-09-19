'Use Strict';
angular.module('App').controller('AppCtrl', function ($scope, $rootScope, $state, $timeout, $ionicSideMenuDelegate, $ionicLoading, $ionicModal, $ionicPopup, Auth, $location, $cordovaInAppBrowser, $cordovaSms, $cordovaSocialSharing) {

    $scope.showLeftMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };

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
        }, function (error) {
            console.error('Sign Out Error', error);
        });
       
        $location.path("/app");
        $ionicSideMenuDelegate.toggleLeft();
    };
}
);