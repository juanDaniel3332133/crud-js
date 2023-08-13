/* VAR DECLARATIONS */

const form = document.querySelector('form'),
        table = document.querySelector('table'),
        users = [];

let userIdToEdit = null;

/* INIT */

loadUsersFromStorage();

printUsersOnTheTable();

/* EVENT LISTENERS */

form.addEventListener('submit', e =>  {
    e.preventDefault();
    userIdToEdit ? updateUser() : addUser();
});

table.querySelector('tbody').addEventListener('click', e => {

    const userId = e.target.getAttribute('attr-user-id');

    if( userId )
    {
        switch( true )
        {
            case e.target.classList.contains('delete-user'):
                removeUser( userId );
                break;

            case e.target.classList.contains('edit-user'):
                selectUserToEdit( userId );
                break;
        }
    }
});

/* FUNCTIONS */

function loadUsersFromStorage()
{
    const _users = localStorage.getItem('users');
    users.push( ...(_users ? JSON.parse(_users) : []) );
}

function addUser()
{
    const user = {id: users.length + 1};

    for(let input of form.querySelectorAll('input'))
        user[ input.getAttribute('name') ] = input.value;

    users.push(user);

    addUserOnTheTable(user);

    form.reset();
    
    refreshUsersInStorage();
}

function removeUser(id)
{
    const userIndex = users.findIndex(user => user.id == id);
    
    users.splice(userIndex, 1);
    
    table.querySelector(`[attr-user-id="${id}"]`).remove();
    
    if(  userIdToEdit == id )
    {
        userIdToEdit = null;
        form.reset();
        updateFormSubmitButtonText();
    }

    refreshUsersInStorage();

    refreshUserCount();
}

function refreshUsersInStorage()
{
    localStorage.setItem('users', JSON.stringify(users));
}

function printUsersOnTheTable()
{
    for( let user of users )
        addUserOnTheTable(user);

    refreshUserCount();
}

function addUserOnTheTable(user)
{
    const actionsTd = `<td>
        <div class="row mx-0">
            
            <div class="col-6 ps-0 pe-1">
                <button type="button" attr-user-id="0" class="btn w-100 btn-success edit-user">
                    Edit
                </button>
            </div>

            <div class="col-6 ps-1 pe-0">
                <button type="button" attr-user-id="0" class="btn w-100 btn-danger delete-user">
                    Delete
                </button>
            </div>

        </div>
    </td>`;
    
    const row = document.createElement('TR');

    row.setAttribute('attr-user-id', user.id);

    let rowHtml = '';

    for( let attribute in user )
        rowHtml += `<td attr-user-${user.id}-${attribute}>${user[attribute]}</td>`
        
    rowHtml += actionsTd;

    row.innerHTML = rowHtml;

    for( let element of row.querySelectorAll('[attr-user-id="0"]') )
        element.setAttribute("attr-user-id", user.id);

    table.querySelector('tbody').appendChild(row);
    
    refreshUserCount();
}

function refreshUserCount()
{
    table.querySelector('#usersCount').innerHTML = users.length;
}

function selectUserToEdit(id)
{
    const user = users.find(user => user.id == id);

    for(let input of form.querySelectorAll('input'))
        input.value = user[ input.getAttribute('name') ];

    userIdToEdit = user.id;

    updateFormSubmitButtonText();
}

function updateFormSubmitButtonText()
{
    form.querySelector('[type="submit"]').innerHTML = userIdToEdit ? "Update" : "Submit";
}

function updateUser()
{
    const userIndex = users.findIndex(user => user.id == userIdToEdit);

    const user = users[userIndex]; 

    for(let input of form.querySelectorAll('input'))
        user[ input.getAttribute('name') ] = input.value;
    
    userIdToEdit = null;

    form.reset();

    const rowOfUser =  table.querySelector(`[attr-user-id="${user.id}"]`);

    for( let attribute in user)
        rowOfUser.querySelector(`[attr-user-${user.id}-${attribute}]`).innerHTML = user[attribute];
    
    updateFormSubmitButtonText();
}