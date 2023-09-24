<?php

// FileView.php (v1)
// An easy to setup PHP script that allows you to display file directories for download and preview.
// https://github.com/Lovely-Experiences/FileView.php
// Docs: https://github.com/Lovely-Experiences/FileView.php/docs/v1.md

declare(strict_types=1);
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
clearstatcache();

// ---- Configuration ---- //

// The path to your config file.
// This file does not need to be served to the web.
$configFilePath = "./fvconfig.json";

// The URL of your contents folder.
// This folder can be hosted remotely.
$contentsFilePath = "./fvcontents/"; // You do not need to include the trailing slash.

// --------- END --------- //

// Load configuration.
$config = json_decode(file_get_contents($configFilePath));

// Create other needed variables.
$files = new stdClass;
$files->files = array();

// Modify variables, mostly paths.
$contentsFilePath = rtrim($contentsFilePath, "/");
$config->rootDirectory = rtrim($config->rootDirectory, "/");
$config->rootURL = rtrim($config->rootURL, "/");
$config->_loaded = new stdClass;
$config->_loaded->contentsFilePath = $contentsFilePath;

// Change current directory to the root directory.
if ($config->phpDirectory !== null) {
    chdir($config->phpDirectory);
}

// Verify that root is a directory and that it exists.
if (!file_exists($config->rootDirectory) or !is_dir($config->rootDirectory)) {
    throw new Exception("Root is not a directory.");
}

// Recursive function that loads the files.
function loadFile(string $filePath, stdClass $object, $webPath): void
{
    global $config;
    $newObject = new stdClass;
    if (is_dir($filePath)) {
        if (in_array(basename($filePath), $config->ignoredFolders))
            return;
        $newObject->name = basename($filePath);
        $newObject->type = "folder";
        $newObject->path = $filePath;
        $newObject->webPath = $webPath;
        $newObject->files = array();
        foreach (scandir($filePath) as $file) {
            if ($file === "." or $file === "..")
                continue;
            loadFile($filePath . "/" . $file, $newObject, $webPath . "/" . $file);
        }
        array_push($object->files, $newObject);
    } else {
        if (in_array(basename($filePath), $config->ignoredFiles) or in_array(pathinfo($filePath, PATHINFO_EXTENSION), $config->ignoredFileExtensions))
            return;
        $newObject->name = basename($filePath);
        $newObject->type = "file";
        $newObject->path = $filePath;
        $newObject->webPath = $webPath;
        $newObject->extension = pathinfo($filePath, PATHINFO_EXTENSION);
        $newObject->size = filesize($filePath);
        array_push($object->files, $newObject);
    }
}

// Load the file.
loadFile($config->rootDirectory, $files, $config->rootURL);

// Check if the URL is requesting JSON and return it if so.
if ($config->apiEnabled === true) {
    if (isset($_GET["json"])) {
        header("Content-Type: application/json");
        echo json_encode($files);
        exit();
    }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        <?php echo $config->pageTitle; ?>
    </title>
    <link rel="stylesheet" href="<?php echo $contentsFilePath; ?>/style.css">
    <link rel="stylesheet" href="<?php echo $contentsFilePath; ?>/github-markdown.css">
</head>

<body>
    <div id="pageDetails">
        <h1>
            <?php echo $config->pageTitle; ?>
        </h1>
        <p>
            <?php echo $config->pageDescription; ?>
        </p>
    </div>
    <div id="fileExplorer" hidden=true>
        <div class="fileExplorerTopRow">
            <p class="currentDirectory">&nbsp;&nbsp;/Loading...</p>
        </div>
        <div class="fileExplorerRow">
            <img class="fileIcon" src="" alt="File Icon">
            <p class="fileName">Loading...</p>
        </div>
        <div class="fileExplorerRow fileExplorerFinalRow">
            <img class="fileIcon" src="" alt="File Icon">
            <p class="fileName">Loading...</p>
        </div>
    </div>
    <div id="extraPanel" hidden=true></div>
    <script>
        // Set some variables used by 'script.js'.
        const filesJSON = `<?php echo json_encode($files); ?>`;
        const configJSON = `<?php echo json_encode($config); ?>`;
    </script>
    <script src="<?php echo $contentsFilePath; ?>/script.js"></script>
</body>

</html>