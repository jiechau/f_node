tools for taifex option

# # root:

# install mercurial 
apt-get install mercurial

# install nodejs 11.x and npm
apt-get install curl  
curl -sL https://deb.nodesource.com/setup_11.x | bash -  
apt-get install -y nodejs  
ln -s /usr/bin/node /usr/local/bin/node  
/usr/local/bin/node -v # should be v11. up  

# set the correct time zone
dpkg-reconfigure tzdata  

# cron need to be restarted
service cron stop  
service cron start  

# #user:

# clone source
cd ~  
hg clone https://jiechau@bitbucket.org/jiechau/f_node  

# install packets, mpn >5
cd ~/f_node  
npm install  

# create and edit fconfig_local
vi fconfig_local  
var filedir = '/home/jie/f_data'; // 存放交易資料的地方  
var nodedir = '/home/jie/f_node'; // 存放 程式 的地方, fweb_template_stem 的 爸爸  
var addrlocalhost = '128.199.201.92'; // http server ip address (in this case my do1)  

# add cron
0 16 * * * /home/jie/f_node/fe.sh >> /home/jie/f_data/quote_daily0_log/fe_`/bin/date "+\%Y_\%m_\%d"`.log 2>&1  
5 16 * * * /home/jie/f_node/f_web.sh  

