var Service, Characteristic;

var storage = require('node-persist');

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
  storage.init({dir:'persist'}).then(function() {
    return storage.getItem('state')
  }).then(function(state) {
    if(state) {
      console.log(1);
      callback(null, 1);
    } else {
      console.log(0);
      callback(null, 0);
    }
  });
}



LockitronAccessory.prototype.setState = function (state, callback) {
  storage.init({dir:'persist'}).then(function() {
    return storage.setItem('state', !state.value);
  }).then(function(response) {
    var state = response[0].value
    console.log('trying to change it to:', state);

    var currentState = (state == Characteristic.LockTargetState.SECURED) ?
          Characteristic.LockCurrentState.SECURED : Characteristic.LockCurrentState.UNSECURED;

    this.service.setCharacteristic(Characteristic.LockCurrentState, currentState);

    callback(null);
  });

}

LockitronAccessory.prototype.getServices = function() {
  return [this.service];
}
