var Service, Characteristic;

var storage = require('node-persist');
storage.init({dir:'persist'});

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
      var state;
      storage.getItem('locked').then(function(value) {
        state = value;
      });
      this.log("Lock state is %s", state);
      callback(null, state);
}


LockitronAccessory.prototype.setState = function (state, callback) {
  storage.setItem('locked', !state)
  .then(function() {
    var currentState = (state == Characteristic.LockTargetState.SECURED) ?
        Characteristic.LockCurrentState.SECURED : Characteristic.LockCurrentState.UNSECURED;

    callback(null);
  };

}

LockitronAccessory.prototype.getServices = function() {
  return [this.service];
}
