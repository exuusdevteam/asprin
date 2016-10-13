var asprinDeskApp = angular.module("asprinLoginApp",['ngRoute','ngFileUpload']);

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
			templateUrl:'app-views/asprindoc.html'
		})
		.when('app/',{
			templateUrl:'app-views/asprindoc.html'
		})
		.when('/app/order',{
			templateUrl:'app-views/order.html'
		})
		.when('/app/printers', {
			templateUrl:'app-views/printers.html'
		})
		.when('/app/settings', {
			templateUrl:'app-views/settings.html'
		})
		.when('/app/offers', {
			templateUrl:'app-views/offers.html'
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
					$location.path('/app/asprindoc');
				}
				
			}
		})
		.error(function(data, status, header, config){
			console.log(status + " "+header);
		});
	}
}]);

asprinDeskApp.controller('profileCtrl', ['$scope','$http', function($scope, $http){
	var data = restoreUserAsprin();
	var user_id = data[0];
	var user_type = data[1];
	
	var url ="http://0.0.0.0:5000/api/v1/user/"+user_id;
	
	$http.get(url).success(function(data,status, header, config){
		console.log(data);
		$scope.fullname = data.user.names;
		$scope.username = data.user.username;
		
	})
	.error(function(data, status, header, config){
		
	});
}]);


asprinDeskApp.controller('usageCtrl', ['$scope','$http', function($scope,$http){
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
		$scope.joined = "Joined Asprin "+data.user.regDate+".";
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





asprinDeskApp.controller('appMenuCtrl', ['$scope', function($scope){
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




	function printerslist($scope,$http,serverData){
		var ipp = require('./node_modules/ipp');
		ipp.operations['CUPS-Get-Printers'] = 0x4002;
		var uri = "http://127.0.0.1:631/printers";
		var data = ipp.serialize({
			"operation": "CUPS-Get-Printers",
			"operation-attributes-tag": {
			"attributes-charset": 'utf-8',
			"attributes-natural-language": 'en-us',
			"limit": 10
			}
		});
		ipp.request(uri, data, function(err, res){
			if(err){
				return console.log(err);
			}
			res = JSON.stringify(res,null,2);
			var parsePrinter = JSON.parse(res);
			//console.log(parsePrinter['printer-attributes-tag']);
			//alert(parsePrinter['printer-attributes-tag']);
			
			renderPrinters($scope,$http,parsePrinter['printer-attributes-tag'], serverData);
		});
	}

	
	function renderPrinters($scope, $http, printerObj, serverData){
		printers = Array();
		$scope.numPrinters = printerObj.length == 1 ? printerObj.length+" Printer":  printerObj.length+ " Printers";
		angular.forEach(printerObj, function(value, key){
			//console.log(value['printer-uuid']);
			if(!serverData.printers.length ){
				if(!key){
					$scope.printerIcon = value['printer-icons'];
					$scope.printerName = value['printer-info'];
					$scope.uuid = value['printer-uuid'];
					$scope.business_id = 1;
					$scope.printerLocation = value['printer-more-info'];
					$scope.uri = value['printer-uri-supported'];
					$scope.printerNotif = true;
				}
			}else if(serverData.printers.length < printerObj.length){
				angular.forEach(serverData.printers, function(v, k){
					//console.log(v['uuid'] +" : "+ value['printer-uuid']);
					if(v['uuid'] != value['printer-uuid']){
						$scope.printerIcon = value['printer-icons'];
						$scope.printerName = value['printer-info'];
						$scope.uuid = value['printer-uuid'];
						$scope.business_id = 1;
						$scope.printerLocation = value['printer-more-info'];
						$scope.uri = value['printer-uri-supported'];
						$scope.printerNotif = true;
					}
				});
			}else{
				$scope.printerNotif = false;
			}
			
			
			printers[key] = printerObject(value['printer-info'], value['printer-icons'], value['printer-state-reasons'], value['color-supported']);
			
		});
		
		console.log(printers);
		$scope.printers = printers;
	}


	function printerObject(name, icon, status, color){
		return JSON.parse('{"printerName":"'+name+'","printerIcon":"'+icon+'","printerStatus":"'+status+'","colorMode":"'+color+'"}');
	}
	


	asprinDeskApp.controller('printersCtrl',['$scope','$http', function($scope, $http){
			getPrinters();	
		
			function getPrinters(){
				var url = "http://0.0.0.0:5000/api/v1/printer/business/1";
				$http.get(url).success(function(data,status, header,config){
					printerslist($scope, $http, data);
					console.log(data);
				})
				.error(function(data, status, header, config){

				});
			}
		
			$scope.addPrinter =  function(printerName, uuid, business_id, printerIcon, printerLocation, uri){
				var data = '{"name":"'+printerName+'","uri":"'+uri+'","uuid":"'+uuid+'", "icon":"'+printerIcon+'","location":"'+printerLocation+'","business_id":"'+business_id+'"}';
				var config = {
					headers:{
						'Content-Type':'application/json'
					}
				}
				
				$http.post("http://0.0.0.0:5000/api/v1/printer/", data, config)
					.success(function(data, status, header, config){
					getPrinters();
				})
				.error(function(data, status, header, config){
					console.log(data + status);
				});
			}
	}]);


asprinDeskApp.controller('asprinDocCtrl', ['$scope','$http', function($scope, $http){
	var data = restoreUserAsprin();
	var user_id = data[0];
	var user_type = data[1];
	
	user_type == 1 ? asprinDocUser() : asprinDocBusiness();
	
	function asprinDocUser(){
		$scope.thCustomer = false;
		$scope.trCustomer = false;
		var url ="http://0.0.0.0:5000/api/v1/printjobs/user/"+user_id;
		$http.get(url).success(function(data, status, header, config){
			console.log(data);
			$scope.asprins = data.PrintJob;
			$scope.numDoc = data.PrintJob.length == 1 ? data.PrintJob.length+" Document": data.PrintJob.length+" Documents"; 
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
			$scope.numDoc = data.PrintJob.length == 1 ? data.PrintJob.length+" Document": data.PrintJob.length+" Documents"; 
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



asprinDeskApp.controller('userInfoCtrl', ['$scope','$http', function($scope, $http){
	var data = restoreUserAsprin();
	var user_id = data[0];
	var user_type = data[1];
	
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	$scope.months = months;
	$scope.genders = ['Gender','M','F'];
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


asprinDeskApp.controller('singnup', ['$scope','$http','$location', function($scope, $http, $location){
	$scope.signupFunc = function(fullname,email,password){
		var data = '{"names":"'+fullname+'", "email":"'+email+'", "password":"'+password+'"}';
		
		var config = {
			headers:{
				'Content-Type':'application/json'
			}
		}
		
		alert(data);
		
		$http.post('http://0.0.0.0:5000/api/v1/user/', data, config)
		.success(function(data, status, header, config){
			if(data.auth){
				$location.path('/');
			}else{
				$scope.singupResponse = data.message;
			}
		});
	}
}]);


asprinDeskApp.controller('pdfUploadAppCtrl',['$scope', 'Upload','$timeout', '$location', function($scope, Upload, $timeout, $location){
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



asprinDeskApp.controller('appPriceCtrl', ['$scope','$http','$location', function($scope,$http,$location){
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
				$location.path('/app/asprindoc');
			}
		})
		.error(function(data, status, header, config){
			console.log(status);
		});
	}


asprinDeskApp.controller('organisationCtrl', ['$scope','$http','$location', function($scope, $http, $location){
	//
	var data = restoreUserAsprin();
	var user_id = data[0];
	var user_type = data[1];
	
	$scope.showOrg = false;
	$scope.newOrg = false;
	
	checkUserType();
	
	function checkUserType(){
		var url ="http://0.0.0.0:5000/api/v1/user/"+user_id;
		$http.get(url).success(function(data, status, header, config){
			var business_id = data.user.business_id;
			data.user.user_type == 0 ? ShowUserOrganisation(business_id) : $scope.newOrg = true;
		});
	}
	
	
	function ShowUserOrganisation(business_id){
		var url = "http://0.0.0.0:5000/api/v1/business/"+business_id;
		$http.get(url).success(function(data, status, header, config){
			$scope.organisation = data.Business.name;
			$scope.business_id = business_id;
			$scope.showOrg = true;
			$scope.newOrg = false;
		});
	}
	
	$scope.orgFunc = function(business_id){
		alert(business_id);
	}
	
	$scope.newOrgFunc = function(orgName){
		alert(orgName);
		var data = '{"name":"'+orgName+'"}';
		var config = {
			headers:{
				'Content-Type':'application/json'
			}
		}
		
		var url ="http://0.0.0.0:5000/api/v1/business/"+user_id;
		$http.post(url, data, config)
		.success(function(data, status, header, config){
			console.log(data);	
		})
		.error(function(data, status, header, config){
			console.log(data);
		});
		
	}
	
	$scope.createTeam = function(){
		alert("create team");
	}
	
}]);
 