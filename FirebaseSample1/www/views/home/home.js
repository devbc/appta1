'Use Strict';
angular.module('App').controller('homeController', function($rootScope, $scope, $state, $cordovaOauth, $localStorage, $log, $location, $http, $ionicPopup, $firebaseObject, $ionicSideMenuDelegate, Auth, FURL, Utils, $firebaseArray, $ionicScrollDelegate, $cordovaPreferences, $ionicPlatform) {

    var h = window.innerHeight;
    //    document.getElementById("itemScroll").style.height = h - 50;

    $scope.itemHeight = 300;
    $scope.offset = 6;
    var topMargin = 50;
    //  document.getElementById("listContainer").style.marginTop = topMargin+"px";
    $scope.newestItems = [];
    var ref = firebase.database().ref();
    $scope.itemList = $firebaseArray(firebase.database().ref().child("items"));
    $scope.isScrolling = false;


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
      });*/
    $scope.$on('$ionicView.afterEnter', function() {
        document.getElementById("splash").style.display = "none";
    });

    $scope.logOut = function() {
        Auth.logout();
        $location.path("/login");
    }

    $scope.profile = function() {
        $location.path("/profile");
    }

    $scope.showLeftMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.addNewItem = function() {
        if ($rootScope.currentUser) {
            $location.path("/add");
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'Error.',
                template: 'Please login to continue.'
            });
            alertPopup.then(function(res) {
                $location.path("/login");
            });
        }

    }


    $scope.scrolled = function() {
        console.log(window.innerHeight + topMargin);
        var top = $ionicScrollDelegate.getScrollPosition().top;
        var totalScrolled = top + (document.getElementById("listContainer").scrollHeight + topMargin);
        var threshold = (Math.ceil($scope.offset / 2) * ($scope.itemHeight));
        console.log(totalScrolled + "<<>>" + threshold);
        //totalScrolled >= threshold && 
        if ($scope.newestItems.length < $scope.itemList.length && !$scope.isScrolling) {
            //   alert("asas");
            $scope.getHomeItems();
            $scope.isScrolling = true;
        }

        console.log("top: " + document.getElementById("listContainer").scrollHeight);
        console.log("window.innerHeight: " + window.innerHeight);
        console.log(top + window.innerHeight + topMargin);
    }

    /* var scrollRef = firebase.util.Scroll(itemList, 'title');
  scrollRef.scroll.next(5);
  $scope.getHomeItems = function () {
      scrollRef.scroll.next(5);
      $scope.$broadcast('scroll.infiniteScrollComplete');
}*/


    Utils.show();
    // alert(firebase);
    //firebase.initializeApp(FURL);
    $scope.getHomeItems = function() {
        var data = {
            query: { 'sold': 'Y' } // query on the title field for 'jones'

        };

        var qu = {
                // "from":0,
                //  "size": 11,
                "query": {

                    //   "match_all" : {},
                    "bool": {
                        "must": [
                            { "match": { "sold": "N" } },
                            { "match": { "approved": true } },
                            { "match": { "blocked": false } }
                        ],
                        "must_not": [
                            { "match": { "email": "shaiwal_sharma@yahoo.com" } }
                        ]

                    },

                },
                "sort": [{
                        "itemPrice": { "order": "asc", "mode": "min" }
                    },
                    {
                        "created_on": { "order": "desc", "mode": "max" }
                    },
                    {
                        "_geo_distance": {
                            "location": {
                                "lat": 37.4145102,
                                "lon": -121.9312227,
                            },
                            "order": "asc",
                            "unit": "km"
                        }
                    }

                ]
            }
            /*    $http({
                      method: "POST",
                      url: "http://localhost:9200/items/_count",
                      crossDomain: true,
                 //     withCredentials: true ,
                      headers: { 'content-type': 'application/x-www-form-urlencoded' },
                      //data
                      params: data
                  })
             .success(function(data) {
                 console.log(JSON.stringify(data));
                
                 })
             .error(function (data) {
                 alert(JSON.stringify(data.error));
                 console.log("Error: " + JSON.stringify(data.error));
                 });*/

        jq.ajax({
            //url: "http://localhost:9200/items/_search",
            url: "https://9cbbz5bt:hcsp7vxt5icrpgcg@cypress-1020692.us-east-1.bonsai.io/items_geo/_search",
            type: 'post',
            dataType: 'json',
            /*   header : {
                   Authorization: "Basic OWNiYno1YnQ6aGNzcDd2eHQ1aWNycGdjZw=="
               },*/
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Basic OWNiYno1YnQ6aGNzcDd2eHQ1aWNycGdjZw==");
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                console.log(JSON.stringify(data.hits.total));
                if (data.hits.total != undefined && data.hits.total > 0) {
                    jq.each(data.hits.hits, function(key, value) {
                        console.log(key);
                        var itemData = {
                            "id": value._id,
                            "data": value._source
                        }
                        $scope.newestItems.push(itemData);
                    });
                }
                Utils.hide();
                //grid
                jq('.grid').masonry({
                    itemSelector: '.grid_item',
                    columnWidth: '.grid_sizer',
                    gutter: '.grid_gutter'
                });
            },
            error: function(data) {
                //  alert(JSON.stringify(data.error));
                console.log("Error: " + JSON.stringify(data));
            },
            data: JSON.stringify(qu)
        });

    }

    $scope.getHomeItems();
});