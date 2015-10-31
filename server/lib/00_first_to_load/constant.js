/**
 * Created by yoh on 4/27/15.
 */

__ = lodash;

C = {  // jshint ignore:line
  DEFAULT_FOLDER: ".packagesFiles",
  VERBOSE: false
};

/**
 * @typedef {Object}  newJ
 * @type {Object}
 * @property {String} newJDbName
 * @property {Function | JSON} newJObj
 * @property {Boolean} newJStart
 * @property {Array.<newJRef>} newJInitRefInput
 * @property {Array.<newJRef>} newJInitRefOutput
 */

/**
 * @typedef {Object} newJRef
 * @property {Boolean} DbIdOrDbName
 * @property {String} value
 *
 */



/**
 * Define the 3 references types
 * @readonly
 * @enum {string}
 */
RefType = {
  TO: "to",
  FROM: "from",
  BOTH: "both"
};

/**
 *
 * @type {{rRefName: String, activeElt: J, _rActiveId, _rRefId: Number,
  _rActiveId: String}}
 */
Ref = {
  rRefName: "String",
  rActiveElt: "Jayuana obj",
  _rRefId: "Number",
  _rActiveId: "String"
};

/**
 *
 * @type {{rRefName: String, activeElt: J}}
 */
NewRef = {
  newRefName: "String",
  newActiveElt: "Jayuana obj"
};

/**
 * Used as param to look for either by dbId or dbName
 * @type {{dbId: String, dbName: String}}
 */
ObjInfo = {
  dbId: "String",
  dbName: "String"
};




