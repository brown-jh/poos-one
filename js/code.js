var urlBase = 'http://www.cop4331group25.xyz/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

// ** register.html **


function registerUser()
{
  userId = 0;
  firstName = "";
  lastName = "";
	
  var registerFirstName = document.getElementById("registerFirstName").value;
  var registerLastName = document.getElementById("registerLastName").value;
  var login = document.getElementById("registerName").value;
  var password = document.getElementById("registerPassword").value;
  var hash = md5( password );
	
  document.getElementById("registerResult").innerHTML = "";

  // TODO: Do database query instead of this test data to check for a duplicate user. (If we have time!)
  // if (login == "test")
  // {
  //   document.getElementById("registerResult").innerHTML = "Username is already used.<br>";
  //   return;
  // }

  var passwdRegex = /^\w{8,}$/; // Matches a string of 8 or more alphanumerics.
  // Check if the password is valid.
  if (!passwdRegex.test(password))
  {
    document.getElementById("registerResult").innerHTML = "Password must be 8 or more numbers, letters, or underscores.";
    return;
  }

  var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '", "firstName" : "' + registerFirstName + '", "lastName" : "' + registerLastName + '"}'
  //var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '", "firstName" : "' + registerFirstName + '", "lastName" : "' + registerLastName + '"}'
  var url = urlBase + '/Register.' + extension;

  // Connects to server and sends jsonPayload containing user information.
  var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
 
				saveCookie();
	
        // Sends user back to main menu where they must log in again
				location.href = "index.html";
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
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

  //TODO: Also check if the entry is a duplicate of a (different) preexisting entry? (If we have time!)

  // If we got no errors, then we can submit the data.
  if (result.innerHTML == "")
  {
    var jsonPayload = '{"firstName" : "' + first + '", "lastName" : "' + last + '", "phoneNumber" : "' + phone + '", "email" : "' + email + '", "userId" : "' + userId + '"}';
    var url = urlBase + '/AddContacts.' + extension;
	
    // Connects to server and sends jsonPayload containing user information.
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
      xhr.onreadystatechange = function() 
      {
        if (this.readyState == 4 && this.status == 200) 
        {
          result.innerHTML = "New contact added."
        }
      };
      xhr.send(jsonPayload);
    }
    catch(err)
    {
      result.innerHTML = err.message;
    }
    
  }

  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("phoneNumber").value = "";
  document.getElementById("emailAddress").value = "";
  
}

// Return the user to the main page when they click Cancel.
function goBack()
{
  location.href = "mainPage.htm";
}


// ** index.html **


function logInUser()
{

  userId = 0;
  firstName = "";
  lastName = "";
	
  var login = document.getElementById("loginName").value;
  var password = document.getElementById("loginPassword").value;
  var hash = md5( password );

  var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
  //var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;

  // Connects to server and sends jsonPayload containing user information, checking if User/Password
  // combo is correct.
  var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect.";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

        document.getElementById("loginResult").innerHTML = "Logged in! Welcome";
 
				saveCookie();
	
				location.href = "mainPage.htm";
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

// Go to the Register screen when the user clicks on the Register button.
function goToRegister()
{
  location.href = "Register.html";
}


// ** mainPage.html **


// This is the array used to store the contacts.
var contactList = [];

// Searches through the contacts and returns found contacts for you to edit/remove.
function searchContacts()
{
  // Start with all the update interfaces closed.
  currentlyUpdating = -1;
  
  // First get the data from the user.
  var first = document.getElementById("firstSearch").value;
  var last = document.getElementById("lastSearch").value;
  var phone = document.getElementById("phoneSearch").value;
  var email = document.getElementById("emailSearch").value;

  var result = document.getElementById("searchResult");
  result.innerHTML = ""; // Clear the login result field.

  //This is where we submit the request to the server.
  var jsonPayload = '{"firstName" : "' + first + '", "lastName" : "' + last + '", "phoneNumber" : "' + phone + '", "email" : "' + email + '", "userId" : "' + userId + '"}';
  var url = urlBase + '/SearchContact.' + extension;

  // Connects to server and sends jsonPayload containing user information.
  var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
        result.innerHTML = "Contact(s) retrieved.<br>"
                
        // Updates the contactList array from database, each array index is a contact.
				var jsonObject = JSON.parse( xhr.responseText );
				for( var i=0; i<Object.keys(jsonObject).length; i++ )
				{
					contactList[i] = jsonObject[i];
				}
        
        // If no results were found, say so.
        if (jsonObject.id == 0)
        {
          result.innerHTML = "No contacts found.<br>";
          return;
        }

        // For each entry, I show a contact with the contact's info formatted, and Update and Remove buttons below.
        for (var i = 0; i < Object.keys(jsonObject).length; i++)
        {
          result.innerHTML += makeContactFloats(contactList, i);
        }
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		result.innerHTML = err.message;
	}
	
}

// This function dynamically generates some HTML to add to the display. It contains two spans; one shows the contact data,
// and the other lets the user update the data.
function makeContactFloats(entries, index)
{
  // First make the contact information.
  var contactInfo = entries[index].FirstName + " " + entries[index].LastName;
  if (entries[index].PhoneNumber != "")
  {
    contactInfo += ", " + entries[index].PhoneNumber;
  }

  if (entries[index].Email != "")
  {
    contactInfo += ", " + entries[index].Email;
  }

  // Next make the parameter lists for the onClick functions. Both need the list of search entries and the index.
  var params = "contactList, " + index;

  // Then we need to give a name to the divs to reference them later.
  var divName1 = "entryDiv" + index;
  var divName2 = "updateDiv" + index;

  // We also need to name the four search boxes in the update div so we can get the information from them.
  var firstBox = "first" + index;
  var lastBox = "last" + index;
  var phoneBox = "phone" + index;
  var emailBox = "email" + index;

  // Finally, we need to name the span for the results of updating, and the paragraph that has the contact info.
  var spanName = "results" + index;
  var paraName = "contactInfo" + index;

  // Now plug all these into the HTML. Yes, it is a doozy @_@.
  var div1 = '<div id="' + divName1 + '"><p id="' + paraName + '">' + contactInfo + 
			'</p><span class="fullWidth"><input type=button value="Delete" class="smallButton" onClick="deleteContact(' + 
			params + ');"><input type=button value="Edit" class="smallButton" onClick="updateContact(' + params + ');"></span></div>';
  var div2 = '<div id="' + divName2 + '" style="display:none;"><span class="fullWidth"><input type="text" id="' + firstBox + 
		'" class="searchBox" placeholder="First name"><input type="text" id="' + lastBox + 
		'" class="searchBox" placeholder="Last name"><input type="text" id="' + phoneBox + 
		'" class="searchBox" placeholder="Phone number"><input type="text" id="' + emailBox + 
'" class="searchBox" placeholder="Email address"></span><span class="fullWidth"><input type=button value="Cancel" class="smallButton" onClick="cancelUpdate(' + 
index + ');"><input type=button value="Confirm" class="smallButton" onClick="acceptUpdate(' + params + ');"></span><span id="' + spanName + 
'" class="results errorText"></div>';

  return div1 + div2;
}

// Send the user to the Add Contact page when they click the Add Contact button.
function goToAdd()
{
  location.href = "addContact.html";
}

// Determines which contact the user is currently updating; -1 is none of them.
var currentlyUpdating = -1;

// Opens up the update interface when the user clicks Update.
function updateContact(entries, index)
{
  // If another update interface is already open, close it.
  if (currentlyUpdating != -1)
  {
    document.getElementById("entryDiv" + currentlyUpdating).style.display = "block";
    document.getElementById("updateDiv" + currentlyUpdating).style.display = "none";
  }
  currentlyUpdating = index;

    // Bring up the update interface by switching which div is displayed.
    document.getElementById("entryDiv" + index).style.display = "none";
    document.getElementById("updateDiv" + index).style.display = "block";

    // Copy the original data in the contact to the search boxes.
    document.getElementById("first" + index).value = entries[index].FirstName;
    document.getElementById("last" + index).value = entries[index].LastName;
    document.getElementById("phone" + index).value = entries[index].PhoneNumber;
    document.getElementById("email" + index).value = entries[index].Email;
}

// Get rid of the update interface when the user clicks Cancel.
function cancelUpdate(index)
{
  currentlyUpdating = -1;

  document.getElementById("entryDiv" + index).style.display = "block";
  document.getElementById("updateDiv" + index).style.display = "none";
}

// Update an entry when the user clicks Accept in the update interface.
function acceptUpdate(entries, index)
{

  // Get the new contact info from the text boxes.
  var first = document.getElementById("first" + index).value;
  var last = document.getElementById("last" + index).value;
  var phone = document.getElementById("phone" + index).value;
  var email = document.getElementById("email" + index).value;

  var result = document.getElementById("results" + index);
  result.innerHTML = ""; // Clear the update result field.
  

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
    // TODO: This is where we would submit the request to the server.
    var jsonPayload = '{"first" : "' + first + '", "last" : "' + last + '", "phone" : "' + phone + '", "email" : "' + email + '", "userID" : "' + userId + '", "primKey": ' + entries[index].primKey + '}';
    alert("TODO: Should submit to update:\n" + jsonPayload);
    
    // Update the local version of the entry. First we make the new contact info.
    var contactInfo = first + " " + last;
    if (phone != "")
    {
      contactInfo += ", " + phone;
    }

    if (email != "")
    {
      contactInfo += ", " + email;
    }

    // Then we find the paragraph where the contact info goes and replace it.
    document.getElementById("contactInfo" + index).innerHTML = contactInfo;

    // Replace the data in the array as well, for the next update.
    entries[index].first = first;
    entries[index].last = last;
    entries[index].phone = phone;
    entries[index].email = email;

    // Finally, switch away from the update interface.
    currentlyUpdating = -1;
    document.getElementById("entryDiv" + index).style.display = "block";
    document.getElementById("updateDiv" + index).style.display = "none";
  }
}

// Remove a contact after warning the user.
function deleteContact(entries, index)
{
  if(confirm("Do you want to delete this contact?"))
  {
    var primKey = entries[index].ID;
    
    var jsonPayload = '{"ID" : "' + primKey + '"}';
    var url = urlBase + '/deleteContact.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
      xhr.onreadystatechange = function() 
      {
        if (this.readyState == 4 && this.status == 200) 
        {
          result.innerHTML = "Contact Deleted."
        }
      };
      xhr.send(jsonPayload);
    }
    catch(err)
    {
      result.innerHTML = err.message;
    }

    // Remove the entry referred to by setting its display to none.
    document.getElementById("entryDiv" + index).style.display = "none";
  }
}

function logOut()
{
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  location.href = "index.html";
}


// **cookie stuff **

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
}