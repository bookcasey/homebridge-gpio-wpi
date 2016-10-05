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

LockitronAccessory.prototype.setState = function(state, callback) {
      // var lockitronState = (state == Characteristic.LockTargetState.SECURED) ? "lock" : "unlock";
      // var currentState = (state == Characteristic.LockTargetState.SECURED) ?
      //  Characteristic.LockCurrentState.SECURED : Characteristic.LockCurrentState.UNSECURED;

      if(state == Characteristic.LockTargetState.SECURED) {
        console.log('Already unlocked for a bit');
        callback(null)
      }

      this.log("Unlocking door");
      this.service
        .setCharacteristic(Characteristic.LockCurrentState, Characteristic.LockCurrentState.UNSECURED);

      this.log("Relocking door");
      this.service
          .setCharacteristic(Characteristic.LockCurrentState, Characteristic.LockCurrentState.SECURED);

      callback(null);
}

LockitronAccessory.prototype.getServices = function() {
  return [this.service];
}
