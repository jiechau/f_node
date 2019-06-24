#!/bin/bash

# option, all
#/usr/local/bin/node ff_taifex option TXO 2018 12 r
for y in {2018..1990}
do
	for m in {12..1}
	do
		/usr/local/bin/node ff_taifex option TXO $y $m r
		/usr/local/bin/node ff_taifex option all $y $m r
		/usr/local/bin/node ff_taifex future TX $y $m r
		/usr/local/bin/node ff_taifex future all $y $m r
	done
done
