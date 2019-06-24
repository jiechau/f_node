// 臺灣證券交易所 首頁 > 交易資訊 > 盤後資訊 > 每日市場成交資訊 (發行量加權股價指數)
// http://www.twse.com.tw/exchangeReport/FMTQIK?response=csv&date=20181201
// 日期可以只指定 每個月第一天, 他會自動抓最近的整個月份的
// "日期","成交股數","成交金額","成交筆數","發行量加權股價指數","漲跌點數",
// "107/12/03","6,946,878,025","170,729,899,437","1,404,681","10,137.87","249.84",
// "107/12/04","5,608,425,855","145,775,659,155","1,229,128","10,083.54","-54.33",
// " 91/01/02","5,519,520,000","167,326,230,700","1,095,999","5,600.05","48.81",
// " 91/01/03","5,479,543,997","159,385,471,296","1,098,559","5,526.32","-73.73",
var fs = require('fs');
eval(fs.readFileSync('./fconfig.js')+''); // the '' is necessary to let './fconfig.js' as a string
eval(fs.readFileSync('./fconfig_1_ffgg.js')+'');
/*
// 一次只抓一個檔案 ms950
// $ /usr/local/bin/node ff_twse  index MI  2018 12  r
//                   [0] [1] 	  [2]   [3] [4]  [5] [6]
[ '/usr/local/bin/node',
  '/home/jie/f_node/ff_twse',
  'index',
  'MI',
  '2018',
  '12',
  'r' ]
*/
//console.log(process.argv);
//console.log(process.argv.length); // 7 (0-6)

var taifex_type = process.argv[2]; // option, future
var commodity = process.argv[3]; // TX, TXO, all, ...
year = parseInt(process.argv[4]); // 2018
month = parseInt(process.argv[5]); // 12
var isReCheck = process.argv[6]; // r:re-check content length, n: normal just check file existed in ff
if (! (isReCheck === "r")) {
	isReCheck = "n";
}

var log_msg = "ff start:" + isReCheck + " " + taifex_type + "_" + commodity + "_" + year + "_" + ("0" + month).slice(-2);
console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);

// a very simple check
if (process.argv.length < 6) {
	return;
}

var commodity1 = commodity; // all, special, TXO, xxO.....
var commodity2 = ''; // have value if commodity1=special

/*

// 一次只抓一個檔案 ms950
// 不用這些 for 了

for (var year = 2018; year > 2000; year--) { // 2000
	for (var month = 12; month > 0; month--) {
		if (! ((year == 2018) && (month == 12))) {
*/
	
			// find the 1st and last day of the month
			var start_date = dateFormat(new Date(year, month - 1, 1), "yyyy/mm/dd");
			var end_date  = dateFormat(new Date(year, month - 1 + 1, 0), "yyyy/mm/dd");
			var monthString = ("0" + month).slice(-2);
			// log_msg = year + "/" + monthString + ": " + start_date + "," + end_date;
			// console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);

			// create dir
			// 不應該在這裡 create dir
			// 最後都成功, 要寫入檔案之前再 create 才對
			
			// filename
			// /home/jie/f_data/quote_daily1_raw_ms950/index/MI/month/2018/index_MI_twse_201812_ms950.csv
			// /home/jie/f_data/quote_daily1_raw_utf8/index/MI/month/2018/index_MI_twse_201812_utf8.csv	
			var filename_ms950 = filedir + '/' + ff_stem950 + '/' + taifex_type + '/' + commodity + '/month/' + year + '/' + taifex_type + '_' + commodity + '_twse_' + year + monthString + '_ms950.csv';
			var filename_utf8 = filedir + '/' + ff_stem + '/' + taifex_type + '/' + commodity + '/month/' + year + '/' + taifex_type + '_' + commodity + '_twse_' + year + monthString + '_utf8.csv';
			//log_msg = filename_ms950;
			//console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
			//log_msg = filename_utf8;
			//console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
			
			// go fetch
			var input_data = {
				'taifex_type': taifex_type, // "option", "future"
				'commodity_id': commodity, // "TXO"
				'commodity_id2': commodity2,
				'start_date': start_date, // 這裡在 twse 要用1個月的第一天
				'end_date': end_date,
				'filename_ms950': filename_ms950,
				'filename_utf8': filename_utf8
			};
			
			// 抓過的不用抓了
			if (fs.existsSync(filename_utf8) && (isReCheck === "n")) {
				// Do something
				log_msg = 'existed_ff: ' + filename_utf8;
				console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
			} else {
				
				//console.log(filename_ms950);
				//console.log(filename_utf8);
				twse_FMTQIK_get(input_data);

			}

/*	
		}
	}
}
*/


process.on('uncaughtException', function (err) {
    var log_msg = 'err uncaughtException' + err;
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
}); 






