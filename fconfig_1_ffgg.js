// ////////////////////////////////////////////////////////////////////////////////////////
// configs for ff fg (crawel and parse data)

/*

期貨交易所
期貨每日行情下載
http://www.taifex.com.tw/cht/3/futDailyMarketView
future:
/home/jie/f_data/quote_daily1_raw_utf8/future/TX/month/2018/future_TX_2018_11_utf8.csv
trading_date, contract_name, contract_month,    OP,    HI,    LO,    CL,    vvv,  vvp,   VOL,    SP,          OI,         LBB,         LBS,       HHI,       HLO,             breaker, contract_hours,             diff_vol
    交易日期,     契約,      到期月份(週別),開盤價,最高價,最低價,收盤價, 漲跌價,漲跌%,成交量,結算價,未沖銷契約數,最後最佳買價,最後最佳賣價,歷史最高價,歷史最低價,是否因訊息面暫停交易,       交易時段, 價差對單式委託成交量
  2018/11/01,       TX,              201811,  9750,  9827,  9705,  9787,     62,0.64%,140555,  9788,       88528,        9787,        9788,     11087,      9326,         (null) or *,      一般/盤後,   (null) or 0 or int,
                                                                                                                                                                          (null) or y,          am/pm,
***<

期貨交易所
選擇權每日行情下載
http://www.taifex.com.tw/cht/3/optDailyMarketView
option:
/home/jie/f_data/quote_daily1_raw_utf8/option/TXO/month/2018/option_TXO_2018_11_utf8.csv
trading_date, contract_name, contract_month, contract_strike, contract_type,    OP,    HI,    LO,    CL,   VOL,    SP,          OI,         LBB,         LBS,       HHI,       HLO,             breaker, contract_hours    
    交易日期,    契約,       到期月份(週別),          履約價,        買賣權,開盤價,最高價,最低價,收盤價,成交量,結算價,未沖銷契約數,最後最佳買價,最後最佳賣價,歷史最高價,歷史最低價,是否因訊息面暫停交易,       交易時段
  2018/11/01,     TXO,               201811,      10000.0000,     買權/賣權,    73,    94,    60,    80,  9614,    80,       18909,          80,          81,       995,      22.5,         (null) or *,      一般/盤後,
                                                                  call/pull                                                                                                                 (null) or y,          am/pm,
***<

臺灣證券交易所
首頁 > 交易資訊 > 盤後資訊 > 每日市場成交資訊
http://www.twse.com.tw/exchangeReport/FMTQIK?response=csv&date=20181201
VOS: shares
VOL: 在這裡是成交金額
VOT: transactions
(兩位數的民國年, 前面會有空白)
trading_date, VOS,    	VOL,   	VOT,    		CL,   		vvv,  	
"日期","成交股數","成交金額","成交筆數","發行量加權股價指數","漲跌點數",
"107/12/03","6,946,878,025","170,729,899,437","1,404,681","10,137.87","249.84",
"107/12/04","5,608,425,855","145,775,659,155","1,229,128","10,083.54","-54.33",
" 91/01/02","5,519,520,000","167,326,230,700","1,095,999","5,600.05","48.81",
" 91/01/03","5,479,543,997","159,385,471,296","1,098,559","5,526.32","-73.73",
***<


元大寶來證卷 加權指數
MI:
/home/jie/f_data/quote_daily1_raw_utf8/index/MI/month/2018/index_MI_polaris_20181214_utf8.csv
trading_date, OP,    	HI,    		LO,    		CL,   		vvv,  	vvp,	VOL,    pVIX    
日期,		開盤,		最高,		最低,		收盤,		漲跌,	漲跌%, 	成交量, 恐慌指數
1987/01/07,	1063.13,	1075.81,	1063.13,	1075.81,	0,		0,		42.31,	0
2018/12/13,	9827.32,	9871.96,	9815.5,		9858.76,	42.31,	0.431,	1122.12,17
2018/12/14,	9818.95,	9818.95,	9718.94,	9774.16,	-84.6,	-0.8581,957.53,	18.1
***<

元大寶來證卷 台指近
TX1:
/home/jie/f_data/quote_daily1_raw_utf8/index/TX1/month/2018/index_TX1_polaris_20181214_utf8.csv
trading_date, OP,    	HI,    		LO,    		CL,    		vvv,  	vvp,	VOL,    pVIX,    	HV,      	OI
日期,		開盤,		最高,		最低,		收盤,		漲跌,	漲跌%, 	成交量, 恐慌指數, 歷史波動率, 未平倉量
1998/07/21,	8101,		8131,		8036,		8043,		0,		0,		208,	0,			0,			0
1998/07/22,	7851,		7950,		7820,		7870,		-173,	-2.1509,360,	0,			0,			0
2018/12/13,	9831,		9872,		9790,		9856,		38,		0.387,	106106,	17,			14.94,		79177
2018/12/14,	9805,		9809,		9676,		9730,		-126,	-1.2784,139345,	18.1,		15.14,		69472
***<
     
															  

*/																																										  

// 用在 ff_twse.js
// 臺灣證券交易所 首頁 > 交易資訊 > 盤後資訊 > 每日市場成交資訊 (發行量加權股價指數)
// http://www.twse.com.tw/exchangeReport/FMTQIK?response=csv&date=20181201
function twse_FMTQIK_get (input_option) {

	/*
	var input_data = {
		'taifex_type': taifex_type, // "option", "future", "index"
		'commodity_id': commodity1, // "MI"
		'commodity_id2': commodity2, // ""
		'start_date': '2018/12/01', // 通常設定一個月的第一天
		'end_date': '2018/12/31',   // 通常設定一個月的最後一天
		'filename_ms950': filename_ms950,
		'filename_utf8': filename_utf8
	};
	*/

	var log_msg = " ";

	// 判斷沒有內容的檔案
	var lines_limit = 1;
	var length_limit = 10;

	var taifex_type = input_option['taifex_type']; // "index","option", "future"
	var startdate = input_option['start_date']; //var start_date = '2007/05/01';
	var get_path = "/exchangeReport/FMTQIK?response=csv&date=" + startdate.replace(/\//g,'');
	// console.log(get_path);

	// 這裡應該檢查一下 input_option
	//console.log(post_Referer[taifex_type]);
	//console.log(post_path[taifex_type]);
	//return;

	// mark start
	log_msg = "STa " + input_option['filename_utf8'];
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
	
	var header_data = {
		// GET /exchangeReport/FMTQIK?response=csv&date=20181201 HTTP/1.1
		'Connection': 'keep-alive',
		'Upgrade-Insecure-Requests': '1',
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'Referer': 'http://www.twse.com.tw/zh/page/trading/exchange/FMTQIK.html',
		// 'Accept-Encoding': 'gzip, deflate',
		'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
		//'Cookie': '_ga=GA1.3.492540449.1543607280; _gid=GA1.3.343104030.1545884588; JSESSIONID=F2DF018E02532C3DB072C3E7A941F985; _gat=1',
		'User-Agent':'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Mobile Safari/537.36'
	};
	
	
	// https://stackoverflow.com/questions/6158933/how-to-make-an-http-post-request-in-node-js
	// We need this to build our post string
	// PostCode(data);
	
	var http = require('http');
	
	// An object of options to indicate where to post to
	var post_options = {
		host: 'www.twse.com.tw',
		port: '80',
		path: get_path,
		method: 'GET',
		headers: header_data
	};
	
	var BufferHelper = require('bufferhelper');
	var iconv = require('iconv-lite');
	
	var filename_ms950 = input_option['filename_ms950'];
	var filename_utf8 = input_option['filename_utf8'];
	
	// Set up the request
	var post_req = http.get(post_options, function(res) {
		
		//log_msg = 'CodeDebug:' + res.statusCode + " " + filename_utf8;
		//console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
		
		if (res.statusCode != 200) {
			log_msg = 'CodeERR:' + res.statusCode + " " + filename_utf8;
			console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
			return;
		}
		
		var bufferhelper = new BufferHelper();
		res.on('data', function (chunk) {
			bufferhelper.concat(chunk);
			// console.log(chunk);
		});
		
		// res.on('error', function(err) {
		// 	// Handle error
		// 	console.log(err);
		// });
		
		res.on('end', function (){
			
			// check
			var buffer_content_ms950_tmp = bufferhelper.toBuffer();
			var buffer_content_utf8_tmp = iconv.decode(bufferhelper.toBuffer(), 'Big5');

			var buffer_content_ms950;
			var buffer_content_utf8 = "";
			//console.log(buffer_content_ms950_tmp);
			//console.log(buffer_content_utf8_tmp);
			//console.log("stop");
			//return;
			/* 要扣掉第一行及之後沒有 / 的行數
			"107年12月市場成交資訊"
			"日期","成交股數","成交金額","成交筆數","發行量加權股價指數","漲跌點數",
			"107/12/28","3,085,258,670","74,119,886,036","659,954","9,727.41","85.85",
			"說明:"
			"當日統計資訊含一般、零股、盤後定價，不含鉅額、拍賣、標購。"
			"不加計外幣交易證券交易金額。"
			*/
	
			var check_err = false;
			
			// check content filed 0 should be month date
			var lines = buffer_content_utf8_tmp.toString().split('\r\n');
			var counts = 0;
			for (var i=0; i<lines.length; ++i) {
			//lines.forEach(function(line) {
				// 一行行處理
				if (i == 1) {
					buffer_content_utf8 += lines[i] + '\r\n';
					counts++;
				}
				
				var fields = lines[i].toString().split('","');
				// fields[0] = '107/05/02', fields[0].charAt(4) == '/'
				// enddate = '107/05/31'
				// 排除 第一行 和 最後一行
				if ((i >= 2) && (fields[0] != undefined) && (fields[2] != undefined)) {
					buffer_content_utf8 += lines[i] + '\r\n';
					//console.log(fields[0].substr(0,8));
					if (! (fields[0].substr(5,2) === start_date.substr(5,2))) {
						// "107/12/24
						// start_date = 2018/12/01
						log_msg = "err diff here: " + fields[0] + ", " + start_date;
						console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
						return;
					}
					counts++;
				}
					
			//});
			}
			counts--;
			
			// check content length bytes
			if (buffer_content_utf8.toString().length < length_limit) {
				log_msg = "length<" + length_limit + " " + counts + ":" + buffer_content_ms950_tmp.length + ":" + buffer_content_utf8.length + " " + filename_utf8;
				console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
				return;
			}
			
			// check content lines
			if (counts < lines_limit) {
				log_msg = "lines<" + lines_limit + " " + counts + ":" + buffer_content_ms950_tmp.length + ":" + buffer_content_utf8.length + " " + filename_utf8;
				console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
				return;
			}
			
			// 只好再自己轉回 ms950
			buffer_content_ms950 = iconv.encode(buffer_content_utf8, 'big5');
			
			//console.log(buffer_content_ms950);
			//console.log(buffer_content_utf8);
						
			// check file existed
			var strOKnr = "OKn ";
			if (fs.existsSync(filename_ms950)) {
				var stats = fs.statSync(filename_ms950);
				var fileSizeInBytes = stats["size"];
				if (buffer_content_ms950.length == fileSizeInBytes) {
					log_msg = "existed_size: " + counts + ":" + buffer_content_ms950.length + ":" + buffer_content_utf8.length + " " + buffer_content_ms950.toString().length + ":" + buffer_content_utf8.toString().length + " " + filename_ms950;
					console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
					return;
				} else {
					strOKnr = "OKr ";
				}
			}
				
			// create dir
			// /home/jie/f_data/quote_daily1_raw_ms950/index/MI/month/2018/index_MI_twse_201812_ms950.csv
			// /home/jie/f_data/quote_daily1_raw_utf8/index/MI/month/2018/index_MI_twse_201812_utf8.csv	
			var options = {
				'recursive' : true,
				'mode' : 0o755 
			};
			var mkdirp_path = filename_ms950.substr(0,filename_ms950.lastIndexOf("/"));
			fs.mkdirSync(mkdirp_path, options);
			fs.writeFileSync(filename_ms950, buffer_content_ms950, 'latin1');
			
			var mkdirp_path = filename_utf8.substr(0,filename_utf8.lastIndexOf("/"));
			fs.mkdirSync(mkdirp_path, options);
			fs.writeFileSync(filename_utf8, buffer_content_utf8, 'utf8');
			
			log_msg = strOKnr;
			log_msg = log_msg + counts + ":" + buffer_content_ms950.length + ":" + buffer_content_utf8.length + " " + buffer_content_ms950.toString().length + ":" + buffer_content_utf8.toString().length + " " + filename_utf8;
			console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);

			return;
		}); // res.on('end', function (){

	}); // var post_req = http.request(post_options, function(res) {

}

// 取出 一個 taifex 的 ff 的 filename
// future, option, 格式一樣, 路徑都有分 ms950 和 utf8
// ./quote_daily1_raw_ms950/option/all/month/2001/option_all_2001_12_ms950.csv
function getTaifexFilename_ff (option_filename) {
	/*
	option_filename = {
		'taifex_type' : 'option',
		'commodity' : 'TXO',
		'yearString' : '2018',
		'monthString' : '10',
		'encoding' : 'ms950'
	}
	*/
	var taifex_type = option_filename['taifex_type'];
	var commodity = option_filename['commodity'];
	var yearString = option_filename['yearString'];
	var monthString = option_filename['monthString'];
	
	if (option_filename['encoding'] == 'ms950') {
		return filedir + '/' + ff_stem950 + '/' + taifex_type + '/' + commodity + '/month/' + yearString + '/' + taifex_type + '_' + commodity + '_' + yearString + '_' + monthString + '_ms950.csv';
	} else {
		return filedir + '/' + ff_stem + '/' + taifex_type + '/' + commodity + '/month/' + yearString + '/' + taifex_type + '_' + commodity + '_' + yearString + '_' + monthString + '_utf8.csv';
	}
}

// 用在 ff_taifex.js
// 期貨選擇權每日行情下載
function taifex_post (input_option) {
	/*
	var input_data = {
		'taifex_type': taifex_type, // "option", "future"
		'commodity_id': commodity1, // "TXO"
		'commodity_id2': commodity2, // ""
		'start_date': '2018/12/01', // 通常設定一個月的第一天
		'end_date': '2018/12/31',   // 通常設定一個月的最後一天
		'filename_ms950': filename_ms950,
		'filename_utf8': filename_utf8
	};
	*/
	var log_msg = " ";

	// 判斷沒有內容的檔案
	var lines_limit = 5;
	var length_limit = 500;

	var taifex_type = input_option['taifex_type']; // "option", "future"
	var post_Referer = {
		'future': 'http://www.taifex.com.tw/cht/3/futDailyMarketView',
		'option': 'http://www.taifex.com.tw/cht/3/optDailyMarketView'
	};
	var post_path = {
		'future': '/cht/3/futDataDown',
		'option': '/cht/3/optDataDown'
	};
	
	// 這裡應該檢查一下 input_option
	//console.log(post_Referer[taifex_type]);
	//console.log(post_path[taifex_type]);
	//return;

	// mark start
	log_msg = "STa " + input_option['filename_utf8'];
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);

	// Set the vars
	var startdate = input_option['start_date']; //var start_date = '2007/05/01';
	var enddate = input_option['end_date']; // var end_date = '2007/05/31';
	var forms_data = {
		'down_type': '1',
		'commodity_id': input_option['commodity_id'],
		'commodity_id2': input_option['commodity_id2'],
		'queryStartDate': startdate,
		'queryEndDate': enddate
	};
	
	// Build the post string from an object
	var querystring = require('querystring');
	var post_data = querystring.stringify(forms_data);
	
	var header_data = {
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		// 'Accept-Encoding': 'gzip, deflate',
		'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
		'Cache-Control': 'max-age=0',
		'Connection': 'keep-alive',
		//'Content-Length': '101',
		'Content-Length': Buffer.byteLength(post_data),
		'Content-Type': 'application/x-www-form-urlencoded',
		// 'Cookie': 'JSESSIONID=F7AD9C36E7A5D657E6DA0AC8CCDB86D4.tomcat3; AX-cookie-POOL_PORTAL=AFACBAKM; ROUTEID=.tomcat3; AX-cookie-pool-portal-2018=MJACBAKM; AX-cookie-POOL_PORTAL_web3=ADACBAKM',
		'Host': 'www.taifex.com.tw',
		'Origin': 'http://www.taifex.com.tw',
		'Referer': post_Referer[taifex_type],
		'Upgrade-Insecure-Requests': '1',
		'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Mobile Safari/537.36'
	};
	
	// https://stackoverflow.com/questions/6158933/how-to-make-an-http-post-request-in-node-js
	// We need this to build our post string
	// PostCode(data);
	
	var http = require('http');
	
	// An object of options to indicate where to post to
	var post_options = {
		host: 'www.taifex.com.tw',
		port: '80',
		path: post_path[taifex_type],
		method: 'POST',
		headers: header_data
	};
	
	var BufferHelper = require('bufferhelper');
	var iconv = require('iconv-lite');
	
	var filename_ms950 = input_option['filename_ms950'];
	var filename_utf8 = input_option['filename_utf8'];
	
	// Set up the request
	var post_req = http.request(post_options, function(res) {
		
		//log_msg = 'CodeDebug:' + res.statusCode + " " + filename_utf8;
		//console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
		
		if (res.statusCode != 200) {
			log_msg = 'CodeERR:' + res.statusCode + " " + filename_utf8;
			console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
			return;
		}
		
		var bufferhelper = new BufferHelper();
		res.on('data', function (chunk) {
			bufferhelper.concat(chunk);
			// console.log(chunk);
		});
		
		// res.on('error', function(err) {
		// 	// Handle error
		// 	console.log(err);
		// });
		
		res.on('end', function (){
			
			// TXO check
			var buffer_content_ms950 = bufferhelper.toBuffer();
			var buffer_content_utf8 = iconv.decode(bufferhelper.toBuffer(), 'Big5');
			
			var check_err = false;
			
			// check content filed 0 should be month date
			var lines = buffer_content_utf8.toString().split('\r\n');
			var counts = 0;
			for (var i=0; i<lines.length; ++i) {
			//lines.forEach(function(line) {
				// 一行行處理
								
				var fields = lines[i].toString().split(',');
				// fields[0] = '2007/05/02', fields[0].charAt(4) == '/'
				// enddate = '2007/05/31'
				// 排除 第一行 和 最後一行
				if ((counts >= 1) && (fields[0] != undefined) && (fields[2] != undefined)) {
					//console.log(fields[0].substr(0,8));
					if (! (fields[0].substr(0,8) === enddate.substr(0,8))) {
						// 2007/05
						log_msg = "err diff here: " + fields[0] + ", " + enddate;
						console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
						return;
					}
				}
				counts++;	
			//});
			}
			counts--;

			// check content length bytes
			if (buffer_content_utf8.toString().length < length_limit) {
				log_msg = "length<" + length_limit + " " + counts + ":" + buffer_content_ms950.length + ":" + buffer_content_utf8.length + " " + filename_utf8;
				console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
				return;
			}
			
			// check content lines
			if (counts <= lines_limit) {
				log_msg = "lines<" + lines_limit + " " + counts + ":" + buffer_content_ms950.length + ":" + buffer_content_utf8.length + " " + filename_utf8;
				console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
				return;
			}

			// check file existed
			var strOKnr = "OKn ";
			if (fs.existsSync(filename_ms950)) {
				var stats = fs.statSync(filename_ms950);
				var fileSizeInBytes = stats["size"];
				if (buffer_content_ms950.length == fileSizeInBytes) {
					log_msg = "existed_size: " + counts + ":" + buffer_content_ms950.length + ":" + buffer_content_utf8.length + " " + buffer_content_ms950.toString().length + ":" + buffer_content_utf8.toString().length + " " + filename_ms950;
					console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
					return;
				} else {
					strOKnr = "OKr ";
				}
			}
				
			// create dir
			// /home/jie/f_data /quote_daily1_raw_ms950/option/TXO/month/2018/option_TXO_2018_11_ms950.csv	
			// /home/jie/f_data /quote_daily1_raw_utf8/option/TXO/month/2018/option_TXO_2018_11_utf8.csv	
			var options = {
				'recursive' : true,
				'mode' : 0o755 
			};
			var mkdirp_path = filename_ms950.substr(0,filename_ms950.lastIndexOf("/"));
			fs.mkdirSync(mkdirp_path, options);
			fs.writeFileSync(filename_ms950, buffer_content_ms950, 'latin1');
			
			var mkdirp_path = filename_utf8.substr(0,filename_utf8.lastIndexOf("/"));
			fs.mkdirSync(mkdirp_path, options);
			fs.writeFileSync(filename_utf8, buffer_content_utf8, 'utf8');
			
			log_msg = strOKnr;
			log_msg = log_msg + counts + ":" + buffer_content_ms950.length + ":" + buffer_content_utf8.length + " " + buffer_content_ms950.toString().length + ":" + buffer_content_utf8.toString().length + " " + filename_utf8;
			console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
		});
	}); // var post_req = http.request(post_options, function(res) 
	// post the data
	post_req.write(post_data);
	post_req.end();

} // end of function taifex_post (input_option) {

// 用在 fg_taifex.js
// 從下載後的檔案 ff_stem. 整理成合約, 放在 fg_stem
function taifex_parse (input_option) {

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

	var contract_header = {
		'future' : 'trading_date,contract_name,contract_month,OP,HI,LO,CL,vvv,vvp,VOL,SP,OI,LBB,LBS,HHI,HLO,breaker,contract_hours,diff_vol',
		'option' : 'trading_date,contract_name,contract_month,contract_strike,contract_type,OP,HI,LO,CL,VOL,SP,OI,LBB,LBS,HHI,HLO,breaker,contract_hours'
	};

	var log_msg = " ";

	var taifex_type = input_option['taifex_type']; // "option", "future"
	var commodity = input_option['commodity']; // "TXO"
	var filename_ff = input_option['filename_ff']; 
	var filedir = input_option['filedir']; 
	var ff_stem = input_option['ff_stem']; 
	var fg_stem = input_option['fg_stem']; 

	
	// 這裡應該檢查一下 input_option
	//return;

	// mark start
	log_msg = "STr " + input_option['filename_ff'];
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);

	// read file filename_ff
	// to a big object var quote_data_ff = {};
	// while reading, replace chinese
	//
	// option_TXO_am_201811_call_9100.0000.csv
	// option, TXO, am, 201811, call, 9100
	// 2018/11/01 ...... (後面全部一個值)
	// 2018/11/02 ...... (後面全部一個值)
	// quote_data_ff = {}
	// quote_data_ff['option_TXO_am_201811_call_9100.0000'] = {}
	// quote_data_ff['option_TXO_am_201811_call_9100.0000']['2018/11/01'] = string
	// quote_data_ff['option_TXO_am_201811_call_9100.0000']['2018/11/02'] = string
	var quote_data_ff = {};
	
	// filename_ff 不存在, 就不用做了
	if (! fs.existsSync(filename_ff)) {
		// Do something
		log_msg = 'err existed_not: ' + filename_ff;
		console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
		return;
	}

	var data = fs.readFileSync(filename_ff);
	var contract_key;
	// 以換行字元作為切割點，將內容切成一個大陣列
	var lines = data.toString().split('\r\n');
	var counts = 0;
	for (var i=0; i<lines.length; ++i) {
	// lines.forEach(function(line) {
		
		// counts == i
		
		// 一行行處理
		var fields = lines[i].toString().split(',');
		// fields[0] = '2007/05/02', fields[0].charAt(4) == '/'
		// 排除 第一行 和 最後一行
		if ((counts >= 1) && (fields[0] != undefined) && (fields[2] != undefined)) {
			
			// fields[2] '201811',
			// fields[2] '201811', 排除 option周合約'201811W1' 和 future跨月價差合約'201812/201903'
			if (/^(\d\d\d\d\d\d)$/.test(fields[2].trim())) {

				var trading_date = fields[0].trim(); // '2018/11/01'
				var contract_name = fields[1].trim(); // 'TXO'
				var contract_month = fields[2].trim(); // '201811'
				var contract_hours = 'am';
				if (fields[17].trim() == "盤後") {
					contract_hours = 'pm';
				}
				// quote_data_ff['option_TXO_am_201811_call_9100.0000']['2018/11/01'] = string
				contract_key= taifex_type + '_' + contract_name + '_' + contract_hours + '_' + contract_month;
				// option [3][4]
				if (taifex_type == "option") {
					/*
					fields[0] '2018/11/01',
					fields[1] 'TXO',
					fields[2] '201811W1',
					fields[3] '8800.0000', // 這個有點麻煩 的確有小數點的履約價
					fields[4] '買權',
					fields[17] '一般',
					*/	
					var contract_strike = fields[3].trim().toString();
					// var contract_strike = parseInt(fields[3].trim()).toString();
					var contract_type = "put";
					if (fields[4].trim() == "買權") {
						contract_type = "call";
					}
					// console.log(contract_strike);
					// 'option_TXO_am_201811_call_9100.0000'
					// 'future_TX_201811_am'
					contract_key= taifex_type + '_' + contract_name + '_' + contract_hours + '_' + contract_month + '_' + contract_type + '_' + contract_strike;
				}
			
				//console.log(contract_key);
				//console.log(fields);
				
				// quote_data_ff['option_TXO_am_201811_call_9100.0000']['2018/11/02'] = string
				if (quote_data_ff[contract_key] == undefined) {
					quote_data_ff[contract_key] = {};
				}
				var contract_value = lines[i];
				contract_value = contract_value.replace('買權','call'); // option 的 call
				contract_value = contract_value.replace('賣權','put'); // option 的 put
				contract_value = contract_value.replace('一般','am'); // option/future 的 時段
				contract_value = contract_value.replace('盤後','pm'); // option/future 的 時段
				contract_value = contract_value.replace('*','y'); // option/future 的 熔斷 null or 'y'
				quote_data_ff[contract_key][trading_date] = contract_value;
				
				// console.log(quote_data_ff[contract_key][trading_date]);
				// return;
		
				//log_msg = "err diff here: " + fields[0] + contract_key;
				//console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
				
				
			} // if (/^(\d\d\d\d\d\d)$/
			// fields[2] '201811', 排除 option周合約'201811W1' 和 future跨月價差合約'201812/201903'

		} // 排除 第一行 和 最後一行
		counts++;	
		

	} // filename_ff 中的每一行
	// });

	// 到這裡 quote_data_ff 好了
	// quote_data_ff = {}
	// quote_data_ff['option_TXO_am_201811_call_9100.0000'] = {}
	// quote_data_ff['option_TXO_am_201811_call_9100.0000']['2018/11/01'] = string
	// quote_data_ff['option_TXO_am_201811_call_9100.0000']['2018/11/02'] = string
	// contract_key= 'option_TXO_am_201811_call_9100.0000'
	// contract_key= 'future_TX_am_201811'
	//console.log(quote_data_ff);
	
	// 寫入檔案
	// foreach quote_data_ff keys 'option_TXO_am_201811_call_9100.0000' in quote_data_ff
	var contract_key_ar = Object.keys(quote_data_ff);
	for (var j=0; j<contract_key_ar.length; ++j) {

		// 一個 contract_key : 'option_TXO_am_201811_call_9100.0000'
		contract_key = contract_key_ar[j];
		var [whole_match, contract_month_y, contract_month_m] = contract_key.match(/^[\w]*_[\w]*_[\w]*_(\d\d\d\d)(\d\d)/);
		//console.log(contract_key);
		//console.log(contract_month_y); //contract_month_y =  // 2018
		//console.log(contract_month_m); //contract_month_m =  // 11
		
		//	check file exist, read all 'option_TXO_am_201811_call_9100.0000.csv' into fg_hash_tmp
		// /home/jie/f_node
		// ./quote_daily2_contract/
		// option/TXO/2018/11/option_TXO_am_201811_call_9100.0000.csv
		// future/TX/2018/11/future_TX_am_201811.csv
		var fg_hash_tmp = {};
		var filename_fg = filedir + '/' + fg_stem + '/' + taifex_type + '/' + commodity + '/' + contract_month_y + '/' + contract_month_m  + '/' + contract_key + '.csv';
		//console.log(filename_fg);			

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
		
		// add/replace everything quote_data_ff['option_TXO_am_201811_call_9100.0000'] = {} 
		// into fg_hash_tmp
		var contract_dates_ar = Object.keys(quote_data_ff[contract_key]);
		for (var i_date=0; i_date<contract_dates_ar.length; ++i_date) {
			fg_hash_tmp[contract_dates_ar[i_date]] = quote_data_ff[contract_key][contract_dates_ar[i_date]];
			//console.log(i_date);
			//console.log(contract_dates_ar[i_date]);
			//console.log(quote_data_ff[contract_key][contract_dates_ar[i_date]]);
		}
		//console.log(fg_hash_tmp);
		
		
		// sort fg_hash_tmp keys 2018/11/14
		var keysSorted = Object.keys(fg_hash_tmp);
		keysSorted = Object.keys(fg_hash_tmp).sort(function(a,b){
			return Number(a.toString().replace(/\//g,''))-Number(b.toString().replace(/\//g,''))
		});
		// console.log(keysSorted);
					
		// write back to 'option_TXO_am_201811_call_9100.0000'
		// make sure sync

		var content_fg = contract_header[taifex_type] + '\n'; // changed \r\n
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
		/*
		// always strange things happen, use fs.mkdirSync
		var mkdirp = require('mkdirp');
		mkdirp(mkdirp_path, function(err) { 
			if (err) {
				//{ [Error: EACCES: permission denied, mkdir '/root/home']
				//errno: -13,
				//code: 'EACCES',
				//syscall: 'mkdir',
				//path: '/root/home' }
				log_msg = err.toString() + " " + filename_fg;
				console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
				return;
			}
		});
		*/			
		
		// write file
		fs.writeFileSync(filename_fg, content_fg);
		//console.log("www");
		
		log_msg = "OKg:" + len_sort +":" + content_fg.length + " " + filename_fg;
		console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
		// return;

	} // foreach quote_data_ff keys 'option_TXO_am_201811_call_9100.0000' in quote_data_ff
	// end for
	
} // end of function taifex_parse (input_option) {

// 用在 fg_taifex_TX1.js
// 用 taifex TX 的資料, 合成 TX1 資料
function taifex_create_TX1 (input_option) {

	/*
	var input_data = {
		'contract_month' : currentContractMonth,
		'contract_hours' : 'pm',
	};
	*/

	
	var contract_header = {
		'future' : 'trading_date,contract_name,contract_month,OP,HI,LO,CL,vvv,vvp,VOL,SP,OI,LBB,LBS,HHI,HLO,breaker,contract_hours,diff_vol',
	};

	var log_msg = " ";

	
	var fg_hash_tmp = {};
	/*
	today's month
	read 		   using this month
	read/overwrite using last month
	read/overwrite using files
	*/
	
	// this month, am
	var contract_month  = input_option['contract_month'];
	//console.log(contract_month);
	var option_input = {
			'taifex_type' : 'future',
			'contract_name' : 'TX',
			'contract_month' : contract_month,
			'contract_hours' : input_option['contract_hours'],
			'output_raw_line' : true
		}
	var future_this = getFutureHash (option_input);
	var datesAR = Object.keys(future_this);
	for (var idate=0; idate<datesAR.length; idate++) {
		fg_hash_tmp[datesAR[idate]] = future_this[datesAR[idate]];
	}
	
	// last month, am
	var input_contractmonth_pre = getPrevContractMonth(contract_month);
	//console.log(input_contractmonth_pre);
	option_input = {
			'taifex_type' : 'future',
			'contract_name' : 'TX',
			'contract_month' : input_contractmonth_pre,
			'contract_hours' : input_option['contract_hours'],
			'output_raw_line' : true
		}
	future_this = getFutureHash (option_input);
	datesAR = Object.keys(future_this);
	for (var idate=0; idate<datesAR.length; idate++) {
		fg_hash_tmp[datesAR[idate]] = future_this[datesAR[idate]];
	}
	
	//console.log(fg_hash_tmp);
	//console.log(TX1_pm_hash);
	//return;
	
	// read old file, am
	option_input = {
			'source':'taifex',
			'trading_hours' : input_option['contract_hours'],
			'output_raw_line' : true
		}
	var future_old = getTX1Hash(option_input);
	var datesAR = Object.keys(future_old);
	for (var idate=0; idate<datesAR.length; idate++) {
		fg_hash_tmp[datesAR[idate]] = future_old[datesAR[idate]];
	}
	
	//console.log(fg_hash_tmp);
	//return;
	
	// sort and write file, am
	var sortDateAR = getSortedDateAr(fg_hash_tmp);
	// console.log(sortDateAR.length);
	if (sortDateAR.length == 0) {
		return;
	}
	
	// ./f_data/quote_daily2_contract/index/TX1/index_TX1_am_taifex.csv
	option_input = {
			'source':'taifex',
			'trading_hours' : input_option['contract_hours'],
			'output_raw_line' : true
		}
	var filename_fg = getTX1Filename_fg(option_input);
	var options = {
		'recursive' : true,
		'mode' : 0o755 
	};
	var mkdirp_path = filename_fg.substr(0,filename_fg.lastIndexOf("/"));
	fs.mkdirSync(mkdirp_path, options);
	
	
	var contract_header = {
		'future' : 'trading_date,contract_name,contract_month,OP,HI,LO,CL,vvv,vvp,VOL,SP,OI,LBB,LBS,HHI,HLO,breaker,contract_hours,diff_vol',
	};
	var content_fg = contract_header['future'] + '\n'; // changed \r\n
	var len_sort = sortDateAR.length;
	for (var i_sort=0; i_sort<len_sort; ++i_sort) {
		// sortDateAR[i]
		content_fg = content_fg + fg_hash_tmp[sortDateAR[i_sort]] + '\n'; // changed \r\n
	}
	//console.log(content_fg);
			
	// write file
	fs.writeFileSync(filename_fg, content_fg);
	//console.log("www");
	
	log_msg = "OKg:" + len_sort +":" + content_fg.length + " " + filename_fg;
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
	// return;
		
}



