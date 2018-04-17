/**
 * Created by Thomas on 14/04/2018.
 */
var app = angular.module('laParlotte', ['ngRoute','firebase']);

app.config(['$routeProvider',
    function($routeProvider) {

        // Système de routage
        $routeProvider
            .when('/home', {
                templateUrl: 'modules/home/home.html',
                controller: 'homeController'
            })
            .when('/administration', {
                templateUrl: 'modules/administration/administration.html',
                controller: 'administrationController'
            })
            .when('/auth', {
                templateUrl: 'modules/auth/auth.html',
                controller: 'authController'
            })
            .otherwise({
                redirectTo: '/home'
            });
    }
]);

app.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'https://w.soundcloud.com/player/**'
    ]);
});