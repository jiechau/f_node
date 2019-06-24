#!/bin/bash
# only do it for fix data under ~/f_data/quote_daily1_raw_ms950/future/TX/year

# option, all
#/usr/local/bin/node fg_taifex option TXO 2018 12 r
for y in {2018..1990}
do
	for m in {12..1}
	do
		/usr/local/bin/node fg_taifex future TX $y $m r
	done
done
