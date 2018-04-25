/**
 * Created by Thomas on 14/04/2018.
 */
app.run(function ($rootScope) {

});


app.controller('mainCtrl', ['$scope', '$location', '$firebaseObject', '$firebaseAuth', '$sce',
    function ($scope, $location, $firebaseObject, $firebaseAuth, $sce) {
        //Initialisation
        var ref = firebase.database().ref();
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
            return firebase.database().ref('/events/').once('value').then(function (pEvents) {
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
                firebase.database().ref('events/' + pCurrentUserUid).set({
                    date: pDate,
                    description: pDescription,
                    linkSoundCloud: pLinkSoundCloud,
                    name: pName,
                    time: pTime,
                    urlPhoto: pPhotoLink
                });
            } else {
                console.log("Tous les champs ne sont pas renseignés")
            }

        }

    }]);


