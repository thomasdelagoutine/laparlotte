/**
 * Created by Thomas on 28/04/2018.
 */
app.controller('homeController', ['$scope', '$location', '$firebaseObject', '$firebaseAuth', '$sce',
    function ($scope, $location, $firebaseObject, $firebaseAuth, $sce) {
        _getEventInfo().then(function (aTabEvent) {
            $scope.tabEvents = aTabEvent;
            $scope.$apply();
        });
        var auth = $firebaseAuth();

        /**
         * Fonction permettant de récuperer la liste des evenements.
         * @returns {*}
         * @private
         */
        function _getEventInfo() {
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

    }]);