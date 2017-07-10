<?php

SESSION_START();
if (!$_SESSION["login"] == 1){
    echo 'session is dead: '.$_SESSION["login"];
    exit; 
}else{



if (isset($_FILES['upload_file'])) {

    if(move_uploaded_file($_FILES['upload_file']['tmp_name'], "../images/" . $_REQUEST['extraParam'] . "/" . $_FILES['upload_file']['name'])){

        $fn = "../images/" . $_REQUEST['extraParam'] . "/" . $_FILES['upload_file']['name'];

        $size = getimagesize($fn);

        $ratio = $size[0]/$size[1]; // width/height

        if( $ratio > 1) {

            $width = 560;
            $height = 560/$ratio;

        } else {

            $width = 560*$ratio;
            $height = 560;

        }

        $target_filename = "../images/mobile/" . $_REQUEST['extraParam'] . "/" . $_FILES['upload_file']['name'];

        $src = imagecreatefromstring(file_get_contents($fn));

        $dst = imagecreatetruecolor($width,$height);

        imagecopyresampled($dst,$src,0,0,0,0,$width,$height,$size[0],$size[1]);

        imagedestroy($src);

        imagejpeg($dst,$target_filename); // adjust format as needed

        imagedestroy($dst);

        echo 'small saved';

    } else {

        echo $_FILES['upload_file']['name']. " KO";

    }

    exit;

} else {

    echo "No files uploaded ...";

}

    echo 'session is: ok';
}

?>
