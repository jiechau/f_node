#!/bin/bash

# ./fe.sh 2018 12

#	echo $# #shoud be 2
#	echo $0 # ./fe.sh
#	echo $1 # 2018
#	echo $2 # 12
#	
#	echo
#	date '+%Y %m'
#	date '+%H %M %S'

YYYY=`date '+%Y'`
MM=`date '+%m'`
DD=`date '+%d'`
#	echo $YYYY/$MM

# 0 16 * * * /home/jie/f_node/fe.sh >> /home/jie/f_data/quote_daily0_log/fe_`/bin/date "+\%Y_\%m_\%d"`.log 2>&1

# 2018-12-11 16:32:14 cron:start
echo "`date '+%Y-%m-%d %H:%M:%S'` cron:start"

cd /home/jie/f_node

/usr/local/bin/node /home/jie/f_node/ff_taifex.js future TX $YYYY $MM r
/usr/local/bin/node /home/jie/f_node/ff_taifex.js future all $YYYY $MM r
/usr/local/bin/node /home/jie/f_node/ff_taifex.js option TXO $YYYY $MM r
/usr/local/bin/node /home/jie/f_node/ff_taifex.js option all $YYYY $MM r
/usr/local/bin/node /home/jie/f_node/ff_twse.js index MI $YYYY $MM r
/usr/local/bin/node /home/jie/f_node/ff_polaris.js index MI $YYYY $MM r
/usr/local/bin/node /home/jie/f_node/ff_polaris.js index TX1 $YYYY $MM r

/usr/local/bin/node /home/jie/f_node/fg_taifex.js future TX $YYYY $MM r
#/usr/local/bin/node /home/jie/f_node/fg_taifex.js future all $YYYY $MM r
/usr/local/bin/node /home/jie/f_node/fg_taifex.js option TXO $YYYY $MM r
#/usr/local/bin/node /home/jie/f_node/fg_taifex.js option all $YYYY $MM r
/usr/local/bin/node /home/jie/f_node/fg_twse.js index MI $YYYY $MM r
/usr/local/bin/node /home/jie/f_node/fg_polaris.js index MI $YYYY $MM r
/usr/local/bin/node /home/jie/f_node/fg_polaris.js index TX1 $YYYY $MM r
# use taifex future to generate TX1
/usr/local/bin/node /home/jie/f_node/fg_taifex_TX1.js index TX1 $YYYY $MM $DD r



