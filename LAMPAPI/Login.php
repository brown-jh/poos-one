<?php 
// Refered to: https://stackoverflow.com/questions/57901808/cors-preflight-request-doesnt-pass-access-control-check-it-does-not-have-http
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];
if ($method == "OPTIONS") {
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
header("HTTP/1.1 200 OK");
die();
}

    $inData = getRequestInfo();
    
    $id = 0;
    $firstName = "";
    $lastName = "";
    $currentTime = date("Y-m-d H:i:s");

    $databaseName = "Contact_Manager";
    $databaseUser = "ManagerOfContactManager";
    $databasePassword = "WeLoveContactManager";

    // Connect to the sqlServer '$databaseName' on 'localhost' with the username '$databaseUser'
    // and the password '$databasePassword

    $conn = new mysqli("localhost", "$databaseUser",  "$databasePassword", "$databaseName"); 

    // If we have a connection error, let us know.
    if($conn->connect_error)
    {
       returnWithError($conn->connect_error);
    }
    // If we don't, let's look for the user
    else
    {
        // Prepare a SQL command to send to the server!
        // **Currently using what was in the class example, but this may need to change
        // (but probably not)**
        $stmt = $conn->prepare("SELECT ID,DateCreated,DateLastLoggedIn,firstName,lastName FROM Users WHERE Login=? AND Password =?");
        // Now let's bind our variables to those ?s in the above line
        $stmt->bind_param("ss", $inData["login"], $inData["password"]);
        // Send the now prepared command!
        $stmt->execute();



        
        // And see if we had a successful login
        $result = $stmt->get_result();

        // Now that we have our results, lets return the user if it existed.
        if( $row = $result->fetch_assoc()  )
		{
            loginUpdate($conn, $row);
			returnWithInfo( $row['ID'], $row['DateCreated'], $currentTime,
                            $row['firstName'], $row['lastName']);
		}
		else
		{
            http_response_code(401);
			returnWithError("No Records Found");   
		}

        // Close the connection
		$stmt->close();
		$conn->close();
    } 

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	

    function loginUpdate(&$conn, &$row)
    {
        // TODO: Update 'DateLastLoggedIn' when user logs in.
        $currentTime = date("Y-m-d H:i:s");
        $timestmt = $conn->prepare("UPDATE Users SET DateLastLoggedIn=? WHERE ID=?");
        $timestmt->bind_param("si", $currentTime, $row['ID']);
        $timestmt->execute();
    }

    // If we have an error, return id as 0
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"dateCreated":"", "dateLastLoggedIn":"",
            "firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
    // No error? return our ID
	function returnWithInfo( $id, $dateCreated, $dateLastLoggedIn, $firstName, $lastName )
	{
		$retValue = '{"id":' . $id . ',"dateCreated":"' . $dateCreated . '",
            "dateLastLoggedIn": "' . $dateLastLoggedIn . '", "firstName":"' . $firstName . '",
            "lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}




?>