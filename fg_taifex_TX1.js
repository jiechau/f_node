// use taifex future data to create TX1_taifex data
// 注意, input 的 日期是"今日的日期", 不是合約月
var fs = require('fs');
eval(fs.readFileSync('./fconfig.js')+''); // the '' is necessary to let './fconfig.js' as a string
eval(fs.readFileSync('./fconfig_1_ffgg.js')+'');
/*
// $ /usr/local/bin/node fg_taifex_TX1 index TX1 2018 12 31  r
//                   [0] [1] 		   [2]  [3] [4]  [5] [6] [7]
[ '/usr/local/bin/node',
  '/home/jie/f_node/fg_taifex_TX1',
  'index',
  'TX1',
  '2018',
  '12',
  '31',  
  'r' ]
*/
//console.log(process.argv);
//console.log(process.argv.length); // 7 (0-6)

var taifex_type = process.argv[2]; // index, option, future
var commodity = process.argv[3]; // TX1, TX, TXO, all, ...
var year = parseInt(process.argv[4]); // 2018
var month = parseInt(process.argv[5]); // 12
var day = parseInt(process.argv[6]); // 12
var yearString = '' + year;
var monthString = ("0" + month).slice(-2);
var dayString = ("0" + day).slice(-2);
var isReCheck = process.argv[7]; // r:re-check content length, n: normal just check file existed in ff
if (! (isReCheck === "r")) {
	isReCheck = "n";
}

// quote_daily2_contract/index/TX1/index_TX1_am_taifex.csv
// quote_daily2_contract/index/TX1/index_TX1_pm_taifex.csv

var currentContractMonth = getThisContractMonth2(yearString + '/' + monthString + '/' + dayString);

var log_msg = "fg_taifex_TX1 start:" + isReCheck + " " + taifex_type + "_" + commodity + ":" + yearString + "_" + monthString + "_" + dayString + " " + currentContractMonth;
console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);

			// am
			// filename_fg 不存在, 就不用做了
			var option_input = {
				'taifex_type' : 'future',
				'contract_name' : 'TX',
				'contract_month' : currentContractMonth,
				'contract_hours' : 'am'
			}
			var filename_fg = getFutureFilename_fg (option_input);			
			if (! fs.existsSync(filename_fg)) {
				log_msg = 'err existed_not: ' + filename_fg;
				console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
			} else {
				var input_data = {
					'contract_month' : currentContractMonth,
					'contract_hours' : 'am',
				};
				//console.log(input_data);
				taifex_create_TX1(input_data);
			}
			
			// pm
			// filename_fg 不存在, 就不用做了
			var option_input = {
				'taifex_type' : 'future',
				'contract_name' : 'TX',
				'contract_month' : currentContractMonth,
				'contract_hours' : 'pm'
			}
			var filename_fg = getFutureFilename_fg (option_input);			
			if (! fs.existsSync(filename_fg)) {
				log_msg = 'err existed_not: ' + filename_fg;
				console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
			} else {
				var input_data = {
					'contract_month' : currentContractMonth,
					'contract_hours' : 'pm',
				};
				//console.log(input_data);
				taifex_create_TX1(input_data);
			}

			
			
process.on('uncaughtException', function (err) {
    var log_msg = 'err uncaughtException' + err;
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
}); 

			

