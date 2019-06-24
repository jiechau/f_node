/*

#/usr/local/bin/node fstrategy_result.js option 2018 40


foreach (days..) {
	get quote
	check_position(), strategy_out()
	strategy_in()
	report result
}
*/
var fs = require('fs');
eval(fs.readFileSync('./fconfig.js')+''); // the '' is necessary to let './fconfig.js' as a string


var year = process.argv[2]; // 2018
var date_start = '' + year + "/01/01";
var date_end = '' + year + "/12/31";
// month = parseInt(process.argv[2]); // 12
var my_ratio = Number(process.argv[3]) / 10;
/*
var date_start = "2012/11/18";
var date_end = "2012/12/21";
var my_ratio = 3.0;
*/

//console.log(date_start);
//console.log(date_end);
//console.log(my_ratio.toFixed(1));
//return;



//console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " start");

var TX1hash = getTX1Hash({'trading_hours':'am','source':'taifex'});
var hContractMonthUsed = {};
var hOptionData = {}; // key 是 contract_month
var hOptionMax = {}; // key 是 contract_month

// for each day, prepare data
var date_ivl = getDifferentDays(date_start, date_end);
for (var i_date=0; i_date<=date_ivl; i_date++) {
	var date_this = getNextnDate(date_start, i_date);
	hContractMonthUsed[getThisContractMonth2(date_this)] = 1;
	// 因為最後幾天, 有可能會用到下一個合約月份
	hContractMonthUsed[getNextContractMonth2(date_this)] = 1;
}

//console.log(hContractMonthUsed);
//return;
var arContractMonth = Object.keys(hContractMonthUsed);
for (var itmp = 0; itmp < arContractMonth.length; itmp++) {
	var contract_month_this = arContractMonth[itmp];
	hOptionData[contract_month_this] = {};
	hOptionMax[contract_month_this] = {};
	var option_input = {
		'taifex_type' : 'option',
		'contract_name' : 'TXO',
		'contract_month' : contract_month_this,
		//'contract_month' : "201801",
		'contract_hours' : 'am',
		'contract_type' : 'call',
		'maxVOLAvg' : false,
		'maxOIAvg' : false
	}
	hOptionMax[arContractMonth[itmp]]['call'] = getAllOptionMaxValueStrikeByDate(option_input);
	hOptionData[arContractMonth[itmp]]['call'] = getAllOptionHashByContractMonth(option_input);
	//hOptionData[arContractMonth[itmp]]['call'] = getAllOptionHashByContractMonthWithValue(option_input);
	option_input['contract_type'] = 'put';
	hOptionMax[arContractMonth[itmp]]['put'] = getAllOptionMaxValueStrikeByDate(option_input);
	hOptionData[arContractMonth[itmp]]['put'] = getAllOptionHashByContractMonth(option_input);
	//hOptionData[arContractMonth[itmp]]['put'] = getAllOptionHashByContractMonthWithValue(option_input);
	
}

var stock_position = [];
var my_in_cumulate = 0;
var my_out_cumulate = 0;
var cnt_lots_all = 0;
var cnt_lots_win_0 = 0;
var cnt_lots_win_1 = 0;
var cnt_lots_lose = 0;
//var my_ratio = 4.0;

/*
stock_position =[
	{
		'status': true // 1:true, 賣掉就 false
		'contract_key': getOptionContractKey();
		'contract_month': "201812",
		'contract_strike': "8000.0000",
		'contract_type': "call",
		'in_time' : "2018/01/01",
		'in_lots' : 1
		'in_position': 50,
		'in_type' : 'buy'
		'out_time' : "2018/01/01",
		'out_lots' : 1
		'out_position': 50,
		'out_type' : 'sell'
		'out_strgy' : 0,1,2,3... // 0:到期
	},
	{},

];

*/
// for each day
var date_ivl = getDifferentDays(date_start, date_end);
for (var i_date=0; i_date<=date_ivl; i_date++) {
	var date_this = getNextnDate(date_start, i_date);
	// 有些日期沒有開盤
	if (TX1hash[date_this] != undefined) { 

		// strategy_in(date_this)
		strategy_in(date_this);

		// strategy_out()
		strategy_out(date_this)

		// report result(), for debug
		/*
		//一天 print 一行
		console.log(date_this + " " + my_ratio.toFixed(1) 
		+ " " + Number(my_in_cumulate).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		+ " " + Number(my_in_cumulate + my_out_cumulate).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
		*/	
		
	} // 有些日期沒有開盤
} // everyday
//console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " end");

//最後一年 print 一行
console.log(year + " " + my_ratio.toFixed(1) 
+ " " + Number(my_in_cumulate).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
+ " " + Number(my_in_cumulate + my_out_cumulate).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
return;




function prt_stock_position () {
/*
[
	{
		'status': true // 1:true, 賣掉就 false
		'contract_key': getOptionContractKey();
		'contract_month': "201812",
		'contract_strike': "8000.0000",
		'contract_type': "call",
		'in_time' : "2018/01/01",
		'in_lots' : 1
		'in_position': 50,
		'in_type' : 'buy'
		'out_time' : "2018/01/01",
		'out_lots' : 1
		'out_position': 50,
		'out_type' : 'sell'
	},
	{},

];
*/
	var print_str = "";
	for (var iARindex = 0; iARindex<stock_position.length; iARindex++) {
		var ar = stock_position[iARindex];
		print_str += ar['status'] + " ";
		print_str += ar['contract_month'] + " ";
		print_str += ar['contract_strike'] + " ";
		print_str += ar['contract_type'] + " ";
		print_str += ar['in_time'] + " ";
		print_str += ar['in_position'] + ", ";
		print_str += ar['out_time'] + " ";
		print_str += ar['out_position'] + "\n";
	}

	console.log(print_str);
}

function strategy_out(date_this){
		
		var contract_month_this = TX1hash[date_this]['contract_month'];
		var contract_month_next = getNextContractMonth(contract_month_this);
		var contract_month_days_left = getDifferentDays(date_this, getContractMonthEndDate(getThisContractMonth2(date_this)));

		for (var iARindex = 0; iARindex<stock_position.length; iARindex++) {
			if (stock_position[iARindex]['status']) {

				var isOut = false;
				var out_strgy = 0;
			
				var contract_month_index = stock_position[iARindex]['contract_month'];
				var contract_strike_index = stock_position[iARindex]['contract_strike'];
				var contract_hours_index = stock_position[iARindex]['contract_hours'];
				var contract_type_index = stock_position[iARindex]['contract_type'];
				var contract_in_lots = stock_position[iARindex]['in_lots'];
				var contract_in_position = stock_position[iARindex]['in_position'];
				var contract_in_type = stock_position[iARindex]['in_type'];

				// 會遇到一個情形是, 太冷門的 strike, 有些日期 有OI, VOL=0, SP(結算價)=0, 其他都沒有 CL='-'
				// 應該用結算價才能保證一定有數值
				// var CL_out = hOptionData[contract_month_index][contract_type_index][contract_strike_index][date_this]['CL'];
				var CL_out = hOptionData[contract_month_index][contract_type_index][contract_strike_index][date_this]['SP'];
		
		
				// 到期先結束
				if ((contract_month_days_left == 0) && (contract_month_this == contract_month_index) ){
					isOut = true;
					if (Number(CL_out) > (Number(contract_in_position))) {
						cnt_lots_win_0++;
					} else {
						cnt_lots_lose++;
					}
				} else {
		
					if (Number(CL_out) >= (my_ratio)*(Number(contract_in_position))) {

						isOut = true;
						out_strgy = 1;
						cnt_lots_win_1++;
					} else {
						//console.log("???" + contract_in_position + ":" + CL_out + "???");
					}
					
				}
		
				if (isOut) {
	
					my_out_cumulate += Number(CL_out)*50;
					
					stock_position[iARindex]['status'] = false;
					stock_position[iARindex]['out_time'] = date_this;
					stock_position[iARindex]['out_position'] = CL_out;
					stock_position[iARindex]['out_type'] = 'sell';
					stock_position[iARindex]['out_strgy'] = out_strgy;
					

				}
			
			} // 'status': true
		}
		
}

function strategy_in(date_this){
	
		var contract_month_this = TX1hash[date_this]['contract_month'];
		var contract_month_next = getNextContractMonth(contract_month_this);
		var contract_month_days_left = getDifferentDays(date_this, getContractMonthEndDate(getThisContractMonth2(date_this)));

		var contract_month_in = contract_month_this;
		if (contract_month_days_left < 16) {
			contract_month_in = contract_month_next;
		}
		
		var maxVOLcallStrike = hOptionMax[contract_month_in]['call'][date_this]['maxVOL'];
		var maxVOLputStrike = hOptionMax[contract_month_in]['put'][date_this]['maxVOL'];

		var maxVOLcallCL = hOptionData[contract_month_in]['call'][maxVOLcallStrike][date_this]['CL'];
		var maxVOLputCL = hOptionData[contract_month_in]['put'][maxVOLputStrike][date_this]['CL'];

		var maxVOLcallDiff = parseInt(maxVOLcallStrike) - parseInt(TX1hash[date_this]['CL']);
		var maxVOLputDiff = parseInt(TX1hash[date_this]['CL']) - parseInt(maxVOLputStrike);
		
		if ((maxVOLcallDiff < 500) && (maxVOLputDiff < 500)) {
		if ((maxVOLcallCL < 100) && (maxVOLputCL < 100)) {

			var option_input_call = {
				'taifex_type' : 'option',
				'contract_name' : 'TXO',
				'contract_month' : contract_month_in,
				'contract_hours' : 'am',
				'contract_type' : 'call',
				'contract_strike' : maxVOLcallStrike
			}
			var position_this_call =
			{
				'status': true, // 1:true, 賣掉就 false
				'contract_key': getOptionContractKey(option_input_call),
				'contract_month': contract_month_in,
				'contract_strike': maxVOLcallStrike,
				'contract_hours' : 'am',
				'contract_type': "call",
				'in_time' : date_this,
				'in_lots' : 1,
				'in_position': maxVOLcallCL,
				'in_type' : 'buy'
				//'out_time' : "2018/01/01",
				//'out_lots' : 1
				//'out_position': 50,
				//'out_type' : 'sell'
				//'out_strgy' : 0,1,2,3... // 0:到期
			}
			stock_position.push(position_this_call);
			my_in_cumulate = my_in_cumulate - (Number(maxVOLcallCL)*50);
			cnt_lots_all++;

			var option_input_put = {
				'taifex_type' : 'option',
				'contract_name' : 'TXO',
				'contract_month' : contract_month_in,
				'contract_hours' : 'am',
				'contract_type' : 'put',
				'contract_strike' : maxVOLputStrike
			}
			var position_this_put =
			{
				'status': true, // 1:true, 賣掉就 false
				'contract_key': getOptionContractKey(option_input_put),
				'contract_month': contract_month_in,
				'contract_strike': maxVOLputStrike,
				'contract_hours' : 'am',
				'contract_type': "put",
				'in_time' : date_this,
				'in_lots' : 1,
				'in_position': maxVOLputCL,
				'in_type' : 'buy'
				//'out_time' : "2018/01/01",
				//'out_lots' : 1
				//'out_position': 50,
				//'out_type' : 'sell'
				//'out_strgy' : 0,1,2,3 // 0:到期
			}
			stock_position.push(position_this_put);
			my_in_cumulate = my_in_cumulate - (Number(maxVOLputCL)*50);
			cnt_lots_all++;

		}
		}

}

function lot_in(){
	
}

function lot_out(){
	
}

return;

var response_string = "";
response_string += "<table border=1>\n";
for (var i=1;i<=3;i++) {
	response_string += "<tr>\n";
	for (var j=1;j<=10;j++) {	
		response_string += "<td>" + j + "</td>\n";
	}
	response_string += "</tr>\n";
}
response_string += "</table>\n";


//透過http模組啟動web server服務
const http = require('http');
const server = http.createServer(function (req, res) {
	//設定回應為text文件，並回應 Hello World!
	
	const { method, url } = req;
	const { headers } = req;

	if (true) {
		res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
		res.write(response_string);
		res.end();
		return;
	}

	//res.write(html_content);
	//res.write(JSON.stringify(fg_hash));

})

//設定服務監聽localhost:3001(127.0.0.1/:3002)
server.listen('3002', function () {  
  console.log('server start on 3002 port');
})

process.on('uncaughtException', function (err) {
    var log_msg = 'err uncaughtException' + err;
	console.log(dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss") + " " + log_msg);
}); 



