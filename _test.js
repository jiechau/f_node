var fs = require('fs');
eval(fs.readFileSync('./fconfig.js')+''); // the '' is necessary to let './fconfig.js' as a string

	var date_this = "2019/01/27";
	console.log(date_this.substr(0,4));
	console.log(date_this.substr(5,2));
	console.log(date_this.substr(8,2));
	
	var ISO8601 = ['<style color=red>sun</style>','mon','tue','wed','thu','fri','<style color=green>sat</style>','<style color=red>sun</style>'];
	var weekday = dateFormat(new Date(parseInt(date_this.substr(0,4)), parseInt(date_this.substr(5,2)) - 1, parseInt(date_this.substr(8,2))),"N");
	console.log(weekday);
	console.log(ISO8601[weekday]);