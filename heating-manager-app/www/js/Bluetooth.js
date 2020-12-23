class Bluetooth {
	constructor() {
		this.devices = [];
	}
	
	hasCoarseLocationPermission() {
		return new Promise(function(success, failure) {
			Permission.has(['android.permission.ACCESS_COARSE_LOCATION' ], function(result) {
				success(result['android.permission.ACCESS_COARSE_LOCATION']);
			}, failure);
		});
	}
	
	requestCoarseLocationPermission() {
		return new Promise(function(success, failure) {
			Permission.request(['android.permission.ACCESS_COARSE_LOCATION' ], function(result) {
				success(result['android.permission.ACCESS_COARSE_LOCATION']);
			}, failure);
		});
	}
	
	
	initialize() {
		return new Promise(function(success, failure) {
			bluetoothle.initialize(success, { request: true, statusReceiver: false });
		});
	}
	
	startScan() {
		let devices = this.devices;
		return new Promise(function(success, failure) {
			bluetoothle.startScan(function(status) {
				if(status == 'scanResult') {
					devices[status.address] = status;
				}
				else if(status == 'scanStarted') {
					success(devices);
				}
			}, failure; console.error(error); }, {});
		});
	}
	
	stopScan() {
		return new Promise(function(success, failure) {
			bluetoothle.stopScan(success, failure);
		});
	}

	connect(device) {
		return new Promise(function(success, failure) {
			bluetoothle.connect(success, failure, { address: device.address });
		});
	}
	
	discover(device) {
		return new Promise(function(success, failure) {
			bluetoothle.discover(
		});
	}
	
}
