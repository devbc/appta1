'Use Strict';
angular.module('App').controller('myPostsController', function ($rootScope, $scope, $state, $cordovaOauth, $localStorage, $location, $http,
    $ionicPopup, $firebaseObject, Auth, FURL, Utils, $firebaseArray, $ionicSlideBoxDelegate, $cordovaCamera, $cordovaGeolocation) {
    $rootScope.currentState = "myPosts";
    $scope.itemHeight = 150;
    $scope.myItems = [];
    $scope.items = [];

    var ref = firebase.database().ref();
    $scope.offersList = [];
    $scope.questionsList = [];

    $scope.offersList = $firebaseArray(firebase.database().ref().child("offers").orderByChild("offeree").equalTo($rootScope.currentUser.email));
    $scope.offersList.$loaded()
      .then(function(x) {
          $scope.loadQuestions();
      })
  .catch(function(error) {
      console.log("Error:", error);
  });

    $scope.loadQuestions = function () {
     
            $scope.questionsList = $firebaseArray(firebase.database().ref().child("questions").orderByChild("answerer").equalTo($rootScope.currentUser.email));
            $scope.questionsList.$loaded()
                .then(function (x) {
                    $scope.getUserPosts();                
                })
            .catch(function (error) {
                console.log("Error:", error);
            });
       

    }

    function findOffers(arr, propName, propValue) {
        var offerArr = [];
        for (var i = 0; i < arr.length; i++)
            if (arr[i][propName] == propValue)
                offerArr.push(arr[i]);

        return offerArr;
    }

      function findQuestions(arr, propName, propValue) {
            var quesArr = [];
            for (var i = 0; i < arr.length; i++)
                if (arr[i][propName] == propValue)
                    quesArr.push(arr[i]);
        
            return quesArr;
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

    $scope.getUserPosts = function () {
        // give size to get all the records...
        var qu = {

            "query": {
                "bool": {
                    "must": [
                        { "match": { "owner": $rootScope.currentUser.email } },
                        { "match": { "approved": true } },
                        { "match": { "blocked": false } }
                    ]
                }

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
                        console.log(key + " ...  " + value._id + " ... " + value._source.blocked);
                        var itemData = {
                            "id": value._id,
                            "data": value._source,
                            "offerCount": findOffers($scope.offersList, "itemId", value._id),
                            "questions":findQuestions($scope.questionsList, "itemId", value._id),
                            "createdon": getCreatedOn(value._source.created_on)

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
    
    $scope.blockItem = function (item) {
        //  console.log($scope.replyQues.question.$id);
     //   $event.stopPropagation();
        var obj = $firebaseObject(ref.child("items").child(item.id));
        obj.$loaded().then(function (data) {

            obj.blocked = true;
            obj.$save().then(function (ref) {
                Utils.alertshow("My Posts", "Your items has been deleted.");
                $state.reload();
            }, function (error) {
                Utils.alertshow("Error:", error);
            });
        });
    }

});