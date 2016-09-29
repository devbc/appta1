'Use Strict';
angular.module('App').controller('itemController', function ($scope, $rootScope, $state, $cordovaOauth, $localStorage, $location, $http, $ionicPopup, $firebaseObject, Auth, FURL, Utils, $firebaseArray, $cordovaCamera, $stateParams) {
    console.log($stateParams);
    $scope.itemId = $stateParams.item;
    $scope.displayFirst = true;
    $scope.showQuestionText = false;
    $scope.item = {};
    $scope.question = "";
    var ref = firebase.database().ref();
    var obj = $firebaseObject(ref.child("items").child($stateParams.item));
    obj.$loaded().then(function (data) {
        $scope.item = data;
        console.log(data);
    });

    $scope.showMoreDetails = function () {
        $scope.displayFirst = false;
        loadMap();
    }

    $scope.showQuestionDiv = function () {
        $scope.showQuestionText = true;
    }

    $scope.askQuestion = function (question) {
        console.log($scope.question);
        var offerJSON = {
            "answerer": $scope.item.owner,
            "questioner": $rootScope.currentUser.email,
            "faq":"N",
            "questionText": question,
            "answerText": "",
            "created_on": new Date().getTime(),
            "block": "N",
            "itemId": $scope.itemId
        }
        var messagesRef = $firebaseArray(firebase.database().ref().child("questions"));
        messagesRef.$loaded().then(function (res) {
            messagesRef.$add(offerJSON).then(function (ref) {
                $ionicPopup.alert({
                    title: 'Info.',
                    template: 'Your question will be delivered to the owner.'
                });
                $scope.showQuestionText = false;
            });
        });
       
    }

    function loadMap() {
        alert("loadMap 1" + $scope.item.location.lat + " ... " +  $scope.item.location.lon);
        var myLatlng = new google.maps.LatLng($scope.item.location.lat, $scope.item.location.lon);

        var mapOptions = {
            center: myLatlng,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map
        });
    
        $scope.map = map;
    }

    $scope.makeAnOffer = function () {
        $scope.userOffer = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="number" ng-model="userOffer.price"> <a nav-direction="forward" class="button icon-right ion-android-close button-clear button-light" ng-click="closeOfferPopUp()"></a>',
            //templateURL : we can use template URL for HTML from other HTML..
            title: 'Make an Offer',
            subTitle: 'Either buy now or make an offer by entering the price.',
            scope: $scope,
            buttons: [
              {
                  text: 'Offer',
                  onTap: function (e) {
                      alert("Offer" + $scope.itemId);
                      var offerJSON = {
                          "offeror": $scope.item.owner,
                          "offeree": $rootScope.currentUser.email,
                          "offeredPrice":$scope.userOffer.price,
                          "isProposedPrice": "N",
                          "counterPrice": null,
                          "created_on": new Date().getTime(),
                          "accepted": "N",
                          "rejected": "N",
                          "block": "N",
                          "itemId": $scope.itemId
                      }

                      $scope.offer(offerJSON);

                  }
              },
              {
                  text: 'Buy Now',
                  type: 'button-positive',
                  onTap: function (e) {

                      alert("Buy Now" + $scope.itemId);
                      var offerJSON = {
                          "offeror": $scope.item.owner,
                          "offeree": $rootScope.currentUser.email,
                          "offeredPrice": $scope.item.itemPrice,
                          "isProposedPrice": "Y",
                          "counterPrice": null,
                          "created_on": new Date().getTime(),
                          "accepted": "N",
                          "rejected": "N",
                          "block": "N",
                          "itemId": $scope.itemId
                      }

                      $scope.offer(offerJSON);

                  }
              }
            ]
        });

        $scope.closeOfferPopUp = function () {
            myPopup.close();
        }
        

        myPopup.then(function (res) {
            console.log('Tapped!', res);
        });

    /*    $timeout(function () {
            myPopup.close(); //close the popup after 3 seconds for some reason
        }, 3000);*/
    }

    $scope.offer = function (offerJSON) {
        var messagesRef = $firebaseArray(firebase.database().ref().child("offers"));
        messagesRef.$loaded().then(function (res) {
            messagesRef.$add(offerJSON).then(function (ref) {
                $ionicPopup.alert({
                    title: 'Info.',
                    template: 'Owner has been notified with the offer.'
                });
                $state.transitionTo("app.home");
            });
        });
    }

});