class Application {
	constructor() {
	}
	
	setDocument(doc) {
		this.doc = doc;
	}
	
	setListenTarget(target) {
		this.listenTarget = target;
		let listeners = {};
		this.listeners = listeners;
		
		target.addEventListener("message", function(event) {
			let data = event.data;
			let source = event.source;
			let eventlisteners = listeners[data.eventname];
			if(!(eventlisteners instanceof Array)) {
				return;
			}
			for(let i = 0; i < eventlisteners.length; i++) {
				eventlisteners[i](data.payload, source);
			}
		});
	}
	
	setFireTarget(target) {
		this.fireTarget = target;
	}
	
	onDeviceReady() {
	}

	onPause() {
		this.fire('pause', {});
	}
	
	onResume(evt) {
		this.fire('resume', evt);
	}

	fire(message, data) {
		var cd = {};
		for(var key in data) {
			if(data.hasOwnProperty(key)) {
				cd[key] = data[key];
			}
		}
		
		this.fireTarget.postMessage({eventname: message, payload: cd}, "*");
	}

	listen(message, callback) {
		let eventlisteners = this.listeners[message];
		if(!(eventlisteners instanceof Array)) {
			eventlisteners = [];
			this.listeners[message] = eventlisteners;
		}
		eventlisteners.push(callback);
	}
}

let App = null;

App = new Application();
App.setListenTarget(window);
if(window.top == window) {	// I'm in the top-level window.
	const FRAME_NAME = "appframe";
	let frame = document.getElementById(FRAME_NAME);
	App.listen("app-handshake-response", function(data, source) {
		App.setFireTarget(source);
		App.fire("deviceready");
	});

	document.addEventListener("deviceready", function() {
		frame.onload = function() {
			frame.contentWindow.postMessage("app-handshake", "*");
		};
		frame.src = "main.html";
	}, false);
	document.addEventListener('pause', function() {
		App.fire('pause');
	}, false);
	document.addEventListener('resume', function(payload) {
		App.fire('resume', payload);
	}, false);


}
else {	// I'm in the frame that contains the actual application
	let holder = {
		handshake: function(event) {
			if(event.data == "app-handshake") {
				window.removeEventListener("message", holder.handshake);
				App.setFireTarget(event.source);
				App.fire('app-handshake-response');
			}
			
		}
	}
	window.addEventListener("message", holder.handshake, false);
}

