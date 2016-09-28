// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


		var Printer = require('node-printer');
		  //HP_Color_LaserJet_Pro_MFP_M177fw
		  //console.log(Printer.list());
		  
		  //http://localhost:631/printers
		  
		  var ipp = require('ipp');
			/*var uri = "ipp://localhost/printers/HP_LaserJet_P2015_Series";
			var data = ipp.serialize({
				"operation":"Get-Printer-Attributes",
				"operation-attributes-tag": {
					"attributes-charset": "utf-8",
					"attributes-natural-language": "en",
					"printer-uri": uri
				}
			});

			ipp.request(uri, data, function(err, res){
				if(err){
					return console.log(err);
				}
				var res = JSON.stringify(res,null,2);
				//console.log(JSON.parse(res));
			});*/
			
			
			// Add missing operation code
			ipp.operations['CUPS-Get-Printers'] = 0x4002;

			// The rest is identical to your code:

			var uri = "http://localhost:631";
			var data = ipp.serialize({
			  "operation": "CUPS-Get-Printers",
			  "operation-attributes-tag": {
				"attributes-charset": 'utf-8',
				"attributes-natural-language": 'en-us'
			  }
			});

			ipp.request(uri, data, function(err, res){
			  if(err){
				return console.log(err);
			  }
			var res = JSON.stringify(res,null,2);
			  console.log(JSON.parse(res));
			});
			
			
		 var fs = require('fs');

		fs.readFile('test.pdf', function(err, data) { 
		  if (err)
			throw err;

		  var printer = ipp.Printer("http://localhost:631/printers/HP_Color_LaserJet_Pro_MFP_M177fw");
		  var msg = {
			"operation-attributes-tag": {
			  "requesting-user-name": "William",
			  "job-name": "My Test Job",
			  "document-format": "application/pdf"
			},
			data: data
		  };
		  printer.execute("Print-Job", msg, function(err, res){
			console.log(res);
		  });
		});