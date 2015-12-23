/**
 * Created by yoh on 4/27/15.
 */

__ = lodash;

C = {  // jshint ignore:line
  DEFAULT_FOLDER: ".packagesFiles",
  VERBOSE: false
};

/**
 * used to add a new element in the db
 * @typedef {Object} elementDefinition
 * @property {Object} obj
 * @property {JDataType} type
 * @property {string} dbName
 * @property {boolean} jStart
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
 * @property {JDataType} type
 * @property {string} objToEval
 * @property {boolean} jStart
 * @property {Array.<JRefForDb>} [JInitRefFrom]
 * @property {Array.<JRefForDb>} [JInitRefTo]
 */

/**
 * new Jayuana Reference to use in newJ
 *
 * @typedef {Object} JRefForDb
 *
 * @property {string} [newRefName]
 * @property {string} [dbId]
 * @property {string} [dbName]
 * @property {string} [activeName]
 *
 * dbId, dbName or activeName is necessary
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



