/*

組合 各個年份內的報價
$ /usr/local/bin/node fg_twse index MI 2018 12  r

utf8 下
quote_daily1_raw_utf8/index/MI/month/2018/index_MI_twse_201812_utf8.csv
放到
./quote_daily2_contract/index/MI/index_MI_twse.csv


ff file:

MI:
/home/jie/f_data/quote_daily1_raw_utf8/index/MI/month/2018/index_MI_twse_201812_utf8.csv
VOS: shares
VOL: 在這裡是成交金額
VOT: transactions
trading_date, VOS,    	VOL,   	VOT,    		CL,   		vvv,  	
"日期","成交股數","成交金額","成交筆數","發行量加權股價指數","漲跌點數",
"107/12/03","6,946,878,025","170,729,899,437","1,404,681","10,137.87","249.84",
"107/12/04","5,608,425,855","145,775,659,155","1,229,128","10,083.54","-54.33",
"107/12/05","4,775,470,945","115,520,209,449","1,028,395","9,916.74","-166.80",
" 91/01/02","5,519,520,000","167,326,230,700","1,095,999","5,600.05","48.81",
" 91/01/03","5,479,543,997","159,385,471,296","1,098,559","5,526.32","-73.73",
" 91/01/04","5,322,566,906","162,751,005,416","1,079,712","5,638.53","112.21",
" 91/01/07","5,281,278,214","170,618,421,634","1,097,557","5,834.89","196.36",
(兩位數的民國年, 前面會有空白)                                                                                                                          (null) or y,          am/pm,

fg file:																																										  
																																										  
MI:																																										  /home/jie/f_node
/home/jie/f_data/quote_daily2_contract/index/MI/index_MI_twse.csv
VOS: shares
VOL: 在這裡是成交金額
VOT: transactions
trading_date, VOS,    	VOL,   		VOT,    CL,   	vvv,  
2018/12/03,6946878025,170729899437,1404681,10137.87,249.84
2018/12/04,5608425855,145775659155,1229128,10083.54,-54.33
2018/12/05,4775470945,115520209449,1028395,9916.74,-166.80
0.header to english
1.split by '","'
2.trim " and ,
3.107 to 2018, (兩位數的民國年, 前面會有空白)  

*/
var fs = require('fs');
eval(fs.readFileSync('./fconfig.js')+''); // the '' is necessary to let './fconfig.js' as a string
eval(fs.readFileSync('./fconfig_1_ffgg.js')+'');
/*
// $ /usr/local/bin/node fg_twse index MI  2018 12  r
// $ /usr/local/bin/node fg_twse index TX1 2018 12  r
//                   [0] [1] 		[2]   [3] [4]  [5] [6]
[ '/usr/local/bin/node',
  '/home/jie/f_node/fg_twse',
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

var log_msg = "fg_twse start:" + isReCheck + " " + taifex_type + "_" + commodity + "_twse_" + year  + ("0" + month).slice(-2) + "*";
console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);

// a very simple check
if (process.argv.length < 7) {
	var log_msg = "process.argv.length < 7";
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
	return;
}

var fg_hash_tmp = {};
// ./quote_daily2_contract/index/MI/index_MI_twse.csv
var filename_fg = filedir + '/' + fg_stem + '/' + taifex_type + '/' + commodity + '/' + taifex_type + '_' + commodity + '_' + 'twse.csv';
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


// /home/jie/f_data /quote_daily1_raw_utf8 /index/MI/month/2018/index_MI_twse_201812_utf8.csv
// 看參數 12 月的就做 12月即可
var filename_utf8 = filedir + '/' + ff_stem + '/' + taifex_type + '/' + commodity + '/month/' + year + '/' + taifex_type + '_' + commodity + '_twse_' + year + monthString + '_utf8.csv';
log_msg = "fg do: " + filename_utf8;
console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
//log_msg = filename_utf8;
//console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
if (! fs.existsSync(filename_utf8)) {
	log_msg = "file not exist: " + filename_utf8;
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
	return;
}


// readfile to hash, replace

var data = fs.readFileSync(filename_utf8);
// 以換行字元作為切割點，將內容切成一個大陣列
var lines = data.toString().split('\r\n');
var counts = 0;
for (var i=0; i<lines.length; ++i) {
// lines.forEach(function(line) {			
	// 一行行處理
	var fields = lines[i].toString().trim().split('","');
	// fields[0] = ' 86/05/02', fields[0].charAt(3) == '/'
	// 排除 第一行 和 最後一行
	if ((counts >= 1) && (fields[0] != undefined) && (fields[2] != undefined)) {

		/*
		1.split by '","'
		2.trim " and ,
		3.107 to 2018, (兩位數的民國年, 前面會有空白)  
		*/	
	
		// trading_date,VOS,VOL,VOT,CL,vvv
		// "日期","成交股數","成交金額","成交筆數","發行量加權股價指數","漲跌點數",
		// "107/12/03","6,946,878,025","170,729,899,437","1,404,681","10,137.87","249.84",
		var line_this = lines[i].toString().trim().replace(/","/g,"==").replace(/[,"]/g,'').trim().replace(/==/g,',');
		// console.log(line_this);
		// 107/12/14,3931391957,97548330195,886843,9774.16,-84.60
		var fields_this = line_this.toString().trim().split(',');
		[trading_yy, trading_mm, trading_dd ]= fields_this[0].trim().split('/');
		var trading_date = (parseInt(trading_yy.trim()) + 1911).toString() + "/" + trading_mm + "/" + trading_dd;
		// console.log(trading_date);
		var line_date = trading_date + "," + fields_this[1] + "," + fields_this[2] + "," + fields_this[3] + "," + fields_this[4] + "," + fields_this[5];
		// console.log(line_date);
		
		fg_hash_tmp[trading_date] = line_date.trim();
		
	} // 排除 第一行 和 最後一行
	counts++;	
} // filename_ff 中的每一行


// write file, fg_hash_tmp
var twse_header = {
	'MI':'trading_date,VOS,VOL,VOT,CL,vvv'
};

if (Object.keys(fg_hash_tmp).length == 0){
	log_msg = "nothing_ff_fg: " + filename_utf8;
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
	return;
}


// sort fg_hash_tmp keys 2018/11/14
var keysSorted = Object.keys(fg_hash_tmp);
keysSorted = Object.keys(fg_hash_tmp).sort(function(a,b){
	return Number(a.toString().replace(/\//g,''))-Number(b.toString().replace(/\//g,''))
});
// console.log(keysSorted);
			
var content_fg = twse_header[commodity] + '\n'; // changed \r\n to \n
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

log_msg = "OKg_twse:" + len_sort +":" + content_fg.length + " " + filename_fg;
console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
// return;
	









		

process.on('uncaughtException', function (err) {
    var log_msg = 'err uncaughtException' + err;
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
}); 










