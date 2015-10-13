var mainApp = angular.module("mainApp", ['ngRoute']);
 
mainApp.config(function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'Templates/login.html',
            controller: 'StudentController'
        })
        .when('/chat-user-list', {
            templateUrl: 'Templates/chat-user-list.html',
            controller: 'StudentController'
        })
        .otherwise({
            redirectTo: '/login'
        });
});
 
mainApp.controller('StudentController', function($scope) {
    $scope.students = [
        {name: 'Mark Waugh', city:'New York'},
        {name: 'Steve Jonathan', city:'London'},
        {name: 'John Marcus', city:'Paris'}
    ];
 
    $scope.message = "Click on the hyper link to view the students list.";
});