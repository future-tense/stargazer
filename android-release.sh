#!/bin/sh
cp -R dist/* ionic/www/
cd ionic
rm Stargazer.apk
ionic cordova build android --release
cp platforms/android/build/outputs/apk/android-release-unsigned.apk .
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore android-release-unsigned.apk alias_name
~/Library/Android/sdk/build-tools/24.0.2/zipalign -v 4 android-release-unsigned.apk Stargazer.apk
