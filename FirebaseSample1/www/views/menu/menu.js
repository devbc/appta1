'Use Strict';
angular.module('App').controller('AppCtrl', function ($scope, $rootScope, $state, $timeout, $ionicSideMenuDelegate, $ionicLoading, $ionicModal, $ionicPopup, Auth, $location) {

    $scope.showLeftMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };

    
    $scope.signOut = function () {
        Auth.logout();
        firebase.auth().signOut().then(function () {
            console.log('Signed Out');
            $rootScope.currentUser = null;
        }, function (error) {
            console.error('Sign Out Error', error);
        });
       
        $location.path("/app");
        $ionicSideMenuDelegate.toggleLeft();
    };
}
);