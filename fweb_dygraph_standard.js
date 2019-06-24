/*

範例程式, 如果是 _fweb_dygraph_example.js

_fweb_dygraph_example.js 最上面, 要有
var fs = require('fs');
eval(fs.readFileSync('./fconfig.js')+''); // the '' is necessary to let './fconfig.js' as a string

_fweb_dygraph_example.js  需要在最下面最下面 加一行
eval(fs.readFileSync('./fweb_dygraph_standard.js')+''); // the '' is necessary to let './fconfig.js' as a string


_fweb_dygraph_example.js  的內容:

x 時間軸去除沒有開盤的日子
y 軸, 用第一個數列的極大極小值, 將其他數列 rescaled

本身程式 _fweb_dygraph_example.js 準備好這些就行了
var graphdata1 = {};
var graphdata2 = {};
var textdiv1 = ""; // 不可以有換行
var textdiv2 = ""; // 不可以有換行
// 主要 內容, 寫在 prepareContent()
function prepareContent (url) {
	graphdata1['title'] = 'Four series on different scales';
	graphdata1['labels'] = ["date","parabola f","line f","another line","sine wave"];
	graphdata1['rescale'] = [true,true,true,true,true];
	//graphdata1['data'] = hash_content['rescaled'];
	graphdata1['data'] = hash_content['orig'];
	
	graphdata2['title'] = 'Four series on the same scale';
	graphdata2['labels'] = ["date","parabola f","line f","another line","sine wave"];
	graphdata2['data'] = hash_content['orig'];
	graphdata2['rescale'] = [true,true,false,false,false];
	
	textdiv1 = "aaa"; // 不可以有換行
	textdiv2 = "bbb"; // 不可以有換行
}

執行
$ /usr/local/bin/node  _fweb_dygraph_example.js
http://192.168.123.166:3001


*/

// cal tool

// 回傳數列中的極大極小值
function getMaxMinValue (date_data_hash, list_key) {
	// [val_min, val_max] = getMaxMinValue(graphdata1['data'], graphdata1['labels'][1]);
//console.log(list_key);
//console.log(date_data_hash);
	var minVal, maxVal;
	var dates_ar = getSortedDateAr(date_data_hash);
	for (var i_date=0; i_date<dates_ar.length; ++i_date) {
		if ((minVal == undefined) 
			&& (date_data_hash[dates_ar[i_date]][list_key] != undefined) 
			&& (date_data_hash[dates_ar[i_date]][list_key] != "")
			&& (date_data_hash[dates_ar[i_date]][list_key] != "-")
			) {
			minVal = parseFloat(date_data_hash[dates_ar[i_date]][list_key]);
			maxVal = parseFloat(date_data_hash[dates_ar[i_date]][list_key]);
		}
		if (minVal != undefined) {
			if (parseFloat(date_data_hash[dates_ar[i_date]][list_key]) < minVal) {
				minVal = parseFloat(date_data_hash[dates_ar[i_date]][list_key]);
			}
		}
		if (maxVal != undefined) {
			if (parseFloat(date_data_hash[dates_ar[i_date]][list_key]) > maxVal) {
				maxVal = parseFloat(date_data_hash[dates_ar[i_date]][list_key]);
			}
		}
	}
	
	var MinMaxAr = [minVal, maxVal];
	return MinMaxAr;
}

// 正向 回傳 rescale 後值
function getRescaledValue (vthis, minthis, maxthis, valmin, valmax) {
	//value_rescale = getRescaledValue(value_this, min_this, max_this, val_min, val_max);
	if ((vthis == undefined) || (vthis == "")) {
		return "";
	}
	
	// (maxthis - minthis) == 0
	// 還沒考慮
	
	// (Y - y1)/(y2 - y1)*(x2 - x1) + x1
	var vrescaled;
	vrescaled = (((vthis - minthis) / (maxthis - minthis)) * (valmax - valmin)) + valmin;
	return vrescaled;
}

// 逆向 回傳 vthis 值
function getOrigValue (vrescaled, minthis, maxthis, valmin, valmax) {
	//value_this = getOrigValue(value_rescale, min_this, max_this, val_min, val_max);
	if ((value_rescale == undefined) || (value_rescale == "")) {
		return "";
	}
	
	// (valmax - valmin) == 0
	// 還沒考慮
	
	// (X - x1)/(x2 - x1)*(y2 - y1) + y1
	var vorig;
	vorig = (((vrescaled - valmin) / (valmax - valmin)) * (maxthis - minthis)) + minthis;
	return vorig;
}

// about the dygraph

function response_xyfunction() {
	
	var xyfunction_string = "";
	
	// var title1, title2
	xyfunction_string += "var title1 = '" + graphdata1['title'] + "';\n";
	xyfunction_string += "var title2 = '" + graphdata2['title'] + "';\n";
	
	/*
	// functions return labels1 and labels2 (目前沒有用)
	xyfunction_string += "function labels1() {" + "\n";
	xyfunction_string += "return [";
	for (var j_fields=0; j_fields<(graphdata1['labels'].length) ; j_fields++) {
		xyfunction_string += "'" + graphdata1['labels'][j_fields] + "'";
		if (j_fields < (graphdata1['labels'].length -1)) {
			xyfunction_string += ",";					
		} else {
			xyfunction_string += "];\n}\n";
		}
	}
	xyfunction_string += "function labels2() {" + "\n";
	xyfunction_string += "return [";
	for (var j_fields=0; j_fields<(graphdata2['labels'].length) ; j_fields++) {
		xyfunction_string += "'" + graphdata2['labels'][j_fields] + "'";
		if (j_fields < (graphdata2['labels'].length -1)) {
			xyfunction_string += ",";					
		} else {
			xyfunction_string += "];\n}\n";
		}
	}
	*/
	
	// var labels1, labels2 (目前是用這個)
	xyfunction_string += "var labels1 = [";
	for (var j_fields=0; j_fields<(graphdata1['labels'].length) ; j_fields++) {
		xyfunction_string += "'" + graphdata1['labels'][j_fields] + "'";
		if (j_fields < (graphdata1['labels'].length -1)) {
			xyfunction_string += ",";					
		} else {
			xyfunction_string += "];\n";
		}
	}
	xyfunction_string += "var labels2 = [";
	for (var j_fields=0; j_fields<(graphdata2['labels'].length) ; j_fields++) {
		xyfunction_string += "'" + graphdata2['labels'][j_fields] + "'";
		if (j_fields < (graphdata2['labels'].length -1)) {
			xyfunction_string += ",";					
		} else {
			xyfunction_string += "];\n";
		}
	}
	// yscales1, yscales2,
	// 取 graphdata1['rescale'][i_label] === 1 數列的極值 當標準 [val_min, val_max]
	// 取每一個數列的極值
	var labelMinMax = {};
	for (var i_label=1; i_label<graphdata1['labels'].length; i_label++) {
		if (graphdata1['rescale'][i_label] === 1) {
			[val_min, val_max] = getMaxMinValue(graphdata1['data'], graphdata1['labels'][i_label]);
		}
		labelMinMax[graphdata1['labels'][i_label]] = getMaxMinValue(graphdata1['data'], graphdata1['labels'][i_label]);
	}
	xyfunction_string += "function yscales1(val, label) {" + "\n";
	xyfunction_string += "switch (label) {" + "\n";
	for (var i_label=1; i_label<graphdata1['labels'].length; i_label++) {
		xyfunction_string += "case '" + graphdata1['labels'][i_label] + "':\n";
		// var calString = (((val - valmin) / (valmax - valmin)) * (maxthis - minthis)) + minthis;
	    var calString = "(((val - " + val_min + ") / (" + val_max + " - " + val_min + ")) * (" + labelMinMax[graphdata1['labels'][i_label]][1] + " - " + labelMinMax[graphdata1['labels'][i_label]][0] + ")) + " + labelMinMax[graphdata1['labels'][i_label]][0];
		if (graphdata1['rescale'][i_label] === true) {
			xyfunction_string += "return " + calString + ";" + "\n";
		} else {
			xyfunction_string += "return val;" + "\n";
		}
		xyfunction_string += "break;" + "\n";
	}
	xyfunction_string += "default:" + "\n";
	xyfunction_string += "return '';" + "\n";
	xyfunction_string += "}" + "\n"; // end of switch (label) {	   
	xyfunction_string += "}" + "\n";
	// 取 graphdata2['rescale'][i_label] === 1 數列的極值 當標準 [val_min, val_max]
	// 取每一個數列的極值
	var labelMinMax = {};
	for (var i_label=1; i_label<graphdata2['labels'].length; i_label++) {
		if (graphdata2['rescale'][i_label] === 1) {
			[val_min, val_max] = getMaxMinValue(graphdata2['data'], graphdata2['labels'][i_label]);
		}
		labelMinMax[graphdata2['labels'][i_label]] = getMaxMinValue(graphdata2['data'], graphdata2['labels'][i_label]);
	}
	xyfunction_string += "function yscales2(val, label) {" + "\n";
	xyfunction_string += "switch (label) {" + "\n";
	for (var i_label=1; i_label<graphdata2['labels'].length; i_label++) {
		xyfunction_string += "case '" + graphdata2['labels'][i_label] + "':\n";
		// var calString = (((val - valmin) / (valmax - valmin)) * (maxthis - minthis)) + minthis;
	    var calString = "(((val - " + val_min + ") / (" + val_max + " - " + val_min + ")) * (" + labelMinMax[graphdata2['labels'][i_label]][1] + " - " + labelMinMax[graphdata2['labels'][i_label]][0] + ")) + " + labelMinMax[graphdata2['labels'][i_label]][0];
		if (graphdata2['rescale'][i_label] === true) {
			xyfunction_string += "return " + calString + ";" + "\n";
		} else {
			xyfunction_string += "return val;" + "\n";
		}
		xyfunction_string += "break;" + "\n";
	}
	xyfunction_string += "default:" + "\n";
	xyfunction_string += "return '';" + "\n";
	xyfunction_string += "}" + "\n"; // end of switch (label) {	   
	xyfunction_string += "}" + "\n";
		
	// xfunction1, xfunction2, 
	xyfunction_string += "function xfunction1(x) {" + "\n";
	xyfunction_string += "switch (x) {" + "\n";
	var dates_ar = getSortedDateAr(graphdata1['data']);
	for (var i_date=0; i_date<dates_ar.length; ++i_date) {
		xyfunction_string += "case " + i_date + ":\n";
		xyfunction_string += "return '" + dates_ar[i_date] + "';" + "\n";
		xyfunction_string += "break;" + "\n";
	}
	xyfunction_string += "default:" + "\n";
	xyfunction_string += "return '';" + "\n";
	xyfunction_string += "}" + "\n";		   
	xyfunction_string += "}" + "\n";	

	xyfunction_string += "function xfunction2(x) {" + "\n";
	xyfunction_string += "switch (x) {" + "\n";
	var dates_ar = getSortedDateAr(graphdata2['data']);
	for (var i_date=0; i_date<dates_ar.length; ++i_date) {
		xyfunction_string += "case " + i_date + ":\n";
		xyfunction_string += "return '" + dates_ar[i_date] + "';" + "\n";
		xyfunction_string += "break;" + "\n";
	}
	xyfunction_string += "default:" + "\n";
	xyfunction_string += "return '';" + "\n";
	xyfunction_string += "}" + "\n";		   
	xyfunction_string += "}" + "\n";	

	// return
	return xyfunction_string;
}

// hash_content['rescaled']
function response_cvs_data1() {
		var csv_data_string1 = "";
		var dates_ar = getSortedDateAr(graphdata1['data']);
		
		// 取 graphdata1['rescale'][i_label] === 1 數列的極值 當標準 [val_min, val_max]
		// 取每一個數列的極值
		var labelMinMax = {};
		for (var i_label=1; i_label<graphdata1['labels'].length; i_label++) {
			if (graphdata1['rescale'][i_label] === 1) {
				[val_min, val_max] = getMaxMinValue(graphdata1['data'], graphdata1['labels'][i_label]);
			}
			labelMinMax[graphdata1['labels'][i_label]] = getMaxMinValue(graphdata1['data'], graphdata1['labels'][i_label]);
		}
//console.log(val_min + " " + val_max);
//console.log(labelMinMax);
		
		for (var i_date=0; i_date<dates_ar.length; ++i_date) {
			
			csv_data_string1 += i_date + ",";			
			//csv_data_string1 += [dates_ar[i_date]] + ",";
			
			for (var j_fields=1; j_fields<(graphdata1['labels'].length) ; j_fields++) {
				value_this = graphdata1['data'][dates_ar[i_date]][graphdata1['labels'][j_fields]];
				min_this = labelMinMax[graphdata1['labels'][j_fields]][0];
				max_this = labelMinMax[graphdata1['labels'][j_fields]][1];
				value_rescale = getRescaledValue(value_this, min_this, max_this, val_min, val_max);
				if (graphdata1['rescale'][j_fields] === true) {
					csv_data_string1 += value_rescale;
				} else {
					csv_data_string1 += value_this;
				}
				if (j_fields < (graphdata1['labels'].length -1)) {
					csv_data_string1 += ",";					
				} else {
					csv_data_string1 += "\n";
				}
			}
		}
		return csv_data_string1;
}

// hash_content['orig']
function response_cvs_data2() {
		var csv_data_string2 = "";
		var dates_ar = getSortedDateAr(graphdata2['data']);
		
		// 取 graphdata2['rescale'][i_label] === 1 數列的極值 當標準 [val_min, val_max]
		// 取每一個數列的極值
		var labelMinMax = {};
		for (var i_label=1; i_label<graphdata2['labels'].length; i_label++) {
			if (graphdata2['rescale'][i_label] === 1) {
				[val_min, val_max] = getMaxMinValue(graphdata2['data'], graphdata2['labels'][i_label]);
			}
			labelMinMax[graphdata2['labels'][i_label]] = getMaxMinValue(graphdata2['data'], graphdata2['labels'][i_label]);
		}
		//console.log(val_min + " " + val_max);
		//console.log(labelMinMax);
		
		for (var i_date=0; i_date<dates_ar.length; ++i_date) {
			
			csv_data_string2 += i_date + ",";			
			//csv_data_string2 += [dates_ar[i_date]] + ",";
			
			for (var j_fields=1; j_fields<(graphdata2['labels'].length) ; j_fields++) {
				value_this = graphdata2['data'][dates_ar[i_date]][graphdata2['labels'][j_fields]];
				min_this = labelMinMax[graphdata2['labels'][j_fields]][0];
				max_this = labelMinMax[graphdata2['labels'][j_fields]][1];
				value_rescale = getRescaledValue(value_this, min_this, max_this, val_min, val_max);
				if (graphdata2['rescale'][j_fields] === true) {
					csv_data_string2 += value_rescale;
				} else {
					csv_data_string2 += value_this;
				}
				if (j_fields < (graphdata2['labels'].length -1)) {
					csv_data_string2 += ",";					
				} else {
					csv_data_string2 += "\n";
				}
			}
		}
		return csv_data_string2;
}

// textdiv1 text
function f_textdiv() {
	var textdiv_content = "";
	textdiv_content += "document.getElementById(\"textdiv1\").innerHTML = \"";
	textdiv_content += textdiv1;
	textdiv_content += "\";\n";
	textdiv_content += "document.getElementById(\"textdiv2\").innerHTML = \"";
	textdiv_content += textdiv2;
	textdiv_content += "\";\n";
	return textdiv_content;
}

// 主要
function response_html (url) {
	prepareContent(url);
	return	fs.readFileSync(nodedir + '/' + fweb_template_stem + '/fweb_dygraph_standard.html');
}

//透過http模組啟動web server服務
const http = require('http');
const server = http.createServer(function (req, res) {
	//設定回應為text文件，並回應 Hello World!
	
	const { method, url } = req;
	const { headers } = req;

	if (url == '/dygraph.js') {
		res.writeHead(200,{'Content-Type':'application/javascript'});
		res.write(fs.readFileSync(nodedir + '/' + fweb_template_stem + '/dygraph.js'));
		res.end();
		return;	
	} else if (url == '/dygraph.css') {
		res.writeHead(200,{'Content-Type':'text/css'});
		res.write(fs.readFileSync(nodedir + '/' + fweb_template_stem + '/dygraph.css'));
		res.end();
		return;	
	} else if (url == '/dygraph.js.map') {
		res.writeHead(200,{'Content-Type':'application/json'});
		res.write(fs.readFileSync(nodedir + '/' + fweb_template_stem + '/dygraph.js.map'));
		res.end();
		return;	
	} else if (url == '/synchronizer.js') {
		res.writeHead(200,{'Content-Type':'application/javascript'});
		res.write(fs.readFileSync(nodedir + '/' + fweb_template_stem + '/synchronizer.js'));
		res.end();
		return;	
		
	} else if (url == '/xyfunction.js') {
		res.writeHead(200,{'Content-Type':'application/javascript'});
		res.write(response_xyfunction());
		res.end();
		return;	
		
	} else if (url == '/dygraph_data1.csv') { 
		res.writeHead(200,{'Content-Type':'text/plain'});
		res.write(response_cvs_data1());
		res.end();
		return;
	} else if (url == '/dygraph_data2.csv') { 
		res.writeHead(200,{'Content-Type':'text/plain'});
		res.write(response_cvs_data2());
		res.end();
		return;

	} else if (url == '/textdiv.js') {
		res.writeHead(200,{'Content-Type':'application/javascript'});
		res.write(f_textdiv());
		res.end();
		return;	
/*
	} else if (url.startsWith("/index?")) {
		//  "/index?o=option_TXO_am_201812_put_10000.0000"
		var match_ar = url.match(/\/index\?o=(.+)$/);
		if (match_ar != undefined) {
			// here change option contract
			option_data_function(match_ar[1].split("_"));
			//console.log(match_ar[1].split("_"));
		} else {
			console.log("no match_ar_o: " + url);
		}
		res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
		res.write(fs.readFileSync(nodedir + '/' + fweb_template_stem + '/fweb_dygraph_standard.html'));
		res.end();
		return;
*/
	} else {
		// this is the default page
		res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
		res.write(response_html(url));
		res.end();
		return;
	}

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

