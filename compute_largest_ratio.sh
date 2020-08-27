#!/bin/bash
# Script will run benchmark several times and compute largest ratio among particular test

bench_results_file=bench_results

rm "${bench_results_file}" 2>/dev/null
seq 1 30 | while read i; do node bench | tee -a ${bench_results_file} 2>/dev/null 1>&2; done
test_names=$(cat ${bench_results_file} | awk '{print $1}' | sort | uniq | egrep -v '^$|Fastest')

# echo "${test_names}"

echo "${test_names}" | while read i; do
  min=$(grep "${i}" ${bench_results_file} | grep -v "Fastest is ${i}" | sort -n | head -1 | awk '{print $3}' | sed 's/,//g')
  max=$(grep "${i}" ${bench_results_file} | grep -v "Fastest is ${i}" | sort -n | tail -1 | awk '{print $3}' | sed 's/,//g')
  ratio=$(echo "scale=2; (${max}/${min})" | bc)
  # echo "i : ${i}, min: ${min}, max: ${max}, ratio : ${ratio}"
  echo "${i} : ${ratio}"
done