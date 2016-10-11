'Use Strict';
angular.module('App').controller('offerListController', function ($rootScope, $scope, $state, $cordovaOauth, $localStorage, $location, $http,
    $ionicPopup, $firebaseObject, Auth, FURL, Utils, $firebaseArray, $ionicSlideBoxDelegate, $cordovaCamera, $cordovaGeolocation, $stateParams, $cordovaSms) {
    console.log("INSIDE OFFERLIST")
    console.log($stateParams);
    $scope.itemId = $stateParams.itemId;

    $rootScope.currentState = "/offers/"+$scope.itemId;

    $scope.displayFirst = true;
    $scope.replyDiv = false;
    $scope.item = {};
    $scope.replyQues = {};
    $scope.reply = "";

    $scope.sms = {};

    $scope.offerBtnText = "Offers";
    $scope.questionBtnText = "Questions";
    
    $scope.itemHeight = 120;
    $scope.myItems = [];
    $scope.items = [];
    $scope.offers = [];
    $scope.questions = [];

    var ref = firebase.database().ref();

    var obj = $firebaseObject(ref.child("items").child($scope.itemId));
    obj.$loaded().then(function (data) {
        $scope.item = data;
        console.log(data);
    });


    $scope.offersList = $firebaseArray(firebase.database().ref().child("offers").orderByChild("itemId").equalTo($scope.itemId));
    $scope.offersList.$loaded()
      .then(function (x) {
          var offerorIds = [];
          $scope.offerBtnText = $scope.offersList.length + " Offers";
         /* for (var i = 0; i < $scope.offersList.length; i++)
              offerorIds.push($scope.offersList[i].itemId);*/
          $scope.getOfferorInfo($scope.offersList);
      })
  .catch(function (error) {
      console.log("Error:", error);
  });

    $scope.questionsList = $firebaseArray(firebase.database().ref().child("questions").orderByChild("itemId").equalTo($scope.itemId));
    $scope.questionsList.$loaded()
        .then(function (x) {
            $scope.questionBtnText = $scope.questionsList.length + " Questions";
            $scope.getQuestionerInfo($scope.questionsList);
        })
    .catch(function (error) {
        console.log("Error:", error);
    });

    $scope.displayQuestions = function () {
        $scope.displayFirst = false;
    }

    $scope.displayOffers = function () {
        $scope.displayFirst = true;
    }

    $scope.getOfferorInfo = function(offerorIds) {
        for (var i = 0; i < offerorIds.length; i++) {
            var offerObj = {
                offer: offerorIds[i]
            }
            console.log(offerorIds[i]);
            var x = firebase.database().ref('/users').orderByChild("email").equalTo(offerorIds[i]["offeror"]).once('value').then(function (snapshot) {
                  var user1 = snapshot.val();
                  var usr;
                  for (var key in user1) {
                      if (user1.hasOwnProperty(key)) {
                          usr = user1[key];
                          offerObj.offeror = usr;
                          console.log(offerorIds[i]);
                          console.log(offerObj);
                          $scope.offers.push(offerObj);
                          break;
                      }
                  }
               
              });
        }
    }

    $scope.getQuestionerInfo = function (questionerIds) {
        for (var i = 0; i < questionerIds.length; i++) {
            var questionObj = {
                question: questionerIds[i]
            }
            console.log(questionerIds[i]);
            var x = firebase.database().ref('/users').orderByChild("email").equalTo(questionerIds[i]["questioner"]).once('value').then(function (snapshot) {
                var user1 = snapshot.val();
                var usr;
                for (var key in user1) {
                    if (user1.hasOwnProperty(key)) {
                        usr = user1[key];
                        questionObj.questioner = usr;
                        console.log(questionerIds[i]);
                        console.log(questionObj);
                        $scope.questions.push(questionObj);
                        break;
                    }
                }

            });
        }
    }

    $scope.replyQuestions = function (question) {
        //console.log(question);
        $scope.replyQues = question;
        $scope.replyDiv = true;
        $scope.reply = question.question.answerText;
    }

    $scope.replyQue = function (reply) {
       // console.log(reply);
        var obj = $firebaseObject(ref.child("questions").child($scope.replyQues.question.$id));
        obj.$loaded().then(function (data) {

            obj.answerText = reply;
            obj.$save().then(function (ref) {
                Utils.alertshow("Reply", "Reply sent Succsessfully.");
                $scope.replyDiv = false;
               // $state.go('app.home');
            }, function (error) {
                Utils.alertshow("Error:", error);
            });
        });
    }


    $scope.markFAQ = function () {
      //  console.log($scope.replyQues.question.$id);
        var obj = $firebaseObject(ref.child("questions").child($scope.replyQues.question.$id));
        obj.$loaded().then(function (data) {
                    
            obj.faq = 'Y';
            obj.$save().then(function (ref) {
                Utils.alertshow("Reply", "Marked as FAQ.");
               // $state.go('app.home');
            }, function (error) {
                Utils.alertshow("Error:", error);
            });
        });
    }

    $scope.rejectOffer = function (offer) {
        console.log(offer);
        var obj = $firebaseObject(ref.child("offers").child(offer.offer.$id));
        obj.$loaded().then(function (data) {
            console.log(offer.offer.rejected);
            obj.rejected = "Y";
            obj.$save().then(function (ref) {
                Utils.alertshow("Offer", "Offer has been rejected.");
                // $state.go('app.home');
            }, function (error) {
                Utils.alertshow("Error:", error);
            });
        });
    }

    $scope.acceptOffer = function (offer) {
        console.log(offer);
        var obj = $firebaseObject(ref.child("offers").child(offer.offer.$id));
        obj.$loaded().then(function (data) {
            console.log(offer.offer.rejected);
            obj.accepted = "Y";
            obj.$save().then(function (ref) {
                Utils.alertshow("Offer", "Offer has been accepted.");
                // $state.go('app.home');
            }, function (error) {
                Utils.alertshow("Error:", error);
            });
        });
    }

    $scope.blockOffer = function (offer) {
        console.log(offer);
        var obj = $firebaseObject(ref.child("offers").child(offer.offer.$id));
        obj.$loaded().then(function (data) {
            obj.block = "Y";
            obj.$save().then(function (ref) {
                Utils.alertshow("Offer", "Offer has been blocked.");
                // $state.go('app.home');
            }, function (error) {
                Utils.alertshow("Error:", error);
            });
        });
    }

    $scope.counterOffer = function (offer) {
        $scope.counterOffer = {};

        var coPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="counterOffer.price"> <a nav-direction="forward" class="button icon-right ion-android-close button-clear button-light" ng-click="closeCOPopup()"></a>',
            //templateURL : we can use template URL for HTML from other HTML..
            title: 'Counter Offer',
            //      subTitle: 'Either buy now or make an offer by entering the price.',
            scope: $scope,
            buttons: [
              {
                  text: 'Cancel',
                  onTap: function (e) {
                      alert("cancel");
                      $scope.closeCOPopup();

                  }
              },
              {
                  text: 'Offer',
                  type: 'button-positive',
                  onTap: function (e) {

                      alert("Offer" + $scope.counterOffer.price);
                      //  console.log($scope.sms.number);
                      //  console.log($scope.sms.message);
                      var obj = $firebaseObject(ref.child("offers").child(offer.offer.$id));
                      obj.$loaded().then(function (data) {
                          obj.counterPrice = $scope.counterOffer.price;
                          obj.$save().then(function (ref) {
                              Utils.alertshow("Offer", "Counter offer extended succefully.");
                              // $state.go('app.home');
                          }, function (error) {
                              Utils.alertshow("Error:", error);
                          });
                      });

                  }
              }
            ]
        });

        $scope.closeCOPopup = function () {
            coPopup.close();
        }


        coPopup.then(function (res) {
            console.log('Tapped!', res);
        });
    }






    var smsoptions = {
        replaceLineBreaks: true, // true to replace \n by a new line, false by default
        android: {
            intent: 'INTENT'  // send SMS with the default SMS app
            //intent: ''        // send SMS without open any other app
        }
    };

    $scope.textOfferor = function (ofr) {
        $scope.textMsg = {};
        // An elaborate, custom popup
        var textPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="textMsg.text"> <a nav-direction="forward" class="button icon-right ion-android-close button-clear button-light" ng-click="closeTextPopUp()"></a>',
            //templateURL : we can use template URL for HTML from other HTML..
            title: 'Text Offeror',
      //      subTitle: 'Either buy now or make an offer by entering the price.',
            scope: $scope,
            buttons: [
              {
                  text: 'Cancel',
                  onTap: function (e) {
                      alert("cancel" );
                      $scope.closeTextPopUp();

                  }
              },
              {
                  text: 'Send',
                  type: 'button-positive',
                  onTap: function (e) {

                      alert("Send" + $scope.textMsg.text);
                    //  console.log($scope.sms.number);
                    //  console.log($scope.sms.message);
                      $cordovaSms
                      .send(ofr.offeror.phone, $scope.textMsg.text, smsoptions)
                          .then(function () {
                              // Success! SMS was sent
                              alert('Success');
                          }, function (error) {
                              // An error occurred
                              alert(error);
                          });//then*/

                  }
              }
            ]
        });

        $scope.closeTextPopUp = function () {
            textPopup.close();
        }


        textPopup.then(function (res) {
            console.log('Tapped!', res);
        });

        
        }
});