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
 * @type {{TO: string, FROM: string, BOTH: string}}
 */
RefType = {
  TO: "to",
  FROM: "from",
  BOTH: "both"
};

/**
 *
 * @type {{dbId: string, refName: string, activeElt: J}}
 */
RefInfo = {
  dbId: "sth",
  refName: "sth",
  activeElt: "Jayuana obj"
};

/**
 * Used as param to look for either by dbId or dbName
 * @type {{dbId: string, dbName: string}}
 */
ObjInfo = {
  dbId: "sth",
  dbName: "sth"
};



