angular.module('App').factory('Auth', function(FURL, $log, $firebaseAuth, $firebaseArray, $firebaseObject, Utils) {

    //var ref = new Firebase(FURL);

    firebase.initializeApp(FURL);
    //var auth = $firebaseAuth(ref);
    var ref = firebase.database().ref();

    //var auth = $firebaseObject(ref);
    var auth = $firebaseAuth();


    

    var Auth = {
        user: {},

        login: function(user) {
            return auth.$signInWithEmailAndPassword(
                user.email, user.password
            );
        },

        createProfile: function(uid, user) {
          

            // If you want insert more data should modify register.html and modify your object.

            var profile = {
                id: uid,
                fullName: user.name,
                email: user.email,
                handle: user.handle,
                phone: user.mobile,
                createdOn: new Date().getTime(),
                updatedOn: new Date().getTime(),
                org: JSON.parse(user.emailDomain),
                avatar: null
            };

            var messagesRef = $firebaseArray(firebase.database().ref().child("users"));
            messagesRef.$add(profile);
            $log.log("User Saved");
        },

        register: function(user) {
            return auth.$createUserWithEmailAndPassword(user.email, user.password)
                .then(function(firebaseUser) {
                    console.log("User created with uid: " + firebaseUser.uid + " <><> " + firebaseUser.emailVerified);
                  
                    firebaseUser.sendEmailVerification();
                    Auth.createProfile(firebaseUser.uid, user);
                })
                .catch(function(error) {
                    console.log(error);
                    throw error;
                });
        },

        logout: function() {
            auth.$signOut();
            console.log("Usuario Sale.");
        },

        resetpassword: function(email) {
            return auth.$sendPasswordResetEmail(
                email
            ).then(function() {
                Utils.alertshow("Succcess", "Password reset email sent successfully.");
                //console.log("Password reset email sent successfully!");
            }).catch(function(error) {
                //  Utils.errMessage(error);
                throw error;
            });
        },

        changePassword: function(user) {
            return auth.$changePassword({ email: user.email, oldPassword: user.oldPass, newPassword: user.newPass });
        },

        signInWithProvider: function(provider) {
            return Auth.signInWithPopup('google');
        }
    };
    return Auth;

});