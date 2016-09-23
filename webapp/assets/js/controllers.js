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
		.when('/app/offers/',{
			templateUrl:'views/app/offers.html'
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
				var Asprin = response.data;
				file.result = Asprin;
				var saveAsrpin = storeAsprin(Asprin.asprin);

				if(saveAsrpin){
					$scope.load_spin = false;
					$window.location.href = '/#/offers/';
				}



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


asprinApp.controller('pdfUploadAppCtrl',['$scope', 'Upload','$timeout', '$location', function($scope, Upload, $timeout, $location){
	$scope.load_spin = false;
	$scope.uploadPic = function(file) {
		file.upload = Upload.upload({
			url: 'http://0.0.0.0:5000/api/upload/pdf/',
			data: {file: file},
		});

		file.upload.then(function (response) {
			$timeout(function () {
				var Asprin = response.data;
				file.result = Asprin;
				var saveAsrpin = storeAsprin(Asprin.asprin);

				if(saveAsrpin){
					$scope.load_spin = false;
					$location.path('/app/offers');
				}



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


asprinApp.controller('printPriceCtrl',['$scope','$http','$location', function($scope){
	var asprinPrice = restoreAsprin();
	console.log(asprinPrice);
	$scope.filename = asprinPrice.filename;
	$scope.page = asprinPrice.page;
	$scope.price = asprinPrice.sumPDF;
	$scope.size = asprinPrice.size;
	$scope.time = asprinPrice.time;
}]);


asprinApp.controller('appPriceCtrl', ['$scope','$http','$location', function($scope,$http,$location){
	var asprinPrice = restoreAsprin();
	var data = restoreUserAsprin();
	var user_id = data[0];
	var user_type = data[1];
	$scope.filename = asprinPrice.filename;
	$scope.page = asprinPrice.page;
	$scope.price = asprinPrice.sumPDF;
	$scope.size = asprinPrice.size;
	$scope.time = asprinPrice.time;
	
	$scope.appOrder = function(){
		postApsinData(user_id, $http, $location);
	}
	
}]);



asprinApp.controller('singinOCtrl',['$scope','$http','$location', function($scope, $http, $location){
	var asprinPrice = restoreAsprin();
	$scope.filename = asprinPrice.filename;
	$scope.page = asprinPrice.page;
	$scope.price = asprinPrice.sumPDF;
	$scope.tprice = asprinPrice.sumPDF;
	$scope.loginResponse = false;
	
	$scope.login = function(username, password){
		var data = '{"username": "'+username+'", "password": "'+password+'"}';
		
		var config = {
			headers:{
				'Content-Type':'application/json'
			}
		}
		
		$http.post('http://0.0.0.0:5000/api/v1/login/', data, config)
		.success(function(data, status, header, config){
			if (data.auth == 0 || data.auth==2){
				$scope.loginResponse = true;
			}else{
				var storeUser = storeUserAsprin(data.user.user_id, data.user.user_type);
				if(storeUser == 1){
					postApsinData(data.user.user_id);
				}
			}
		})
		.error(function(data, status, header, config){
			console.log(status + " "+header);
		});
	}
	

	
}]);


asprinApp.controller('signupoCrtl',['$scope','$http','$location', function($scope,$http,$location){
	var asprinPrice = restoreAsprin();
	$scope.filename = asprinPrice.filename;
	$scope.page = asprinPrice.page;
	$scope.price = asprinPrice.sumPDF;
	$scope.tprice = asprinPrice.sumPDF;
	$scope.singupResponse = "";
	
	$scope.singup =  function(fullname, email, password){
		var data = '{"names":"'+fullname+'", "email":"'+email+'", "password":"'+password+'"}';
		
		var config = {
			headers:{
				'Content-Type':'application/json'
			}
		}
		
		$http.post('http://0.0.0.0:5000/api/v1/user/', data, config)
		.success(function(data, status, header, config){
			if(data.auth){
				$location.path('/signin-o');
			}else{
				$scope.singupResponse = data.message;
			}
		});
	}
	
}]);


asprinApp.controller('sgininCtrl',['$scope','$http','$location', function($scope,$http,$location){
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
			if (data.auth == 0 || data.auth==2){
				$scope.loginResponse = true;
			}else{
				var storeUser = storeUserAsprin(data.user.user_id, data.user.user_type);
				if (storeUser == 1){
					$location.path('/app/asprin-doc');
				}
				
			}
		})
		.error(function(data, status, header, config){
			console.log(status + " "+header);
		});
	}
}]);


asprinApp.controller('singnup', ['$scope','$http','$location', function($scope, $http, $location){
	$scope.signupFunc = function(fullname,email,password){
		var data = '{"names":"'+fullname+'", "email":"'+email+'", "password":"'+password+'"}';
		
		var config = {
			headers:{
				'Content-Type':'application/json'
			}
		}
		
		$http.post('http://0.0.0.0:5000/api/v1/user/', data, config)
		.success(function(data, status, header, config){
			if(data.auth){
				$location.path('/signin');
			}else{
				$scope.singupResponse = data.message;
			}
		});
	}
}]);

asprinApp.controller('headerNameCtrl', ['$scope','$http', function($scope, $http){
	var data = restoreUserAsprin();
	var user_id = data[0];
	var user_type = data[1];
	
	var url ="http://0.0.0.0:5000/api/v1/user/"+user_id;
	
	$http.get(url).success(function(data,status, header, config){
		$scope.fullname = data.user.names.toUpperCase();
	})
	.error(function(data, status, header, config){
		
	});
	
}]);


asprinApp.controller('appMenuCtrl', ['$scope','$http', function($scope, $http){
	var data = restoreUserAsprin();
	var user_id = data[0];
	var user_type = data[1];
	$scope.menuBookkeeping = false;
	if(user_type == 1){
		$scope.menuPrinters = false;
	}else{
		$scope.menuPrinters = true;
	}
	
}]);



asprinApp.controller('asprinDocCtrl', ['$scope','$http', function($scope,$http){
	var data = restoreUserAsprin();
	var user_id = data[0];
	var user_type = data[1];
	
	if(user_type == 1){
		asprinDocUser();
	}else{
		asprinDocBusiness();
	}
	
	
	
	function asprinDocUser(){
		$scope.thCustomer = false;
		$scope.trCustomer = false;
		var url ="http://0.0.0.0:5000/api/v1/printjobs/user/"+user_id;
		$http.get(url).success(function(data, status, header, config){
			console.log(data);
			$scope.asprins = data.PrintJob;
			
		})
		.error(function(data, status, header, config){
			console.log(data);
		});
	}
	
	function asprinDocBusiness(){
		$scope.thCustomer = true;
		$scope.trCustomer = true;
		
		var url ="http://0.0.0.0:5000/api/v1/printjobs/business/1";
		$http.get(url).success(function(data, status, header, config){
			$scope.asprins = data.PrintJob;
			
			console.log(data);
		})
		.error(function(data, status, header, config){
			console.log(data);
		});
	}
	
	
	
	
	$scope.moreAsprin = function(printer_job_id){
		alert(printer_job_id);
	}
	
	
	$scope.loadPdf = function(file){
		alert(file);
	}
}]);


asprinApp.controller('storageCtrl', ['$scope', '$http', function($scope, $http){
	var data = restoreUserAsprin();
	var user_id = data[0];
	var user_type = data[1];
	
	if(user_type == 1){
		asprinDocUser();
	}else{
		asprinDocBusiness();
	}
	
	var url ="http://0.0.0.0:5000/api/v1/user/"+user_id;
	
	$http.get(url).success(function(data,status, header, config){
		$scope.joined = "Joined Asprin "+data.user.regDate;
	})
	.error(function(data, status, header, config){
		
	});
	
	
	function asprinDocUser(){
		$scope.thCustomer = false;
		$scope.trCustomer = false;
		var url ="http://0.0.0.0:5000/api/v1/printjobs/user/"+user_id;
		$http.get(url).success(function(data, status, header, config){
			$scope.storage = data.storage + " ("+data.percentage+"%) of 1 GB used.";
		})
		.error(function(data, status, header, config){
			console.log(data);
		});
	}
	
	function asprinDocBusiness(){
		$scope.thCustomer = true;
		$scope.trCustomer = true;
		
		var url ="http://0.0.0.0:5000/api/v1/printjobs/business/1";
		$http.get(url).success(function(data, status, header, config){
			$scope.storage = data.storage + " ("+data.percentage+"%) of 1 GB used.";
			
		})
		.error(function(data, status, header, config){
			console.log(data);
		});
	}
}]);



asprinApp.controller('userInfoCtrl', ['$scope','$http','$location', function($scope, $http, $location){
	
	var data = restoreUserAsprin();
	var user_id = data[0];
	var user_type = data[1];
	
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	$scope.months = months;
	$scope.gender = 'Gender';
	$scope.year = 1900; 
	$scope.day = 1;
	$scope.month = 'Jan'
	
	
	
	var url = "http://0.0.0.0:5000/api/v1/user/"+user_id;
	
	$http.get(url).success(function(data, status, header, config){
		console.log(data);
		$scope.names = data.user.names;
		$scope.username = data.user.username;
		if(data.user.gender != 'null' || data.user.gender != null){
			$scope.gender = data.user.gender;
		}
		if(data.user.dob != null){
			$scope.day = parseInt(data.user.dob[0].day);
			$scope.month = data.user.dob[0].month;
			$scope.year = parseInt(data.user.dob[0].year);
		}
		if(data.user.job_title !=null || data.user.job_title != 'undefined'){
			$scope.job_title = data.user.job_title;
		}
	});
	
	
	$scope.updateInfo = function(){
		var gender = $scope.gender == 'Gender'? null:$scope.gender;
		var dob = $scope.year+'-'+$scope.month+'-'+$scope.day;
		
		console.log($scope.job_title);
		
		var data = '{"names":"'+$scope.names+'","username":"'+$scope.username+'","gender":"'+gender+'","dob":"'+dob+'","job_title":"'+$scope.job_title+'"}';
		
		var config = {
			headers:{
				'Content-Type':'application/json'
			}
		}
		
		var url = "http://0.0.0.0:5000/api/v1/user/"+user_id+"/";
		
		$http.put(url, data, config).success(function(data,status,header,config){
			console.log(data);
		});
		
	}
	
	
	$scope.changePassword = function(){
		var c_password = $scope.c_password;
		var n_password = $scope.n_password;
		var co_password = $scope.co_password;
		
		alert(n_password +" "+ co_password);
		
		if(n_password != co_password){
			$scope.pMessage = 'New password and confirm password not matching!';
			$scope.pResponse = true;
		}else{
			var data = '{"password":"'+c_password+'","n_password":"'+n_password+'"}';
			var config = {
				headers:{
					'Content-Type':'application/json'
				}
			}
			
			var url = 'http://0.0.0.0:5000/api/v1/user/password/'+user_id;
			$http.put(url,data,config).success(function(data, status, header, config){
				console.log(data);
			}).error(function(data, status, header, config){
				console.log(data);
			});
		}
	}
	
}]);


// Helper function

function storeAsprin(Asprin){
	localStorage.setItem('asprin', JSON.stringify(Asprin));
	return 1;
}

function restoreAsprin(){
	var storeData = Array();
	storeData = localStorage.getItem('asprin');
	if(storeData){
		return JSON.parse(storeData);
	}else{
		return 0;
	}
}

function destroyAsprin(){
	localStorage.removeItem('asprin');
	return 1;
}

function restoreUserAsprin(){
	var user_id = localStorage.getItem('asprin_u__');
	var user_type = localStorage.getItem('asprin_t__');
	var data = new Array(user_id,user_type); 
	return data;
}

function storeUserAsprin(User,UserType){
	localStorage.setItem('asprin_u__', User);
	localStorage.setItem('asprin_t__', UserType);
	return 1;
}






function postApsinData(user_id, $http, $location){
		var data = restoreAsprin();
		var json = '{"file":"'+data.path+'", "filename":"'+data.filename+'","size":"'+data.size+'","exec_time":"'+data.time+'","cyan":"'+data.cyan+'", "magenta":"'+data.magenta+'","yellow":"'+data.yellow+'","black":"'+data.black+'","price":"'+data.sumPDF+'","tonner_cost":"'+data.sumtonner+'","page":"'+data.page+'","user_id":"'+user_id+'","business_id":"1"}';
		
		var config = {
			headers:{
				'Content-Type':'application/json'
			}
		}
		//console.log(json);
		$http.post('http://0.0.0.0:5000/api/v1/printjob/', json, config)
		.success(function(data, status, header, config){
			if(status == 200){
				var removeAsprin = destroyAsprin();
				$location.path('/app/asprin-doc');
			}
		})
		.error(function(data, status, header, config){
			console.log(status);
		});
	}






