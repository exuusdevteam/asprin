 var PythonShell = require('python-shell');
	  
	   var pyshell = new PythonShell('python/script.py', { mode:'text'});
		// sends a message to the Python script via stdin 
		pyshell.send('hello');
	   	
		pyshell.on('message', function (message) {
		  // received a message sent from the Python script (a simple "print" statement) 
			var printer_data = JSON.parse(message);
			
			$.each(printer_data, function(key,val){
				console.log(val);
				
			});
			
		
		});