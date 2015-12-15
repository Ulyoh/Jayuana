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
 * @property {StrOrJSON} type //TODO: perhaps use JDataType
 * @property {string | JSON} newJObj
 * @property {boolean} newJStart
 * @property {Array.<JRefForDb>} [newJInitRefInput]
 * @property {Array.<JRefForDb>} [newJInitRefOutput]
 */

/**
 * Object extract from Db to pass to the Jayuana constructor
 *
 * @typedef {Object} JFromDb
 *
 * @property {string} dbId
 * @property {string} dbName
 * @property {JDataType} JDataType
 * @property {boolean} jStart
 * @property {boolean} available
 * @property {Array.<JRefForDb>} [JInitRefInput]
 * @property {Array.<JRefForDb>} [JInitRefOutput]
 * @property {string} path
 */

/**
 * new Jayuana Reference to use in newJ
 *
 * @typedef {Object} JRefForDb
 *
 * @property {string} [newRefName]
 * @property {DbIdOrDbName} JInDb
 */

/**
 * new info to create a new Reference
 *
 * @typedef {Object} newJRefForActiveJ
 *
 * @property {number} [activeId]
 * @property {activeName} [activeName]
 * @property {string} [newRefName]
 *
 * activeId or activeName must be given
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

//TODO : vérifier si enum defini

/**
 * Define the 3 references types
 *
 * @readonly
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
 * @readonly
 * @enum {string}
 */

StrOrJSON = {
  str: "str",
  JSON: "JSON"
};

/**
 * Jayuana data type
 *
 * @readonly
 * @enum  {string}
 */

JDataType = {
  EJSON: "EJSON",
  code: "code",
  file: "file"
};



