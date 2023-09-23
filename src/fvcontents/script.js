// Some type definitions.
/**
 * @typedef {object} FileObject
 * @property {string} name
 * @property {'file'|'folder'} type
 * @property {string} path
 * @property {string} webPath
 * @property {string} [extension]
 * @property {FileObject[]} [files]
 */
/**
 * @typedef {object} FilesObject
 * @property {FileObject[]} files
 */

// Re-declaring variables for autocomplete.
/** @type {FilesObject} */
const files = JSON.parse(filesJSON);

/** @type {{}} */
const config = JSON.parse(configJSON);

// Functions

// Listen for the window to finish loading.
// Once it's done, we will display the first directory.
