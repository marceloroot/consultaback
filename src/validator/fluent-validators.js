'use strict';

let errors = {};

function ValidationContract() {
    errors = {};

}

ValidationContract.prototype.isRequired = (value,name, message) => {
    if (!value || value.length <= 0)
    errors[name] = {[name]:[message]};
}

ValidationContract.prototype.hasMinLen = (value, min,name, message,) => {
    if (!value || value.length < min)
    errors[name] = {[name]:[message]};
}

ValidationContract.prototype.hasMaxLen = (value,name, max, message) => {
    if (!value || value.length > max)
    errors[name] = {[name]:[message]};
}

ValidationContract.prototype.isFixedLen = (value,name, len, message) => {
    if (value.length != len)
    errors[name] = {[name]:[message]};
}

ValidationContract.prototype.isEmail = (value,name, message) => {
    var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
    if (!reg.test(value))
       errors[name] = {[name]:[message]};
}

ValidationContract.prototype.errors = () => { 
    return errors; 
}

ValidationContract.prototype.clear = () => {
    errors = [];
}

ValidationContract.prototype.isValid = () => {
    console.log(errors);
    if(isEmpty(errors)){
      
        return true;
    }
    
      
        return false;
    
  
}
function isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }
module.exports = ValidationContract;