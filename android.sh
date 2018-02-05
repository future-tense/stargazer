#!/bin/sh
cp -R dist/* ionic/www/
cd ionic
ionic cordova run android
