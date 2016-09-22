'Use Strict';
angular.module('App').controller('itemController', function ($scope, $rootScope, $state, $cordovaOauth, $localStorage, $location, $http, $ionicPopup, $firebaseObject, Auth, FURL, Utils, $firebaseArray, $cordovaCamera, $stateParams) {
    console.log($stateParams);

    $scope.displayFirst = true;
    $scope.item = {};
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

});