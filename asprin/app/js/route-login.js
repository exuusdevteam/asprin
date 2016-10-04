var asprinDeskApp = angular.module("asprinLoginApp",['ngRoute']);

asprinDeskApp.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl:'./login-view/singin.html'
		})
		.when('/singin',{
			templateUrl:'./login-view/singnin.html'
		})
		.when('/signup',{
			templateUrl:'./login-view/singup.html'
		})
		.when('/forget', {
			templateUrl:'./login-view/forget.html'
		});
}]);



 