J.prototype.error = function (shortMsg, reason, details ){ // jshint ignore:line
   var error;

   if (!Match.test(shortMsg, String)){
      shortMsg = "unknown error";
   }
   if (!Match.test(reason, String)){
      reason = " ";
   }
   if (!Match.test(details, String)){
      error = new Error();
      details = error.stack;
   }

   return new Meteor.Error(shortMsg, reason, details);
};