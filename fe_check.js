/*

do some check

*/
var fs = require('fs');
eval(fs.readFileSync('./fconfig.js')+''); // the '' is necessary to let './fconfig.js' as a string
eval(fs.readFileSync('./fconfig_1_ffgg.js')+'');
/*
/usr/local/bin/node /home/jie/f_node/ff_taifex.js future TX $YYYY $MM r
/usr/local/bin/node /home/jie/f_node/ff_taifex.js future all $YYYY $MM r
/usr/local/bin/node /home/jie/f_node/ff_taifex.js option TXO $YYYY $MM r
/usr/local/bin/node /home/jie/f_node/ff_taifex.js option all $YYYY $MM r
*/

// check ff_taifex.js future TX
// check ff_taifex.js future all
// future_TX_1998_08_ms950.csv: 開始都是 1998 08
// http://www.taifex.com.tw/cht/3/futDailyMarketView
var check_h = {};
for (var i_year=1998;i_year<2020;i_year++) {	
	for (var i_month=1;i_month<13;i_month++) {
		if ((i_year != 1998) || (i_month >= 8)) {
			var yearString = '' + i_year;
			var monthString = ("0" + i_month).slice(-2);
			var contract_month_string = yearString + monthString;
			var option_filename = {
				'taifex_type' : 'future',
				'commodity' : 'TX',
				'yearString' : yearString,
				'monthString' : monthString,
				'encoding' : 'ms950'
			}
			var filename_ff_ms950 = getTaifexFilename_ff (option_filename);
			option_filename['encoding'] = 'utf8';
			var filename_ff_utf8 = getTaifexFilename_ff (option_filename);
			// check consistency
			if (fs.existsSync(filename_ff_ms950) && (! fs.existsSync(filename_ff_utf8))) {
				console.log("not exist: " + filename_ff_utf8);
			}
			
			// check not exist
			// 原始就沒有資料
			if ((! fs.existsSync(filename_ff_ms950))
			&& (yearString != '2019')	
			){
				if (check_h[yearString] == undefined) check_h[yearString] = {};
				check_h[yearString][monthString] = true;
				//console.log("not exist: " + yearString + "_" + monthString);
			}
		}
	} // month
} // year
// console.log(check_h);
var msgString = "TX  :01 02 03 04 05 06 07 08 09 10 11 12\n";
var yMissAR = Object.keys(check_h);
for (var iAR=0; iAR<yMissAR.length; iAR++){
	msgString += yMissAR[iAR] + ":";
	for (var iMM=1;iMM<=12;iMM++) {
		sMM = ("0" + iMM).slice(-2);
		if (check_h[yMissAR[iAR]][sMM] != undefined){
			msgString += ' X ';
		} else {
			msgString += '   ';
		}
	}
	msgString += '\n';
}
console.log(msgString);
console.log("");

// check ff_taifex.js option TXO
// check ff_taifex.js option all
// option_TXO_2001_12_ms950.csv: 開始都是 2001 12
// http://www.taifex.com.tw/cht/3/optDailyMarketView
var check_h = {};
for (var i_year=2001;i_year<2020;i_year++) {	
	for (var i_month=1;i_month<13;i_month++) {
		if ((i_year != 2001) || (i_month >= 12)) {
			var yearString = '' + i_year;
			var monthString = ("0" + i_month).slice(-2);
			var contract_month_string = yearString + monthString;
			var option_filename = {
				'taifex_type' : 'option',
				'commodity' : 'TXO',
				'yearString' : yearString,
				'monthString' : monthString,
				'encoding' : 'ms950'
			}
			var filename_ff_ms950 = getTaifexFilename_ff (option_filename);
			option_filename['encoding'] = 'utf8';
			var filename_ff_utf8 = getTaifexFilename_ff (option_filename);
			// check consistency
			if (fs.existsSync(filename_ff_ms950) && (! fs.existsSync(filename_ff_utf8))) {
				console.log("not exist: " + filename_ff_utf8);
			}
			
			// check not exist
			// 原始就沒有資料
			if ((! fs.existsSync(filename_ff_ms950))
			&& (yearString != '2019')	
			){
				if (check_h[yearString] == undefined) check_h[yearString] = {};
				check_h[yearString][monthString] = true;
				console.log("not exist: " + yearString + "_" + monthString);
			}
		}
	} // month
} // year
//console.log(check_h);
var msgString = "TXO :01 02 03 04 05 06 07 08 09 10 11 12\n";
var yMissAR = Object.keys(check_h);
for (var iAR=0; iAR<yMissAR.length; iAR++){
	msgString += yMissAR[iAR] + ":";
	for (var iMM=1;iMM<=12;iMM++) {
		sMM = ("0" + iMM).slice(-2);
		if (check_h[yMissAR[iAR]][sMM] != undefined){
			msgString += ' X ';
		} else {
			msgString += '   ';
		}
	}
	msgString += '\n';
}
console.log(msgString);




/*

/usr/local/bin/node /home/jie/f_node/ff_twse.js index MI $YYYY $MM r
/usr/local/bin/node /home/jie/f_node/ff_polaris.js index MI $YYYY $MM r
/usr/local/bin/node /home/jie/f_node/ff_polaris.js index TX1 $YYYY $MM r

/usr/local/bin/node /home/jie/f_node/fg_taifex.js future TX $YYYY $MM r
#/usr/local/bin/node /home/jie/f_node/fg_taifex.js future all $YYYY $MM r
/usr/local/bin/node /home/jie/f_node/fg_taifex.js option TXO $YYYY $MM r
#/usr/local/bin/node /home/jie/f_node/fg_taifex.js option all $YYYY $MM r
/usr/local/bin/node /home/jie/f_node/fg_twse.js index MI $YYYY $MM r
/usr/local/bin/node /home/jie/f_node/fg_polaris.js index MI $YYYY $MM r
/usr/local/bin/node /home/jie/f_node/fg_polaris.js index TX1 $YYYY $MM r
# use taifex future to generate TX1
/usr/local/bin/node /home/jie/f_node/fg_taifex_TX1.js index TX1 $YYYY $MM r
*/




process.on('uncaughtException', function (err) {
    var log_msg = 'err uncaughtException' + err;
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
}); 



