#!/bin/sh

echo 'begin deploy:'

echo '1. compress js code :'
java -jar yuicompressor-2.4.6.jar js/os.js -o js/os_o.js --charset utf-8
java -jar yuicompressor-2.4.6.jar js/lib.js -o js/lib_o.js --charset utf-8
java -jar yuicompressor-2.4.6.jar js/pc.js -o js/pc_o.js --charset utf-8
java -jar yuicompressor-2.4.6.jar css/r.css -o css/r_o.css --charset utf-8
echo '>> compress end!'


echo '2. git commit :'
git add .
git commit -m ' commit *_o to repository'
git push
echo '>> git commit end!'

echo '3. export code to delivercode:'
git clone git@github.com:wxytest111/routermenu.git
echo '>> export code succeed!'

echo '4. delete excess code:'
basepath=~/delivercode/routermenu/
delfiles=(README.md .git comp.bat deploy.sh *.html robots.txt yuicompressor-2.4.6.jar css/r.css js/jquery-1.7.2.min.js js/index_o.js js/backbone-min.js js/lib.js js/backbone.js js/index.js js/os.js js/pc.js js/underscore-min.js)
for tmp in ${delfiles[@]}
do
file=$basepath$tmp
echo $file
#if [ -f $file ]
#then
rm -fr $file
#fi
done
echo '>> delete success!'

 
echo '5. make a tar:'
tar -zcvf ~/delivercode/routermenu.tar.gz ~/delivercode/routermenu
echo '>> tar end!'

echo 'end deploy!'
