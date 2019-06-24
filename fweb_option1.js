/*

一個合約月份, 例如 201812
的一個履約價 的 圖表



但是測試了 VOLz (使用 getAllOptionHashByContractMonth 來取出值計算)
畫圖的時候, 只要 label 是 VOLz 就會畫出 bar chart

*/
var fs = require('fs');
eval(fs.readFileSync('./fconfig.js')+''); // the '' is necessary to let './fconfig.js' as a string

var TX1_taifex;
var MI_twse;

// service port
var service_port = '40003';
// 放到 graphdata1, graphdata2
// 第一個欄位是 date, 最好是 graphdata1, graphdata2 的聯集, 需要自己先設定好
var graphdata1 = {};
var graphdata2 = {};
var textdiv1 = ""; // 不可以有換行
var textdiv2 = ""; // 不可以有換行
// 主要 內容, 寫在 prepareContent()
function prepareContent (url) {

	var option_input = {
			'source':'taifex',
			'trading_hours' : 'am',
			'output_raw_line' : false
		}
	if (TX1_taifex == undefined)  TX1_taifex = getTX1Hash(option_input);
	if (MI_twse == undefined)  MI_twse = getMItwseHash();

	var contract_month_t;
	var contract_strike_t;
	// if (url.startsWith("/dygraph_data.csv")
	// /index?o=201812&s=9000.0000
	var match_ar = url.match(/\/index\?o=(\d\d\d\d\d\d)&s=(.+)$/);
	if (match_ar != undefined) {
		contract_month_t = match_ar[1];
		contract_strike_t = match_ar[2];
	} else {
		contract_month_t = '201812';
		contract_strike_t = '9700.0000';
	}
	// call, value hash by date
	var option_input_call = {
		'taifex_type' : 'option',
		'contract_name' : 'TXO',
		'contract_month' : contract_month_t, // 201812
		'contract_hours' : 'am',
		'contract_type' : 'call',
		'maxVOLAvg' : false,
		'maxOIAvg' : false
	}
	var month_strike_call = getOptionStrikesArByContractMonth(option_input_call);
	var month_h_call = getAllOptionHashByContractMonth (option_input_call);
	// put, value hash by date
	var option_input_put = {
		'taifex_type' : 'option',
		'contract_name' : 'TXO',
		'contract_month' : contract_month_t, // 201812
		'contract_hours' : 'am',
		'contract_type' : 'put',
		'maxVOLAvg' : false,
		'maxOIAvg' : false
	}
	var month_strike_put = getOptionStrikesArByContractMonth(option_input_put);
	var month_h_put = getAllOptionHashByContractMonth (option_input_put);
	// check contract_month_t
	if ((month_strike_call.length == 0) && (month_strike_put.length == 0)) {
		contract_month_t = '201812';
		option_input_call['contract_month'] = contract_month_t;
		option_input_put['contract_month'] = contract_month_t;
		month_strike_call = getOptionStrikesArByContractMonth(option_input_call);
		month_h_call = getAllOptionHashByContractMonth (option_input_call);
		month_strike_put = getOptionStrikesArByContractMonth(option_input_put);
		month_h_put = getAllOptionHashByContractMonth (option_input_put);
	}
	// check contract_strike_t
	if ((month_h_call[contract_strike_t] == undefined) && (month_h_put[contract_strike_t] == undefined)) {
		contract_strike_t = month_strike_call[0];
	}
	var strike_data_call = month_h_call[contract_strike_t];
	var strike_data_put = month_h_put[contract_strike_t];

	// 要得, 放到 graphdata1, graphdata2
	// 第一個欄位是 date, 最好是 graphdata1, graphdata2 的聯集, 需要自己先設定好
	graphdata1['data'] = {};
	var date_ar = Object.keys(strike_data_call);
	for (var i_data_ar=0; i_data_ar<date_ar.length; i_data_ar++) {
		var date_now = date_ar[i_data_ar];
		graphdata1['data'][date_now] = {};
		graphdata1['data'][date_now]["MI"] = MI_twse[date_now]["CL"];
		graphdata1['data'][date_now]["TX1"] = TX1_taifex[date_now]["CL"];
		graphdata1['data'][date_now]["CL"] = strike_data_call[date_now]["CL"];
		graphdata1['data'][date_now]["VOLz"] = strike_data_call[date_now]["VOL"];
	}
	graphdata1['title'] = contract_month_t + ' ' + contract_strike_t + ' call';
	graphdata1['labels'] = ["date","MI","TX1","CL","VOLz"];
	graphdata1['rescale'] = [false,1,false,true,false];
	//graphdata1['data'] = strike_data_call;

	graphdata2['data'] = {};
	var date_ar = Object.keys(strike_data_put);
	for (var i_data_ar=0; i_data_ar<date_ar.length; i_data_ar++) {
		var date_now = date_ar[i_data_ar];
		graphdata2['data'][date_now] = {};
		graphdata2['data'][date_now]["MI"] = MI_twse[date_now]["CL"];
		graphdata2['data'][date_now]["TX1"] = TX1_taifex[date_now]["CL"];
		graphdata2['data'][date_now]["CL"] = strike_data_put[date_now]["CL"];
		graphdata2['data'][date_now]["VOLz"] = strike_data_put[date_now]["VOL"];
	}
	graphdata2['title'] = contract_month_t + ' ' + contract_strike_t + ' put';
	graphdata2['labels'] = ["date","MI","TX1","CL","VOLz"];
	graphdata2['rescale'] = [false,1,false,true,false];
	//graphdata2['data'] = strike_data_put;
	
	
	// text div
	
	textdiv1 = ""; // 不可以有換行
	textdiv2 = ""; // 不可以有換行
	
	//textdiv1 = "aaa"; // 不可以有換行
	for (var i_year=2019;i_year>2002;i_year--) {
		textdiv1 +=  i_year +"&nbsp;";
		
		for (var i_month=12;i_month>0;i_month--) {
			var monthString = ("0" + i_month).slice(-2);
			var contract_month_string = '' + i_year + monthString;
			// 都用 call 好了
			var option_input_call_string = {
				'taifex_type' : 'option',
				'contract_name' : 'TXO',
				'contract_month' : contract_month_string, // 201812
				'contract_hours' : 'am',
				'contract_type' : 'call',
				'maxVOLAvg' : false,
				'maxOIAvg' : false
			}
			// strike 初始 用一半的值就好了
			var month_strike_call_ar = getOptionStrikesArByContractMonth(option_input_call_string);
			var strike_call_first_string = month_strike_call_ar[parseInt((month_strike_call_ar.length)/2)];
			textdiv1 += "<a href='/index?o=" + contract_month_string + "&s=" + strike_call_first_string + "'>" + monthString + "</a>&nbsp;";
			// textdiv1 += "<a href='/index?o=201812'>201812</a>";
			// textdiv1 += "<a href='/index?o=" + kkey + "'>" + kkey + "</a><br/>";

		} // month
		textdiv1 +=  "<br/>&nbsp;";
	} // year
	
	//textdiv2 = "bbb"; // 不可以有換行
	var option_input_call_string = {
		'taifex_type' : 'option',
		'contract_name' : 'TXO',
		'contract_month' : contract_month_t, // 201812
		'contract_hours' : 'am',
		'contract_type' : 'call',
		'maxVOLAvg' : false,
		'maxOIAvg' : false
	}
	var month_strike_call_ar = getOptionStrikesArByContractMonth(option_input_call_string);
	var option_input_put_string = {
		'taifex_type' : 'option',
		'contract_name' : 'TXO',
		'contract_month' : contract_month_t, // 201812
		'contract_hours' : 'am',
		'contract_type' : 'put',
		'maxVOLAvg' : false,
		'maxOIAvg' : false
	}
	var month_strike_put_ar = getOptionStrikesArByContractMonth(option_input_put_string);
	// get union ar
	var div2_strike_h = {};
	for (var iii=0; iii<month_strike_call_ar.length; iii++) {
		div2_strike_h[month_strike_call_ar[iii]] = 1;
	}
	for (var iii=0; iii<month_strike_put_ar.length; iii++) {
		div2_strike_h[month_strike_put_ar[iii]] = 1;
	}
	// sort
	var div2_strike_ar = Object.keys(div2_strike_h)
	var div2_list_ar = div2_strike_ar.sort(function(a,b){
		return Number(b)-Number(a)
	});
	// print out
	for (var jjj=0; jjj<div2_list_ar.length; jjj++) {
		var strike_jjj = div2_list_ar[jjj];
		// call
		if (month_strike_call_ar.indexOf(strike_jjj) === -1) {
			textdiv2 +=  div2_list_ar[jjj] +"&nbsp;";
		} else {
			textdiv2 += "<a href='/index?o=" + contract_month_t + "&s=" + strike_jjj + "'>" + div2_list_ar[jjj] +"</a>&nbsp;";
		}
		// the middle one
		textdiv2 +=  div2_list_ar[jjj] +"&nbsp;";
		// put
		if (month_strike_put_ar.indexOf(strike_jjj) === -1) {
			textdiv2 +=  div2_list_ar[jjj] +"&nbsp;";
		} else {
			textdiv2 += "<a href='/index?o=" + contract_month_t + "&s=" + strike_jjj + "'>" + div2_list_ar[jjj] +"</a>&nbsp;";
		}
		textdiv2 += "<br/>&nbsp;";
	}
	
	
}

// 文件最後要有這個
eval(fs.readFileSync('./fweb_dygraph_standard.js')+''); // the '' is necessary to let './fconfig.js' as a string




