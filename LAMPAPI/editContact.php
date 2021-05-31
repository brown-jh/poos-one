<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

$inData = getRequestInfo();

$firstName = $inData["firstName"];
$lastName = $inData['lastName'];
$email = $inData['email'];
$phoneNumber = $inData['phoneNumber'];
$ID = $inData["ID"];

$databaseName = "Contact_Manager";
$databaseUser = "ManagerOfContactManager";
$databasePassword = "WeLoveContactManager";
$dateCreated = "";

$conn = new mysqli("localhost", "$databaseUser",  "$databasePassword", "$databaseName");
if ($conn->connect_error)
{
    returnWithError( $conn->connect_error );
}
else
{
    $stmt = $conn->prepare("UPDATE Contacts SET
                            firstName=?,
                            lastName=?,
                            email=?,
                            phoneNumber=?,
                            WHERE ID=?");
    $stmt->bind_param("sssss", $firstName, $lastName, $email, $phoneNumber, $ID);
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
