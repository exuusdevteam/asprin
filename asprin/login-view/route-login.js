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
			
			
			printers[key] = printerObject(value['printer-info'], value['printer-icons'], value['printer-state-reasons'], value['print-color-mode-default']);
			
		});
		
		console.log(printers);
		$scope.printers = printers;
	}


	function printerObject(name, icon, status, colorMode){
		return JSON.parse('{"printerName":"'+name+'","printerIcon":"'+icon+'","printerStatus":"'+status+'","colorMode":"'+colorMode+'"}');
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






 