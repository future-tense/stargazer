#!/bin/sh
cp -R dist/* ionic/www/
cd ionic
ionic run android
