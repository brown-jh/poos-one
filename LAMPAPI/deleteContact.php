<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phoneNumber = $inData["phoneNumber"];
	$userId = $inData["userId"];

	$conn = new mysqli("159.203.86.224", "ManagerOfContactManager", "WeLoveContactManager", "Contact_Manager");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $mysqli->prepare("DELETE from Contacts WHERE firstName = ? AND lastName = ? AND userId = ?);
		$stmt->bind_param("sss", $firstName, $lastName, $userId);
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