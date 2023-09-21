<?php

// FileView.php
// An easy to setup PHP script that allows you to display file directories for download and preview.
// https://github.com/Lovely-Experiences/FileView.php

// The path to your config file.
$configFilePath = "./fvconfig.yaml";

// The path to your contents folder.
$contentsFilePath = "./fvcontents/";

?>

<?php

// Load configuration.
$config = yaml_parse_file($configFilePath);
global $config;

echo $config->rootURL;

?>