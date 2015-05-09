"use strict";

J.Error = (function() {

  var e = function (error, reason, details) {
    var self = this;

    self.name = "Jayuana.Error";

    if (!Match.test(error, String)) {
      error = "unknown Error";
    }
    if (!Match.test(reason, String)) {
      reason = " ";
    }
    if (!Match.test(details, String)) {
      details = (new Error()).stack;
    }

    self.error = error;
    self.reason = reason;
    self.details = details;

    if (self.reason) {
      self.message = self.reason + ' [' + self.error + ']';
    }
    else {
      self.message = '[' + self.error + ']';
    }
  };

  e.prototype = Object.create(Error.prototype);
  e.prototype.name = "Jayuana.Error";

  return e;

})();
















  /*


  (function (shortMsg, reason, details){ // jshint ignore:line
   var error;

   if (!Match.test(shortMsg, String)){
      shortMsg = "unknown Error";
   }
   if (!Match.test(reason, String)){
      reason = " ";
   }
   if (!Match.test(details, String)){
      error = new Error();
      details = error.stack;
   }

   return Meteor.Error(shortMsg, reason, details);
})();*/