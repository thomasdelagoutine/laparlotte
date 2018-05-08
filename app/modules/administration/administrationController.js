/**
 * Created by Thomas on 23/04/2018.
 */
app.controller('administrationController', ['$scope', '$location', '$firebaseObject', '$firebaseAuth', '$sce',
    function ($scope, $location, $firebaseObject, $firebaseAuth, $sce) {
        //Init
        var auth = $firebaseAuth();
        _getEventList().then(function (aTabEvent) {
            $scope.listEvents = aTabEvent;
            $scope.$apply();
        });
        $scope.addDisplay = true;
        $scope.updateDisplay = false;
        $scope.deleteDisplay = false;
        $scope.openUpdate = false;
        $scope.updatedEvent = null;
        $scope.$broadcast("administration", true);

        /**
         * Fonction pour sauvegarder les evenements.
         * @returns {*}
         */
        $scope.saveEvent = function () {
            if ($scope.dateEvent && $scope.descriptionEvent && $scope.nameEvent
                && $scope.timeEvent && $scope.photoLinkEvent) {
                var pDate = $scope.dateEvent;
                var pDescription = $scope.descriptionEvent;
                var pName = $scope.nameEvent;
                var pTime = $scope.timeEvent;
                var pPhotoLink = $scope.photoLinkEvent;
                var pCurrentUserUid = currentUser = firebase.auth().currentUser.uid;
                var postData = {
                    date: pDate,
                    description: pDescription,
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
                    _getEventList().then(function (aTabEvent) {
                        $scope.listEvents = aTabEvent;
                        $scope.$apply();
                    });
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

        /**
         * Remise à zero des champs.
         * @private
         */
        function _resetInput() {
            $scope.dateEvent = "";
            $scope.descriptionEvent = "";
            $scope.nameEvent = "";
            $scope.timeEvent = "";
            $scope.photoLinkEvent = "";
            $scope.linkSoundCloudEvent = "";
        }

        /**
         * Fonction pour avoir la liste des evenements.
         * @returns {*}
         * @private
         */
        function _getEventList() {
            return firebase.database().ref('/events/IpvdRu6xphhEDa52yYgApiE5Xq52/').once('value').then(function (pEvents) {
                var tabEvents = [];
                var aEvents = pEvents.val();
                angular.forEach(aEvents, function (aEvent, aKey) {
                    aEvent.key = aKey;
                    $sce.trustAsResourceUrl(aEvent.linkSoundCloud);
                    tabEvents.push(aEvent);
                });
                return tabEvents;
            });
        }

        $scope.displayAdd = function () {
            $scope.addDisplay = true;
            $scope.updateDisplay = false;
            $scope.deleteDisplay = false;
            $scope.openUpdate = false;
        };
        $scope.displayUpdate = function () {
            $scope.addDisplay = false;
            $scope.updateDisplay = true;
            $scope.deleteDisplay = false;
            $scope.openUpdate = false;
        };

        $scope.displayDelete = function () {
            $scope.addDisplay = false;
            $scope.updateDisplay = false;
            $scope.deleteDisplay = true;
            $scope.openUpdate = false;
        };

        /**
         * Fonction pour supprimer un évenement.
         * @param pEventId
         * @returns {*}
         */
        $scope.deleteEvent = function (pEventId) {
            return firebase.database().ref('/events/IpvdRu6xphhEDa52yYgApiE5Xq52/' + pEventId).remove()
                .then(function () {
                    console.log("Supprimé!");
                    _getEventList().then(function (aTabEvent) {
                        $scope.listEvents = aTabEvent;
                        $scope.$apply();
                    });
                }).catch(function (e) {
                    console.log("Erreur!" + e);
                })
        };

        /**
         * Fonction pour ouvrir la mise à jour d'évenement.
         * @param pUpdatedEvent
         */
        $scope.openUpdateEvent = function (pUpdatedEvent) {
            $scope.openUpdate = true;
            $scope.updatedEvent = pUpdatedEvent;
        };


        /**
         * Fonction pour mettre à jour un évenement.
         * @param pEventId
         * @returns {*}
         */
        $scope.updateEvent = function (pEventId) {
            var postData = {
                date: $scope.updatedEvent.date,
                description: $scope.updatedEvent.description,
                name: $scope.updatedEvent.name,
                time: $scope.updatedEvent.time,
                urlPhoto: $scope.updatedEvent.urlPhoto
            };
            var pCurrentUserUid = currentUser = firebase.auth().currentUser.uid;
            var updates = {};
            updates['/events/' + pCurrentUserUid + '/' + pEventId] = postData;
            return firebase.database().ref().update(updates).then(function () {
                console.log("OK");
                $scope.isEventCreated = true;
                $scope.isEventError = false;
                $scope.openUpdate = false;
                $scope.$apply();
            }).catch(function (e) {
                console.log("error : " + e);
                $scope.isEventError = true;
                $scope.isEventCreated = false;
                $scope.errorSave = "Erreur durant l'enregistrement";
            });
        };
    }]);