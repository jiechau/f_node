#!/bin/bash

# 5 16 * * * /home/jie/f_node/f_web.sh

cd /home/jie/f_node
ps -ef | grep fweb | grep -v grep | awk '{print $2}' | xargs kill -9
/usr/local/bin/node /home/jie/f_node/fweb_40000.js &
/usr/local/bin/node /home/jie/f_node/fweb_index_mi.js &
/usr/local/bin/node /home/jie/f_node/fweb_optionmax.js &
/usr/local/bin/node /home/jie/f_node/fweb_option1.js &
/usr/local/bin/node /home/jie/f_node/fweb_optionT.js &


