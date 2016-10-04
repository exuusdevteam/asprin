var asprinDeskApp = angular.module("asprinLoginApp",['ngRoute']);

asprinDeskApp.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl:'login-view/singin.html'
		})
		.when('/singin',{
			templateUrl:'login-view/singin.html'
		})
		.when('/signup',{
			templateUrl:'login-view/singup.html'
		})
		.when('/forget', {
			templateUrl:'login-view/forget.html'
		})
		.when('/app/asprindoc',{
			templateUrl:'app/views/asprindoc.html'
		});
}]);
 

asprinDeskApp.controller('sgininCtrl', ['$scope','$http','$location','$window', function($scope,$http,$location, $window){
	$scope.loginResponse = false;
	$scope.login = function(username,password){
		var data = '{"username": "'+username+'", "password": "'+password+'"}';
		
		var config = {
			headers:{
				'Content-Type':'application/json'
			}
		}
		
		$http.post('http://0.0.0.0:5000/api/v1/login/', data, config)
		.success(function(data, status, header, config){
			console.log(data);
			if (data.auth == 0 || data.auth==2){
				$scope.loginResponse = true;
			}else{
				var storeUser = storeUserAsprin(data.user.user_id, data.user.user_type);
				if (storeUser == 1){
					//$window.location.href = '/app/index.html';
				}
				
			}
		})
		.error(function(data, status, header, config){
			console.log(status + " "+header);
		});
	}
}]);



function storeUserAsprin(User,UserType){
	localStorage.setItem('asprin_u__', User);
	localStorage.setItem('asprin_t__', UserType);
	return 1;
}






 