<?php 
    $_db_host = "localhost";            # meist localhost 
    $_db_datenbank = "content_admin"; 
    $_db_username = "editor"; 
    $_db_passwort = "p5XC++99?o"; 


    SESSION_START(); 

    # Datenbankverbindung herstellen 
    $link = mysql_connect($_db_host, $_db_username, $_db_passwort); 

    # Hat die Verbindung geklappt ? 
    if (!$link) 
        { 
        die("Keine Datenbankverbindung möglich: " . mysql_error()); 
        } 

    # Verbindung zur richtigen Datenbank herstellen 
    $datenbank = mysql_select_db($_db_datenbank, $link); 

    if (!$datenbank) 
        { 
        echo "Kann die Datenbank nicht benutzen: " . mysql_error(); 
        mysql_close($link);        # Datenbank schliessen 
        exit;                    # Programm beenden ! 
        } 

    ################################################################## 


    # Ist die $_POST Variable submit nicht leer ??? 
    # dann wurden Logindaten eingegeben, die müssen wir überprüfen ! 
    if ($_POST["login"] == 'botsi') 
        { 
        # Die Werte die im Loginformular eingegeben wurden "escapen", 
        # damit keine Hackangriffe über den Login erfolgen können ! 
        # Mysql_real_escape ist auf jedenfall dem Befehle addslashes() 
        # vorzuziehen !!! Ohne sind mysql injections möglich !!!! 
        $_username = mysql_real_escape_string($_POST["username"]); 
        $_passwort = mysql_real_escape_string($_POST["passwort"]); 

        # Befehl für die MySQL Datenbank 
        $_sql = "SELECT * FROM users WHERE 
                    email='$_username' AND 
                    password='$_passwort'
                LIMIT 1"; 

        # Prüfen, ob der User in der Datenbank existiert ! 
        $_res = mysql_query($_sql, $link); 
        $_anzahl = @mysql_num_rows($_res); 

        # Die Anzahl der gefundenen Einträge überprüfen. Maximal 
        # wird 1 Eintrag rausgefiltert (LIMIT 1). Wenn 0 Einträge 
        # gefunden wurden, dann gibt es keinen Usereintrag, der 
        # gültig ist. Keinen wo der Username und das Passwort stimmt 
        # und user_geloescht auch gleich 0 ist ! 
        if ($_anzahl > 0) 
            { 
            //echo "Der Login war erfolgreich.<br>"; 

            # In der Session merken, dass der User eingeloggt ist ! 
            $_SESSION["login"] = 1; 

            # Den Eintrag vom User in der Session speichern ! 
            $_SESSION["user"] = mysql_fetch_array($_res, MYSQL_ASSOC); 

            # Das Einlogdatum in der Tabelle setzen ! 
/*
            $_sql = "UPDATE login_usernamen SET letzter_login=NOW() 
                     WHERE id=".$_SESSION["user"]["id"]; 
            mysql_query($_sql); 
*/
            } 
        else 
            { 
            //echo "Die Logindaten sind nicht korrekt.<br>"; 
            } 
        } 

    # Ist der User eingeloggt ??? 
    if ($_SESSION["login"] == 0) 
        { 
        # ist nicht eingeloggt, also Formular anzeigen, die Datenbank 
        # schliessen und das Programm beenden 
        include("login/login_formular_part.html"); 
$referer = $_SERVER['HTTP_REFERER'];

echo '<script type="text/javascript" charset="utf-8">var login = "'.$referer.'";</script></body></html>';
        mysql_close($link); 
        exit; 
        } 

    # Hier wäre der User jetzt gültig angemeldet ! Hier kann 
    # Programmcode stehen, den nur eingeloggte User sehen sollen !! 
    //echo "Hallo, Sie sind erfolgreich eingeloggt !<br>"; 

    ################################################################## 

    # Datenbank wieder schliessen 
    mysql_close($link); 
?>

<!DOCTYPE html>
<html>

	<head>

		<meta charset="utf-8" />

		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />


		<title>PALMA EDITOR</title>

		<link rel="shortcut icon" href="images/favicon.ico" />

<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400" rel="stylesheet">

		<link rel="stylesheet" href="font-awesome-4.6.3/css/font-awesome.min.css">

		<link rel="stylesheet" href="css/editor_main.css">

<!-- javascript files for the demo page; json for old webbrowser-->
<script type="text/javascript" src="../../scripts/lib/js/base64.min.js" ></script>
<!-- file that contains the functions to use drag/drop and the file api (you need HTML5) -->
<script type="text/javascript" src="scripts/lib/js/script.js" ></script>

<!-- libwebp javascript by Dominik Homberger (Dominikhlbg) -->
<script type="text/javascript" src="scripts/lib/js/libwebp-0.1.min.js"></script>



<script type="text/javascript" charset="utf-8" src="scripts/geonames_dav.js"></script>



<script type="text/javascript" charset="utf-8" src="js/editor_main.js"></script>



	</head>

	<body onload="getvals()">

<canvas id="encoderInputCanvas">
	Your Browser cannot show canvas
</canvas>

		<div id="header">Palma3 Editor<span id="actual_chapter"></span>
		</div>
		<div id="positioner">
		</div>
		<table border="0" id="all_cells">
			<tbody>
				<tr id="basis"></tr>
			</tbody>
		</table>
		<div id="editor_fields_container">
			<div class="editor_fields"><label>Name / Titel</label><input autocomplete="off" id="name_display" onkeyup="validate(this,this.nextSibling)" /><button type="button" onclick="save_existing(this)"><i class="fa fa-floppy-o" aria-hidden="true"></i> speichern</button><button type="button" onclick="revert(this)"><i class="fa fa-undo" aria-hidden="true"></i> nein, lieber nicht</button></div>
			<div class="editor_fields"><label>Untertitel</label><input autocomplete="off" id="prolog_display" onkeyup="validate(this,this.nextSibling)" /><button type="button" onclick="save_existing(this)"><i class="fa fa-floppy-o" aria-hidden="true"></i> speichern</button><button type="button" onclick="revert(this)"><i class="fa fa-undo" aria-hidden="true"></i> nein, lieber nicht</button></div>
			<div class="editor_fields"><label>Stichworte</label>
				<div id="search_display"></div><button type="button" onclick="save_existing(this)"><i class="fa fa-floppy-o" aria-hidden="true"></i> speichern</button><button type="button" onclick="revert(this)"><i class="fa fa-undo" aria-hidden="true"></i> nein, lieber nicht</button></div>
			<div class="editor_fields"><label>Einleitungstext</label><div contenteditable="true" id="text_display" onkeyup="validate(this,this.nextSibling)" onmouseup="text_selected(this)"></div><button type="button" onclick="save_existing(this)"><i class="fa fa-floppy-o" aria-hidden="true"></i> speichern</button><button type="button" onclick="revert(this)"><i class="fa fa-undo" aria-hidden="true"></i> nein, lieber nicht</button></div>
			<div class="editor_fields"><label>Daten</label>
				<div id="time_display"></div><button type="button" onclick="save_existing(this)"><i class="fa fa-floppy-o" aria-hidden="true"></i> speichern</button><button type="button" onclick="revert(this)"><i class="fa fa-undo" aria-hidden="true"></i> nein, lieber nicht</button></div>
			<div class="editor_fields"><label>Orte</label>
				<div id="Ausstellungsort_display"></div><button type="button" onclick="save_existing(this)"><i class="fa fa-floppy-o" aria-hidden="true"></i> speichern</button><button type="button" onclick="revert(this)"><i class="fa fa-undo" aria-hidden="true"></i> nein, lieber nicht</button></div>
			<div class="editor_fields"><label>Impressum</label>
				<div id="Impressum_display"></div><button type="button" onclick="save_existing(this)"><i class="fa fa-floppy-o" aria-hidden="true"></i> speichern</button><button type="button" onclick="revert(this)"><i class="fa fa-undo" aria-hidden="true"></i> nein, lieber nicht</button></div>
			<div class="editor_fields"><label>Ausstellungskonzept</label><div contenteditable="true" id="Ausstellungskonzept_display" onkeyup="validate(this,this.nextSibling)" onmouseup="text_selected(this)"></div><button type="button" onclick="save_existing(this)"><i class="fa fa-floppy-o" aria-hidden="true"></i> speichern</button><button type="button" onclick="revert(this)"><i class="fa fa-undo" aria-hidden="true"></i> nein, lieber nicht</button></div>
			<div class="editor_fields"><label>Bilder</label><div id="Images_display"></div></div>
      <div class="editor_fields"><label>Medienberichte</label><div id="Medienberichte_display"></div><button type="button" onclick=""><i class="fa fa-floppy-o" aria-hidden="true"></i> speichern</button><button type="button" onclick=""><i class="fa fa-undo" aria-hidden="true"></i> nein, lieber nicht</button></div>
		</div>

		<div id="image_selector" draggable="true" ondragstart="drag(event)"><i class="fa fa-minus-circle" aria-hidden="true" onclick="remove_image()"></i><i class="fa fa-arrows-h" aria-hidden="true"></i><i class="fa fa-pencil-square-o" aria-hidden="true" onclick="edit_image()"></i></div>
<div id="unsaved"><span id="u_count"></span></div>
		<div id="image_editor"></div>
		<div id="process_overlay"></div>
		<div id="text_editor"></div>

	</body>

</html>
