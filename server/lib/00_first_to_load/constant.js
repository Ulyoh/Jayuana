/**
 * Created by yoh on 4/27/15.
 */

__ = lodash;

C = {  // jshint ignore:line
  DEFAULT_FOLDER: ".packagesFiles",
  VERBOSE: true
};

/**
 * Define a type of reference
 * @type {{TO: String, FROM: String, BOTH: String}}
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



