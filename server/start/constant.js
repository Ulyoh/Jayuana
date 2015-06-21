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
 * @type {{idInDb: string, localName: string, activeElt: J}}
 */
RefInfo = {
  idInDb: "sth",
  localName: "sth",
  activeElt: "Jayuana obj"
};

/**
 * Used as param to look for either by id or name
 * @type {{id: string, name: string}}
 */
ObjInfo = {
  idInDb: "sth",
  nameInDb: "sth"
};



