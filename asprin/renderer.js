var ipp = require('ipp');
// Add missing operation code
ipp.operations['CUPS-Get-Printers'] = 0x4002;
// The rest is identical to your code:
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
	console.log(JSON.parse(res));
});