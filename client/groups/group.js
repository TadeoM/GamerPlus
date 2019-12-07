let csrfToken = null;

const handleGroup = (e) =>{
    e.preventDefault();

    $("#groupMessage").animate({width:'hide'},350);

    if($("#groupName").val()==''|| $("#groupOwner").val()=='')
    {
        handleError("Gamer! All fields are required");
        return false;
    }

    let formData = new FormData();
    let groupName = document.querySelector('#groupName').value;
    let groupOwner = document.querySelector('#groupOwner').checked;
    let groupMember = document.querySelector('#groupMember').value;

    formData.append('groupName', groupName);
    formData.append('groupOwner', groupOwner);
    formData.append('groupMember', groupMember);
    formData.append('_csrf', csrfToken);

    fetch(`/addMember?_csrf=${csrfToken}`,
    {
        method: "POST",
        body: formData,
    })
    .then(
        function(response){
            console.log("FUCK");
            if(response.status === 200){
                console.log("Group made");
                loadGroupsFromServer();
            }
            else {
                console.log("response.error");
            }
        }
    );
    
    return false;
};

const GroupForm = (props) =>{
    return(
        <form id="groupForm" name="groupForm"
            onSubmit ={handleGroup}
            action ="/addMember"
            encType="multipart/form-data"
            className ="mainForm"
        >
            <label htmlFor ="name">Name: </label>
            <input id="groupName" type="text" name="name" placeholder ="Group Name"/>
            <input id="groupOwner" type="checkbox" name="owner" value="owner" /> Owner<br></br>
            <label htmlFor ="newMember">New Member: </label>
            <input id="groupMember" type="text" name="newMember" placeholder ="New Member"/>
            <input type="hidden" name="_csrf" value={csrfToken}/>
            <input className ="makeGroupSubmit" type="submit" value ="Make Quest"/>
        </form>
    );
};

const GroupList = function(props)
{
    if(props.groups.length === 0)
    {
        return(
            <div className="groupList">
                <h3 className="emptyGroup">No Groups Yet</h3>
            </div>
        );
    }
    const groupNodes = props.groups.map(function(group)
    {
        console.log(group.groupOwner);
        return(
            <div key={group._id} className="quest">
                <h3 className="groupName">Name: {group.groupName}</h3>
                <h3 className="groupOwner">Group Owner: {group.groupOwner.toString()}</h3>
                <h4 className="groupMember">Group Member: {group.groupMember}</h4>
                <input type="hidden" name="_csrf" value={props.csrf}/>
            </div>
        );
    });
    return (
        <div className="groupList">
            {groupNodes}
        </div>
    );
}

const loadGroupsFromServer = () =>{
    sendAjax('GET', '/getGroups', null, (data) =>{
        ReactDOM.render(
            <GroupList groups ={data.groups} csrf = {csrfToken} />, document.querySelector("#groups")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <GroupForm csrf ={csrf}/>, document.querySelector("#groupCreation")
    );

    loadGroupsFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
        csrfToken = result.csrfToken;
    });
};

$(document).ready(function() {
    getToken();
});
