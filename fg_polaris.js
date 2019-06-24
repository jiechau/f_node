/*

組合 各個年份內的報價
$ /usr/local/bin/node fg_polaris index MI  2018 12  r
$ /usr/local/bin/node fg_polaris index TX1 2018 12  r
(比較麻煩的是 TX1 有分 am/pm)

TX1: utf8 下
quote_daily1_raw_utf8/index/TX1/month/2018/index_TX1_am_polaris_20181214_utf8.csv
quote_daily1_raw_utf8/index/TX1/month/2018/index_TX1_pm_polaris_20181214_utf8.csv
組合, 放到
quote_daily2_contract/index/TX1/index_TX1_am_polaris.csv
quote_daily2_contract/index/TX1/index_TX1_pm_polaris.csv

MI: utf8 下
quote_daily1_raw_utf8/index/MI/month/2018/index_MI_polaris_20181214_utf8.csv
組合, 放到
quote_daily2_contract/index/MI/index_MI_polaris.csv


ff file:

MI:
/home/jie/f_node/quote_daily1_raw_utf8/index/MI/month/2018/index_MI_polaris_20181214_utf8.csv
trading_date, OP,    	HI,    		LO,    		CL,   		vvv,  	vvp,	VOL,    pVIX    
日期,		開盤,		最高,		最低,		收盤,		漲跌,	漲跌%, 	成交量, 恐慌指數
1987/01/07,	1063.13,	1075.81,	1063.13,	1075.81,	0,		0,		42.31,	0
2018/12/13,	9827.32,	9871.96,	9815.5,		9858.76,	42.31,	0.431,	1122.12,17
2018/12/14,	9818.95,	9818.95,	9718.94,	9774.16,	-84.6,	-0.8581,957.53,	18.1

TX1:
/home/jie/f_node/quote_daily1_raw_utf8/index/TX1/month/2018/index_TX1_am_polaris_20181214_utf8.csv
trading_date, OP,    	HI,    		LO,    		CL,    		vvv,  	vvp,	VOL,    pVIX,    	HV,      	OI
日期,		開盤,		最高,		最低,		收盤,		漲跌,	漲跌%, 	成交量, 恐慌指數, 歷史波動率, 未平倉量
1998/07/21,	8101,		8131,		8036,		8043,		0,		0,		208,	0,			0,			0
1998/07/22,	7851,		7950,		7820,		7870,		-173,	-2.1509,360,	0,			0,			0
2018/12/13,	9831,		9872,		9790,		9856,		38,		0.387,	106106,	17,			14.94,		79177
2018/12/14,	9805,		9809,		9676,		9730,		-126,	-1.2784,139345,	18.1,		15.14,		69472

                                                                                                                                                                  (null) or y,          am/pm,

fg file:																																										  
																																										  
MI:																																										  /home/jie/f_node
/home/jie/f_data/quote_daily2_contract/index/TX1/index_MI_polaris.csv

TX1:
/home/jie/f_data/quote_daily2_contract/index/TX1/index_TX1_am_polaris.csv

*/
var fs = require('fs');
eval(fs.readFileSync('./fconfig.js')+''); // the '' is necessary to let './fconfig.js' as a string
eval(fs.readFileSync('./fconfig_1_ffgg.js')+'');
/*
// $ /usr/local/bin/node fg_polaris index MI  2018 12  r
// $ /usr/local/bin/node fg_polaris index TX1 2018 12  r
//                   [0] [1] 		[2]   [3] [4]  [5] [6]
[ '/usr/local/bin/node',
  '/home/jie/f_node/fg_polaris',
  'index',
  'TX1',
  '2018',
  '12',
  'r' ]
*/
//console.log(process.argv);
//console.log(process.argv.length); // 7 (0-6)

var taifex_type = process.argv[2]; // option, future, index
var commodity = process.argv[3]; // TX, TXO, all, ...
year = parseInt(process.argv[4]); // 2018
month = parseInt(process.argv[5]); // 12
var monthString = ("0" + month).slice(-2);
var isReCheck = process.argv[6]; // r:re-check content length, n: normal just check file existed in ff
if (! (isReCheck === "r")) {
	isReCheck = "n";
}

var log_msg = "fg_polaris start:" + isReCheck + " " + taifex_type + "_" + commodity + "_polaris_" + year  + ("0" + month).slice(-2) + "*";
console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);

// a very simple check
if (process.argv.length < 7) {
	var log_msg = "process.argv.length < 7";
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
	return;
}



// 這裡 wait_here
// MI OK
// 但是 TX1 分成 am/pm
var isTX1ampm = {
	'MI': ['',''],
	'TX1': ['_am', '_pm']
};

var irunCnt = 1;
if (commodity == 'TX1') irunCnt = 2;

for (var irun=0; irun<irunCnt; irun++) {




var fg_hash_tmp = {};

// ./quote_daily2_contract/index/TX1/index_TX1_polaris.csv
var filename_fg = filedir + '/' + fg_stem + '/' + taifex_type + '/' + commodity + '/' + taifex_type + '_' + commodity + isTX1ampm[commodity][irun] + '_' + 'polaris.csv';
//console.log(filename_fg);			

// 先讀舊的資料
// read old data to fg_hash_tmp
if (fs.existsSync(filename_fg)) {
	// read it all to fg_hash_tmp
	var data_fg = fs.readFileSync(filename_fg);
	var lines_fg = data_fg.toString().split('\n'); // changed \r\n
	var counts_fg = 0;
	for (var i_fg=0; i_fg<lines_fg.length; ++i_fg) {
		var fields_fg = lines_fg[i_fg].toString().split(',');
		// 排除 第一行 和 最後一行
		if ((counts_fg >= 1) && (fields_fg[0] != undefined) && (fields_fg[2] != undefined)) {
			//console.log(fields_fg[0]);
			fg_hash_tmp[fields_fg[0].trim()] = lines_fg[i_fg].toString().trim();
		}
		counts_fg++;
	}
	counts_fg--;
	log_msg = 'fg_exist:' + (counts_fg - 1) + " " + filename_fg;
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
} else {
	log_msg = 'fg_existed_not: ' + filename_fg;
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
}


// /home/jie/f_node /quote_daily1_raw_utf8 /index/TX1/month/2018/index_TX1_polaris_20181214_utf8.csv
// for 目錄裡面有幾個做幾個
var dir_to_check = filedir + "/" + ff_stem + "/" + taifex_type + "/" + commodity + "/month/" + year;
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
var files = fs.readdirSync(dir_to_check);
for (var i_file=0; i_file<files.length; ++i_file) {
	// index_TX1_am_polaris_20181214_utf8.csv
	var polaris_utf8 = files[i_file].toString().trim();
	
	var pattern1 = "^(.+" + isTX1ampm[commodity][irun] + "_polaris_" + year + monthString + ".+)_utf8.csv\$";
	var re1 = new RegExp(pattern1);
	
	var found_ar = polaris_utf8.match(re1);
	if ((found_ar != undefined) && (found_ar[1] != undefined)) {
		
		var filename_utf8 = filedir + '/' + ff_stem + '/' + taifex_type + '/' + commodity + '/month/' + year + '/' + polaris_utf8;
		log_msg = "fg do: " + filename_utf8;
		console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
		//log_msg = filename_utf8;
		//console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
		
		// readfile to hash, replace

		var data = fs.readFileSync(filename_utf8);
		// 以換行字元作為切割點，將內容切成一個大陣列
		var lines = data.toString().split('\r\n');
		var counts = 0;
		for (var i=0; i<lines.length; ++i) {
		// lines.forEach(function(line) {			
			// 一行行處理
			var fields = lines[i].toString().split(',');
			// fields[0] = '2007/05/02', fields[0].charAt(4) == '/'
			// 排除 第一行 和 最後一行
			if ((counts >= 1) && (fields[0] != undefined) && (fields[2] != undefined)) {
				var trading_date = fields[0].trim(); // '2018/11/01'
				fg_hash_tmp[trading_date] = lines[i].trim();
			} // 排除 第一行 和 最後一行
			counts++;	
		} // filename_ff 中的每一行
		// });	
//	} else{
//		log_msg = "err found_ar: " + pattern1 + " " + polaris_utf8;
//		console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
	}
}


// write file, fg_hash_tmp
var polaris_header = {
	'MI':'trading_date,OP,HI,LO,CL,vvv,vvp,VOL,pVIX',
	'TX1':'trading_date,OP,HI,LO,CL,vvv,vvp,VOL,pVIX,HV,OI'
};

if (Object.keys(fg_hash_tmp).length == 0){
	log_msg = "nothing_ff_fg: " + polaris_utf8;
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
	return;
}


// sort fg_hash_tmp keys 2018/11/14
var keysSorted = Object.keys(fg_hash_tmp);
keysSorted = Object.keys(fg_hash_tmp).sort(function(a,b){
	return Number(a.toString().replace(/\//g,''))-Number(b.toString().replace(/\//g,''))
});
// console.log(keysSorted);
			
var content_fg = polaris_header[commodity] + '\n'; // changed \r\n
var len_sort = keysSorted.length;
for (var i_sort=0; i_sort<len_sort; ++i_sort) {
	// keysSorted[i]
	content_fg = content_fg + fg_hash_tmp[keysSorted[i_sort]] + '\n'; // changed \r\n
}
//console.log(content_fg);
var options = {
	'recursive' : true,
	'mode' : 0o755 
};
var mkdirp_path = filename_fg.substr(0,filename_fg.lastIndexOf("/"));
fs.mkdirSync(mkdirp_path, options);
// console.log(mkdirp_path);


// write file
fs.writeFileSync(filename_fg, content_fg);
//console.log("www");

log_msg = "OKg_polaris:" + len_sort +":" + content_fg.length + " " + filename_fg;
console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
// return;
	


}






		

process.on('uncaughtException', function (err) {
    var log_msg = 'err uncaughtException' + err;
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
}); 










