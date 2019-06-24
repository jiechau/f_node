/*

一個合約月份, 例如 201812
所有的 履約價 的極值
基本上是 使用 getAllOptionMaxValueStrikeByDate

但是測試了 VOLz (使用 getAllOptionHashByContractMonth 來取出值計算)
畫圖的時候, 只要 label 是 VOLz 就會畫出 bar chart

*/
var fs = require('fs');
eval(fs.readFileSync('./fconfig.js')+''); // the '' is necessary to let './fconfig.js' as a string

var TX1_taifex;
var MI_twse;

// service port
var service_port = '40002';
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
	var match_ar = url.match(/\/index\?o=(.+)$/);
	if (match_ar != undefined) {
		contract_month_t = match_ar[1];
	} else {
		contract_month_t = '201812';
	}

	// call, value hash by date
	var option_input_h = {
		'taifex_type' : 'option',
		'contract_name' : 'TXO',
		'contract_month' : contract_month_t, // 201812
		'contract_hours' : 'am',
		'contract_type' : 'call',
		'maxVOLAvg' : false,
		'maxOIAvg' : false
	}
	var maxvalue_h_call = getAllOptionMaxValueStrikeByDate (option_input_h);
	var month_h_call = getAllOptionHashByContractMonth (option_input_h);
	var dateAR = Object.keys(maxvalue_h_call);
	for (var ii=0; ii<dateAR.length; ii++) {
		maxvalue_h_call[dateAR[ii]]["VOLz"] = 
			month_h_call[maxvalue_h_call[dateAR[ii]]["maxVOL"]][dateAR[ii]]['VOL'];
		/*
		// 這個部分, 本來用所有當天交易量的總和
		maxvalue_h_call[dateAR[ii]]["VOLz"] = 0;
		var strikeAR = Object.keys(month_h_call);
		for (var jj=0; jj<strikeAR.length; jj++) {
			if (month_h_call[strikeAR[jj]][dateAR[ii]] != undefined) {
				if ((month_h_call[strikeAR[jj]][dateAR[ii]]['VOL'] != undefined)
					&& (month_h_call[strikeAR[jj]][dateAR[ii]]['VOL'] != "-")
					){
					maxvalue_h_call[dateAR[ii]]["VOLz"] += parseInt(month_h_call[strikeAR[jj]][dateAR[ii]]['VOL']);
				}
			}
		}
		*/
	}
	// put, value hash by date
	var option_input_h = {
		'taifex_type' : 'option',
		'contract_name' : 'TXO',
		'contract_month' : contract_month_t, // 201812
		'contract_hours' : 'am',
		'contract_type' : 'put',
		'maxVOLAvg' : false,
		'maxOIAvg' : false
	}
	var maxvalue_h_put = getAllOptionMaxValueStrikeByDate (option_input_h);
	var month_h_put = getAllOptionHashByContractMonth (option_input_h);
	var dateAR = Object.keys(maxvalue_h_put);
	for (var ii=0; ii<dateAR.length; ii++) {
		maxvalue_h_put[dateAR[ii]]["VOLz"] = 
			month_h_put[maxvalue_h_put[dateAR[ii]]["maxVOL"]][dateAR[ii]]['VOL'];
		/*
		// 這個部分, 本來用所有當天交易量的總和
		maxvalue_h_put[dateAR[ii]]["VOLz"] = 0;
		var strikeAR = Object.keys(month_h_put);
		for (var jj=0; jj<strikeAR.length; jj++) {
			if (month_h_put[strikeAR[jj]][dateAR[ii]] != undefined) {
				if ((month_h_put[strikeAR[jj]][dateAR[ii]]['VOL'] != undefined)
					&& (month_h_put[strikeAR[jj]][dateAR[ii]]['VOL'] != "-")
					){
					maxvalue_h_put[dateAR[ii]]["VOLz"] += parseInt(month_h_put[strikeAR[jj]][dateAR[ii]]['VOL']);
				}
			}
		}
		*/
	}
	
	// 要得, 放到 graphdata1, graphdata2
	// 第一個欄位是 date, 最好是 graphdata1, graphdata2 的聯集, 需要自己先設定好
	graphdata1['data'] = {};
	var date_ar = Object.keys(maxvalue_h_call);
	for (var i_data_ar=0; i_data_ar<date_ar.length; i_data_ar++) {
		var date_now = date_ar[i_data_ar];
		graphdata1['data'][date_now] = {};
		graphdata1['data'][date_now]["TX1"] = TX1_taifex[date_now]["CL"];
		graphdata1['data'][date_now]["maxOI"] = maxvalue_h_call[date_now]["maxOI"];
		graphdata1['data'][date_now]["maxVOL"] = maxvalue_h_call[date_now]["maxVOL"];
		graphdata1['data'][date_now]["VOLz"] = maxvalue_h_call[date_now]["VOLz"];
	}
	graphdata1['title'] = contract_month_t + ' call';
	graphdata1['labels'] = ["date","TX1","maxOI","maxVOL","VOLz"];
	graphdata1['rescale'] = [false,1,false,false,false];
	//graphdata1['data'] = maxvalue_h_call;

	graphdata2['data'] = {};
	var date_ar = Object.keys(maxvalue_h_put);
	for (var i_data_ar=0; i_data_ar<date_ar.length; i_data_ar++) {
		var date_now = date_ar[i_data_ar];
		graphdata2['data'][date_now] = {};
		graphdata2['data'][date_now]["TX1"] = TX1_taifex[date_now]["CL"];
		graphdata2['data'][date_now]["maxOI"] = maxvalue_h_put[date_now]["maxOI"];
		graphdata2['data'][date_now]["maxVOL"] = maxvalue_h_put[date_now]["maxVOL"];
		graphdata2['data'][date_now]["VOLz"] = maxvalue_h_put[date_now]["VOLz"];
	}
	graphdata2['title'] = contract_month_t + ' put';
	graphdata2['labels'] = ["date","TX1","maxOI","maxVOL","VOLz"];
	graphdata2['rescale'] = [false,1,false,false,false];
	//graphdata2['data'] = maxvalue_h_put;
	
	
	// text div
	textdiv1 = ""; // 不可以有換行
	textdiv2 = ""; // 不可以有換行
	
	for (var i_year=2019;i_year>2002;i_year--) {
		textdiv1 +=  i_year +"&nbsp;";
		
		for (var i_month=12;i_month>0;i_month--) {
			var monthString = ("0" + i_month).slice(-2);
			var contract_month_string = i_year + monthString;
			
			textdiv1 += "<a href='/index?o=" + contract_month_string + "'>" + monthString + "</a>&nbsp;";
			// textdiv1 += "<a href='/index?o=201812'>201812</a>";
			// textdiv1 += "<a href='/index?o=" + kkey + "'>" + kkey + "</a><br/>";

		} // month
		
		textdiv1 +=  "<br/>&nbsp;";
	} // year
	
}

// 文件最後要有這個
eval(fs.readFileSync('./fweb_dygraph_standard.js')+''); // the '' is necessary to let './fconfig.js' as a string




