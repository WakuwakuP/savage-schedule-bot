#!/bin/sh

#DB作成、DBユーザ作成
mongo admin --host mongo:27017 < /mongo_seed/create_db.js

#ドキュメント作成、データインポート(CSV)
ls -l /mongo_seed/import_data | grep .csv | while read LINE 
do 
  FILE=`echo ${LINE} | awk '{print $9}'`
  COLLECTION=`echo ${FILE} | sed 's/\.[^\.]*$//'`
  mongoimport --host mongo:27017 --db foxcopeDB --collection ${COLLECTION} --type csv --file /mongo_seed/import_data/${FILE} --headerline --columnsHaveTypes
done

#ドキュメント作成、データインポート(JSON)
ls -l /mongo_seed/import_data | grep .json | while read LINE 
do 
  FILE=`echo ${LINE} | awk '{print $9}'`
  COLLECTION=`echo ${FILE} | sed 's/\.[^\.]*$//'`
  mongoimport --host mongo:27017 --db foxcopeDB --collection ${COLLECTION} --file /mongo_seed/import_data/${FILE} --jsonArray
done
