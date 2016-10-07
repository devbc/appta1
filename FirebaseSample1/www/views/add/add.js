'Use Strict';
angular.module('App').controller('addController', function ($rootScope, $scope, $state, $cordovaOauth, $localStorage, $location, $http,
    $ionicPopup, $firebaseObject, Auth, FURL, Utils, $firebaseArray, $ionicSlideBoxDelegate, $cordovaCamera, $cordovaGeolocation) {
   
    jq('.photo_wrapper .photo_slide').css('display', 'block');
   /* jq('.photo_wrapper').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        fade: true
        //   asNavFor: '.photo_thumbs'
    });*/

    $scope.item = {};
    $scope.imageArr = [];
    $scope.parseFile = null;
    $scope.parseFile2 = null;
    $scope.parseFile3 = null;
    $scope.parseFile4 = null;
    $scope.showOne = true;
    $scope.locResult = '';
    $scope.locDetails = null;
    $scope.locOptions = '';

    $scope.slideHasChanged = function () {
        $ionicSlideBoxDelegate.update();
    };

    // Getting the image
    $scope.getImage = function () {
        alert("inside getimage");
        if ($scope.imageArr.length < 4) {
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                destinationType: Camera.DestinationType.DATA_URL
            });
        } else {
            alert("You have already added 4 images!");
        }
          
                
    }
            
    $scope.getCamera = function () {
       // alert("inside getimage 1");
        if ($scope.imageArr.length < 4){
        //    alert("inside getimage 2");
            navigator.camera.getPicture(onSuccess, onFail, {
                quality : 75, 
                destinationType : Camera.DestinationType.DATA_URL, 
                sourceType : Camera.PictureSourceType.CAMERA, 
                allowEdit : false,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 480,
                targetHeight: 640,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            
            });
      
        } else {
            alert("You have already added 4 images!");
        }
    }
            
  //  $scope.getCamera();

    function onSuccess(imageData) {
       
        $scope.imageArr.push("data:image/jpeg;base64," + imageData);
        $ionicSlideBoxDelegate.update();
        $ionicSlideBoxDelegate.$getByHandle('image-viewer').update();
       alert("inside getimage 4>> " + $scope.imageArr.length);
       
  
    } 
            
    function onFail(message) {
        alert('Failed because: ' + message);
    }
            
    // Getting Location 
 //   $scope.getLocation = function () {
        var onGeoSuccess = function (position) {
            var latlng = position.coords.latitude + ', ' + position.coords.longitude;
            alert(latlng);
            var geocoder = new google.maps.Geocoder();
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var request = {
                latLng: latLng
            };
            $scope.item.lat = position.coords.latitude;
            $scope.item.lng = position.coords.longitude;
            geocoder.geocode(request, function (data, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (data[0] != null) {
                        alert("address is: " + data[0].formatted_address);
                        document.getElementById('userLoc').value = data[0].formatted_address;
                        $scope.item.location = data[0].formatted_address;
                    } else {
                        alert("No address available");
                    }
                }
            })
            // Get location (city name, state)
       
        };
        // onError Callback receives a PositionError object
        //
        function onGeoError(error) {
            alert(error.message);
        }
        navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
  //  }


    $scope.send = function () {

        for (var i = 0; i < $scope.imageArr.length; i++) {
            if (i == 0) {
                $scope.parseFile = $scope.imageArr[i];
            }else if(i ==1){
                $scope.parseFile2 = $scope.imageArr[i];
            } else if (i == 2) {
                $scope.parseFile3 = $scope.imageArr[i];
            } else if (i == 3) {
                $scope.parseFile4 = $scope.imageArr[i];
            }
                
        }
                
        // Checking if user is logged in      

        if ($rootScope.currentUser) {
            var itemJSON = {};
            
            itemJSON = {
                "itemName": $scope.item.itemName,
                "approved": true,
                "blocked": false,
                "itemDescription": null,
                "itemPrice": $scope.item.itemPrice,
                "reported": false,
                "location":{
                    "lat": $scope.item.lat,
                    "lon": $scope.item.lng,
                },
                "itemLocation": $scope.item.location,
                "user": $rootScope.currentUser,
                "itemPicture": $scope.parseFile,
                "itemPicture2": $scope.parseFile2,
                "itemPicture3": $scope.parseFile3,
                "itemPicture4": $scope.parseFile4,
                "used": null,
                "purchaseYear": null,
                "reason": null,
                "owner": $rootScope.currentUser.email,
                "created_on": new Date().getTime(),
                "updated_on": new Date().getTime(),
                "sold":"N"
            }

            var messagesRef = $firebaseArray(firebase.database().ref().child("items"));
         
           
       //     messageListRef.push(itemJSON);
           // alert(messagesRef);
            messagesRef.$loaded().then(function (res) {
                messagesRef.$add(itemJSON).then(function (ref) {
                    //  list.$indexFor(id); // returns location in the array
                    $ionicPopup.alert({
                        title: 'Congratulations!',
                        template: 'We will review your listing in a bit.'
                    });
                    $state.transitionTo("app.home");
                });
               // alert(res);
            });
           
        } 
    }

    $scope.closeAddNew = function () {
        $state.transitionTo("app.home");
    }

});