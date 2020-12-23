(function() {
	function base64ToHex(str) {
		const raw = atob(str);
		let result = '';
		for (let i = 0; i < raw.length; i++) {
			const hex = raw.charCodeAt(i).toString(16);
			result += (hex.length === 2 ? hex : '0' + hex);
		}
		return result.toUpperCase();
	}
	
	function updateText(value) {
		let el = document.getElementById("sensordata");
		el.innerHTML = value;
	}


	let setupPromise = BLE.initialize().then(function() {
		return new Promise(function(accept, reject) {
			updateText("Scanning...");
			
			let to = setTimeout(function() {
				BLE.stopScan();
				reject();
			}, 60000);
			
			BLE.startScan({}, function(device) {
				if(device.name == "Jinou_Sensor_HumiTemp") {
					updateText("Sensor found.");
					clearTimeout(to);
					BLE.stopScan().then(function () {
						accept(device);
					});
				}
			});
		});
	}).then(function(device) {
		updateText("Connecting...");
		return BLE.connect(device).then(Promise.resolve(device));
	}).then(function(device) {
		updateText("Discovering services...");
		return BLE.discover(device).then(Promise.resolve(device));
	});
	
	setupPromise.then(function(device) {
		updateText("Reading data...");
		setInterval(function() {
			BLE.read(device, { uuid: "AA20" }, { uuid: "AA21" }).then(function(result) {
				let raw = atob(result.value);
				let tempInt = raw.charCodeAt(1).toString(10);
				let tempDec = raw.charCodeAt(2).toString(10);
				let humInt = raw.charCodeAt(4).toString(10);
				let humDec = raw.charCodeAt(5).toString(10);
				
				let temp = parseFloat(tempInt + "." + tempDec);
				let humidity = parseFloat(humInt + "." + humDec);
					
				return {
					temperature: temp,
					humidity: humidity
				};
			}).then(function(data) {
				updateText("Temperature:<br/>&nbsp;&nbsp;" + data.temperature.toFixed(1) + "°C<br/>Humidity:<br/>&nbsp;&nbsp;" + data.humidity.toFixed(1) + "%<br/><br/>" + (new Date()).toLocaleString());
			});
		}, 5000);
	});
	
})();