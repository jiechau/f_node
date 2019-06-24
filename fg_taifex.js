// 從下載後的檔案 ff_stem. 整理成合約, 放在 fg_stem
var fs = require('fs');
eval(fs.readFileSync('./fconfig.js')+''); // the '' is necessary to let './fconfig.js' as a string
eval(fs.readFileSync('./fconfig_1_ffgg.js')+'');
/*
// $ /usr/local/bin/node fg_taifex  option TXO 2018 12  r
//                   [0] [1] 		[2]    [3] [4]  [5] [6]
[ '/usr/local/bin/node',
  '/home/jie/f_node/fg_taifex',
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
var monthString = ("0" + month).slice(-2);
var isReCheck = process.argv[6]; // r:re-check content length, n: normal just check file existed in ff
if (! (isReCheck === "r")) {
	isReCheck = "n";
}

var log_msg = "fg start:" + isReCheck + " " + taifex_type + "_" + commodity + "_" + year + "_" + ("0" + month).slice(-2);
console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);


			// filename_ff
			// /home/jie/f_node/quote_daily1_raw_utf8/option/TXO/month/2018/option_TXO_2018_11_utf8.csv	
			var filename_ff = filedir + '/' + ff_stem + '/' + taifex_type + '/' + commodity + '/month/' + year + '/' + taifex_type + '_' + commodity + '_' + year + '_' + monthString + '_utf8.csv';

			// call fdaily2contract, 
			/*
			var input_data = {
				'taifex_type': taifex_type, // "option", "future"
				'commodity': commodity, // "TXO"
				'filename_ff': /home/jie/f_node/quote_daily1_raw_utf8/option/TXO/month/2018/option_TXO_2018_11_utf8.csv
				'filedir' : '/home/jie/f_node',
				'ff_stem' : 'quote_daily1_raw_utf8',
				'fg_stem' : 'quote_daily2_contract'
			};
			*/
			var input_data = {
				'taifex_type': taifex_type, // "option", "future"
				'commodity': commodity, // "TXO"
				'filename_ff': filename_ff,
				'filedir' : filedir,
				'ff_stem' : ff_stem,
				'fg_stem' : fg_stem
			};
			
			// filename_ff 不存在, 就不用做了
			if (! fs.existsSync(filename_ff)) {
				// Do something
				log_msg = 'err existed_not: ' + filename_ff;
				console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
			} else {
				//console.log(input_data);
				taifex_parse(input_data);
			}

			

process.on('uncaughtException', function (err) {
    var log_msg = 'err uncaughtException' + err;
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
}); 












