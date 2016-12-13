angular.module('App').factory('Notifier', function(FURL, $log, $firebaseAuth, $firebaseArray, $firebaseObject, Utils, $http) {

    var Notifier = {

        sendNotification: function(title, body, params, isTopic, userToken) {
           // alert(title + " ... " + body + " ... " + params + " ... " + isTopic + " ... " + userToken);
            var data = {
                "to": userToken, //"dBCvjnF_KNc:APA91bH2kud_dZM-H7ntaFNTppcwXSU1DyUAUVWxX-XfpaDkZZPrhgznO342DZX3jITSEqIQMn94TqbwbnJGoLuXjNcnd8vhrVrmjQfDSpwCFz901Z7OMK9miIJ9MuJ02y122grIcQRG",
                "priority": "normal",
                "notification": {
                    "body": body, //"This week's edition is now available.123",
                    "title": title, //"NewsMagazine.com",
                    "icon": "new"
                },
                "data": params
            }

            var config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'key=AIzaSyCZvwlH6XKxXT507LIJIalaJOCKMCMP_54'
                }
            }
            var url = "https://fcm.googleapis.com/fcm/send";

            $http.post(url, data, config)
                .success(function(data, status, headers, config) {
                    alert("Notification Send");
                })
                .error(function(data, status, header, config) {
                    alert("Data: " + data + " status: " + status +
                        "headers: " + header +
                        "config: " + config);
                });


        }

    };

    return Notifier;

});