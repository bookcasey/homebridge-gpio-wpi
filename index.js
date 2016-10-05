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
    callback(null, 0);
}



LockitronAccessory.prototype.setState = function (state, callback) {
  var currentState = (state == Characteristic.LockTargetState.SECURED) ?
        Characteristic.LockCurrentState.SECURED : Characteristic.LockCurrentState.UNSECURED;
  var notCurrentState = (!state == Characteristic.LockTargetState.SECURED) ?
              Characteristic.LockCurrentState.SECURED : Characteristic.LockCurrentState.UNSECURED;

  this.service
        .setCharacteristic(Characteristic.LockCurrentState, currentState);

    callback(null);
}

LockitronAccessory.prototype.getServices = function() {
  return [this.service];
}
