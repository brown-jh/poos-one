<?php
    $inData = getRequestInfo();

    $login = $inData['login'];
    $password = $inData['password'];


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

        $stmt = $conn->prepare("INSERT blah blah not done");
        // Now let's bind our variables to those ?s in the above line
        $stmt->bind_param("ss", $login, $password);
        // Send the now prepared command!
        $stmt->execute();


        

        // Close the connection
		$stmt->close();
		$conn->close();
    } 


?>