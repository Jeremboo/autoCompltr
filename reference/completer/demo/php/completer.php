<?php
$request       = strip_tags($_POST['requestExpression']);   // Request expression
$filePath      = '../files/completer.json';     // Path .json file
$cfgPath       = '../files/configuration.ini';  // Path configuration file
$responseSize  = 5;                             // Number of items to return
$expire        = time() - 3600;                 // Validity cache duration in seconds

if(file_exists($cfgPath)) 
{
    $cfg = parse_ini_file ($cfgPath);
    
    // If the file doesn't exist or is not actualized, load the datas set on DB
    if(!file_exists($filePath) || filemtime($filePath) > $expire)
    {
        try 
        {
            $pdo = new PDO($cfg["dsn"], $cfg["user"], $cfg["pwd"], array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION , PDO::ATTR_PERSISTENT => TRUE));
        } 
        catch(PDOException $exception)
        {
            exit("Error Data Base connexion : " . $exception->getMessage());
        }

        $sql = ("SELECT " . $cfg["enum"] . " FROM " . $cfg["table"] . " ORDER BY ID ASC");
        $query = $pdo->query($sql);

        if($query->rowCount() > 0)
        {
            while($row = $query->fetch())
            {
                $result[] = $row;
            }

            // Encode the result of the SQL request in JSON and puts him into JSON file
            $content = json_encode($result);
            $handle  = fopen($filePath, 'w+');

            if (flock($handle, LOCK_EX))
            {
                ftruncate($handle, 0);     
                fwrite($handle, $content);
                flock($handle, LOCK_UN);   
            }
            else
            {
                exit("Error Unable to lock file");
            }

            fclose($handle);
        }
        else 
        {
            @mail('admin@yoursite.com', 'application@yoursite.com', 'Completer.js : the SQL request return zero result');

            // Reply soluce
            if (file_exists($filePath))
            {
                $content = file_get_contents($filePath);
            }
        }
       
    }
    // Else if the file exist and is actualized, read it
    else if (file_exists($filePath))
    {
        $content = file_get_contents($filePath);
    }
    
    // Columns list to return
    $enum = explode(',', trim($cfg['enum']));
    
    // Decode the data source
    $complete = json_decode($content);

    $length = count($complete);
    for($i = 0 ; $i < $length ; $i++)
    {
        // Case unsensitive matching
        $pos = strpos(strtolower($complete[$i]->$enum[0]), strtolower($request));

        // One occurence is find
        if($pos !== FALSE)
        {
            // The string begin by the occurence
            if($pos == 0)
            {
                $response[] = $complete[$i];
            }
        }
    }

    // Alphabetic sorting
    sort($response);

    // Send response encoded in JSON and limited to 5 suggestions
    echo json_encode(array_slice($response, 0, $responseSize));   
}  
else 
{
    @mail('admin@yoursite.com', 'application@yoursite.com', 'Completer.js : configuration.ini is unavailable');
    exit("Unable to load configuration file");
}
?>