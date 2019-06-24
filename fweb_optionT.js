
var fs = require('fs');
eval(fs.readFileSync('./fconfig.js')+''); // the '' is necessary to let './fconfig.js' as a string

var service_port = '40004';

var date_this = '2018/12/11';
var contract_month_this = '201812';

var TX1_taifex = getTX1Hash({'source':'taifex','trading_hours' : 'am','output_raw_line' : false});
var MI_twse = getMItwseHash();

// 主要 內容, 寫在 response_html()
function response_html () {

	// call, value hash by date
	var option_input_call = {
		'taifex_type' : 'option',
		'contract_name' : 'TXO',
		'contract_month' : contract_month_this, // 201812
		'contract_hours' : 'am',
		'contract_type' : 'call',
	}
	var option_h_call = getAllOptionHashByContractMonth (option_input_call); // ok quick
	// put, value hash by date
	var option_input_put = {
		'taifex_type' : 'option',
		'contract_name' : 'TXO',
		'contract_month' : contract_month_this, // 201812
		'contract_hours' : 'am',
		'contract_type' : 'put',
	}
	var option_h_put = getAllOptionHashByContractMonth (option_input_put); // ok quick
	
	// console.log(option_h_call['9600.0000']['2018/12/11']);

	// info, div1
	var textdiv1 = ""; 
	textdiv1 += "contract month: " + contract_month_this + "&nbsp\n <a href='/'>reset</a><br/>\n";
	textdiv1 += "date_this: " + "<a href='/index?m=" + contract_month_this + "&d=" + getPrevDate(date_this) + "'>prev</a>&nbsp;";
	var ISO8601 = ['<font color=red>sun</font>','mon','tue','wed','thu','fri','<font color=green>sat</font>','<font color=red>sun</font>'];
	var weekday = dateFormat(new Date(parseInt(date_this.substr(0,4)), parseInt(date_this.substr(5,2)) - 1, parseInt(date_this.substr(8,2))),"N");
	textdiv1 += date_this + "&nbsp;" + ISO8601[weekday] + "&nbsp;(" + getDifferentDays(date_this, getContractMonthEndDate(contract_month_this)) + ")&nbsp;";
	textdiv1 += "<a href='/index?m=" + contract_month_this + "&d=" + getNextDate(date_this) + "'>next</a>&nbsp;";
	// contract_month, div1
	textdiv1 += "<br/><br/><br/>\n";
	for (var i_year=2019;i_year>2002;i_year--) {
		textdiv1 +=  i_year +"&nbsp;";
		
		for (var i_month=12;i_month>0;i_month--) {
			var monthString = ("0" + i_month).slice(-2);
			var contract_month_string = '' + i_year + monthString;
			textdiv1 += "<a href='/index?m=" + contract_month_string + "&d=" + date_this + "'>" + monthString + "</a>&nbsp;";
			// textdiv1 += "<a href='/index?o=201812'>201812</a>";
			// textdiv1 += "<a href='/index?o=" + kkey + "'>" + kkey + "</a><br/>";

		} // month
		textdiv1 +=  "<br/>&nbsp;";
	} // year

	
	// optionT
	var textdiv2 = ""; 
	textdiv2 += "<table border=1>\n";
	textdiv2 += "<tr>\n";
	textdiv2 += "<td align=right>OI</td>\n";
	textdiv2 += "<td align=right>VOL</td>\n";
	textdiv2 += "<td align=right>CL</td>\n";
	textdiv2 += "<td>strike</td>\n";
	textdiv2 += "<td align=right>CL</td>\n";
	textdiv2 += "<td align=right>VOL</td>\n";
	textdiv2 += "<td align=right>OI</td>\n";
	textdiv2 += "</tr>\n";
	
	var isMoney0 = false;
	var money0String = "";
	
	var strikeAR = getOptionStrikesArByContractMonth(option_input_call); // call,put 的 strike 都一樣
	for (var iStrike = 0; iStrike<strikeAR.length; iStrike++) {
		var strike_now = strikeAR[iStrike];
		var CL_now_call = "/";
		var CL_now_put = "/";
		var VOL_now_call = "/";
		var VOL_now_put = "/";
		var OI_now_call = "/";
		var OI_now_put = "/";
		if (option_h_call[strike_now][date_this] != undefined) CL_now_call = option_h_call[strike_now][date_this]['CL'];
		if (option_h_put[strike_now][date_this] != undefined) CL_now_put = option_h_put[strike_now][date_this]['CL'];
		if (option_h_call[strike_now][date_this] != undefined) VOL_now_call = option_h_call[strike_now][date_this]['VOL'];
		if (option_h_put[strike_now][date_this] != undefined) VOL_now_put = option_h_put[strike_now][date_this]['VOL'];
		if (option_h_call[strike_now][date_this] != undefined) OI_now_call = option_h_call[strike_now][date_this]['OI'];
		if (option_h_put[strike_now][date_this] != undefined) OI_now_put = option_h_put[strike_now][date_this]['OI'];
		if (! isNaN(CL_now_call)) CL_now_call = Number(CL_now_call).toFixed(2);
		if (! isNaN(CL_now_put)) CL_now_put = Number(CL_now_put).toFixed(2);
		if (TX1_taifex[date_this] != undefined) {
			if ((! isMoney0) && (parseInt(strike_now) > parseInt(TX1_taifex[date_this]['CL']))) {
				money0String = "(" + TX1_taifex[date_this]['vvv'] + ")&nbsp;"; 				
				money0String += "<font color=red>" + TX1_taifex[date_this]['CL'] + "</font>";
				isMoney0 = true;
			}
		}
		
		textdiv2 += "<tr>\n";
		
		textdiv2 += "<td align=right>" + OI_now_call.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>\n";
		textdiv2 += "<td align=right>" + VOL_now_call.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>\n";
		textdiv2 += "<td align=right>" + CL_now_call + "</td>\n";
		textdiv2 += "<td align=right>";
		if (money0String != undefined) textdiv2 += money0String + "<br/>\n";
		textdiv2 +=  parseInt(strike_now) + "</td>\n";
		textdiv2 += "<td align=right>" + CL_now_put + "</td>\n";
		textdiv2 += "<td align=right>" + VOL_now_put.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>\n";
		textdiv2 += "<td align=right>" + OI_now_put.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td>\n";
		
		textdiv2 += "</tr>\n";
		
		money0String = undefined;
		
	}
	textdiv2 += "</table>\n";
	
	
	var response_string = "";
	response_string += "<div id='textdiv1' style='width:500px'>" + textdiv1 + "</div>\n";
	response_string += "<div id='textdiv2' style='width:500px; position:absolute; top:0; left:500'>" + textdiv2 + "</div>\n";	
	// the final string
	return response_string;
}

//透過http模組啟動web server服務
const http = require('http');
const server = http.createServer(function (req, res) {
	//設定回應為text文件，並回應 Hello World!
	
	const { method, url } = req;
	const { headers } = req;

	// this is the default page
	date_this = dateFormat(new Date(), "yyyy/mm/dd");
	date_this = getPrevDate(date_this);
	contract_month_this = getThisContractMonth2(date_this);
	
	if (url.startsWith("/index?")) {
		//  "/index?m=201812&d=2018/12/11"
		var match_ar = url.match(/\/index\?m=(\d\d\d\d\d\d)&d=(\d\d\d\d\/\d\d\/\d\d)$/);
		if (match_ar != undefined) {
			// here change option contract
			contract_month_this = match_ar[1];
			date_this = match_ar[2];
		} 
	} 

	// 修正 date_this 和 contract_month_this 的關係
	if (getDifferentDays(date_this, getContractMonthEndDate(contract_month_this)) < 0)
		date_this = getContractMonthEndDate(contract_month_this);
	
	res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
	//res.write(date_this + "<br/>\n");
	//res.write(contract_month_this + "<br/>\n");
	res.write(response_html());
	res.end();
	return;
	//res.write(html_content);
	//res.write(JSON.stringify(fg_hash));

})

// start web server
server.listen(service_port, function () {  
  console.log('http://' + addrlocalhost + ":" + service_port);
})

process.on('uncaughtException', function (err) {
    var log_msg = 'err uncaughtException' + err;
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
}); 
