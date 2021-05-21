<?php


// insert into Contacts (FirstName, LastName, Email, Phone, UserID) VALUES ('','','','','')

    $inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
    $lastName = $inData['lastName'];
    $email = $inData['email'];
    $phoneNumber = $inData['phoneNumber'];
	$userId = $inData["userId"];

    $databaseName = "";
    $databaseUser = "";
    $databasePassword = "";

    // Connect to the sqlServer '$databaseName' on 'localhost' with the username '$databaseUser'
    // and the password '$databasePassword

    $conn = new mysqli("localhost", "$databaseUser",  "$databasePassword", "$databaseName"); 
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        // no clue if this following line works, may have adapted it correctly but who knows
		$stmt = $conn->prepare("INSERT into Contacts (UserId,Name) VALUES(?,?,?,?,?)");
		$stmt->bind_param("sssss", $userId, $firstName, $lastName, $email, $phoneNumber);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
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
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}


?>