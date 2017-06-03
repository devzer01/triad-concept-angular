'use strict';

var AppConfig = {
    host: "//dev.oro.world/"
};

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.landing',
  'myApp.office', 'myApp.simple', 'myApp.orbital', 'myApp.simulation',
  'myApp.chat',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/orbital'});
}]);
