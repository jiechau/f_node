#!/bin/bash

for y in {1990..2018}
do
	for m in {1..12}
	do
		/usr/local/bin/node fg_taifex_TX1.js index TX1 $y $m 28 r
	done
done
