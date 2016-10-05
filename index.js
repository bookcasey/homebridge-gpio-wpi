var Service, Characteristic;

var storage = require('node-persist');
// storage.init({dir:'persist'})

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
    console.log('getting state called!');
    callback(null, 1);
}



LockitronAccessory.prototype.setState = function (state, callback) {
    console.log('this happens!');

    var currentState = (state == Characteristic.LockTargetState.SECURED) ?
        Characteristic.LockCurrentState.SECURED : Characteristic.LockCurrentState.UNSECURED;

      this.service
        .setCharacteristic(Characteristic.LockCurrentState, currentState);

    callback();

    if (state == Characteristic.LockCurrentState.UNSECURED) {
      console.log('trying to undo what we just did...')
      console.log(this.service.getCharacteristic(Characteristic.LockTargetState));
      this.service.getCharacteristic(Characteristic.LockTargetState).setValue(Characteristic.LockCurrentState.SECURED);
      console.log(this.service.getCharacteristic(Characteristic.LockTargetState));
      return null;
        }
}

LockitronAccessory.prototype.getServices = function() {
  return [this.service];
}
