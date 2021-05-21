<?php

    $inData = getRequestInfo();
    
    $id = 0;
    $firstName = "";
    $lastName = "";

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
        $stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=? AND Password =?");
        // Now let's bind our variables to those ?s in the above line
        $stmt->bind_param("ss", $inData["login"], $inData["password"]);
        // Send the now prepared command!
        $stmt->execute();
        // And see if we had a successful login
        $result = $stmt->get_result();

        // Now that we have our results, lets return the user if it existed.
        if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
		}
		else
		{
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
	
    // If we have an error, return id as 0
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
    // No error? return our ID
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}




?>