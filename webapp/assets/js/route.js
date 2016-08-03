var asprinApp = angular.module('asprinApp', ['ngRoute']);

asprinApp.config(['$routeProvider', function($routeProvider){
	
	$routeProvider
		.when('/', {
			templateUrl: 'views/home.html'
		})
		.when('/offers', {
			templateUrl: 'views/offers.html'
		})
		.when('/signin-o', {
			templateUrl: 'views/signin-o.html'
		})
		.when('/signup-o', {
			templateUrl: 'views/signup-o.html'
		})
		.when('/signin', {
			templateUrl: 'views/app/signin.html'
		})
		.when('/signup',{
			templateUrl: 'views/app/signup.html'
		})
		.when('/password', {
			templateUrl: 'views/app/forgot-password.html'
		})
		.when('/app/', {
			templateUrl: 'views/app/index.html'
		})
		.when('/app/asprin-doc', {
			templateUrl: 'views/app/asprindoc.html'
		})
		.when('/app/printers', {
			templateUrl: 'views/app/printers.html'
		})
		.when('/app/settings', {
			templateUrl: 'views/app/settings.html'
		})
		.otherwise({
			redirectTo: '/'
		});
	
}]);


asprinApp.controller('asprinCtrl', function($scope){
	$scope.upload = true;
	$scope.loader = false;
	
	
	
	$scope.showLoader = function(){
		alert("Remy");
		$scope.upload = false;
		$scope.loader = true;
	}
});