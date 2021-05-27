<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");
    $inData = getRequestInfo();

    $id = 0;
    $login = $inData['login'];
    $password = $inData['password'];
    $firstName = $inData['firstName'];
    $lastName = $inData['lastName'];
    $dateCreated = "";
    $dateLastLoggedIn = "";



    $databaseName = "Contact_Manager";
    $databaseUser = "ManagerOfContactManager";
    $databasePassword = "WeLoveContactManager";

    // Connect to the sqlServer '$databaseName' on 'localhost' with the username '$databaseUser'
    // and the password '$databasePassword

    $conn = new mysqli("localhost", "$databaseUser",  "$databasePassword", "$databaseName"); 
    if($conn->connect_error)
    {
       returnWithError($conn->connect_error);
    }
    // make the user if connection was successful
    else
    {
        // Prepare a SQL command to send to the server!

        $stmt = $conn->prepare("INSERT into Users (ID,DateCreated,DateLastLoggedIn,FirstName,LastName,Login,Password)
                                VALUES (?,?,?,?,?,?,?");
        // Now let's bind our variables to those ?s in the above line
        $stmt->bind_param("issssss",$id, $dateCreated, $dateLastLoggedIn, $firstName, $lastName, $login, $password);
        // Send the now prepared command!
        $stmt->execute();




        // Close the connection
		$stmt->close();
		$conn->close();
    } 


?>