			class BLEWrapper {
				constructor() {
					this.devices = [];
				}
				
				addDevice(device) {
					let found = false;
					for(let i = 0; i < this.devices.length; i++) {
						let d = this.devices[i];
						if(d.address == device.address) {
							found = true;
							break;
						}
					}
					if(!found) {
						this.devices.push(device);
						return device;
					}
					return null;
				}
				
				initialize(params) {
					params = params || {
						request: true,
						statusReceiver: true,
						restoreKey: (new Date()).getTime().toString()
					};
				
					return new Promise(function(resolve, reject) {
						top.bluetoothle.initialize(resolve, { request: true, statusReceiver: true });
					});
					
				}
			
				startScan(params, newdevicefn) {
					newdevicefn = newdevicefn || function(device) {};
					let me = this;
					this.devices = [];
					var devices = this.devices;
					return new Promise(function(resolve, reject) {
						top.bluetoothle.startScan(function(result) {
							if(result.status == "scanStarted") {
								resolve(result);
							}
							else if(result.status == "scanResult") {
								let device = me.addDevice(result);
								if(device) {
									newdevicefn(device);
								}
							}
						}, function(error) {
							reject(error);
						}, params);
					});
				}
				
				stopScan() {
					return new Promise(function(resolve, reject) {
						top.bluetoothle.stopScan(resolve, reject);
					});
				}
				
				bond(device) {
					return new Promise(function(resolve, reject) {
						top.bluetoothle.bond(resolve, reject, device);
					});
				}
				
				connect(device) {
					return new Promise(function(resolve, reject) {
						top.bluetoothle.connect(resolve, reject, device);
					});
				}
				
				disconnect(device) {
					return new Promise(function(resolve, reject) {
						top.bluetoothle.disconnect(resolve, reject, device);
					});
				}
				
				close(device) {
					return new Promise(function(resolve, reject) {
						top.bluetoothle.close(resolve, reject, device);
					});
				}
				
				discover(device) {
					return new Promise(function(resolve, reject) {
						top.bluetoothle.discover(resolve, reject, device);
					});
				}
				
				read(device, service, characteristic) {
					return new Promise(function(resolve, reject) {
						top.bluetoothle.read(resolve, reject, {
							address: device.address,
							service: service.uuid,
							characteristic: characteristic.uuid
						});
					});
				}
				
			}
			
			let BLE = new BLEWrapper();
			