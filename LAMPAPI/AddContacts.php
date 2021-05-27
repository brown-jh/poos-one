<?php header('Access-Control-Allow-Origin: *');


// insert into Contacts (FirstName, LastName, Email, Phone, UserID) VALUES ('','','','','')

    $inData = getRequestInfo();

	$firstName = $inData["firstName"];
    $lastName = $inData['lastName'];
    $email = $inData['email'];
    $phoneNumber = $inData['phoneNumber'];
	$userId = $inData["userId"];

    // Is this the best way to do this? Or should I set the time myself?
    //$dateRecordCreated = $inData["dateRecordCreated"];

    // If setting the time here the line below should do it
    // dateRecordCreated will hold date in format "May 25, 2021, 4:21pm"
    $dateRecordCreated = date("F j, Y, g:i a");
    $databaseName = "Contact_Manager";
    $databaseUser = "ManagerOfContactManager";
    $databasePassword = "WeLoveContactManager";

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
        // should insert the values into Contacts table
		$stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Email, PhoneNumber, DateRecordCreated, UserID) VALUES(?,?,?,?,?,?)");
		$stmt->bind_param("ssssss", $firstName, $lastName, $email, $phoneNumber, $dateRecordCreated, $userId);
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
