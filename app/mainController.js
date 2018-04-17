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
            console.log($scope.tabEvents);
            $scope.$apply();
        });

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

    }]);


