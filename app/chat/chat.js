'use strict';

angular.module('myApp.chat', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/chat', {
    templateUrl: 'chat/chat.html',
    controller: 'ChatCtrl'
  });
}])

.controller('ChatCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.host = {mood: 'anticipation', reason: 'excitement', intention: 'giving'};
    $scope.incoming = {mood: null, state: null, perception: null, message: null, context: 0};

    $scope.buffer = [];

    $scope.send = function () {

    };

    $scope.chat = function () {
        var localIncomming = $scope.incoming;
        $scope.buffer.push({msg: localIncomming.message});
        $http.post('http://localhost/incomming', {data: localIncomming}).then(function (e) {
            $scope.incoming.state = e.data.learn;
            $scope.incoming.context = e.data.context;
            $scope.buffer.push(e.data);
        });
    };

}]);