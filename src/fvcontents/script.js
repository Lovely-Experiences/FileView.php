// Some type definitions.
/**
 * @typedef {object} FileObject
 * @property {string} name
 * @property {'file'|'folder'} type
 * @property {string} path
 * @property {string} webPath
 * @property {string} [extension]
 * @property {number} [size]
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

const contentsPath = config._loaded.contentsFilePath;

// Functions
/**
 * Display files. (Create row elements, etc.)
 * @param {FileObject} files
 */
function displayFiles(files) {
    const fileExplorer = document.getElementById('fileExplorer');
    fileExplorer.innerHTML = '';

    const topRow = document.createElement('div');
    topRow.classList.add('fileExplorerTopRow');
    fileExplorer.insertAdjacentElement('beforeend', topRow);

    const currentDirectory = document.createElement('p');
    currentDirectory.classList.add('currentDirectory');
    currentDirectory.innerText = files.webPath;
    topRow.insertAdjacentElement('beforeend', currentDirectory);
}

// Listen for the window to finish loading.
// Once it's done, we will display the first directory.
window.addEventListener('load', function () {
    displayFiles(files.files[0]);
});
