var urlBase = 'http://cop4331group25.xyz/LAMPAPI';
var extension = 'php';


// ** register.html **


function registerUser()
{
  var userId = 0;
  var firstName = "";
  var lastName = "";
	
  var login = document.getElementById("registerName").value;
  var password = document.getElementById("registerPassword").value;
  //var hash = md5( password );
	
  document.getElementById("registerResult").innerHTML = "";

  //var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
  var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';

  // TODO: Do database query instead of this test data to check for a duplicate user.
  if (login == "test")
  {
    document.getElementById("registerResult").innerHTML = "Username is already used.<br>";
    return;
  }

  var passwdRegex = /^\w{8,}$/; //Matches a string of 8 or more alphanumerics.
  // Check if the password is valid.
  if (!passwdRegex.test(password))
  {
    document.getElementById("registerResult").innerHTML = "Password must be 8 or more numbers, letters, or underscores.";
    return;
  }
  // TODO: Hash password.
  //var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
  var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
  alert("TODO: Should submit to Register API and make cookie:\n" + jsonPayload);
  // TODO: Database query to add the new user, and make the cookie.
  location.href = "mainPage.htm";
}

// Go to the Register screen when the user clicks on the Register button.
function goToLogin()
{
  location.href = "index.html";
}


// ** addContact.html **


function checkContact()
{
  // Get the data the user entered.
  var first = document.getElementById("firstName").value;
  var last = document.getElementById("lastName").value;
  var phone = document.getElementById("phoneNumber").value;
  var email = document.getElementById("emailAddress").value;

  var result = document.getElementById("addResult");
  result.innerHTML = ""; // Clear the login result field.
  

  // Check for invalid data: either missing names, invalid phone, or invalid email.
  // Since the email and phone are optional, don't check them if empty.
  if (first == "" || last == "")
  {
    result.innerHTML += "Please fill in first and last name. <br>";
  }

  var phoneRegex = /^\d{7}$|^\d{10}$/; //Matches a string of 7 or 10 digits. 
  if (phone != "" && !phoneRegex.test(phone))
  {
    result.innerHTML += "Phone number must be either 7 or 10 digits (no dashes). <br>";
  }
  
  // Check for a valid email (foo@bar.baz) via regex.
  var emailRegex = /.+\@.+\..+/; 
  if (email != "" && !emailRegex.test(email))
  {
    result.innerHTML += "Email must be of the form name@site.foo. <br>";
  }

  //TODO: Also check if the entry is duplicate?

  // If we got no errors, then we can submit the data.
  if (result.innerHTML == "")
  {
    // First clear the textboxes.
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("emailAddress").value = "";

    // TODO: This is where we would submit the request to the server.
    result.innerHTML = "New contact added."
    var jsonPayload = '{"first" : "' + first + '", "last" : "' + last + '", "phone" : "' + phone + '", "email" : "' + email + '", "userID" : "' + '1' + '"}';
    alert("TODO: Should submit:\n" + jsonPayload);
  }
}

// Return the user to the main page when they click Cancel.
function goBack()
{
  location.href = "mainPage.htm";
}


// ** index.html **


function logInUser()
{
  var userId = 0;
  var firstName = "";
  var lastName = "";
	
  var login = document.getElementById("loginName").value;
  var password = document.getElementById("loginPassword").value;
  //var hash = md5( password );
	
  document.getElementById("loginResult").innerHTML = "";

  //var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
  var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
  alert("TODO: Should submit to Login API:\n" + jsonPayload);

  // TODO: Do database query instead of this test data.
  if (login == "test" && password == "password")
  {
    // TODO: Set up and create the cookie.
    location.href = "mainPage.htm";
    return;
  }
  // Tell the user if the login failed.
  document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
}

// Go to the Register screen when the user clicks on the Register button.
function goToRegister()
{
  location.href = "Register.html";
}


// ** mainPage.html **

