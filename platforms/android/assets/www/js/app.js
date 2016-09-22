'Use Strict';
angular.module('App', ['ionic', 'ngStorage', 'ngCordova', 'firebase', 'ngMessages', 'ion-floating-menu', 'mgo-angular-wizard', 'ngAutocomplete'])
.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'views/login/login.html',
            controller: 'loginController'
        })
        .state('forgot', {
            url: '/forgot',
            templateUrl: 'views/forgot/forgot.html',
            controller: 'forgotController'
        })
        .state('register', {
            url: '/register',
            templateUrl: 'views/register/register.html',
            controller: 'registerController'
        })
     /*   .state('home', {
          url: '/home',
          templateUrl: 'views/home/home.html',
          controller:'homeController'
        })*/
        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "views/menu/menu.html",
            controller: 'AppCtrl'
        })

          .state('app.home', {
              url: "/home",
              views: {
                  'menuContent': {
                      templateUrl: "views/home/home.html",
                      controller: 'homeController'
                  }
              }
          })
        .state('editProfile', {
            url: '/editProfile',
            templateUrl: 'views/editProfile/editProfile.html',
            controller: 'editProfileController'
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'views/profile/profile.html',
            controller: 'profileController'
        })
        .state('add', {
            url: '/add',
            templateUrl: 'views/add/add.html',
            controller: 'addController'
        })
         .state('item', {
             url: '/item/:item',
             templateUrl: 'views/item/item.html',
             controller: 'itemController'
         })
    ;
    $urlRouterProvider.otherwise("app/home");
})
// Changue this for your Firebase App URL.
.constant('FURL', {
    apiKey: "AIzaSyD_eW2BTWhHxQpfIwMs1Rh8ZFtjSRCXLYw",
    authDomain: "buyandsell-26251.firebaseio.com",
    databaseURL: "https://buyandsell-26251.firebaseio.com",
    storageBucket: "buyandsell-26251.appspot.com",
}
  )
.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function (FURL) {


        // AdMob
        if (window.AdMob) {
            var admobid;

            if (device.platform == "Android") {
                admobid = { // for Android
                    banner: 'ca-app-pub-8943241156434100/4304279677',
                    interstitial: 'ca-app-pub-8943241156434100/3994725276'
                };
            } else {
                admobid = { // for iOS
                    banner: 'ca-app-pub-8943241156434100/7257746078',
                    interstitial: 'ca-app-pub-8943241156434100/2378391279'
                };
            }
            console.log("admobid" + angular.toJson(admobid));

            $adMob.createBanner({
                adId: admobid.banner,
                autoShow: true,
                bgColor: 'black',
                position: $adMob.position.BOTTOM_CENTER
            });

            $adMob.prepareInterstitial({
                adId: admobid.interstitial,
                autoShow: false
            });
        }
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})
;
