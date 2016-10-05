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
  // Use your API to actually change the lock in the real world.
    this.log("door unlocked");

    var self = this;

    callback();

    if (state === Characteristic.LockCurrentState.UNSECURED) {
        self
          .service
          .getCharacteristic(Characteristic.LockCurrentState)
          .setValue(Characteristic.LockCurrentState.UNSECURED);
      }
    }
  });
}

LockitronAccessory.prototype.getServices = function() {
  return [this.service];
}
