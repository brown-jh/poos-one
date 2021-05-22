<?php

	$inData = getRequestInfo();
	
	// results and how many searches are found
	$searchResults = "";
	$searchCount = 0;
	
	// database information, name, user, and password to make the mysql connection
	$databaseName = "Contact_Manager";
    $databaseUser = "ManagerOfContactManager";
    $databasePassword = "WeLoveContactManager";

	$conn = new mysqli("localhost", "$databaseUser",  "$databasePassword", "$databaseName"); 
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// looked at Friday lecture to help, common error he said would be the capilization/spelling
		// of FirstName/firstName, UserID/userID, etc. so check that first if errors occur
		//
		$stmt = $conn->prepare("SELECT * from Contacts WHERE (firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR phoneNumber LIKE ?) AND UserID=?");
		$firstName = "%" . $inData["firstName"] . "%";
		$lastName = "%" . $inData["lastName"] . "%";
		$email = "%" . $inData["email"] . "%";
		$phoneNumber = "%" . $inData["phoneNumber"] . "%";
		$stmt->bind_param("sssss", $firstName, $lastName, $email, $phoneNumber, $inData["userId"]);
		//
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;

			// changed from his lecture, if search results show something weird, probably because of this
			$searchResults .= '"' . $row["firstName"] . '"' . $row["lastName"] . '"' . $row["email"] . '"' . $row["phoneNumber"] . '"';
		}
		
		// search was not found, so record back nothing was found
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		// if search found something, then record back the search result
		else
		{
			returnWithInfo( $searchResults );
		}
		
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
	
	function returnWithError( $err )
	{
		// leaving this for now, but if error code doesn't make sense when a contact is not found, this is where to change that 
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>