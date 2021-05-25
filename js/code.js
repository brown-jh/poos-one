var urlBase = 'http://cop4331group25.xyz/LAMPAPI';
var extension = 'php';


function searchContacts()
{
  // First get the data from the user.
  var first = document.getElementById("firstSearch").value;
  var last = document.getElementById("lastSearch").value;
  var phone = document.getElementById("phoneSearch").value;
  var email = document.getElementById("emailSearch").value;

  var result = document.getElementById("searchResult");
  result.innerHTML = ""; // Clear the login result field.

  // TODO: This is where we would submit the request to the server.
  result.innerHTML = "Contact(s) retrieved.<br>"
  var jsonPayload = '{"first" : "' + first + '", "last" : "' + last + '", "phone" : "' + phone + '", "email" : "' + email + '", "userID" : "' + '1' + '"}';
  alert("TODO: Should submit to search:\n" + jsonPayload);
  
  // This test data can substitute for the request output.
  // It's rendered as an array of objects, each with fields for the contact data, and another for the primary key.
  var dummyContacts = [{first:"William", last:"Tell", phone:"", email:"", primKey:10}, 
		       {first:"Tommy", last:"Tutone", phone:"8675309", email:"", primKey:15}, 
		       {first:"Professor", last:"Nelson", phone:"", email:"hnelson@uni.edu", primKey:45}, 
		       {first:"Jane", last:"Smith", phone:"5555555", email:"jsmith@yahoo.com", primKey:46}];

  // For each entry, I show a contact with the text on the left, and Update and Remove buttons on the right.
  for (var i = 0; i < dummyContacts.length; i++)
  {
    result.innerHTML += makeContactFloats(dummyContacts[i], i);
  }
  // If no results were found, say so.
  if (dummyContacts.length == 0)
  {
    result.innerHTML = "No contacts found.<br>";
  }
}


// This function generates a piece of text and two buttons in HTML to add to the display.
function makeContactFloats(entry, index)
{
  // First make the contact information.
  var contactInfo = entry.first + " " + entry.last;
  if (entry.phone != "")
  {
    contactInfo += ", " + entry.phone;
  }

  if (entry.email != "")
  {
    contactInfo += ", " + entry.email;
  }

  // Next make the parameter listss for the two onClick functions. Both of them need the primary key (to know what database entry to act on)
  // and the display index (so that it can update the displayed data without re-fetching), but the Update one also needs the 
  // full data of the entry (to display it as the default data).
  var deleteParams = entry.primKey + ", " + index;
  var updateParams = "'" + entry.first + "', '" + entry.last + "', '" + entry.phone + "', '" + entry.email + "', " + deleteParams;

  // Then we need to give a name to the div to reference it later.
  var divName = "entryDiv" + index;

  // Now plug all these into the HTML.
  var fullContact = '<div id="' + divName + '"><p>' + contactInfo + 
			'</p><span class="fullWidth"><input type=button value="Delete" class="smallButton" onClick="deleteContact(' + 
			deleteParams + ');"><input type=button value="Edit" class="smallButton" onClick="updateContact(' + updateParams + ');"></span></div>';
  return fullContact;
}


// Send the user to the Add Contact page when the click the Add Contact button.
function goToAdd()
{
  location.href = "addContact.html";
}

// TODO: This function needs a modal box and database access.
function updateContact(first, last, phone, email, primKey, index)
{
  alert("TODO: Bring up a modal dialog box with default values '" + first + "', '" + last + "', '" + phone + "', '" + email + 
		"' to update the database entry with key " + primKey + ", and update the div indexed " + index + ".");
}

// TODO: Remove a contact after warning the user.
function deleteContact(entryKey, entryInd)
{
  if(confirm("Do you want to delete this contact?"))
  {
    alert("TODO: Tell the database to delete the entry with key " + entryKey + ".");

    // Remove the entry referred to by setting its display to none.
    document.getElementById("entryDiv" + entryInd).style.display = "none";
  }
}


//TODO: Return the user to the login page and clear their cookie.
function logOut()
{
  alert("TODO: Clear the user's cookie.");
  location.href = "index.html";
}


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