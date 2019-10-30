/*
	Copyright (c) 2012, Jeffrey Pfau
	All rights reserved.

	Adapted code for React context by @mateuscoelho2009
*/

export default function loadRom(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.responseType = 'arraybuffer';

	xhr.onload = function() { callback(xhr.response) };
	xhr.send();
}
