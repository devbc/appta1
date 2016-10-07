'Use Strict';
angular.module('App').controller('registerController', function ($scope, $state, $cordovaOauth, $localStorage, $location, $http, $ionicPopup, $firebaseObject, Auth, FURL, Utils, $firebaseArray) {
    //  alert(JSON.stringify(FURL));
  
   // firebase.initializeApp(FURL);

    $scope.domainList = [];
    var orgs = $firebaseArray(firebase.database().ref().child("organizations"));
    orgs.$loaded().then(function (res) {
        $scope.domainList = res;
    });

    $scope.addToken = function (key) {

        FCMPlugin.getToken(
                  function (token) {
                      alert(token);
                      alert($rootScope.currentUserKey);
                      var obj = $firebaseObject(ref.child("users").child($rootScope.currentUserKey));
                      obj.$loaded().then(function (data) {
                          alert("loaded   " + token);
                          obj.uToken = token;
                          obj.$save().then(function (ref) {
                              //     console.log(ref);
                              alert("Token Updated Successfully.");
                              //    $state.go('app.home');
                              return;
                          }, function (error) {
                              Utils.alertshow("Error:", error);
                          });
                      });
                  },
                  function (err) {
                      alert('error retrieving token: ' + err);
                  }
                );

    }

  $scope.register = function(user) {
    if(angular.isDefined(user)){
        Utils.show();
     user.email = user.email + '@' + JSON.parse(user.emailDomain).domain;

    Auth.register(user)
      .then(function() {
         Utils.hide();
         console.log("Antes de loguear:" + JSON.stringify(user));
         Utils.alertshow("Successfully","The User was Successfully Created. Please verify your email to login.");
         $location.path('/login');
      }, function(err) {
         Utils.hide();
         Utils.errMessage(err);
      });
    }
  };


  function findElement(arr, propValue) {
      for (var i = 0; i < arr.length; i++) {
          alert(arr[i].domain + " .. " + propValue);
          if (arr[i].domain == propValue) {
              return arr[i];
          }
      }
  }

}
);
