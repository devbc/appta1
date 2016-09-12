'Use Strict';
angular.module('App').controller('loginController', function ($rootScope, $scope, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup,$firebaseAuth , $firebaseObject,$log, Auth, FURL, Utils) {
  //var ref = new Firebase(FURL);
  var auth = $firebaseAuth();
  //firebase.initializeApp(FURL);
  var ref = firebase.database().ref();
  var userkey = "";
  $scope.signIn = function (user) {
    $log.log("Enviado");
    if(angular.isDefined(user)){
    Utils.show();
    Auth.login(user)
      .then(function (authData) {
          $log.log("id del usuario:" + authData);
          if (authData.emailVerified) {
              Utils.hide();
             // alert(JSON.stringify(firebase.user));
              /*var user1 = auth.currentUser;
              alert(JSON.stringify(user1));
              alert(user1.name + " .... " + user1.handle + " .. "  + user1.address);*/
              var userId = authData.uid;
            //  alert(userId);
           //   ref.orderByChild("height").equalTo(25)
              var x = firebase.database().ref('/users').orderByChild("email").equalTo(authData.email).once('value').then(function (snapshot) {
                  var user1 = snapshot.val();
                  var usr;
               //   alert("user1:: " + JSON.stringify(user1));
                  for (var key in user1) {
                      if (user1.hasOwnProperty(key)) {
                          usr = user1[key];
                       //   alert("usr:: " + JSON.stringify(usr));
                          break;
                      }
                  }
                //  alert(usr.name + " .... " + usr.handle + " .. " + usr.address);
                  $rootScope.currentUser = usr;
              });

          /*    var ref1 = firebase.database().ref('/users');
              ref1.once("value", function (snapshot) {
                  // The callback function will get called twice, once for "fred" and once for "barney"
                  snapshot.forEach(function (childSnapshot) {
                      // key will be "fred" the first time and "barney" the second time
                      alert("forEach: "+JSON.stringify(childSnapshot.val()));

                 //     var key = childSnapshot.key();
                      // childData will be the actual contents of the child
                   //   var childData = childSnapshot.val();
                    //  alert(JSON.stringify(childData));
                  });
              });*/
              $state.go('app.home');
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
  
/* SEEMS NOT WORKING WELL

  $scope.loginWithGoogle =  function(){
  var provider = new firebase.auth.GoogleAuthProvider();

 firebase.auth().signInWithPopup(provider).then(function(result) {

    $log.log("Authenticated successfully with payload:", angular.toJson(result));
    $state.go('home');
  
  })
  .catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
  $log.error("error:", angular.toJson(error));
});
  ;
  };

*/

/* SEEMS NOT WORKING WELL
  $scope.loginWithFacebook =  function(){
    var provider = new firebase.auth.FacebookAuthProvider();

 firebase.auth().signInWithPopup(provider).then(function(result) {

    $log.log("Authenticated successfully with payload:", angular.toJson(result));
    $state.go('home');
  
  })
  .catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
  $log.error("error:", angular.toJson(error));
});
  ;
  };
  */
  
/* SEEMS NOT WORKING WELL
  $scope.loginWithTwitter =  function(){
    var provider = new firebase.auth.FacebookAuthProvider();

 firebase.auth().signInWithPopup(provider).then(function(result) {

    $log.log("Authenticated successfully with payload:", angular.toJson(result));
    $state.go('home');
  
  })
  .catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
  $log.error("error:", angular.toJson(error));
});
  ;
  };
*/

});