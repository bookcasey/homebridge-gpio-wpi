var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-lockitron", "Lockitron", LockitronAccessory);
}

function LockitronAccessory(log, config) {
  this.log = log;
  this.name = config["name"];

  this.service = new Service.LockMechanism(this.name);

  this.service
    .getCharacteristic(Characteristic.LockCurrentState)
    .on('get', this.getState.bind(this));

  this.service
    .getCharacteristic(Characteristic.LockTargetState)
    .on('get', this.getState.bind(this))
    .on('set', this.setState.bind(this));
}

LockitronAccessory.prototype.getState = function(callback) {
      var state = true;
      this.log("Lock state is %s", state);
      callback(null, state);
}


LockitronAccessory.prototype.setState = function (state, callback) {
  console.log('unsecured', Characteristic.LockCurrentState.UNSECURED);
  console.log('secured', Characteristic.LockCurrentState.SECURED);

    clearTimeout(this.timeoutId);

  // Use your API to actually change the lock in the real world.
    var self = this;


    callback();

    if (state === Characteristic.LockCurrentState.UNSECURED) {

      clearTimeout(self.timeoutId);
      self.timeoutId = setTimeout(function () {
        console.log('unsecured timout', Characteristic.LockCurrentState.UNSECURED);
        console.log('secured timout', Characteristic.LockCurrentState.SECURED);
        self
          .service
          .getCharacteristic(Characteristic.LockCurrentState)
          .setValue(Characteristic.LockCurrentState.SECURED);

          console.log('unsecured postchange', Characteristic.LockCurrentState.UNSECURED);
          console.log('secured postchange', Characteristic.LockCurrentState.SECURED);
      }, 30000);
    }
}

LockitronAccessory.prototype.getServices = function() {
  return [this.service];
}
