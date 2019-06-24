// 
var fs = require('fs');
eval(fs.readFileSync('./fconfig.js')+''); // the '' is necessary to let './fconfig.js' as a string
eval(fs.readFileSync('./fconfig_1_ffgg.js')+'');
/*
我把這幾個年度下載的檔案 (手動下載的)
放到 ~/f_data/quote_daily1_raw_ms950/future/TX/year
集合成 fut.all 和 fut.TX
寫了一個程式修改
+新的 header
+結尾 加上 ",,一般,,"
+日期格式改成 YYYY/MM/DD

儲存成 (取代原來的)
這個部分仍然需要先做 utf8 再轉回 ms950
~/f_data/quote_daily1_raw_ms950/future/all/month/1998/future_all_1998_08_ms950.csv
~/f_data/quote_daily1_raw_ms950/future/TX/month/1998/future_TX_1998_08_ms950.csv

然後執行一次
fg_taifex_1998.sh (fg_taifex.sh 裡面的 option 其實是不用再跑一次的, 所以我手動 copy 了 fg_taifex_1998.sh)
fg_taifex_TX1.sh

再執行
/usr/local/bin/node /home/jie/f_node/fg_taifex.js future TX 2019 01 r
/usr/local/bin/node /home/jie/f_node/fg_taifex_TX1.js index TX1 2019 01 r

*/
//console.log(process.argv);
//console.log(process.argv.length); // 7 (0-6)

var log_msg = "ff_taifex_year start";
// console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);



// fut.all 和 fut.TX
var commodity_to_do = ["all","TX"]; 

// ~/f_data/quote_daily1_raw_ms950/future/TX/year/fut.all (**這裡注意, 放在TX**)
// ~/f_data/quote_daily1_raw_ms950/future/TX/year/fut.TX
var source_year_ms950 = {
	"all": filedir + "/" + ff_stem950 + "/future/TX/year/fut.all",
	"TX": filedir + "/" + ff_stem950 + "/future/TX/year/fut.TX"
}
// ~/f_data/quote_daily1_raw_ms950/future/all/month/1998/future_all_1998_08_ms950.csv
// ~/f_data/quote_daily1_raw_ms950/future/TX/month/1998/future_TX_1998_08_ms950.csv
var filename_month_ms950 = {
	"all": filedir + "/" + ff_stem950 + "/future/all/month/1998/future_all_1998_08_ms950.csv",
	"TX": filedir + "/" + ff_stem950 + "/future/TX/month/1998/future_TX_1998_08_ms950.csv"
}
var filename_month_utf8 = {
	"all": filedir + "/" + ff_stem + "/future/all/month/1998/future_all_1998_08_utf8.csv",
	"TX": filedir + "/" + ff_stem + "/future/TX/month/1998/future_TX_1998_08_utf8.csv"
}

//console.log(source_year_ms950);
//console.log(filename_month_ms950);
//console.log(filename_month_utf8);

for (var i_todo=0; i_todo<commodity_to_do.length; i_todo++){

	var content_fg_utf8 = "交易日期,契約,到期月份(週別),開盤價,最高價,最低價,收盤價,漲跌價,漲跌%,成交量,結算價,未沖銷契約數,最後最佳買價,最後最佳賣價,歷史最高價,歷史最低價,是否因訊息面暫停交易,交易時段,價差對單式委託成交量";
	content_fg_utf8 += "\r\n";

	var commodity = commodity_to_do[i_todo];

	var data = fs.readFileSync(source_year_ms950[commodity]);
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
			
			// fields.length = 16, 
			if (fields.length != 16) {
				console.log("ERR fields.length != 16");
				console.log(source_year_ms950[commodity]);
				console.log(fields);
				return;
			} 
			// 一行最後一個字元不可是 ','
			//console.log(lines[i].trim().charAt(lines[i].trim().length - 1));
			//return;
			if (lines[i].trim().charAt(lines[i].trim().length - 1) == ',') {
				console.log("ERR last charAt == ','");
				console.log(source_year_ms950[commodity]);
				console.log(fields);
				return;
			} 
			// 修正日期 1998/9/1 改成 YYYY/MM/DD
//			var trading_date = fields[0].trim(); // '2018/11/1'
			var line_this = lines[i].trim();
			var pattern1 = "^(\\d\\d\\d\\d)/(\\d+)/(\\d+)(,.+)\$";
			var re1 = new RegExp(pattern1);
			var found_ar = line_this.match(re1);
			if ((found_ar != undefined) && (found_ar[1] != undefined)) {
				//console.log(found_ar);
				//return;
				var trading_date = found_ar[1] + "/" + ("0" + found_ar[2]).slice(-2) + "/" + ("0" + found_ar[3]).slice(-2);
				var line_new = trading_date + found_ar[4];
				// all ok
				content_fg_utf8 += line_new + ",,一般,," + "\r\n"; 
			} else {
				console.log("ERR found_ar == undefined");
				console.log(source_year_ms950[commodity]);
				console.log(line_this);
				return;
			}
			
		} // 排除 第一行 和 最後一行
		counts++;	
	} // filename_ff 中的每一行

	// 只好再自己轉回 ms950
	var iconv = require('iconv-lite');
	var content_fg_ms950 = iconv.encode(content_fg_utf8, 'big5');
	
	// write file
	// console.log(content_fg_utf8);
	fs.writeFileSync(filename_month_ms950[commodity], content_fg_ms950, 'latin1');
	fs.writeFileSync(filename_month_utf8[commodity], content_fg_utf8, 'utf8');
	console.log(filename_month_ms950[commodity]);
	console.log(filename_month_utf8[commodity]);
}



process.on('uncaughtException', function (err) {
    var log_msg = 'err uncaughtException' + err;
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
}); 












