/**
 * Created by yoh on 4/27/15.
 */

__ = lodash;

C = {  // jshint ignore:line
  DEFAULT_FOLDER: ".packagesFiles",
  VERBOSE: false
};

/**
 * Object to add a new Jayuana element to the database
 *
 * @typedef {Object} newJ
 *
 * @property {string} newJDbName
 * @property {StrOrJSON} type
 * @property {string | JSON} newJObj
 * @property {boolean} newJStart
 * @property {Array.<newJRefForDb>} [newJInitRefInput]
 * @property {Array.<newJRefForDb>} [newJInitRefOutput]
 */

/**
 * new Jayuana Reference to use in newJ
 *
 * @typedef {Object} newJRefForDb
 *
 * @property {string} [newRefName]
 * @property {DbIdOrDbName} JInDb
 */

/**
 * new Jayuana Reference to add to a References Object
 *
 * @typedef {Object} newJRefForActiveJ
 *
 * @property {string} [newRefName]
 * @property {ActiveIdOrActiveName} JIdOrName
 */

/**
 * reference created to an active Jayuana
 *
 * @typedef {Object} cleanJRef
 * @constant
 *
 * @property  {string} rRefName
 * @property  {string} _rActiveId
 * @property  {string} rActiveName
 * @property  {string} rDbId
 * @property  {string} rDbName
 * @property  {J} rActiveElt
 */

/**
 * DbId or DbName
 *
 * @typedef {Object} DbIdOrDbName
 * @readonly
 * @parameter {string} [DbId]
 * @parameter {string} [DbName]
 */

/**
 * ActiveId or ActiveName
 *
 * @typedef {Object} ActiveIdOrActiveName
 * @readonly
 * @parameter {string} [ActiveId]
 * @parameter {string} [ActiveName]
 */

//TODO : vérifier si enum defini

/**
 * Define the 3 references types
 *
 * @enum {string}
 */
RefType = {
  TO: "to",
  FROM: "from",
  BOTH: "both"
};

/**
 * string or JSON
 *
 * @enum {string}
 */

StrOrJSON = {
  str: "str",
  JSON: "JSON"
};




