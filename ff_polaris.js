/*
這個將 手動下載 polaris 單純只是轉檔成 utf8
$ /usr/local/bin/node ff_polaris  index TX1 2018 12  r
就把  目錄下 201812 所有的檔案 ^(.+_polaris_201812.+)_ms950.csv$ , 
例如
quote_daily1_raw_ms950/index/TX1/month/2018/index_TX1_polaris_20181214_ms950.csv
都轉到 utf8 下
quote_daily1_raw_utf8/index/TX1/month/2018/index_TX1_polaris_20181214_utf8.csv
一個對一個. 就這樣

*/
var fs = require('fs');
eval(fs.readFileSync('./fconfig.js')+''); // the '' is necessary to let './fconfig.js' as a string
eval(fs.readFileSync('./fconfig_1_ffgg.js')+'');
/*
// $ /usr/local/bin/node ff_polaris index MI  2018 12  r
// $ /usr/local/bin/node ff_polaris index TX1 2018 12  r
//                   [0] [1]        [2]   [3] [4]  [5] [6]
[ '/usr/local/bin/node',
  '/home/jie/f_node/ff_polaris',
  'index',
  'TX1',
  '2018',
  '12',
  'r' ]
*/
//console.log(process.argv);
//console.log(process.argv.length); // 7 (0-6)

var iconv = require('iconv-lite');

var taifex_type = process.argv[2]; // option, future, index
var commodity = process.argv[3]; // TX, TXO, all, ...
year = parseInt(process.argv[4]); // 2018
month = parseInt(process.argv[5]); // 12
var monthString = ("0" + month).slice(-2);
var isReCheck = process.argv[6]; // r:re-check content length, n: normal just check file existed in ff
if (! (isReCheck === "r")) {
	isReCheck = "n";
}

var log_msg = "polaris start:" + isReCheck + " " + taifex_type + "_" + commodity + "_polaris_" + year + ("0" + month).slice(-2) + "*";
console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);

// a very simple check
if (process.argv.length < 7) {
	var log_msg = "process.argv.length < 7";
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
	return;
}




// /home/jie/f_data /quote_daily1_raw_ms950 /index/TX1/month/2018/index_TX1_polaris_20181214_ms950.csv	
// /home/jie/f_data /quote_daily1_raw_utf8 /index/TX1/month/2018/index_TX1_polaris_20181214_utf8.csv

// for 目錄裡面有幾個做幾個
var dir_to_check = filedir + "/" + ff_stem950 + "/" + taifex_type + "/" + commodity + "/month/" + year;
if (! fs.existsSync(dir_to_check)) {
	log_msg = 'err no dir: ' + dir_to_check;
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
	var options = {
		'recursive' : true,
		'mode' : 0o755 
	};
	fs.mkdirSync(dir_to_check, options);
	log_msg = 'create dir: ' + dir_to_check;
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
} 

var files = fs.readdirSync(filedir + "/" + ff_stem950 + "/" + taifex_type + "/" + commodity + "/month/" + year);

for (var i_file=0; i_file<files.length; ++i_file) {
	// index_TX1_polaris_20181214_ms950.csv
	var polaris_ms950 = files[i_file].toString().trim();
	var polaris_utf8;

	// MI 不用, 但是 TX1 有分 am/pm, 都在 pattern1 內
	
	var pattern1 = "^(.+_polaris_" + year + monthString + ".+)_ms950.csv\$";
	var re1 = new RegExp(pattern1);
	
	var found_ar = polaris_ms950.match(re1);
	if ((found_ar != undefined) && (found_ar[1] != undefined)) {
		polaris_utf8 = found_ar[1] + "_utf8.csv";
		var filename_ms950 = filedir + '/' + ff_stem950 + '/' + taifex_type + '/' + commodity + '/month/' + year + '/' + polaris_ms950;
		var filename_utf8 = filedir + '/' + ff_stem + '/' + taifex_type + '/' + commodity + '/month/' + year + '/' + polaris_utf8;
		log_msg = "ff do: " + filename_ms950;
		console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
		//log_msg = filename_utf8;
		//console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
		//console.log("");

		// 抓過的不用抓了
		if (fs.existsSync(filename_utf8) && (isReCheck === "n")) {
			// Do something
			log_msg = 'existed: ' + filename_utf8;
			console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
		} else {
			// 這裡才是真的轉檔
			var options = {
				'recursive' : true,
				'mode' : 0o755 
			};
			var mkdirp_path = filename_utf8.substr(0,filename_utf8.lastIndexOf("/"));
			fs.mkdirSync(mkdirp_path, options);
			var buffer_content_utf8 = iconv.decode(fs.readFileSync(filename_ms950), 'Big5');
			fs.writeFileSync(filename_utf8, buffer_content_utf8, 'utf8');
			log_msg = 'polaris done: ' + filename_utf8;
			console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
		}


//	} else{
//		log_msg = "err found_ar: " + pattern1 + " " + polaris_ms950;
//		console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
	}
}


process.on('uncaughtException', function (err) {
    var log_msg = 'err uncaughtException' + err;
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
}); 






