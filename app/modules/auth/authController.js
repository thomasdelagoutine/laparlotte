/**
 * Created by Thomas on 29/04/2018.
 */
app.controller('authController', ['$scope', '$location', '$firebaseObject', '$firebaseAuth', '$sce',
    function ($scope, $location, $firebaseObject, $firebaseAuth, $sce) {
        var auth = $firebaseAuth();

        /**
         * Function to connect to the administration panel.
         */
        $scope.connexion = function () {
            var email = $scope.email;
            var password = $scope.password;
            auth.$signInWithEmailAndPassword(email, password).then(function () {
                $location.path("/administration");
            }).catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                $scope.errorSignIn = true;
                $scope.signInError = "Mot de passe ou identifiant incorrect";
            });
        };
        

    }]);