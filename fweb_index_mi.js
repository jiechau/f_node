


var fs = require('fs');
eval(fs.readFileSync('./fconfig.js')+''); // the '' is necessary to let './fconfig.js' as a string

// service port
var service_port = '40001';
// 放到 graphdata1, graphdata2
// 第一個欄位是 date, 最好是 graphdata1, graphdata2 的聯集, 需要自己先設定好
var graphdata1 = {};
var graphdata2 = {};
var textdiv1 = ""; // 不可以有換行
var textdiv2 = ""; // 不可以有換行

var TX1_polaris;
var TX1_taifex;
var MI_polaris;
var MI_twse;
	
// 主要 內容, 寫在 prepareContent()
function prepareContent (url) {

	var date_start = "1987/01/01";
	var date_end = "2019/12/31";
	var chart_year = "2018";
	
	var match_ar = url.match(/\/index\?y=(.+)$/);
	if (match_ar != undefined) {
		chart_year = match_ar[1];
		var date_start = chart_year + "/01/01";
		var date_end = chart_year + "/12/31";
		if (parseInt(chart_year) >= 2018) {
			chart_year = '2018';
			date_start = "2018/01/01";
			date_end = "2019/12/31"
		}
	}
	


	// TX1
	var option_input = {
			'source':'polaris',
			'trading_hours' : 'am',
			'output_raw_line' : false
		}
	if (TX1_polaris == undefined) TX1_polaris = getTX1Hash(option_input);;
	var option_input = {
			'source':'taifex',
			'trading_hours' : 'am',
			'output_raw_line' : false
		}
	if (TX1_taifex == undefined)  TX1_taifex = getTX1Hash(option_input);
	// MI
	if (MI_polaris == undefined)  MI_polaris = getMIpolarisHash();
	if (MI_twse == undefined)  MI_twse = getMItwseHash();

	var data_h = {};
	var union_date = getUnionDateAr ([TX1_polaris, TX1_taifex, MI_polaris, MI_twse]);
	union_date = getArrayInterval(union_date, date_start, date_end);
	
	for (var i=0; i<union_date.length; i++) {
		data_h[union_date[i]] = {};
		
		data_h[union_date[i]]["MItw"] = "";
		if (MI_twse[union_date[i]] != undefined) data_h[union_date[i]]["MItw"] = MI_twse[union_date[i]]['CL'];

		data_h[union_date[i]]["MIpo"] = "";
		if (MI_polaris[union_date[i]] != undefined) data_h[union_date[i]]["MIpo"] = MI_polaris[union_date[i]]['CL'];

		data_h[union_date[i]]["TX1po"] = "";
		if (TX1_polaris[union_date[i]] != undefined) data_h[union_date[i]]["TX1po"] = TX1_polaris[union_date[i]]['CL'];

		data_h[union_date[i]]["TX1tw"] = "";
		if (TX1_taifex[union_date[i]] != undefined) data_h[union_date[i]]["TX1tw"] = TX1_taifex[union_date[i]]['CL'];
		
	}
	
	// 要得, 放到 graphdata1, graphdata2
	// 第一個欄位是 date, 最好是 graphdata1, graphdata2 的聯集, 需要自己先設定好
	graphdata1['title'] = chart_year + ' MItw MIpo TX1po TX1tw';
	graphdata1['labels'] = ["date","MItw","MIpo","TX1po", "TX1tw"];
	graphdata1['rescale'] = [true,false,1,false,false];
	graphdata1['data'] = data_h;
	
	graphdata2['title'] = graphdata1['title'];
	graphdata2['labels'] = graphdata1['labels'];
	graphdata2['rescale'] = graphdata1['rescale'];
	graphdata2['data'] = graphdata1['data'];
	
	// text div
	
	textdiv1 = "aaa"; // 不可以有換行
	textdiv2 = "bbb"; // 不可以有換行
	
	
	textdiv1 = "<a href='/index?o=all'>all</a>&nbsp;";
	textdiv1 +=  "<br/>&nbsp;";
	textdiv1 +=  "year:&nbsp;";
	for (var i_year=2019;i_year>1980;i_year--) {	
		textdiv1 += "<a href='/index?y=" + i_year + "'>" + i_year + "</a>&nbsp;";
		textdiv1 +=  "&nbsp;";
	} // year


}


// 文件最後要有這個
eval(fs.readFileSync('./fweb_dygraph_standard.js')+''); // the '' is necessary to let './fconfig.js' as a string




