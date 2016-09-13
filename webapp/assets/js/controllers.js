var asprinApp = angular.module('asprinApp', ['ngRoute','ngFileUpload']);

asprinApp.config(['$routeProvider', function($routeProvider){
	
	$routeProvider
		.when('/', {
			templateUrl: 'views/home.html'
		})
		.when('/offers/', {
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




asprinApp.controller('pdfUploadCtrl', ['$scope', 'Upload', '$timeout','$window', function ($scope, Upload, $timeout, $window) {
	$scope.load_spin = false;
	$scope.uploadPic = function(file) {
	file.upload = Upload.upload({
		url: 'http://0.0.0.0:5000/api/upload/pdf/',
		data: {file: file},
	});

	file.upload.then(function (response) {
		$timeout(function () {
			file.result = response.data;
			$scope.load_spin = false;
			console.log(response.data);
			$window.location.href = '/#/offers/';
			
		});
	}, function (response) {
	if (response.status > 0)
		$scope.errorMsg = response.status + ': ' + response.data;
	}, function (evt) {
			// Math.min is to fix IE which reports 200% sometimes
		file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		if(file.progress == 100){
			$scope.load_spin = true;
		}
	});
	}
}]);







