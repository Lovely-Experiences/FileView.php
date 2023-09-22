<?php

declare(strict_types=1);

// FileView.php (v1)
// An easy to setup PHP script that allows you to display file directories for download and preview.
// https://github.com/Lovely-Experiences/FileView.php
// Docs: https://github.com/Lovely-Experiences/FileView.php/docs/v1.md

// ---- Configuration ---- //

// The path to your config file.
// This file does not need to be served to the web.
$configFilePath = "./fvconfig.json";

// The URL of your contents folder. 
// This folder can be hosted remotely.
// REMOTE URL: https://raw.githubusercontent.com/Lovely-Experiences/FileView.php/main/src/fvcontents/
$contentsFilePath = "fvcontents/";

// --------- END --------- //

// Load configuration.
$config = json_decode(file_get_contents($configFilePath));
global $config;
global $contentsFilePath; // Making sure this is accessible everywhere.

?>