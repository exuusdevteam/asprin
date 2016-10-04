var asprinDeskApp = angular.module("asprinDeskApp",['ngRoute']);

asprinDeskApp.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('app/',{
			templateUrl:'views/asprindoc.html'
		})
		.when('app/asprindoc',{
			templateUrl:'views/asprindoc.html'
		})
		.when('app/order',{
			templateUrl:'views/order.html'
		})
		.when('app/printers', {
			templateUrl:'views/printers.html'
		})
		.when('app/settings', {
			templateUrl:'views/settings.html'
		});
}]);



 