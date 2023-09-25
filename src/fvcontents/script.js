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

const requestCache = {};

// Functions
/**
 * Get a file object from its path.
 * @param {string} path
 * @returns {FileObject|null}
 */
function getFileFromPath(path) {
    /** @param {FileObject} file */
    function checkDir(file) {
        let found = null;
        if (file.webPath === path) found = file;
        file.files.forEach(function (value) {
            if (value.webPath === path) {
                found = value;
            }
            if (found === null && value.type === 'folder') {
                found = checkDir(value);
            }
        });
        return found;
    }
    return checkDir(files.files[0]);
}

/**
 * Display files. (Create row elements, etc.)
 * @param {FileObject} file
 */
function displayFiles(file) {
    const fileExplorer = document.getElementById('fileExplorer');
    fileExplorer.innerHTML = '';

    const extraPanel = document.getElementById('extraPanel');
    extraPanel.innerHTML = '';
    extraPanel.hidden = true;

    const topRow = document.createElement('div');
    topRow.classList.add('fileExplorerTopRow');
    fileExplorer.insertAdjacentElement('beforeend', topRow);

    const currentDirectory = document.createElement('p');
    currentDirectory.classList.add('currentDirectory');

    /** @type {HTMLSpanElement[]} */
    const pathElements = [];

    const pathStrings = file.webPath.split('/');

    pathStrings.forEach(function (value, index) {
        let currentPath = files.files[0].webPath;

        if (pathElements[index - 1] !== undefined)
            currentPath = `${currentPath}${pathElements[index - 1].getAttribute('path')}/`;

        currentPath = `${currentPath}${value}`;

        const element = document.createElement('span');
        element.innerText = value;

        if (value === '') element.innerText = '*';

        element.classList.add('fileName');
        element.setAttribute('path', currentPath);

        pathElements.push(element);

        element.onclick = function () {
            displayFiles(getFileFromPath(currentPath));
        };
    });

    pathElements.forEach(function (value) {
        currentDirectory.insertAdjacentElement('beforeend', value);
        currentDirectory.insertAdjacentHTML('beforeend', "<span class='transparent-text'> / </span>");
    });

    // currentDirectory.insertAdjacentHTML('afterbegin', '&nbsp;&nbsp;');
    topRow.insertAdjacentElement('beforeend', currentDirectory);

    /**
     * @param {HTMLImageElement} element
     */
    function errorImage(element) {
        element.src = `${contentsPath}/icons/files/unknown.svg`;
    }

    const organized = {
        files: [],
        folders: [],
    };

    file.files.forEach(function (file, index) {
        const row = document.createElement('div');
        row.classList.add('fileExplorerRow');

        const fileIcon = document.createElement('img');
        fileIcon.classList.add('fileIcon');
        fileIcon.onerror = function () {
            errorImage(fileIcon);
        };

        const paragraph = document.createElement('p');
        paragraph.classList.add('fileName');
        paragraph.innerText = file.name;

        row.insertAdjacentElement('beforeend', fileIcon);
        row.insertAdjacentElement('beforeend', paragraph);

        if (file.type === 'folder') {
            fileIcon.src = `${contentsPath}/icons/files/folder.svg`;
            organized.folders.push(row);

            if (file.files.length === 0) {
                paragraph.insertAdjacentHTML('beforeend', " <span class='transparent-text'><i>(Empty)</i></span>");
                paragraph.classList.add('fileNameNoClick');
            } else {
                paragraph.onclick = function () {
                    displayFiles(file);
                };
            }
        } else if (file.type === 'file') {
            if (file.extension === '') {
                file.extension = file.name;
            }

            fileIcon.src = `${contentsPath}/icons/files/${file.extension}.svg`;
            organized.files.push(row);

            paragraph.onclick = function () {
                //window.location = file.webPath;
                window.open(file.webPath, '_blank');
            };

            if (config.displayREADME === true) {
                if (
                    file.name === 'README' ||
                    file.name === 'README.txt' ||
                    file.name === 'README.md' ||
                    file.name === 'README.markdown' ||
                    file.name === 'README.html'
                ) {
                    const article = document.createElement('article');
                    article.classList.add('markdown-body');
                    extraPanel.insertAdjacentElement('afterbegin', article);

                    if (requestCache[`github-markdown-:${file.webPath}`] === undefined) {
                        fetch(file.webPath)
                            .then(async function (response) {
                                const fileContents = await response.text();

                                if (file.extension === 'md' || file.extension === 'markdown') {
                                    const response = await fetch('https://api.github.com/markdown', {
                                        method: 'POST',
                                        body: JSON.stringify({ text: fileContents }),
                                    });

                                    const responseText = await response.text();

                                    article.innerHTML = responseText;
                                    extraPanel.hidden = false;

                                    if (response.status === 403) {
                                        extraPanel.innerHTML = `Exceeded GitHub markdown API ratelimit.<br><br>Markdown Source:<br><code>${fileContents}</code>`;
                                    } else {
                                        requestCache[`github-markdown-:${file.webPath}`] = responseText;
                                    }
                                } else {
                                    extraPanel.innerHTML = fileContents;
                                    extraPanel.hidden = false;
                                }
                            })
                            .catch();
                    } else {
                        article.innerHTML = requestCache[`github-markdown-:${file.webPath}`];
                        extraPanel.hidden = false;
                    }
                }
            }
        }
    });

    organized.files.sort((a, b) => a.innerText - b.innerText);
    organized.folders.sort((a, b) => a.innerText - b.innerText);

    const rows = organized.folders.concat(organized.files);
    rows.forEach(function (value, index) {
        fileExplorer.insertAdjacentElement('beforeend', value);
        if (rows[index + 1] === undefined) {
            value.classList.add('fileExplorerFinalRow');
        }
    });

    fileExplorer.hidden = false;
}

// Listen for the window to finish loading.
// Once it's done, we will display the first directory.
window.addEventListener('load', function () {
    displayFiles(files.files[0]);
});
