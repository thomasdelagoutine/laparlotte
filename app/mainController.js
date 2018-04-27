/**
 * Created by Thomas on 14/04/2018.
 */
app.run(function ($rootScope) {

});


app.controller('mainCtrl', ['$scope', '$location', '$firebaseObject', '$firebaseAuth', '$sce',
    function ($scope, $location, $firebaseObject, $firebaseAuth, $sce) {
        //Initialisation
        var ref = firebase.database().ref();
        $scope.isEventCreated = false;
        $scope.isEventError = false;
        $scope.errorSave = "";
        _getProfileInfo().then(function (aTabEvent) {
            $scope.tabEvents = aTabEvent;
            $scope.$apply();
        });
        var auth = $firebaseAuth();
        $scope.openAuth = false;

        /**
         * Fonction permettant de récuperer la liste des evenements.
         * @returns {*}
         * @private
         */
        function _getProfileInfo() {
            return firebase.database().ref('/events/IpvdRu6xphhEDa52yYgApiE5Xq52/').once('value').then(function (pEvents) {
                var tabEvents = [];
                var aEvents = pEvents.val();
                angular.forEach(aEvents, function (aEvent) {
                    $sce.trustAsResourceUrl(aEvent.linkSoundCloud);
                    tabEvents.push(aEvent);
                });
                return tabEvents;
            });
        }


        $scope.authAdmin = function () {
            $scope.openAuth = !$scope.openAuth;
            if ($scope.openAuth) {
                window.scrollTo(0, document.body.scrollHeight + 500);
            }
        };

        $scope.isConnected = function () {
            var user = $firebaseAuth().$getAuth();
            if (user) {
                return true
            } else {
                return false;
            }
        };

        $scope.connexion = function () {
            var email = $scope.email;
            var password = $scope.password;
            auth.$signInWithEmailAndPassword(email, password).then(function () {
                $location.path("/mainMenu");
            }).catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                $scope.errorSignIn = true;
                $scope.signInError = "Mot de passe ou identifiant incorrect";
            });
        };

        $scope.deconnexion = function () {
            auth.$signOut().then(function () {
                console.log("Deconnecté");
            }).catch(function (error) {
                // An error happened.
            });
        };

        $scope.saveEvent = function () {
            if ($scope.dateEvent && $scope.descriptionEvent && $scope.nameEvent
                && $scope.timeEvent && $scope.photoLinkEvent) {
                var pDate = $scope.dateEvent;
                var pDescription = $scope.descriptionEvent;
                var pLinkSoundCloud = $scope.linkSoundCloudEvent;
                var pName = $scope.nameEvent;
                var pTime = $scope.timeEvent;
                var pPhotoLink = $scope.photoLinkEvent;
                var pCurrentUserUid = currentUser = firebase.auth().currentUser.uid;
                var postData = {
                    date: pDate,
                    description: pDescription,
                    linkSoundCloud: pLinkSoundCloud,
                    name: pName,
                    time: pTime,
                    urlPhoto: pPhotoLink
                };
                // Get a key for a new Post.
                var newPostKey = firebase.database().ref().child('events').push().key;
                // Write the new post's data simultaneously in the posts list and the user's post list.
                var updates = {};
                updates['/events/' + pCurrentUserUid + '/' + newPostKey] = postData;
                return firebase.database().ref().update(updates).then(function (aResult) {
                    console.log("OK");
                    $scope.isEventCreated = true;
                    $scope.isEventError = false;
                    _resetInput();
                    $scope.$apply();
                }).catch(function (e) {
                    console.log("error : " + e);
                    $scope.isEventError = true;
                    $scope.isEventCreated = false;
                    $scope.errorSave = "Erreur durant l'enregistrement";
                });
            } else {
                console.log("Tous les champs ne sont pas renseignés");
                $scope.isEventError = true;
                $scope.isEventCreated = false;
                $scope.errorSave = "Il manque un champs à renseigner ;)";
            }

        };

        function _resetInput() {
            $scope.dateEvent = "";
            $scope.descriptionEvent = "";
            $scope.nameEvent = "";
            $scope.timeEvent = "";
            $scope.photoLinkEvent = "";
            $scope.linkSoundCloudEvent = "";
        }

    }]);


