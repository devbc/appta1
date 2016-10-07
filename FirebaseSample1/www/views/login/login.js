'Use Strict';
angular.module('App').controller('loginController', function ($rootScope, $scope, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup,$firebaseAuth , $firebaseObject,$log, Auth, FURL, Utils) {
    //var ref = new Firebase(FURL);
 // jq('.wrapper').css('min-height', window.innerHeight);

    //inputbox not_empty
  jq('.inputbox').each(function () {
      if (this.value) {
          jq(this).addClass('not_empty');
      } else {
          jq(this).removeClass('not_empty');
      }
  });
  $scope.inputChange = function () {
      if (this.value) {
          jq(this).addClass('not_empty');
      } else {
          jq(this).removeClass('not_empty');
      }
  };

  var auth = $firebaseAuth();
  //firebase.initializeApp(FURL);
  var ref = firebase.database().ref();
  var userkey = "";
  $scope.signIn = function (user) {
      alert("asas");
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
                          $rootScope.currentUserKey = key;
                       //   alert("usr:: " + JSON.stringify(usr));
                          break;
                      }
                  }
                //  alert(usr.name + " .... " + usr.handle + " .. " + usr.address);
                  $rootScope.currentUser = usr;
               /*   FCMPlugin.getToken(
                     function (token) {
                         alert(token);
                         var obj = $firebaseObject(ref.child("users").child($rootScope.currentUserKey));
                         obj.$loaded().then(function (data) {

                             obj.uToken = toek;
                             obj.$save().then(function (ref) {
                                 //     console.log(ref);
                                 alert("Token Updated Successfully.");
                                 $state.go('app.home');
                             }, function (error) {
                                 Utils.alertshow("Error:", error);
                             });
                         });
                     },
                     function (err) {
                         alert('error retrieving token: ' + err);
                     }
                   );*/
                  
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
});