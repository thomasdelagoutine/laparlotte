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
        $scope.openAuth = false;
        var auth = $firebaseAuth();

        $scope.authAdmin = function () {
            $scope.openAuth = !$scope.openAuth;
            $location.path("/auth");
        };

        $scope.isConnected = function () {
            var user = $firebaseAuth().$getAuth();
            if (user) {
                return true
            } else {
                return false;
            }
        };

        $scope.deconnexion = function () {
            auth.$signOut().then(function () {
                console.log("Deconnecté");
                $scope.openAuth = false;
                $location.path("/home");
            }).catch(function (error) {
                // An error happened.
                console.log("Erreur de deconnexion");
            });
        };

        $scope.$on("administration", function (event) {
            if (event){
                $scope.openAuth = true;
            }
        });

        /**
         * Fonction pour transformer une date du format date vers le format français. 
         * @param pDate
         * @returns {string}
         */
        $scope.convertToFrenchDate = function (pDate) {
            var event = new Date(pDate);
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            var pDateEvent = event.toLocaleDateString('fr-FR', options);
            return pDateEvent;
        };
    }]);


