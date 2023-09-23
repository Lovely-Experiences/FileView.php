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
    currentDirectory.innerHTML = `&nbsp;${files.webPath}/`.replaceAll('/', ' <span class="transparent-text">/</span> ');
    topRow.insertAdjacentElement('beforeend', currentDirectory);

    /**
     * @param {HTMLImageElement} element
     */
    function errorImage(element) {
        element.src = `${contentsPath}/icons/files/unknown.svg`;
    }

    files.files.forEach(function (file, index) {
        const row = document.createElement('div');
        row.classList.add('fileExplorerRow');

        const fileIcon = document.createElement('img');
        fileIcon.classList.add('fileIcon');
        fileIcon.onerror = function() {
            errorImage(fileIcon);
        };

        const paragraph = document.createElement('p');
        paragraph.classList.add('fileName');
        paragraph.innerText = file.name;

        if (file.type === 'folder') {
            fileIcon.src = `${contentsPath}/icons/files/folder.svg`;
        } else if (file.type === 'file') {
            if (file.extension === '') {
                file.extension = file.name;
            }
            fileIcon.src = `${contentsPath}/icons/files/${file.extension}.svg`;
        }

        if (files[index + 1] === undefined) {
            row.classList.add('fileExplorerFinalRow');
        }

        row.insertAdjacentElement('beforeend', fileIcon);
        row.insertAdjacentElement('beforeend', paragraph);
        fileExplorer.insertAdjacentElement('beforeend', row);
    });

    fileExplorer.hidden = false;
}

// Listen for the window to finish loading.
// Once it's done, we will display the first directory.
window.addEventListener('load', function () {
    displayFiles(files.files[0]);
});
