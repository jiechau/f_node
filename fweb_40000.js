
var fs = require('fs');
eval(fs.readFileSync('./fconfig_local')+''); // the '' is necessary to let './fconfig.js' as a string
// 下面這3行放到 fconfig_local, 沒有進入 hg 版本控制 
// 如果沒有, 就讓它 throw Error: ENOENT 
//var filedir = '/home/jie/f_data'; // 存放交易資料的地方
//var nodedir = '/home/jie/f_node'; // 存放 程式 的地方, fweb_template_stem 的 爸爸
//var addrlocalhost = '192.168.123.166';

var service_port = '40000';



//透過http模組啟動web server服務
const http = require('http');
const server = http.createServer(function (req, res) {
	//設定回應為text文件，並回應 Hello World!
	
	const { method, url } = req;
	const { headers } = req;

	// this is the default page
	res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
	res.write('40000 <a href="http://' + addrlocalhost + ':40000">this</a><br/>\n');
	res.write('40001 <a href="http://' + addrlocalhost + ':40001">fweb_index_mi</a><br/>\n');
	res.write('40002 <a href="http://' + addrlocalhost + ':40002">fweb_optionmax</a><br/>\n');
	res.write('40003 <a href="http://' + addrlocalhost + ':40003">fweb_option1</a><br/>\n');
	res.write('40004 <a href="http://' + addrlocalhost + ':40004">fweb_optionT</a><br/>\n');
	res.end();
	return;


	//res.write(html_content);
	//res.write(JSON.stringify(fg_hash));

})

// start web server
server.listen(service_port, function () {  
  console.log('http://' + addrlocalhost + ":" + service_port);
})

process.on('uncaughtException', function (err) {
    var log_msg = 'err uncaughtException' + err;
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
}); 
