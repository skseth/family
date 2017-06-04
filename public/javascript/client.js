// https://www.sitepoint.com/dom-manipulation-vanilla-javascript-no-jquery/

// TODO : fetch polyfill for ie 11
// TODO : promise polyfill for ie 11

// Userlist data array for filling in info box
let personListData = [];


// DOM Ready =============================================================
document.addEventListener('DOMContentLoaded', function() {
    populateTable();
});


function populateTable() {

    fetch('/api/persons')
    .then(function(response) { 
        return response.json()
    })
    .then(function(data) {
        personListData = data;

        const tableContent = data.map(el => 
            `<tr>
            <td><a href="#" class="linkshowperson" rel="${el._id}">${el.name}</a></td>
            <td>${el.email}</td>
            <td><a href="#" class="linkdeleteperson" rel="${el._id}">delete</a></td></tr>`).join('')


        const personTableEl = document.querySelector('#personList table tbody')

        personTableEl.innerHTML = tableContent

        const showPersonLinkEls = personTableEl.querySelectorAll('td a.linkshowperson')

        Array.from(showPersonLinkEls).forEach(el => {
            el.addEventListener('click', showPersonInfo)
        })

        const delpersonLinkEls = personTableEl.querySelectorAll('td a.linkdeleteperson')
        Array.from(delpersonLinkEls).forEach(el => {
            el.addEventListener('click', deletePerson)
        })

        const btnAddPerson = document.querySelector('#btnAddPerson')
        btnAddPerson.addEventListener('click', addPerson)

    });
};

// Show User Info
function showPersonInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    const personid = this.getAttribute('rel');

    const person = personListData.find( el => el._id === personid);

    //Populate Info Box
    document.getElementById('infoname').innerHTML = person.name;
    document.getElementById('infoemail').innerHTML = person.email;

};

function addPerson(event) {
    event.preventDefault();

    const addUserEl = document.querySelector('#addPerson')

    const fieldval = (fldname) => addUserEl.querySelector(`#${fldname}`).value
    const inputEls = addUserEl.querySelectorAll('input')

    var errorCount = 0;
    Array.from(inputEls).forEach(el => {
        if (el.value === '') { errorCount++; }
    })

    if (errorCount === 0) {
        const newPerson = {
            'name': fieldval('personname'),
            'email': fieldval('personemail'),
        }

        fetch('/api/persons', {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                method: 'POST', 
                body: JSON.stringify(newPerson)
        })
        .then(function(response) { 
            return response.json()
        })
        .then(function(respjson) {
            if (!respjson.hasOwnProperty('err')) {                
                const inputEls = addUserEl.querySelectorAll('input')
                Array.from(inputEls).forEach(el => el.value = '')
                populateTable();            
            }
            else {                
                alert('Error: ' + respjson.err);            
            }
        })
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }    
}


// Delete User
function deletePerson(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        fetch(`/api/persons/${this.getAttribute('rel')}`, {
                headers: {
                  'Accept': 'application/json',
                },
                method: 'DELETE', 
        })
        .then(function(response) { 
            return response.json()
        })
        .then(function(respjson) {
            if (!respjson.hasOwnProperty('err')) {           
            }
            else {                
                alert('Error: ' + respjson.err);            
            }
            // Update the table
            populateTable();
        });


    }
    else {
        // If they said no to the confirm, do nothing
        return false;
    }
};

