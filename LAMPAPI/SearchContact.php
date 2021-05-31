<?php 
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

	$inData = getRequestInfo();
	
	// Results and how many searches are found.
	$searchResults = "";
	$searchContactArray = array();
	$searchCount = 0;
	
	// Database information, name, user, and password to make the mysql connection.
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
		// Grabs contact(s) from Contacts table where FirstName, LastName, Email, and Phone Number are similar and UserID matches the current logged in user.
		$stmt = $conn->prepare("SELECT * from Contacts WHERE FirstName LIKE ? AND LastName LIKE ? AND Email LIKE ? AND PhoneNumber LIKE ? AND UserID=?");
		$firstName = "%" . $inData["firstName"] . "%";
		$lastName = "%" . $inData["lastName"] . "%";
		$email = "%" . $inData["email"] . "%";
		$phoneNumber = "%" . $inData["phoneNumber"] . "%";
		$stmt->bind_param("sssss", $firstName, $lastName, $email, $phoneNumber, $inData["userId"]);

		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
            // If more than one contact is found, seperate them with a ','.
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
            
            // Add the matched contact to the array.
			$searchContactArray[] = $row;
		}
		
		// Search was not found, so record back nothing was found.
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		// If search found something, then record back the search result.
		else
		{
			returnWithInfo( json_encode($searchContactArray) );
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
		// If no matching contact was found, then return with no matching error, or if other error occurs, return with that.
		$retValue = '{"id":0,"firstName":"","lastName":"","email":"","phoneNumber":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchContactArray )
	{
        // If a matching contact is found, return back the contacts information.
		sendResultInfoAsJson( $searchContactArray );
	}
	
?>
