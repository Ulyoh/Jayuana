"use strict";

J.Error = (function() {

  var e = function (error, reason, details) {
    var self = this, tmpStack, endFirstLine;

    self.objType = "J.Error";

    tmpStack = (new Error()).stack;
    endFirstLine = tmpStack.indexOf("\n", 8) + 1;
    self.stack = "Error: \n" + tmpStack.slice(endFirstLine);

    if (!Match.test(error, String)) {
      error = "unknown Error";
    }
    if (!Match.test(reason, String)) {
      reason = " ";
    }
    if (!Match.test(details, String)) {
      details = "";
    }

    self.error = error;
    self.reason = reason;
    self.details = details;

    self.message = self.reason + ' [' + self.error + ']';
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