var asprinDeskApp = angular.module("asprinDeskApp",['ngRoute']);

asprinDeskApp.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl:'views/asprindoc.html'
		})
		.when('/asprindoc',{
			templateUrl:'views/asprindoc.html'
		})
		.when('/order',{
			templateUrl:'views/order.html'
		})
		.when('/printers', {
			templateUrl:'views/printers.html'
		})
		.when('/settings', {
			templateUrl:'views/settings.html'
		});
}]);



 