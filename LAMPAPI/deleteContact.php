<?php header('Access-Control-Allow-Origin: *');
	$primKey = getRequestInfo();
	
	$primKey = $inData["primKey"];

	$conn = new mysqli("localhost", "ManagerOfContactManager", "WeLoveContactManager", "Contact_Manager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $mysqli->prepare("DELETE from Contacts WHERE primKey = ?);
		$stmt->bind_param("s", $firstName, $lastName, $userId);
		$stmt->execute();
	}

	$stmt->close();
	$conn->close();
	
	returnWithError("");
	
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