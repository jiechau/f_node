// ////////////////////////////////////////////////////////////////////////////////////////
// configs

var filedir = "";
var nodedir = "";

eval(fs.readFileSync('./fconfig_local')+''); // the '' is necessary to let './fconfig.js' as a string
// 下面這3行放到 fconfig_local, 沒有進入 hg 版本控制 
// 如果沒有, 就讓它 throw Error: ENOENT 
//var filedir = '/home/jie/f_data'; // 存放交易資料的地方
//var nodedir = '/home/jie/f_node'; // 存放 程式 的地方, fweb_template_stem 的 爸爸
//var addrlocalhost = '192.168.123.166';

var ff_stem950 = 'quote_daily1_raw_ms950';
var ff_stem = 'quote_daily1_raw_utf8';
var fg_stem = 'quote_daily2_contract';
var special_commodity = ["CDF", "CEF", "CFF", "CDO", "CEO", "CFO"]; // stock future, or stock options

var fweb_template_stem = 'fweb_template';

var dateFormat = require('dateformat');


// ////////////////////////////////////////////////////////////////////////////////////////
// date and common functions

function getNextDate (date_this) {
	// date_this = "2018/12/15";
	[dummy, yearString, monthString, dayString] = date_this.match(/^(\d\d\d\d)\/(\d\d)\/(\d\d)$/);
	var date_this_y = parseInt(yearString); // 2018
	var date_this_m = parseInt(monthString); // 12
	var date_this_d = parseInt(dayString); // 15
	
	var date_next = dateFormat(new Date(date_this_y, date_this_m - 1, date_this_d+1), "yyyy/mm/dd");

	return date_next;
}
function getPrevDate (date_this) {
	// date_this = "2018/12/15";
	[dummy, yearString, monthString, dayString] = date_this.match(/^(\d\d\d\d)\/(\d\d)\/(\d\d)$/);
	var date_this_y = parseInt(yearString); // 2018
	var date_this_m = parseInt(monthString); // 12
	var date_this_d = parseInt(dayString); // 15
	
	var date_prev = dateFormat(new Date(date_this_y, date_this_m - 1, date_this_d-1), "yyyy/mm/dd");

	return date_prev;
}
function getNextnDate (date_this, n) {
	// date_this = "2018/12/15";
	[dummy, yearString, monthString, dayString] = date_this.match(/^(\d\d\d\d)\/(\d\d)\/(\d\d)$/);
	var date_this_y = parseInt(yearString); // 2018
	var date_this_m = parseInt(monthString); // 12
	var date_this_d = parseInt(dayString); // 15
	
	var inn = parseInt(n);
	var date_next = dateFormat(new Date(date_this_y, date_this_m - 1, date_this_d+inn), "yyyy/mm/dd");

	return date_next;
}
// 計算2個日子的差距日子
// getCalContractMonthEndDate("2018/11/01","2018/11/02")
// return 1 (int), 或是負的
function getDifferentDays (date_firstDate, date_secondDate) {
	[yyy, mmm, ddd] = date_firstDate.split("/");
	let firstDate = new Date(mmm+ "/" + ddd + "/" + yyy);
	[yyy, mmm, ddd] = date_secondDate.split("/");
	let secondDate = new Date(mmm+ "/" + ddd + "/" + yyy);
//	timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());
	timeDifference = secondDate.getTime() - firstDate.getTime();
	let differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
	return differentDays;
}

// 給一個 object (hash) 的 key 是日期 "2018/11/01", 
// 回傳 array 是按照日期排序過的
function getSortedDateAr (key_date_hash) {
	var keysSortedAr = Object.keys(key_date_hash).sort(function(a,b){
		return Number(a.toString().replace(/\//g,''))-Number(b.toString().replace(/\//g,''))
	});
	return keysSortedAr;
}

// 只要 key 是 date 的 hash
// var union_date = getUnionDateAr ([TX1_polaris, TX1_taifex, MI_polaris, MI_twse]);
function getUnionDateAr (hash_ar) {
	var UnionDateH = {};
	for (var i=0; i<hash_ar.length; i++){
		var date_ar_this = Object.keys(hash_ar[i]);
		for (var j=0; j<date_ar_this.length; j++){
			UnionDateH[date_ar_this[j]] = 1;
		}
	}
	return getSortedDateAr(UnionDateH);
}

// 給一個 object (hash) 的 key 是日期 "2018/11/01", 
// 先排序, 然後回傳 start_date 和 end_date 之間的內容
// (用於處理不必把所有的歷史資料帶進來) 
function getHashInterval (kay_date_hash, start_date, end_date) {
	var kay_date_hash_return = {};
	var date_keys_ar = getSortedDateAr(kay_date_hash);
	for (var j=0; j<date_keys_ar.length; ++j) {	
		var date_this = date_keys_ar[j];
		if ((getDifferentDays(start_date, date_this) >=0) && (getDifferentDays(date_this, end_date) >=0)) {
			kay_date_hash_return[date_this] = kay_date_hash[date_this];
		}
	}
	return kay_date_hash_return;
}
function getArrayInterval (kay_date_array, start_date, end_date) {
	var kay_date_array_return = [];
	var date_keys_ar = kay_date_array.sort(function(a,b){
		return Number(a.toString().replace(/\//g,''))-Number(b.toString().replace(/\//g,''))
	});;
	for (var j=0; j<date_keys_ar.length; ++j) {	
		var date_this = date_keys_ar[j];
		if ((getDifferentDays(start_date, date_this) >=0) && (getDifferentDays(date_this, end_date) >=0)) {
			kay_date_array_return.push(date_this);
		}
	}
	return kay_date_array_return;
}




// ////////////////////////////////////////////////////////////////////////////////////////
// index, future, options

// 目前只有每個合約的結束日期, 用實際日期算出來的
function getTX1ContractMonthCalendar() {
	var ContractMonthCalendarHash = {};
	var TX1Hash = getTX1Hash ({'trading_hours':'am','source':'taifex'});
	var TX1SortedDateAr = getSortedDateAr(TX1Hash);
	var contract_month_this;
	for (var iSortDate=0; iSortDate<TX1SortedDateAr.length; iSortDate++) {
		var date_this = TX1SortedDateAr[iSortDate];
		if (contract_month_this == undefined) contract_month_this = TX1Hash[TX1SortedDateAr[iSortDate]]['contract_month'];
		// console.log(date_this);
		if (contract_month_this != TX1Hash[TX1SortedDateAr[iSortDate]]['contract_month']) {
			contract_month_this = TX1Hash[TX1SortedDateAr[iSortDate]]['contract_month'];
		} else {
			if (ContractMonthCalendarHash[contract_month_this] == undefined) ContractMonthCalendarHash[contract_month_this] = {};
			ContractMonthCalendarHash[contract_month_this]['contract_enddate'] = TX1SortedDateAr[iSortDate];
		} // if change ['contract_month']
	}
	// add 2019 up-to-date
	
	ContractMonthCalendarHash['201901'] = {};
	ContractMonthCalendarHash['201902'] = {};
    ContractMonthCalendarHash['201903'] = {};
	ContractMonthCalendarHash['201904'] = {};
	ContractMonthCalendarHash['201905'] = {};
	ContractMonthCalendarHash['201906'] = {};
	ContractMonthCalendarHash['201907'] = {};
	ContractMonthCalendarHash['201908'] = {};
	ContractMonthCalendarHash['201909'] = {};
	ContractMonthCalendarHash['201910'] = {};
	ContractMonthCalendarHash['201911'] = {};
	ContractMonthCalendarHash['201912'] = {};
	
	ContractMonthCalendarHash['201901']['contract_enddate'] = "2019/01/16";
	ContractMonthCalendarHash['201902']['contract_enddate'] = "2019/02/20";
	ContractMonthCalendarHash['201903']['contract_enddate'] = "2019/03/20";
	ContractMonthCalendarHash['201904']['contract_enddate'] = "2019/04/17";
	ContractMonthCalendarHash['201905']['contract_enddate'] = "2019/05/15";
	ContractMonthCalendarHash['201906']['contract_enddate'] = "2019/06/19";
	ContractMonthCalendarHash['201907']['contract_enddate'] = "2019/07/17";
	ContractMonthCalendarHash['201908']['contract_enddate'] = "2019/08/21";
	ContractMonthCalendarHash['201909']['contract_enddate'] = "2019/09/18";
	ContractMonthCalendarHash['201910']['contract_enddate'] = "2019/10/16";
	ContractMonthCalendarHash['201911']['contract_enddate'] = "2019/11/20";
	ContractMonthCalendarHash['201912']['contract_enddate'] = "2019/12/18";
	return ContractMonthCalendarHash;
}
// 每個合約的結束日期, 用實際日期算出來的
function getContractMonthEndDate (input_contractmonth) {
	// input_contractmonth = "201810"
	// return "2018/10/17"
	var ContractMonthCalendarHash = getTX1ContractMonthCalendar();
	return ContractMonthCalendarHash[input_contractmonth]['contract_enddate'];
}

// 找出上一個合約月份, input contract_month: 201801
function getPrevContractMonth (contract_month_this) {
	[dummy, year, month] = contract_month_this.match(/^(\d\d\d\d)(\d\d)$/);
	return dateFormat(new Date(year, parseInt(month) - 1 -1, 1), "yyyymm");
}
// 找出下一個合約月份, input contract_month: 201801
function getNextContractMonth (contract_month_this) {
	[dummy, year, month] = contract_month_this.match(/^(\d\d\d\d)(\d\d)$/);
	return dateFormat(new Date(year, parseInt(month) - 1 +1, 1), "yyyymm");
}

// 找出上一個合約月份, input date: 2018/01/01
function getPrevContractMonth2 (date_this) {
	// 因為 input 的日期有可能是沒有開盤 TX1Hash, 所以只能用 getTX1ContractMonthCalendar()
	var contract_month_prev = "";
	var ContractMonthCalendarHash = getTX1ContractMonthCalendar();
	var aContractMonthCalendarKeys = Object.keys(ContractMonthCalendarHash);
	for (var iM=0; iM<aContractMonthCalendarKeys.length; iM++){
		if (getDifferentDays(date_this, ContractMonthCalendarHash[aContractMonthCalendarKeys[iM]]['contract_enddate']) < 0) {
			contract_month_prev = aContractMonthCalendarKeys[iM];
		}
	}
	return contract_month_prev;	
}
// 找出這一個合約月份, input date: 2018/01/01
function getThisContractMonth2 (date_this) {
	// 因為 input 的日期有可能是沒有開盤 TX1Hash, 所以只能用 getTX1ContractMonthCalendar()
	var contract_month_prev = getPrevContractMonth2(date_this);
	return getNextContractMonth(contract_month_prev);
}
// 找出下一個合約月份, input date: 2018/01/01
function getNextContractMonth2 (date_this) {
	// 因為 input 的日期有可能是沒有開盤 TX1Hash, 所以只能用 getTX1ContractMonthCalendar()
	var contract_month_this = getThisContractMonth2(date_this);
	return getNextContractMonth(contract_month_this);
}

// 計算合約日期 開始 結束, 這4個是用公式算出來的, 沒什麼用 (應該用實際日期)
function getCalContractMonthEndDate (input_contractmonth) {
	// input_contractmonth = "201810"
	// return "2018/10/17"
	return getCalTX1ContractMonthEndDate(input_contractmonth);
}
function getCalContractMonthStartDate (input_contractmonth) {
	// input_contractmonth = "201810"
	// return "xxxx/xx/xx"
	// 這個有點複雜, 要看那個 excel, 晚點再弄
}
function getCalTX1ContractMonthStartDate (input_contractmonth) {
	// 這個是自己用數學算得, 基礎理論是合約結算日是每個月的第3個周三
	// 比較不準確
	// 但是這個要注意的是, 萬一放假會遞延
	// 實際的情形最好用 parse 全部的 data 看合約的最後一天來當結算日
	// input_contractmonth = "201810"
	// return "2018/09/20"
	
	// 先取出上個月 input_contractmonth_pre = "201809"
	[dummy, year, month] = input_contractmonth.match(/^(\d\d\d\d)(\d\d)$/);
	input_contractmonth_pre = dateFormat(new Date(year, parseInt(month) - 2, 1), "yyyymm");
	//console.log(input_contractmonth_pre);
	// 然後 +1天
	[dummy, year, month, day] = getCalTX1ContractMonthEndDate(input_contractmonth_pre).match(/^(\d\d\d\d)\/(\d\d)\/(\d\d)$/);
	return  dateFormat(new Date(year, parseInt(month) - 1, parseInt(day)+1), "yyyy/mm/dd");
}
function getCalTX1ContractMonthEndDate (input_contractmonth) {
	// 這個是自己用數學算得, 基礎理論是合約結算日是每個月的第3個周三
	// 比較不準確
	// 但是這個要注意的是, 萬一放假會遞延
	// 實際的情形最好用 parse 全部的 data 看合約的最後一天來當結算日
	// input_contractmonth = "201810"
	// return "2018/10/17"
	[dummy, year, month] = input_contractmonth.match(/^(\d\d\d\d)(\d\d)$/);
	/*
	如果每個月第一天是:
	周1+16=17號
	周2+15=16號
	周3+14=15號
	周4+20=21號
	周5+19=20號
	周6+18=19號
	周日+17=18號
	*/
	// find the 1st and last day of the month
	// var start_date = dateFormat(new Date(year, month - 1, 1), "yyyy/mm/dd");
	// var end_date  = dateFormat(new Date(year, month - 1 + 1, 0), "yyyy/mm/dd");
	var day;
	var wkday = dateFormat(new Date(parseInt(year), parseInt(month) - 1, 1), "N");
	if (wkday == 1) {
		day = "17";
	} else if (wkday == 2) {
		day = "16";
	} else if (wkday == 3) {
		day = "15";
	} else if (wkday == 4) {
		day = "21";
	} else if (wkday == 5) {
		day = "20";
	} else if (wkday == 6) {
		day = "19";
	} else if (wkday == 7) {
		day = "18";
	} else {
		
	}
	return year + "/" + month + "/" + day;
	
}


// TX1
function getTX1Filename_fg (option_filename) {
	// option_input = {
	//	'trading_hours':'am', // 'am', 'pm' 
	//	'source':'polaris', // 'polaris', 'taifex'
	//  'output_raw_line' : true
	// }
	// 
	// return "/home/jie/f_data/quote_daily2_contract/index/TX1/index_TX1_am_taifex.csv"
	// return "/home/jie/f_data/quote_daily2_contract/index/TX1/index_TX1_am_polaris.csv"
	return filedir + "/" + fg_stem + "/index/TX1/index_TX1_" + option_filename['trading_hours'] + "_" + option_filename['source'] + ".csv";
}

function getTX1Hash (option_input) {
	// var TX1hash = getTX1Hash({'trading_hours':'am','source':'taifex'});
	// option_input = {
	//	'trading_hours':'am', // 'am', 'pm' 
	//	'source':'polaris', // 'polaris', 'taifex'
	//  'output_raw_line' : true
	// }
	if (option_input['source'] == "polaris") {
		return getTX1polarisHash (option_input);
	}
	if (option_input['source'] == "taifex") {
		return getTX1taifexHash (option_input);
	}
}

function getTX1taifexHash (option_input) {
	// option_input = {
	//	'trading_hours':'am', // 'am', 'pm' 
	//	'source':'polaris', // 'polaris', 'taifex'
	//  'output_raw_line' : true
	// }
	var fg_hash_tmp = {};
	
	if (option_input['source'] != "taifex") {
		return fg_hash_tmp;
	}
	
	var filename_fg = getTX1Filename_fg(option_input);
	// ./f_data/quote_daily2_contract/index/TX1/index_TX1_am_taifex.csv

	var taifex_type = 'index';
	var commodity = 'TX1';
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
				
				var trading_date = fields_fg[0].trim();
				
				// 一整行的 value 回傳
				if ((option_input['output_raw_line'] != undefined) 
					&& (option_input['output_raw_line'] === true)) {
					
					fg_hash_tmp[trading_date] = lines_fg[i_fg].toString().trim();
					
				// 取出每個值得 回傳	
				} else {
				
					fg_hash_tmp[trading_date] = {}; // fg_hash_tmp['2018/08/22'] = {};
					fg_hash_tmp[trading_date]['trading_date']   = fields_fg[0].trim();  // 交易日期,     
					fg_hash_tmp[trading_date]['contract_name']  = fields_fg[1].trim();  // 契約,      
					fg_hash_tmp[trading_date]['contract_month'] = fields_fg[2].trim();  // 到期月份(週別),  
					fg_hash_tmp[trading_date]['OP']             = fields_fg[3];  // 開盤價,
					fg_hash_tmp[trading_date]['HI']             = fields_fg[4];  // 最高價,
					fg_hash_tmp[trading_date]['LO']             = fields_fg[5];  // 最低價,
					fg_hash_tmp[trading_date]['CL']             = fields_fg[6];  // 收盤價, 
					fg_hash_tmp[trading_date]['vvv']            = fields_fg[7];  // 漲跌價,
					fg_hash_tmp[trading_date]['vvp']            = fields_fg[8];  // 漲跌%,
					fg_hash_tmp[trading_date]['VOL']            = fields_fg[9];  // 成交量,
					fg_hash_tmp[trading_date]['SP']             = fields_fg[10]; // 結算價,
					fg_hash_tmp[trading_date]['OI']             = fields_fg[11]; // 未沖銷契約數,
					fg_hash_tmp[trading_date]['LBB']            = fields_fg[12]; // 最後最佳買價,
					fg_hash_tmp[trading_date]['LBS']            = fields_fg[13]; // 最後最佳賣價,
					fg_hash_tmp[trading_date]['HHI']            = fields_fg[14]; // 歷史最高價,
					fg_hash_tmp[trading_date]['HLO']            = fields_fg[15]; // 歷史最低價, 
					fg_hash_tmp[trading_date]['breaker']        = fields_fg[16]; // 是否因訊息面暫停交易,
					fg_hash_tmp[trading_date]['contract_hours'] = fields_fg[17]; // 交易時段,             
					fg_hash_tmp[trading_date]['diff_vol']       = fields_fg[18]; // 價差對單式委託成交量
				}
			}
			counts_fg++;
		}
		counts_fg--;
		//log_msg = 'fg_exist:' + (counts_fg - 1) + " " + filename_fg;
		//console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
		return fg_hash_tmp;
	} else {
		log_msg = 'fg_existed_not: ' + filename_fg;
		console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
	}
		
	return fg_hash_tmp;
}

function getTX1polarisHash (option_input) {
	// option_input = {
	//	'trading_hours':'am', // 'am', 'pm' 
	//	'source':'polaris', // 'polaris', 'taifex'
	//  'output_raw_line' : true
	// }

	/*
	am pm
	polaris 的分辨不出 contractmonth
	maybe input_contractmonth 
	input_contractmonth = "all" or "201810"
	*/

	
	
	// var filename_fg = getTX1Filename_fg({'trading_hours':'am','source':'polaris',});
	var filename_fg = getTX1Filename_fg(option_input);
	// ./quote_daily2_contract/index/TX1/index_TX1_am_polaris.csv
	var fg_hash_tmp = {};
	var taifex_type = 'index';
	var commodity = 'TX1';
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
				// 	for 'TX1': 'trading_date,OP,HI,LO,CL,vvv,vvp,VOL,pVIX,HV,OI'
				var trading_date = fields_fg[0].toString().trim();
				var OP           = fields_fg[1].toString().trim();
				var HI           = fields_fg[2].toString().trim();
				var LO           = fields_fg[3].toString().trim();
				var CL           = fields_fg[4].toString().trim(); // 4: 收盤價
				var vvv          = fields_fg[5].toString().trim(); // 5:漲跌
				var vvp          = fields_fg[6].toString().trim();
				var VOL          = fields_fg[7].toString().trim(); // 7: 成交量
				var pVIX         = fields_fg[8].toString().trim(); // 8: 恐慌指數
				var HV           = fields_fg[9].toString().trim();
				var OI           = fields_fg[10].toString().trim();
				fg_hash_tmp[trading_date] = {};
				fg_hash_tmp[trading_date]["OP"] =   OP   ;
				fg_hash_tmp[trading_date]["HI"] =   HI   ;
				fg_hash_tmp[trading_date]["LO"] =   LO   ;
				fg_hash_tmp[trading_date]["CL"] =   CL   ;
				fg_hash_tmp[trading_date]["vvv"] =  vvv  ;
				fg_hash_tmp[trading_date]["vvp"] =  vvp  ;
				fg_hash_tmp[trading_date]["VOL"] =  VOL  ;
				fg_hash_tmp[trading_date]["pVIX"] = pVIX ;
                fg_hash_tmp[trading_date]["HV"] =   HV   ;
                fg_hash_tmp[trading_date]["OI"] =   OI   ;		

			}
			counts_fg++;
		}
		counts_fg--;
		//log_msg = 'fg_exist:' + (counts_fg - 1) + " " + filename_fg;
		//console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
		return fg_hash_tmp;
	} else {
		log_msg = 'fg_existed_not: ' + filename_fg;
		console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
	}
}

// MI
function getMIFilename_fg (option_filename) {
	// option_filename = {
	//	trading_hours = "am"; MI 只有 am
	//	source = "polaris"; "twse"
	// }
	// return "/home/jie/f_data/./quote_daily2_contract/index/MI/index_MI_polaris.csv"
	if (option_filename['trading_hours'] == "am") {
		return filedir + "/" + fg_stem + "/index/MI/index_MI_" + option_filename['source'] + ".csv";
	} else {
		console.log("err ask MI pm");
		return;
	}
}

function getMIHash (option_filename) {
	// option_filename = {
	//	'trading_hours':'am', MI 只能有 "am"
	//	'source':'polaris', // 'twse', 'polaris'
	//  'output_raw_line' : true
	//	}
	if (option_filename['source'] == "polaris") {
		return getMIpolarisHash ();
	}
	if (option_filename['source'] == "twse") {
		return getMItwseHash ();
	}
}

function getMItwseHash () {
	
	var filename_fg = getMIFilename_fg({'trading_hours':'am','source':'twse',});
	// ./quote_daily2_contract/index/MI/index_MI_twse.csv
	var fg_hash_tmp = {};
	var taifex_type = 'index';
	var commodity = 'MI';
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
				// 	trading_date, VOS,    	VOL,   	VOT,    		CL,   		vvv,  	
				// "日期","成交股數","成交金額","成交筆數","發行量加權股價指數","漲跌點數",
				var trading_date = fields_fg[0].toString().trim();
				var VOS          = fields_fg[1].toString().trim(); // 1:成交股數
				var VOL          = fields_fg[2].toString().trim(); // 2:成交金額
				var VOT          = fields_fg[3].toString().trim(); // 3:成交筆數
				var CL           = fields_fg[4].toString().trim(); // 4: 收盤價
				var vvv          = fields_fg[5].toString().trim(); // 5:漲跌

				fg_hash_tmp[trading_date] = {};
				fg_hash_tmp[trading_date]["VOS"] =  VOS  ;
				fg_hash_tmp[trading_date]["VOL"] =  VOL  ;
				fg_hash_tmp[trading_date]["VOT"] =  VOT  ;
				fg_hash_tmp[trading_date]["CL"]  =  CL   ;
				fg_hash_tmp[trading_date]["vvv"] =  vvv  ;
			}
			counts_fg++;
		}
		counts_fg--;
		//log_msg = 'fg_exist:' + (counts_fg - 1) + " " + filename_fg;
		//console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
		return fg_hash_tmp;
	} else {
		log_msg = 'fg_existed_not: ' + filename_fg;
		console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
	}
}

function getMIpolarisHash () {
	
	var filename_fg = getMIFilename_fg({'trading_hours':'am','source':'polaris',});
	// ./quote_daily2_contract/index/MI/index_MI_polaris.csv
	var fg_hash_tmp = {};
	var taifex_type = 'index';
	var commodity = 'MI';
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
				// 	for MI: 'trading_date,OP,HI,LO,CL,vvv,vvp,VOL,pVIX'
				var trading_date = fields_fg[0].toString().trim();
				var OP           = fields_fg[1].toString().trim();
				var HI           = fields_fg[2].toString().trim();
				var LO           = fields_fg[3].toString().trim();
				var CL           = fields_fg[4].toString().trim(); // 4: 收盤價
				var vvv          = fields_fg[5].toString().trim(); // 5:漲跌
				var vvp          = fields_fg[6].toString().trim();
				var VOL          = fields_fg[7].toString().trim(); // 7: 成交量
				var pVIX         = fields_fg[8].toString().trim(); // 8: 恐慌指數

				fg_hash_tmp[trading_date] = {};
				fg_hash_tmp[trading_date]["OP"] =   OP   ;
				fg_hash_tmp[trading_date]["HI"] =   HI   ;
				fg_hash_tmp[trading_date]["LO"] =   LO   ;
				fg_hash_tmp[trading_date]["CL"] =   CL   ;
				fg_hash_tmp[trading_date]["vvv"] =  vvv  ;
				fg_hash_tmp[trading_date]["vvp"] =  vvp  ;
				fg_hash_tmp[trading_date]["VOL"] =  VOL  ;
				fg_hash_tmp[trading_date]["pVIX"] = pVIX ;
			}
			counts_fg++;
		}
		counts_fg--;
		//log_msg = 'fg_exist:' + (counts_fg - 1) + " " + filename_fg;
		//console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
		return fg_hash_tmp;
	} else {
		log_msg = 'fg_existed_not: ' + filename_fg;
		console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
	}
}

// *** future

// getFutureContractKey, // return "future_TX_am_201812"
function getFutureContractKey (option_input) {
	/*
	option_input = {
		'taifex_type' : 'future',
		'contract_name' : 'TX',
		'contract_month' : '201812',
		'contract_hours' : 'am'
	}
	*/
	var taifex_type = option_input['taifex_type']; // option, future
	var contract_name = option_input['contract_name']; // TX, TXO, all, ...
	var contract_month = option_input['contract_month'].trim(); // 201812
	var contract_hours = option_input['contract_hours']; // am,pm
	// return "future_TX_am_201812"
	var contract_key = taifex_type + '_' + contract_name + '_' + contract_hours + '_' + contract_month;
	return contract_key;
	
}

// 取出 一個 future 的 filename
function getFutureFilename_fg (option_input) {
	/*
	option_input = {
		'taifex_type' : 'future',
		'contract_name' : 'TX',
		'contract_month' : '201810',
		'contract_hours' : 'am',
	}
	*/
	// return "quote_daily2_contract/future/TX/2018/12/future_TX_am_201812.csv"
	var taifex_type = option_input['taifex_type']; // option, future
	var contract_name = option_input['contract_name']; // TX, TXO, all, ...
	var contract_month = option_input['contract_month'].trim(); // 201810
	[dummy, yearString, monthString] = contract_month.match(/^(\d\d\d\d)(\d\d)$/);
	var year = parseInt(yearString); // 2018
	var month = parseInt(monthString); // 10
	var contract_hours = option_input['contract_hours']; // am,pm
	
	// "future_TX_am_201812"
	var contract_key = getFutureContractKey (option_input);
	
	// quote_daily2_contract/future/TX/2018/12/future_TX_am_201812.csv
	var filename_fg = filedir + '/' + fg_stem + '/' + taifex_type + '/' + contract_name + '/' + yearString + '/' + monthString  + '/' + contract_key + '.csv';

	return filename_fg;
	
}

// 取出 一個 Future hash
function getFutureHash (option_input) {
	/*
	option_input = {
		'taifex_type' : 'future',
		'contract_name' : 'TX',
		'contract_month' : '201812',
		'contract_hours' : 'am',
		'output_raw_line' : true
	}
	*/
	var taifex_type = option_input['taifex_type']; // option, future
	var contract_name = option_input['contract_name']; // TX, TXO, all, ...
	var contract_month = option_input['contract_month'].trim(); // 201810
	[dummy, yearString, monthString] = contract_month.match(/^(\d\d\d\d)(\d\d)$/);
	var year = parseInt(yearString); // 2018
	var month = parseInt(monthString); // 10
	var contract_hours = option_input['contract_hours']; // am,pm

	var contract_key = getFutureContractKey (option_input);
	var filename_fg = getFutureFilename_fg (option_input);
	
	var fg_hash_fields = {};
	if (fs.existsSync(filename_fg)) {
		var data_fg = fs.readFileSync(filename_fg);
	} else {
		return fg_hash_fields; 
	}
	var lines_fg = data_fg.toString().split('\n'); // changed \r\n
	var counts_fg = 0;
	for (var i_fg=0; i_fg<lines_fg.length; ++i_fg) {
		var fields_fg = lines_fg[i_fg].toString().split(',');
		// 排除 第一行 和 最後一行
		if ((counts_fg >= 1) && (fields_fg[0] != undefined) && (fields_fg[2] != undefined)) {
			//console.log(fields_fg[0]);
			var trading_date = fields_fg[0].trim();
			
			// 一整行的 value 回傳
			if ((option_input['output_raw_line'] != undefined) 
				&& (option_input['output_raw_line'] === true)) {
				
				fg_hash_fields[trading_date] = lines_fg[i_fg].toString().trim();
				
			// 取出每個值得 回傳	
			} else {
			
				fg_hash_fields[trading_date] = {}; // fg_hash_fields['2018/08/22'] = {};
				fg_hash_fields[trading_date]['trading_date']   = fields_fg[0].trim();  // 交易日期,     
				fg_hash_fields[trading_date]['contract_name']  = fields_fg[1].trim();  // 契約,      
				fg_hash_fields[trading_date]['contract_month'] = fields_fg[2].trim();  // 到期月份(週別),  
				fg_hash_fields[trading_date]['OP']             = fields_fg[3];  // 開盤價,
				fg_hash_fields[trading_date]['HI']             = fields_fg[4];  // 最高價,
				fg_hash_fields[trading_date]['LO']             = fields_fg[5];  // 最低價,
				fg_hash_fields[trading_date]['CL']             = fields_fg[6];  // 收盤價, 
				fg_hash_fields[trading_date]['vvv']            = fields_fg[7];  // 漲跌價,
				fg_hash_fields[trading_date]['vvp']            = fields_fg[8];  // 漲跌%,
				fg_hash_fields[trading_date]['VOL']            = fields_fg[9];  // 成交量,
				fg_hash_fields[trading_date]['SP']             = fields_fg[10]; // 結算價,
				fg_hash_fields[trading_date]['OI']             = fields_fg[11]; // 未沖銷契約數,
				fg_hash_fields[trading_date]['LBB']            = fields_fg[12]; // 最後最佳買價,
				fg_hash_fields[trading_date]['LBS']            = fields_fg[13]; // 最後最佳賣價,
				fg_hash_fields[trading_date]['HHI']            = fields_fg[14]; // 歷史最高價,
				fg_hash_fields[trading_date]['HLO']            = fields_fg[15]; // 歷史最低價, 
				fg_hash_fields[trading_date]['breaker']        = fields_fg[16]; // 是否因訊息面暫停交易,
				fg_hash_fields[trading_date]['contract_hours'] = fields_fg[17]; // 交易時段,             
				fg_hash_fields[trading_date]['diff_vol']       = fields_fg[18]; // 價差對單式委託成交量
			}
		} // 排除 第一行 和 最後一行
		counts_fg++;
		
	} // 一行 for (var i_fg=0; i_fg<lines_fg.length; ++i_fg) {
	counts_fg--;
	
	//
	return fg_hash_fields;
}


// *** option

// getOptionContractKey, // return "option_TXO_am_201812_call_8000.0000"
function getOptionContractKey (option_input) {
	/*
	option_input = {
		'taifex_type' : 'option',
		'contract_name' : 'TXO',
		'contract_month' : '201810',
		'contract_hours' : 'am',
		'contract_type' : 'call',
		'contract_strike' : '8000.0000'
	}
	*/
	var taifex_type = option_input['taifex_type']; // option, future
	var contract_name = option_input['contract_name']; // TX, TXO, all, ...
	var contract_month = option_input['contract_month'].trim(); // 201810
	[dummy, yearString, monthString] = contract_month.match(/^(\d\d\d\d)(\d\d)$/);
	var year = parseInt(yearString); // 2018
	var month = parseInt(monthString); // 10
	var contract_hours = option_input['contract_hours']; // am,pm
	var contract_type = option_input['contract_type']; // call/put
	var contract_strike = option_input['contract_strike']; // 8000.0000
	
	var contract_key = taifex_type + '_' + contract_name + '_' + contract_hours + '_' + contract_month + '_' + contract_type + '_' + contract_strike;
	return contract_key;
	
}

// 取出 一個 option 的 filename
function getOptionFilename_fg (option_input) {
	/*
	option_input = {
		'taifex_type' : 'option',
		'contract_name' : 'TXO',
		'contract_month' : '201810',
		'contract_hours' : 'am',
		'contract_type' : 'call',
		'contract_strike' : '8000.0000'
	}
	*/
	// ./quote_daily2_contract/option/TXO/2018/12/option_TXO_am_201812_call_8000.0000.csv
	var taifex_type = option_input['taifex_type']; // option, future
	var contract_name = option_input['contract_name']; // TX, TXO, all, ...
	var contract_month = option_input['contract_month'].trim(); // 201810
	[dummy, yearString, monthString] = contract_month.match(/^(\d\d\d\d)(\d\d)$/);
	var year = parseInt(yearString); // 2018
	var month = parseInt(monthString); // 10
	var contract_hours = option_input['contract_hours']; // am,pm
	var contract_type = option_input['contract_type']; // call/put
	var contract_strike = option_input['contract_strike']; // 8000.0000
	
	//"option_TXO_am_201812_call_8000.0000"
	var contract_key = getOptionContractKey (option_input);
	
	//  ./quote_daily2_contract/option/TXO/2018/12/option_TXO_am_201812_call_8000.0000.csv
	var filename_fg = filedir + '/' + fg_stem + '/' + taifex_type + '/' + contract_name + '/' + yearString + '/' + monthString  + '/' + contract_key + '.csv';

	return filename_fg;
	
}

// 取出 一個 option hash
function getOptionHash (option_input) {
	/*
	option_input = {
		'taifex_type' : 'option',
		'contract_name' : 'TXO',
		'contract_month' : '201810',
		'contract_hours' : 'am',
		'contract_type' : 'call',
		'contract_strike' : '8000.0000'
	}
	*/
	var taifex_type = option_input['taifex_type']; // option, future
	var contract_name = option_input['contract_name']; // TX, TXO, all, ...
	var contract_month = option_input['contract_month'].trim(); // 201810
	[dummy, yearString, monthString] = contract_month.match(/^(\d\d\d\d)(\d\d)$/);
	var year = parseInt(yearString); // 2018
	var month = parseInt(monthString); // 10
	var contract_hours = option_input['contract_hours']; // am,pm
	var contract_type = option_input['contract_type']; // call/put
	var contract_strike = option_input['contract_strike']; // 8000.0000

	var contract_key = getOptionContractKey (option_input);
	var filename_fg = getOptionFilename_fg (option_input);
	
	var fg_hash_fields = {};
	var data_fg = fs.readFileSync(filename_fg);
	var lines_fg = data_fg.toString().split('\n'); // changed \r\n
	var counts_fg = 0;
	for (var i_fg=0; i_fg<lines_fg.length; ++i_fg) {
		var fields_fg = lines_fg[i_fg].toString().split(',');
		// 排除 第一行 和 最後一行
		if ((counts_fg >= 1) && (fields_fg[0] != undefined) && (fields_fg[2] != undefined)) {
			//console.log(fields_fg[0]);
			var trading_date = fields_fg[0].trim();
			
			fg_hash_fields[trading_date] = {}; // fg_hash_fields['2018/08/22'] = {};

			fg_hash_fields[trading_date]['trading_date']   = fields_fg[0].trim();  // 交易日期,      
			fg_hash_fields[trading_date]['contract_name']  = fields_fg[1].trim();  // 契約,        
			fg_hash_fields[trading_date]['contract_month'] = fields_fg[2].trim();  // 到期月份(週別),       
			fg_hash_fields[trading_date]['contract_strike']= fields_fg[3];  // 履約價,        
			fg_hash_fields[trading_date]['contract_type']  = fields_fg[4];  // 買賣權,
			fg_hash_fields[trading_date]['OP']             = fields_fg[5];  // 開盤價,
			fg_hash_fields[trading_date]['HI']             = fields_fg[6];  // 最高價,
			fg_hash_fields[trading_date]['LO']             = fields_fg[7];  // 最低價,
			fg_hash_fields[trading_date]['CL']             = fields_fg[8];  // 收盤價,
			fg_hash_fields[trading_date]['VOL']            = fields_fg[9];  // 成交量,
			fg_hash_fields[trading_date]['SP']             = fields_fg[10]; // 結算價,
			fg_hash_fields[trading_date]['OI']             = fields_fg[11]; // 未沖銷契約數,
			fg_hash_fields[trading_date]['LBB']            = fields_fg[12]; // 最後最佳買價,
			fg_hash_fields[trading_date]['LBS']            = fields_fg[13]; // 最後最佳賣價,
			fg_hash_fields[trading_date]['HHI']            = fields_fg[14]; // 歷史最高價,
			fg_hash_fields[trading_date]['HLO']            = fields_fg[15]; // 歷史最低價,
			fg_hash_fields[trading_date]['breaker']        = fields_fg[16]; // 是否因訊息面暫停交易,
			fg_hash_fields[trading_date]['contract_hours'] = fields_fg[17]; // 交易時段  

		} // 排除 第一行 和 最後一行
		counts_fg++;
		
	} // 一行 for (var i_fg=0; i_fg<lines_fg.length; ++i_fg) {
	counts_fg--;
	
	//
	return fg_hash_fields;
}

/* 取出 一個 option hash, 外加 Value (時間價值, 內含價值)
針對一個 option 合約 option_hash = getOptionHash (option_input);
我想把他們 append 在 ['value']
option_hash[trading_date]['value']['TX1']['CL'] // TX1 的 CL
option_hash[trading_date]['value']['TX1']['money'] = 1,0,-1 (in-the-money, at-the-money, out-the-money)
option_hash[trading_date]['value']['TX1']['oIV']
option_hash[trading_date]['value']['TX1']['oTV']
option_hash[trading_date]['value']['TX1']['xIV']
option_hash[trading_date]['value']['TX1']['xTV']

option_hash[trading_date]['value']['MI']['CL'] // MI 的 CL
option_hash[trading_date]['value']['MI']['money'] = 1,0,-1 (in-the-money, at-the-money, out-the-money)
option_hash[trading_date]['value']['MI']['oIV']
option_hash[trading_date]['value']['MI']['oTV']
option_hash[trading_date]['value']['MI']['xIV']
option_hash[trading_date]['value']['MI']['xTV']

option_hash[trading_date]['value']['TXs']['CL'] // TXs  同月份 期貨 TXs 的 CL
option_hash[trading_date]['value']['TXs']['money'] = 1,0,-1 (in-the-money, at-the-money, out-the-money)
option_hash[trading_date]['value']['TXs']['oIV']
option_hash[trading_date]['value']['TXs']['oTV']
option_hash[trading_date]['value']['TXs']['xIV']
option_hash[trading_date]['value']['TXs']['xTV']

*/
function getOptionHashWithValue (option_input) {
	/*
	option_input = {
		'taifex_type' : 'option',
		'contract_name' : 'TXO',
		'contract_month' : '201810',
		'contract_hours' : 'am',
		'contract_type' : 'call',
		'contract_strike' : '8000.0000'
	}
	*/
	var taifex_type = option_input['taifex_type']; // option, future
	var contract_name = option_input['contract_name']; // TX, TXO, all, ...
	var contract_month = option_input['contract_month'].trim(); // 201810
	[dummy, yearString, monthString] = contract_month.match(/^(\d\d\d\d)(\d\d)$/);
	var year = parseInt(yearString); // 2018
	var month = parseInt(monthString); // 10
	var contract_hours = option_input['contract_hours']; // am,pm
	var contract_type = option_input['contract_type']; // call/put
	var contract_strike = option_input['contract_strike']; // 8000.0000
	
	var option_hash_v = getOptionHash (option_input);
	
	var future_input = {
		'taifex_type' : 'future',
		'contract_name' : 'TX',
		'contract_month' : contract_month,
		'contract_hours' : contract_hours
	}
	var fg_hash_TXs = getFutureHash (future_input);
	var fg_hash_TX1 = getTX1Hash({'trading_hours':future_input['contract_hours'],'source':'taifex'});
	var fg_hash_MI = getMIHash ({'source':'twse'});

	// 這裡要 call revise money
	// 準備這個 hash 用來修正 價平 money = 0
	var OptionMaxValueHash = getAllOptionMaxValueStrikeByDate (option_input);
		/*
		option_input = {
			'taifex_type' : 'option',
			'contract_name' : 'TXO',
			'contract_month' : '201810',
			'contract_hours' : 'am',
			'contract_type' : 'call',
		*/

	var keysSorted = getSortedDateAr(option_hash_v);
	var len_sort = keysSorted.length;
	for (var i_sort=0; i_sort<len_sort; ++i_sort) {

		var date_this = keysSorted[i_sort];
		var option_CL_this = option_hash_v[date_this]['CL'];
		if (i_sort == (len_sort -1)) option_CL_this = option_hash_v[date_this]['SP'];
		option_hash_v[date_this]['value'] = {};
		// option_hash_v[trading_date]['value']['TX1'] = {};
		// option_hash_v[trading_date]['value']['TX1']['CL'] // TX1 自己的 CL
		// option_hash_v[trading_date]['value']['TX1']['money'] = 1,0,-1 (in-the-money, at-the-money, out-the-money)
		// option_hash_v[trading_date]['value']['TX1']['oIV'] // o: 一般的算法
		// option_hash_v[trading_date]['value']['TX1']['oTV'] // o: 一般的算法
		// option_hash_v[trading_date]['value']['TX1']['xIV'] // x: 有負IV算法
		// option_hash_v[trading_date]['value']['TX1']['xTV'] // x: 有負IV算法
		var option_input = {
			'CL' : option_CL_this, 
			'contract_strike' : option_hash_v[date_this]['contract_strike'],
			'contract_type' : option_hash_v[date_this]['contract_type'],
			'target_CL' : fg_hash_TX1[date_this]['CL'],
			'target' : "TX1"
		}
		option_hash_v[date_this]['value']['TX1'] = getOptionValueCal(option_input); // 回傳 {}, 如果沒有數值
		if (OptionMaxValueHash[date_this]['money0TX1'] == contract_strike) option_hash_v[date_this]['value']['TX1']['money'] = 0;
		
		var option_input = {
			'CL' : option_CL_this, 
			'contract_strike' : option_hash_v[date_this]['contract_strike'],
			'contract_type' : option_hash_v[date_this]['contract_type'],
			'target_CL' : fg_hash_MI[date_this]['CL'],
			'target' : "MI"
		}
		option_hash_v[date_this]['value']['MI'] = getOptionValueCal(option_input); // 回傳 {}, 如果沒有數值
		if (OptionMaxValueHash[date_this]['money0MI'] == contract_strike) option_hash_v[date_this]['value']['MI']['money'] = 0;
/*
if (fg_hash_TXs[date_this] == undefined) {
	console.log(option_hash_v);
	return;
}
*/		
		// 自己月份的期貨, 有可能有的日期沒有值 fg_hash_TXs[date_this]['CL'] (no date_this)
		if (fg_hash_TXs[date_this] == undefined) {
			option_hash_v[date_this]['value']['TXs'] = {};
		} else {
			var TXs_CL = fg_hash_TXs[date_this]['CL'];
			if (i_sort == (len_sort -1)) TXs_CL = fg_hash_TXs[date_this]['SP'];
			var option_input = {
				'CL' : option_CL_this, 
				'contract_strike' : option_hash_v[date_this]['contract_strike'],
				'contract_type' : option_hash_v[date_this]['contract_type'],
				'target_CL' : TXs_CL,
				'target' : "TXs"
			}
			option_hash_v[date_this]['value']['TXs'] = getOptionValueCal(option_input); // 回傳 {}, 如果沒有數值	
		}
		if (OptionMaxValueHash[date_this]['money0TXs'] == contract_strike) option_hash_v[date_this]['value']['TXs']['money'] = 0;

	} // 一個日期 var date_this = keysSorted[i_sort];
	
	
	
	return option_hash_v;
}

/* value Cal (時間價值, 內含價值)

value

**一般的算法: 用變數 oIV, oTV
http://blog.cnyes.com/My/stocksway/article2417598
選擇權價值 = 內含價值（Intrinsic Value；IV）＋時間價值（Time Value；TV）。
選擇權價值 = IV + TV
Call權利金 CL = Max (TX1 - Strike,0)+ TV
Put 權利金 CL = Max (Strike - TX1,0)+ TV
IV = max(TX1 - strike, 0), TV = CL - IV
台指期貨收盤價 7557
7400call 其內含價值為157點(=7557-7400)，時間價值則為58點(=215-157)。
7500call 其內含價值為 57點(=7557-7500)，時間價值則為86點(=143-57)。
if strike = 7500, TX1 = 7557, IV = TX1 - strike = 57
7500 call, CL = 214, TV = CL - 57 = 157

**有負的算法: 用變數 xIV, xTV
Call權利金 CL =  (TX1 - Strike)+ TV
Put 權利金 CL =  (Strike - TX1)+ TV
IV = TX1 - strike, TV = CL - IV

頭符號 define:
o: 一般的算法, CL = oIV + oTV, oIV = max(TX1 - strike, 0), oTV = CL - oIV
x: 有負的算法, CL = xIV + xTV, xIV = TX1 - strike,         xTV = CL - xIV

(這個部分 尾符號 後來沒有用到)
尾符號 define:
m: 標的和加權指數 MI 比
1: 標的和台指期近1 TX1 比
s: 標的和同月份的期貨契約比 option TXO 201812 : future TX 201812
所以
CL = oIVm + oTVm 或  oIV1 + oTV1 或 oIVs + oTVs
*/
function getOptionValueCal(option_input) {

	// option_input = {
	//		'CL' : option 自己的收盤價 
	//		'contract_strike' : 9000.000
	//		'contract_type' : "call"
	//		'target_CL' : target MI 的收盤價
	//		'target' : MI/TXs/TX1
	//	}
	var value_hash = {};
	if ((option_input['target_CL'] == undefined) || (option_input['target_CL'] == '-')) return value_hash;
	
	var option_strike = parseFloat(option_input['contract_strike']);
	var option_type = option_input['contract_type']; // call, put
	var target_CL = parseFloat(option_input['target_CL']);
	var target_name = option_input['target']; // MI/TXs/TX1
	// o: 一般的算法, CL = oIV + oTV, oIV = max(TX1 - strike, 0), oTV = CL - oIV
	// x: 有負IV算法, CL = xIV + xTV, xIV = TX1 - strike,         xTV = CL - xIV
	var money = 1;
	if (option_type == 'call') { 
		var oIV =  target_CL - option_strike;
		var xIV =  target_CL - option_strike;
	} else {
		var oIV =  option_strike - target_CL;
		var xIV =  option_strike - target_CL;
	}
	if (oIV < 0) {
		oIV = 0;
		money = -1;
	}
	value_hash['oIV'] = oIV.toString();
	value_hash['xIV'] = xIV.toString();
	value_hash['CL'] = option_input['target_CL'];
	value_hash['money'] = money.toString();
	// option 'CL' 沒有值是 '-'
	// TXs 'CL' 沒有值, 會發生, 有的日期沒有數值
	// TX1 'CL' 沒有值, 不可能
	// MI 'CL' 沒有值, 不可能
	if ((option_input['CL'] == undefined) || (option_input['CL'] == '-')) return value_hash;
	
	var option_CL = parseFloat(option_input['CL']);
	// 另一個會發生負值的是 TV
	// 時間價值的確有可能是負數
	// 通常發生在深度價內(已經賺很多)的大漲或大跌之後
	// https://www.wantgoo.com/blog/article/content?blogname=22609&articleid=1276
	var oTV = option_CL - oIV;
	var xTV = option_CL - xIV;
	value_hash['oTV'] = oTV.toString();
	value_hash['xTV'] = xTV.toString();
	
	return value_hash;
}

// * value MAX
// 給定一個 contract_month (一個合約月份 取出所有的 選擇權履約價)
// 回傳所有日期的 maxOI, maxVOL, .... 是落在哪一個 履約價
// 比較特別的是多了 money0MI, money0TXs, money0TX1
// 決定 VOL 和 OI 是不是要用加權平均值 還是 MAX, 'maxAvg' = false
function getAllOptionMaxValueStrikeByDate (option_input) {
	/*
	option_input = {
		'taifex_type' : 'option',
		'contract_name' : 'TXO',
		'contract_month' : '201810',
		'contract_hours' : 'am',
		'contract_type' : 'call',
		'maxVOLAvg' : false,
		'maxOIAvg' : false
	*/
	var taifex_type = option_input['taifex_type']; // option, future
	var contract_name = option_input['contract_name']; // TX, TXO, all, ...
	var contract_month = option_input['contract_month'].trim(); // 201810
	[dummy, yearString, monthString] = contract_month.match(/^(\d\d\d\d)(\d\d)$/);
	var year = parseInt(yearString); // 2018
	var month = parseInt(monthString); // 10
	var contract_hours = option_input['contract_hours']; // am,pm
	var contract_type = option_input['contract_type']; // call/put

	var contract_strike;
	var date_maxvalue_hash = {};
	
	var option_hash_all = getAllOptionHashByContractMonth (option_input);
	
	// 先取時間軸的最大值 (所有的 option strike)
	var date_h_tmp = {};
	var option_keys_ar = Object.keys(option_hash_all);
	for (var j=0; j<option_keys_ar.length; ++j) {	
		contract_strike = option_keys_ar[j];
		var date_keys_ar = Object.keys(option_hash_all[contract_strike]);
		for (var i_this=0; i_this<date_keys_ar.length; ++i_this) {
			date_h_tmp[date_keys_ar[i_this]] = {};
			// date_maxvalue_hash[date_keys_ar[i_this]] = {};
		} // i
	} // j


	var future_input = {
		'taifex_type' : 'future',
		'contract_name' : 'TX',
		'contract_month' : contract_month,
		'contract_hours' : contract_hours
	}
	var fg_hash_TXs = getFutureHash (future_input); // 有可能有的日期沒有值
	var fg_hash_TX1 = getTX1Hash({'trading_hours':future_input['contract_hours'],'source':'polaris'}); 
	var fg_hash_MI = getMIHash ({'source':'twse'});
		
	// 先時間
	var date_keys_ar = getSortedDateAr(date_h_tmp);
	for (var j=0; j<date_keys_ar.length; ++j) {	
		var date_this = date_keys_ar[j];
		date_maxvalue_hash[date_this] = {};
		var maxVOL, maxOI, money0;
		var maxVoli = 0, maxOIi = 0;	
		var money0TXs, money0TX1, money0MI;		
		var money0TXsi = 0, money0TX1i = 0, money0MIi = 0;
		// 再 strike
		var option_keys_ar = Object.keys(option_hash_all).sort(function(a,b){
			return Number(a)-Number(b)
			});

		// here here here
		var maxVoliAmt = 0, maxVoliCnt = 0;
		var maxOIiAmt = 0, maxOIiCnt = 0;
		for (var i_this=0; i_this<option_keys_ar.length; ++i_this) {
			var contract_strike = option_keys_ar[i_this];
			// VOL
			if ((option_hash_all[contract_strike][date_this] != undefined)
			 && (option_hash_all[contract_strike][date_this]['VOL'] != '-')) {
				maxVoliAmt += parseInt(option_hash_all[contract_strike][date_this]['VOL']) * parseInt(contract_strike);
				maxVoliCnt += parseInt(option_hash_all[contract_strike][date_this]['VOL']);
				if (parseInt(option_hash_all[contract_strike][date_this]['VOL']) >= maxVoli) {
					date_maxvalue_hash[date_this]['maxVOL'] = contract_strike;
					maxVoli = parseInt(option_hash_all[contract_strike][date_this]['VOL']);
				}
			}
			// OI
			if ((option_hash_all[contract_strike][date_this] != undefined)
			 && (option_hash_all[contract_strike][date_this]['OI'] != '-')) {
				maxOIiAmt += parseInt(option_hash_all[contract_strike][date_this]['OI']) * parseInt(contract_strike)
				maxOIiCnt += parseInt(option_hash_all[contract_strike][date_this]['OI']);
				if (parseInt(option_hash_all[contract_strike][date_this]['OI']) >= maxOIi) {
					date_maxvalue_hash[date_this]['maxOI'] = contract_strike;
					maxOIi = parseInt(option_hash_all[contract_strike][date_this]['OI']);
				}
			}
			// money0TXs, money0TX1, money0MI, 
			if (contract_type == 'call') {
				// call
				if ((fg_hash_TXs[date_this] != undefined) && (fg_hash_TXs[date_this]['CL'] != undefined)) {
					if ((money0TXsi == 0) &&
					(Number(fg_hash_TXs[date_this]['CL']) > Number(contract_strike))) {
						date_maxvalue_hash[date_this]['money0TXs'] = contract_strike;
					} else {
						money0TXsi = 1;
					}
				}
				if ((fg_hash_TX1[date_this] != undefined) && (fg_hash_TX1[date_this]['CL'] != undefined)) {
					if ((money0TX1i == 0) &&
					(Number(fg_hash_TX1[date_this]['CL']) > Number(contract_strike))) {
						date_maxvalue_hash[date_this]['money0TX1'] = contract_strike;
					} else {
						money0TX1i = 1;
					}
				}
				if ((fg_hash_MI[date_this] != undefined) && (fg_hash_MI[date_this]['CL'] != undefined)) {
					if ((money0MIi == 0) &&
					(Number(fg_hash_MI[date_this]['CL']) > Number(contract_strike))) {
						date_maxvalue_hash[date_this]['money0MI'] = contract_strike;
					} else {
						money0MIi = 1;
					}
				}
			} else {
				// put
				if ((fg_hash_TXs[date_this] != undefined) && (fg_hash_TXs[date_this]['CL'] != undefined)) {
					if (money0TXsi == 0) {
						date_maxvalue_hash[date_this]['money0TXs'] = contract_strike;
						if (Number(fg_hash_TXs[date_this]['CL']) < Number(contract_strike)) {
							money0TXsi = 1;
						}
					}
				}
				if ((fg_hash_TX1[date_this] != undefined) && (fg_hash_TX1[date_this]['CL'] != undefined)) {				
					if (money0TX1i == 0) {
						date_maxvalue_hash[date_this]['money0TX1'] = contract_strike;
						if (Number(fg_hash_TX1[date_this]['CL']) < Number(contract_strike)) {
							money0TX1i = 1;
						}
					}
				}
				if ((fg_hash_MI[date_this] != undefined) && (fg_hash_MI[date_this]['CL'] != undefined)) {						
					if (money0MIi == 0) {
						date_maxvalue_hash[date_this]['money0MI'] = contract_strike;
						if (Number(fg_hash_MI[date_this]['CL']) < Number(contract_strike)) {
							money0MIi = 1;
						}
					}
				}
			}
		} // i (所有同一天的 strike)
		
		// 多加上  平均值
		date_maxvalue_hash[date_this]['maxVOLavg'] = parseInt(maxVoliAmt/maxVoliCnt);
		date_maxvalue_hash[date_this]['maxOIavg'] = parseInt(maxOIiAmt/maxOIiCnt);
		
		/*
		// OI 和 VOL 用平均值
		if ((option_input['maxVOLAvg'] != undefined) && (option_input['maxVOLAvg'] == true)) {
			if (maxVoliCnt != 0) date_maxvalue_hash[date_this]['maxVOL'] = parseInt(maxVoliAmt/maxVoliCnt);
		}
		if ((option_input['maxOIAvg'] != undefined) && (option_input['maxOIAvg'] == true)) {
			if (maxOIiCnt != 0) date_maxvalue_hash[date_this]['maxOI'] = parseInt(maxOIiAmt/maxOIiCnt);
		}
		*/
	} // j
	
	return date_maxvalue_hash;
}


// ***
// *** T
// optoin, a contract month (201812), get all contract_strike
// return array OptionStrikesAr
// 一個合約月份 取出所有的 選擇權 履約價格
function getOptionStrikesArByContractMonth (option_input) {
	/*
	option_input = {
		'taifex_type' : 'option',
		'contract_name' : 'TXO',
		'contract_month' : '201810',
		'contract_hours' : 'am',
		'contract_type' : 'call',
	}
	*/
	var taifex_type = option_input['taifex_type']; // option, future
	var contract_name = option_input['contract_name']; // TX, TXO, all, ...
	var contract_month = option_input['contract_month'].trim(); // 201810
	[dummy, yearString, monthString] = contract_month.match(/^(\d\d\d\d)(\d\d)$/);
	var year = parseInt(yearString); // 2018
	var month = parseInt(monthString); // 10
	var contract_hours = option_input['contract_hours']; // am,pm
	var contract_type = option_input['contract_type']; // call/put
	
	var OptionStrikesAr = [];
	var contract_strike = '';
	
	// 有可能沒有這個 contract_month (沒有 dir)
	if (! fs.existsSync(filedir + "/" + fg_stem + "/" + taifex_type + "/" + contract_name + "/" + year + "/" + monthString)) {
		return OptionStrikesAr;
	}
	
	// read folder
	var files = fs.readdirSync(filedir + "/" + fg_stem + "/" + taifex_type + "/" + contract_name + "/" + year + "/" + monthString);
	// console.log(files); // [ 'future_TX_am_201811.csv', 'future_TX_pm_201811.csv' ]
	// console.log(files); // [ 'option_TXO_am_201811_put_9300.0000.csv', 'option_TXO_am_201811_put_9400.0000.csv' ]
	for (var i_file=0; i_file<files.length; ++i_file) {
		var fields_fg = files[i_file].toString().trim().split('_');
		
		// option, am
		if ((fields_fg[0] != undefined) && (fields_fg[0] == taifex_type) 
			&& (fields_fg[2] == contract_hours)
			&& (fields_fg[4] == contract_type)) {
			
			contract_strike = fields_fg[5].replace(/\.csv$/,'');
			// contract_key = taifex_type + '_' + contract_name + '_' + contract_hours + '_' + contract_month;
			// contract_key = taifex_type + '_' + contract_name + '_' + contract_hours + '_' + contract_month + '_' + contract_type + '_' + contract_strike;
			OptionStrikesAr.push(contract_strike);
		}
	}	
	
	// 可以 sort

	var OptionStrikesAr = OptionStrikesAr.sort(function(a,b){
		return Number(a)-Number(b)
	});
	
	return OptionStrikesAr;
}

// optoin, a contract month (201812), get all contract_strike hash
// 一個合約月份 取出所有的 選擇權履約價, 的每一天的報價, 
// 先取出這個 合約月份 所有的 選擇權 strikes
// 針對 每一個 strikes, 每一天, 的資料內容
function getAllOptionHashByContractMonth (option_input) {
	/*
	option_input = {
		'taifex_type' : 'option',
		'contract_name' : 'TXO',
		'contract_month' : '201810',
		'contract_hours' : 'am',
		'contract_type' : 'call',
	*/
	var taifex_type = option_input['taifex_type']; // option, future
	var contract_name = option_input['contract_name']; // TX, TXO, all, ...
	var contract_month = option_input['contract_month'].trim(); // 201810
	[dummy, yearString, monthString] = contract_month.match(/^(\d\d\d\d)(\d\d)$/);
	var year = parseInt(yearString); // 2018
	var month = parseInt(monthString); // 10
	var contract_hours = option_input['contract_hours']; // am,pm
	var contract_type = option_input['contract_type']; // call/put
	
	
	var option_data_hash = {};
	var contract_strike = '';
	var option_input_one = option_input;
	/*
	option_input_one = {
		'taifex_type' : 'option',
		'contract_name' : 'TXO',
		'contract_month' : '201810',
		'contract_hours' : 'am',
		'contract_type' : 'call',
		'contract_strike' : '8000.0000'
	}
	*/
	var contract_key = '';
	var OptionStrikesAr = getOptionStrikesArByContractMonth(option_input);
	for (var i_strike=0; i_strike<OptionStrikesAr.length; ++i_strike) {
		contract_strike = OptionStrikesAr[i_strike];
		option_input_one['contract_strike'] = contract_strike;
		option_data_one = getOptionHash (option_input_one);
		option_data_hash[contract_strike] = option_data_one;
	}

	return option_data_hash;
}

// optoin, a contract month (201812), get all contract_strike hash, with value
// 一個合約月份 取出所有的 選擇權履約價, 的每一天的報價, 外加 Value (時間價值, 內含價值)
// 先取出這個 合約月份 所有的 選擇權 strikes
// 針對 每一個 strikes, 每一天, 的資料內容
// 這個做一次要 16秒
function getAllOptionHashByContractMonthWithValue (option_input) {
	/*
	option_input = {
		'taifex_type' : 'option',
		'contract_name' : 'TXO',
		'contract_month' : '201810',
		'contract_hours' : 'am',
		'contract_type' : 'call',
	*/
	var taifex_type = option_input['taifex_type']; // option, future
	var contract_name = option_input['contract_name']; // TX, TXO, all, ...
	var contract_month = option_input['contract_month'].trim(); // 201810
	[dummy, yearString, monthString] = contract_month.match(/^(\d\d\d\d)(\d\d)$/);
	var year = parseInt(yearString); // 2018
	var month = parseInt(monthString); // 10
	var contract_hours = option_input['contract_hours']; // am,pm
	var contract_type = option_input['contract_type']; // call/put
	
	
	var option_data_hash = {};
	var contract_strike = '';
	var option_input_one = option_input;
	/*
	option_input_one = {
		'taifex_type' : 'option',
		'contract_name' : 'TXO',
		'contract_month' : '201810',
		'contract_hours' : 'am',
		'contract_type' : 'call',
		'contract_strike' : '8000.0000'
	}
	*/
	var contract_key = '';
	var OptionStrikesAr = getOptionStrikesArByContractMonth(option_input);
	for (var iii_strike=0; iii_strike<OptionStrikesAr.length; ++iii_strike) {
		contract_strike = OptionStrikesAr[iii_strike];
		option_input_one['contract_strike'] = contract_strike;
		//option_data_one = getOptionHash (option_input_one);
		option_data_one = getOptionHashWithValue (option_input_one);
		option_data_hash[contract_strike] = option_data_one;
	}

	return option_data_hash;
}

