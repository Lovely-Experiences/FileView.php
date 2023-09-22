<?php

// FileView.php (v1)
// An easy to setup PHP script that allows you to display file directories for download and preview.
// https://github.com/Lovely-Experiences/FileView.php
// Docs: https://github.com/Lovely-Experiences/FileView.php/docs/v1.md

declare(strict_types=1);

// ---- Configuration ---- //

// The path to your config file.
// This file does not need to be served to the web.
$configFilePath = "./fvconfig.json";

// The URL of your contents folder.
// This folder can be hosted remotely.
// REMOTE URL: https://raw.githubusercontent.com/Lovely-Experiences/FileView.php/main/src/fvcontents/
$contentsFilePath = "./fvcontents/"; // You do not need to include the trailing slash.

// --------- END --------- //

// Load configuration.
$config = json_decode(file_get_contents($configFilePath));

// Create other needed variables.
$files = new stdClass;

// Modify variables.
$contentsFilePath = rtrim($contentsFilePath, "/");

// Set globals.
global $contentsFilePath;
global $config;
global $files;


?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        <?php echo $config->pageTitle; ?>
    </title>
    <link rel="stylesheet" href="<?php echo $contentsFilePath; ?>/main.css">
</head>

<body>

</body>

</html>