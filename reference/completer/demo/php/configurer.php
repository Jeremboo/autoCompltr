<?php
$cfgPath = '../files/configuration.ini';
if(file_exists($cfgPath)) 
{
    $cfg = parse_ini_file ($cfgPath);
    
    echo trim($cfg["enum"]);
}
?>