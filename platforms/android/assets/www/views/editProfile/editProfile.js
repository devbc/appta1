'Use Strict';
angular.module('App').controller('editProfileController', function ($scope, $rootScope, $state, $cordovaOauth, $localStorage, $location, $http, $ionicPopup, $firebaseObject, Auth, FURL, Utils, $firebaseArray,  $cordovaCamera) {

    if (!$rootScope.currentUser) {
        $state.go('app.home');
    }

    $scope.user = $rootScope.currentUser;
    if ($scope.user.profilePic == undefined || $scope.user.profilePic == null)
        $scope.user.profilePic = "img/user.png";

    console.log($scope.user);
    var ref = firebase.database().ref();

    $scope.getCamera = function () {
        alert("inside get camera");
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 128,
            targetHeight: 128,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            cameraDirection:1

        });
            
          
    }

    function onSuccess(imageData) {
     //   alert('Success : ' + imageData);
        $scope.user.profilePic = "data:image/jpeg;base64," + imageData;
        $scope.$apply();
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }

    $scope.editProfile = function () {
        // alert("1");

        var obj = $firebaseObject(ref.child("users").child($rootScope.currentUserKey));
        obj.$loaded().then(function (data) {
         //   console.log(data);
        //    alert("2");
            if ($scope.user.profilePic != undefined || $scope.user.profilePic != null) {
                obj.profilePic = $scope.user.profilePic;
            }
          //  alert("3");
            obj.phone = $scope.user.phone
            obj.$save().then(function (ref) {
           //     console.log(ref);
                Utils.alertshow("Profile", "Profile Updated Successfully.");
                $state.go('app.home');
            }, function (error) {
                Utils.alertshow("Error:" , error);
            });
        });
       
    }
});