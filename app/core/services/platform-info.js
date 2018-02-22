/* global console */

let ua = navigator ? navigator.userAgent : null;

if (!ua) {
	console.log('Could not determine navigator. Using fixed string');
	ua = 'dummy user-agent';
}

// Fixes IOS WebKit UA
ua = ua.replace(/\(\d+\)$/, '');

// Detect mobile devices
export default {
	isAndroid: !!ua.match(/Android/i),
	isIOS: /iPad|iPhone|iPod/.test(ua) && !window.MSStream,
	isWP: !!ua.match(/IEMobile/i),
	isSafari: Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
	ua: ua,
	isCordova: !!window.cordova,
	isElectron: !!ua.match(/Electron/i)
};
