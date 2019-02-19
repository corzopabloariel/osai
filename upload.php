<?php
session_start();
// incluyo la configuracion local y redbeans
require_once 'lib/config.php';
require_once 'lib/ext/rb.php';
$valid_extensions = array('pdf');
$path = 'uploads/';
$arc = $_FILES['frm_archivo']['name'];
$tmp = $_FILES['frm_archivo']['tmp_name'];

$ext = strtolower(pathinfo($arc, PATHINFO_EXTENSION));
$archivo = date("dmYHis") . "_" . $arc;

if(in_array($ext, $valid_extensions)) {
    $path = $path.strtolower($archivo); 
    echo $path;
    move_uploaded_file($tmp,$path);
        //GUARDO
} else echo "ERR ext";