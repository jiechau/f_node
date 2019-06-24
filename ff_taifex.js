// 抓 期貨選擇權每日行情下載, 一次只抓一個檔案 ms950
// http://www.taifex.com.tw/cht/3/futDailyMarketView
// http://www.taifex.com.tw/cht/3/optDailyMarketView
var fs = require('fs');
eval(fs.readFileSync('./fconfig.js')+''); // the '' is necessary to let './fconfig.js' as a string
eval(fs.readFileSync('./fconfig_1_ffgg.js')+'');
/*
// 一次只抓一個檔案 ms950
// $ /usr/local/bin/node ff_taifex  option TXO 2018 12  r
//                   [0] [1] 		[2]    [3] [4]  [5] [6]
[ '/usr/local/bin/node',
  '/home/jie/f_node/ff_taifex',
  'option',
  'TXO',
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

// loop do a whole month
//var commodity1 = 'TXO'; // all, special, TXO, xxO.....
var commodity1 = commodity; // all, special, TXO, xxO.....
var commodity2 = ''; // have value if commodity1=special

// console.log(special_commodity.includes(commodity));
if (special_commodity.includes(commodity)) {
	commodity2 = commodity1;
	commodity1 = "specialid";
}

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
			// /home/jie/f_data /quote_daily1_raw_ms950/option/TXO/month/2018/option_TXO_2018_11_ms950.csv	
			// /home/jie/f_data /quote_daily1_raw_utf8/option/TXO/month/2018/option_TXO_2018_11_utf8.csv	
			var filename_ms950 = filedir + '/' + ff_stem950 + '/' + taifex_type + '/' + commodity + '/month/' + year + '/' + taifex_type + '_' + commodity + '_' + year + '_' + monthString + '_ms950.csv';
			var filename_utf8 = filedir + '/' + ff_stem + '/' + taifex_type + '/' + commodity + '/month/' + year + '/' + taifex_type + '_' + commodity + '_' + year + '_' + monthString + '_utf8.csv';
			//log_msg = filename_ms950;
			//console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
			//log_msg = filename_utf8;
			//console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
			
			// go fetch
			var input_data = {
				'taifex_type': taifex_type, // "option", "future"
				'commodity_id': commodity1, // "TXO"
				'commodity_id2': commodity2,
				'start_date': start_date,
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
				taifex_post(input_data);
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






