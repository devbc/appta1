'Use Strict';
angular.module('App').controller('myQuotesController', function ($rootScope, $scope, $state, $cordovaOauth, $localStorage, $location, $http,
    $ionicPopup, $firebaseObject, Auth, FURL, Utils, $firebaseArray, $ionicSlideBoxDelegate, $cordovaCamera, $cordovaGeolocation) {
    $rootScope.currentState = "myQuotes";
    $scope.itemHeight = 150;
    $scope.myItems = [];
    $scope.items = [];

    var ref = firebase.database().ref();
    $scope.offersList = $firebaseArray(firebase.database().ref().child("offers").orderByChild("offeror").equalTo($rootScope.currentUser.email));
    $scope.offersList.$loaded()
      .then(function (x) {
          var itemsIds = [];
          for (var i = 0; i < $scope.offersList.length; i++)
              itemsIds.push($scope.offersList[i].itemId);
          $scope.getUserQuotedItems(itemsIds);
      })
  .catch(function (error) {
      console.log("Error:", error);
  });

    function findElements(arr, propName, propValue) {
        var offerArr = [];
        for (var i = 0; i < arr.length; i++)
            if (arr[i][propName] == propValue)
                offerArr.push(arr[i]);

        return offerArr;
    }

    var monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
    ];


    function getCreatedOn(dateCreated) {
        var currentDate = new Date().getTime();
        var timeDiff = Math.abs(currentDate - dateCreated);
        var diffDays = (timeDiff / (1000 * 3600 * 24));
        if (diffDays < 1) {
            var date = new Date(dateCreated);
            var hours = date.getHours();
            var suffix = "am";
            if (date.getHours() > 12) {
                hours = date.getHours() - 12;
                suffix = "pm"
            }
            return hours + ":" + date.getMinutes() + " " + suffix;
        } else if (1 < diffDays && diffDays < 2) {
            return "Yesterday";
        } else if (diffDays >= 2) {
            var date = new Date(dateCreated);
            return date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();

        }


    }

    function getOfferState(itemId) {
        
        var state = "No Response";
        for (var i = 0; i < $scope.offersList.length; i++) {
            
            if ($scope.offersList[i]["itemId"] == itemId && $scope.offersList[i]["offeror"] == $rootScope.currentUser.email) {
                if($scope.offersList[i]["accepted"] === "Y"){
                    state = "Accepted";
                    break;
                }   
                else if ($scope.offersList[i]["rejected"] === "Y") {
                    state = "Rejected";
                    break;
                }
            }
        }
        console.log(state);
        return state;
    }

    function getOfferId(itemId) {

        var state = "No Response";
        for (var i = 0; i < $scope.offersList.length; i++) {

            if ($scope.offersList[i]["itemId"] == itemId && $scope.offersList[i]["offeror"] == $rootScope.currentUser.email) {
                return $scope.offersList[i]["$id"]
                //break;
            }
        }
    }

    $scope.getUserQuotedItems = function (itemsIds) {
        console.log(itemsIds);
        var qu = {

            "query": {
                "terms": 
                    { "_id": itemsIds } 
            },
            "sort": [
                  {
                      "created_on": { "order": "desc", "mode": "max" }
                  }

            ]
        }

        jq.ajax({
            //url: "http://localhost:9200/items/_search",
            url: "https://9cbbz5bt:hcsp7vxt5icrpgcg@cypress-1020692.us-east-1.bonsai.io/items_geo/_search",
            type: 'post',
            dataType: 'json',
            /*   header : {
                   Authorization: "Basic OWNiYno1YnQ6aGNzcDd2eHQ1aWNycGdjZw=="
               },*/
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic OWNiYno1YnQ6aGNzcDd2eHQ1aWNycGdjZw==");
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                console.log(JSON.stringify(data.hits.total));
                if (data.hits.total != undefined && data.hits.total > 0) {
                    jq.each(data.hits.hits, function (key, value) {
                        console.log(value._id);
                        var itemData = {
                            "id": value._id,
                            "data": value._source,
                            "offerState": getOfferState(value._id),
                            "createdon": getCreatedOn(value._source.created_on),
                            "offerId":getOfferId(value._id)
                        }
                        $scope.myItems.push(itemData);
                    });
                }
                Utils.hide();
            },
            error: function (data) {
                //  alert(JSON.stringify(data.error));
                console.log("Error: " + JSON.stringify(data));
            },
            data: JSON.stringify(qu)
        });

    }

    $scope.updateOffer = function (offerId) {
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
                      var obj = $firebaseObject(ref.child("offers").child(offerId));
                      obj.$loaded().then(function (data) {
                          obj.offeredPrice = $scope.counterOffer.price;
                          obj.$save().then(function (ref) {
                              Utils.alertshow("Offer", "New offer extended succefully.");
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

    $scope.textOfferor = function (ownerEmail) {

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
                      alert("cancel");
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