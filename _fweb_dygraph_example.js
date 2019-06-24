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
	graphdata1['rescale'] = [true,true,1,true,true]; // 1是選定的標準, 其他 true 要 rescale (date 的沒有作用)
	//graphdata1['data'] = hash_content['rescaled'];
	graphdata1['data'] = hash_content['orig'];
	
	graphdata2['title'] = 'Four series on the same scale';
	graphdata2['labels'] = ["date","parabola f","line f","another line","sine wave"];
	graphdata2['data'] = hash_content['orig'];
	graphdata2['rescale'] = [true,false,false,false,false];
	
	textdiv1 = "aaa"; // 不可以有換行
	textdiv2 = "bbb"; // 不可以有換行
}

執行
$ /usr/local/bin/node  _fweb_dygraph_example.js
http://192.168.123.166:3001


*/
var fs = require('fs');
eval(fs.readFileSync('./fconfig.js')+''); // the '' is necessary to let './fconfig.js' as a string

// 測試資料
//hash_content = {}
//hash_content['orig']
//hash_content['rescaled']



// the test data
// 測試資料
hash_content = {};
hash_content['orig'] =
{ '2006/10/02':
   { 'parabola f': '300',
     'line f': '800',
     'another line': '242000',
     'sine wave': '1619400.2583266746' },
  '2006/10/03':
   { 'parabola f': '580',
     'line f': '1600',
     'another line': '234000',
     'sine wave': '1955803.091743794' },
  '2006/10/04':
   { 'parabola f': '840',
     'line f': '2400',
     'another line': '226000',
     'sine wave': '2229158.6370343543' },
  '2006/10/05':
   { 'parabola f': '1080',
//     'line f': '3200',
     'line f': '',
     'another line': '218000',
     'sine wave': '2415048.8574590324' },
  '2006/10/06':
   { 'parabola f': '1300',
     'line f': '4000',
//     'another line': '210000',
     'another line': '-210000',
     'sine wave': '2496868.7332550683' },
  '2006/10/07':
   { 'parabola f': '1500',
     'line f': '4800',
     'another line': '202000',
     'sine wave': '2467309.538597744' },
  '2006/10/08':
   { 'parabola f': '1680',
     'line f': '5600',
     'another line': '194000',
     'sine wave': '2329011.708311092' },
  '2006/10/09':
   { 'parabola f': '1840',
     'line f': '6400',
     'another line': '186000',
     'sine wave': '2094328.9756889385' },
  '2006/10/10':
   { 'parabola f': '1980',
     'line f': '7200',
     'another line': '178000',
     'sine wave': '1784224.8502922878' },
  '2006/10/11':
   { 'parabola f': '2100',
     'line f': '8000',
     'another line': '170000',
     'sine wave': '1426400.0100748339' },
  '2006/10/12':
   { 'parabola f': '2200',
     'line f': '8800',
     'another line': '162000',
     'sine wave': '1052817.8823209398' },
  '2006/10/13':
   { 'parabola f': '12280',
//   { 'parabola f': '2280',
     'line f': '9600',
     'another line': '154000',
     'sine wave': '696849.4458814348' },
  '2006/10/14':
   { 'parabola f': '2340',
     'line f': '10400',
     'another line': '146000',
     'sine wave': '390292.30102003284' },
  '2006/10/15':
   { 'parabola f': '2380',
     'line f': '11200',
     'another line': '138000',
     'sine wave': '160530.28448301475' },
  '2006/10/16':
   { 'parabola f': '2400',
     'line f': '12000',
     'another line': '130000',
     'sine wave': '28087.352918628738' },
  '2006/10/17':
   { 'parabola f': '2400',
     'line f': '12800',
     'another line': '122000',
     'sine wave': '4794.238955199148' },
  '2006/10/18':
   { 'parabola f': '2380',
     'line f': '13600',
     'another line': '114000',
     'sine wave': '92731.64709033437' },
  '2006/10/19':
   { 'parabola f': '2340',
     'line f': '14400',
     'another line': '106000',
     'sine wave': '284044.3905550154' },
  '2006/10/20':
   { 'parabola f': '2280',
     'line f': '15200',
     'another line': '98000',
     'sine wave': '561643.0717529531' },
  '2006/10/21':
   { 'parabola f': '2200',
     'line f': '16000',
     'another line': '90000',
     'sine wave': '900730.6272513426' },
  '2006/10/22':
   { 'parabola f': '2100',
     'line f': '16800',
     'another line': '82000',
     'sine wave': '1271017.3756054372' },
  '2006/10/23':
   { 'parabola f': '1980',
     'line f': '17600',
     'another line': '74000',
     'sine wave': '1639426.704391722' },
  '2006/10/24':
   { 'parabola f': '1840',
     'line f': '18400',
     'another line': '66000',
     'sine wave': '1973049.7054852492' },
  '2006/10/25':
   { 'parabola f': '1680',
     'line f': '19200',
     'another line': '58000',
     'sine wave': '2242084.829811441' },
  '2006/10/26':
   { 'parabola f': '1500',
     'line f': '20000',
     'another line': '50000',
     'sine wave': '2422499.970968424' },
  '2006/10/27':
   { 'parabola f': '1300',
     'line f': '20800',
     'another line': '42000',
     'sine wave': '2498179.1817182563' },
  '2006/10/28':
   { 'parabola f': '1080',
     'line f': '21600',
     'another line': '34000',
     'sine wave': '2462362.263556358' },
  '2006/10/29':
   { 'parabola f': '840',
     'line f': '22400',
     'another line': '26000',
     'sine wave': '2318248.635110351' },
  '2006/10/30':
   { 'parabola f': '580',
     'line f': '23200',
     'another line': '18000',
     'sine wave': '2078711.5376027294' },
  '2006/10/31':
   { 'parabola f': '300',
     'line f': '24000',
     'another line': '10000',
     'sine wave': '1765148.1065521957' } };

// 以下資料沒有用到
hash_content['rescaled'] =
{ '2006/10/02':
   { 'parabola f': '300',
     'line f': '-80',
     'another line': '2420',
     'sine wave': '1619.4002583266745' },
  '2006/10/03':
   { 'parabola f': '580',
     'line f': '-160',
     'another line': '2340',
     'sine wave': '1955.803091743794' },
  '2006/10/04':
   { 'parabola f': '840',
     'line f': '',
     'another line': '2260',
     'sine wave': '2229.1586370343543' },
  '2006/10/05':
   { 'parabola f': '1080',
     'line f': '320',
     'another line': '2180',
     'sine wave': '2415.0488574590327' },
  '2006/10/06':
   { 'parabola f': '1300',
     'line f': '400',
     'another line': '2100',
     'sine wave': '2496.8687332550685' },
  '2006/10/07':
   { 'parabola f': '1500',
     'line f': '2000',
     'another line': '2020',
     'sine wave': '2467.309538597744' },
  '2006/10/08':
   { 'parabola f': '1680',
     'line f': '560',
     'another line': '1940',
     'sine wave': '2329.011708311092' },
  '2006/10/09':
   { 'parabola f': '1840',
     'line f': '640',
     'another line': '1860',
     'sine wave': '2094.3289756889385' },
  '2006/10/10':
   { 'parabola f': '1980',
     'line f': '720',
     'another line': '1780',
     'sine wave': '1784.2248502922878' },
  '2006/10/11':
   { 'parabola f': '2100',
     'line f': '800',
     'another line': '1700',
     'sine wave': '1426.400010074834' },
  '2006/10/12':
   { 'parabola f': '2200',
     'line f': '880',
     'another line': '1620',
     'sine wave': '1052.8178823209398' },
  '2006/10/13':
   { 'parabola f': '2280',
     'line f': '960',
     'another line': '1540',
     'sine wave': '696.8494458814348' },
  '2006/10/14':
   { 'parabola f': '2340',
     'line f': '1040',
     'another line': '1460',
     'sine wave': '390.2923010200328' },
  '2006/10/15':
   { 'parabola f': '2380',
     'line f': '1120',
     'another line': '1380',
     'sine wave': '160.53028448301475' },
  '2006/10/16':
   { 'parabola f': '2400',
     'line f': '1200',
     'another line': '1300',
     'sine wave': '28.08735291862874' },
  '2006/10/17':
   { 'parabola f': '2400',
     'line f': '1280',
     'another line': '1220',
     'sine wave': '4.794238955199148' },
  '2006/10/18':
   { 'parabola f': '2380',
     'line f': '1360',
     'another line': '1140',
     'sine wave': '92.73164709033438' },
  '2006/10/19':
   { 'parabola f': '2340',
     'line f': '1440',
     'another line': '1060',
     'sine wave': '284.0443905550154' },
  '2006/10/20':
   { 'parabola f': '2280',
     'line f': '1520',
     'another line': '980',
     'sine wave': '561.6430717529531' },
  '2006/10/21':
   { 'parabola f': '2200',
     'line f': '1600',
     'another line': '900',
     'sine wave': '900.7306272513426' },
  '2006/10/22':
   { 'parabola f': '2100',
     'line f': '1680',
     'another line': '820',
     'sine wave': '1271.017375605437' },
  '2006/10/23':
   { 'parabola f': '1980',
     'line f': '1760',
     'another line': '740',
     'sine wave': '1639.426704391722' },
  '2006/10/24':
   { 'parabola f': '1840',
     'line f': '1840',
     'another line': '660',
     'sine wave': '1973.0497054852492' },
  '2006/10/25':
   { 'parabola f': '1680',
     'line f': '1920',
     'another line': '580',
     'sine wave': '2242.0848298114406' },
  '2006/10/26':
   { 'parabola f': '1500',
     'line f': '2000',
     'another line': '500',
     'sine wave': '2422.499970968424' },
  '2006/10/27':
   { 'parabola f': '1300',
     'line f': '2080',
     'another line': '420',
     'sine wave': '2498.179181718256' },
  '2006/10/28':
   { 'parabola f': '1080',
     'line f': '2160',
     'another line': '340',
     'sine wave': '2462.362263556358' },
  '2006/10/29':
   { 'parabola f': '840',
     'line f': '2240',
     'another line': '260',
     'sine wave': '2318.2486351103507' },
  '2006/10/30':
   { 'parabola f': '580',
     'line f': '2320',
     'another line': '180',
     'sine wave': '2078.7115376027295' },
  '2006/10/31':
   { 'parabola f': '300',
     'line f': '2400',
     'another line': '100',
     'sine wave': '1765.1481065521957' } };

var csv_content = {};
csv_content['orig'] = "";
csv_content["orig"] += "2006/10/02,300,800,242000,1619400.2583266746\n";
csv_content["orig"] += "2006/10/03,580,1600,234000,1955803.091743794\n";
csv_content["orig"] += "2006/10/04,840,2400,226000,2229158.6370343543\n";
csv_content["orig"] += "2006/10/05,1080,3200,218000,2415048.8574590324\n";
csv_content["orig"] += "2006/10/06,1300,4000,210000,2496868.7332550683\n";
csv_content["orig"] += "2006/10/07,1500,4800,202000,2467309.538597744\n";
csv_content["orig"] += "2006/10/08,1680,5600,194000,2329011.708311092\n";
csv_content["orig"] += "2006/10/09,1840,6400,186000,2094328.9756889385\n";
csv_content["orig"] += "2006/10/10,1980,7200,178000,1784224.8502922878\n";
csv_content["orig"] += "2006/10/11,2100,8000,170000,1426400.0100748339\n";
csv_content["orig"] += "2006/10/12,2200,8800,162000,1052817.8823209398\n";
csv_content["orig"] += "2006/10/13,2280,9600,154000,696849.4458814348\n";
csv_content["orig"] += "2006/10/14,2340,10400,146000,390292.30102003284\n";
csv_content["orig"] += "2006/10/15,2380,11200,138000,160530.28448301475\n";
csv_content["orig"] += "2006/10/16,2400,12000,130000,28087.352918628738\n";
csv_content["orig"] += "2006/10/17,2400,12800,122000,4794.238955199148\n";
csv_content["orig"] += "2006/10/18,2380,13600,114000,92731.64709033437\n";
csv_content["orig"] += "2006/10/19,2340,14400,106000,284044.3905550154\n";
csv_content["orig"] += "2006/10/20,2280,15200,98000,561643.0717529531\n";
csv_content["orig"] += "2006/10/21,2200,16000,90000,900730.6272513426\n";
csv_content["orig"] += "2006/10/22,2100,16800,82000,1271017.3756054372\n";
csv_content["orig"] += "2006/10/23,1980,17600,74000,1639426.704391722\n";
csv_content["orig"] += "2006/10/24,1840,18400,66000,1973049.7054852492\n";
csv_content["orig"] += "2006/10/25,1680,19200,58000,2242084.829811441\n";
csv_content["orig"] += "2006/10/26,1500,20000,50000,2422499.970968424\n";
csv_content["orig"] += "2006/10/27,1300,20800,42000,2498179.1817182563\n";
csv_content["orig"] += "2006/10/28,1080,21600,34000,2462362.263556358\n";
csv_content["orig"] += "2006/10/29,840,22400,26000,2318248.635110351\n";
csv_content["orig"] += "2006/10/30,580,23200,18000,2078711.5376027294\n";
csv_content["orig"] += "2006/10/31,300,24000,10000,1765148.1065521957\n";

csv_content['rescaled'] = "";
csv_content["rescaled"] += "2006/10/02,300,-80,2420,1619.4002583266745\n";
csv_content["rescaled"] += "2006/10/03,580,-160,2340,1955.803091743794\n";
csv_content["rescaled"] += "2006/10/04,840,240,2260,2229.1586370343543\n";
csv_content["rescaled"] += "2006/10/05,1080,320,2180,2415.0488574590327\n";
csv_content["rescaled"] += "2006/10/06,1300,400,2100,2496.8687332550685\n";
csv_content["rescaled"] += "2006/10/07,1500,2000,2020,2467.309538597744\n";
csv_content["rescaled"] += "2006/10/08,1680,560,1940,2329.011708311092\n";
csv_content["rescaled"] += "2006/10/09,1840,640,1860,2094.3289756889385\n";
csv_content["rescaled"] += "2006/10/10,1980,720,1780,1784.2248502922878\n";
csv_content["rescaled"] += "2006/10/11,2100,800,1700,1426.400010074834\n";
csv_content["rescaled"] += "2006/10/12,2200,880,1620,1052.8178823209398\n";
csv_content["rescaled"] += "2006/10/13,2280,960,1540,696.8494458814348\n";
csv_content["rescaled"] += "2006/10/14,2340,1040,1460,390.2923010200328\n";
csv_content["rescaled"] += "2006/10/15,2380,1120,1380,160.53028448301475\n";
csv_content["rescaled"] += "2006/10/16,2400,1200,1300,28.08735291862874\n";
csv_content["rescaled"] += "2006/10/17,2400,1280,1220,4.794238955199148\n";
csv_content["rescaled"] += "2006/10/18,2380,1360,1140,92.73164709033438\n";
csv_content["rescaled"] += "2006/10/19,2340,1440,1060,284.0443905550154\n";
csv_content["rescaled"] += "2006/10/20,2280,1520,980,561.6430717529531\n";
csv_content["rescaled"] += "2006/10/21,2200,1600,900,900.7306272513426\n";
csv_content["rescaled"] += "2006/10/22,2100,1680,820,1271.017375605437\n";
csv_content["rescaled"] += "2006/10/23,1980,1760,740,1639.426704391722\n";
csv_content["rescaled"] += "2006/10/24,1840,1840,660,1973.0497054852492\n";
csv_content["rescaled"] += "2006/10/25,1680,1920,580,2242.0848298114406\n";
csv_content["rescaled"] += "2006/10/26,1500,2000,500,2422.499970968424\n";
csv_content["rescaled"] += "2006/10/27,1300,2080,420,2498.179181718256\n";
csv_content["rescaled"] += "2006/10/28,1080,2160,340,2462.362263556358\n";
csv_content["rescaled"] += "2006/10/29,840,2240,260,2318.2486351103507\n";
csv_content["rescaled"] += "2006/10/30,580,2320,180,2078.7115376027295\n";
csv_content["rescaled"] += "2006/10/31,300,2400,100,1765.1481065521957\n";

// 放到 graphdata1, graphdata2
// 第一個欄位是 date, 最好是 graphdata1, graphdata2 的聯集, 需要自己先設定好
var graphdata1 = {};
var graphdata2 = {};
var textdiv1 = ""; // 不可以有換行
var textdiv2 = ""; // 不可以有換行
// 主要 內容, 寫在 prepareContent()
function prepareContent (url) {
	
	
	graphdata1['title'] = 'Four series on different scales';
	graphdata1['labels'] = ["date","parabola f","line f","another line","VOLz"];
	graphdata1['rescale'] = [true,1,true,true,true];
	//graphdata1['data'] = hash_content['rescaled'];
	graphdata1['data'] = hash_content['orig'];
	var iiKeysAr = Object.keys(graphdata1['data']);
	for (var ii=0; ii<iiKeysAr.length; ii++){
		if (graphdata1['data'][iiKeysAr[ii]]["sine wave"] != undefined) {
			graphdata1['data'][iiKeysAr[ii]]["VOLz"] = graphdata1['data'][iiKeysAr[ii]]["sine wave"];
		}
	}

	
	graphdata2['title'] = 'Four series on the same scale';
	graphdata2['labels'] = ["date","parabola f","line f","another line","sine wave"];
	graphdata2['data'] = hash_content['orig'];
	graphdata2['rescale'] = [true,false,false,false,false];
	
	textdiv1 = "aaa"; // 不可以有換行
	textdiv2 = "bbb"; // 不可以有換行
}

// 文件最後要有這個
eval(fs.readFileSync('./fweb_dygraph_standard.js')+''); // the '' is necessary to let './fconfig.js' as a string




