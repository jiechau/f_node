#!/bin/bash

# option, all
#/usr/local/bin/node fstrategy_result.js option $y $ratio
for y in {2018..2002}
do
	for ratio in {70..10}
	do
		#echo $ratio
		/usr/local/bin/node fstrategy_result $y $ratio

	done
done
