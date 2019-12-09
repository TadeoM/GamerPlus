let csrfToken = null;
let groupsListed = []
let groupPage = "";
let quests = [];

const handleQuest = (e) =>{
    e.preventDefault();

    $("#questMessage").animate({width:'hide'},350);
    
    if($("#questName").val()==''|| $("#questExperience").val()==''||$("#questType").val()==''||$(".questContent").val()==''||document.querySelector('#fileData').files.length===0)
    {
        console.log("Missing something");
        handleError("Gamer! All fields are required");
        return false;
    }
    let formData = new FormData();
    let imageData = new FormData();
    let picture = document.querySelector('#fileData').files[0];
    if(picture)
    {
        let imageName = picture.name;
        imageData.append("sampleFile", picture);
        formData.append('imageName', imageName);
    }
    
    let questName = document.querySelector('#questName').value;
    let questExp = document.querySelector('#questExperience').value;
    let a = document.querySelector('#questType');
    let questType = a.options[a.selectedIndex].text;
    let questContent = document.querySelector('.questContent').value;
    console.log(groupPage)
    
    formData.append('questName', questName);
    formData.append('questExp', questExp);
    formData.append('questType', questType);
    formData.append('questContent', questContent);
    formData.append('groupName', groupPage);
    formData.append('_csrf', csrfToken);

    fetch(`/upload?_csrf=${csrfToken}`,
    {
        method: "POST",
        body: imageData,
    })
    .then(
        function(response){
            if(response.status === 200){
                console.log("Image Uploaded");
            }
        }
    );

    fetch(`${$("#questForm").attr("action")}?_csrf=${csrfToken}`,
    {
        method: "POST",
        body: formData,
    })
    .then(
        function(response){
            if(response.status === 200){
                console.log("Quest made");
                loadGroupQuestsFromServer();
            }
        }
    );
    
    return false;
};

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
            loadGroupsFromServer();
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
            <label>Group Creation</label>
            <label htmlFor ="name">Name: </label>
            <input id="groupName" type="text" name="name" placeholder ="Group Name"/>
            <input id="groupOwner" type="checkbox" name="owner" value="owner" /> Owner<br></br>
            <label htmlFor ="newMember">New Member: </label>
            <input id="groupMember" type="text" name="newMember" placeholder ="New Member"/>
            <input type="hidden" name="_csrf" value={csrfToken}/>
            <input className ="makeGroupSubmit" type="submit" value ="Make Group"/>
            <a href="/groupPage" className="navButton" id="groupButton">All Groups</a>
        </form>
    );
};

const QuestForm = (props) =>{
    return(
        <form id="questForm" name="questForm"
        onSubmit ={handleQuest}
        action ="/maker"
        encType="multipart/form-data"
        className ="mainForm"
        >
            <div className="col-1 questBox">
                <label htmlFor ="name">Name: </label>
                <input id="questName" type="text" name="name" placeholder ="Quest Name"/>
            </div>
            <div className="col-2 questBox">
                <label htmlFor ="Quest Type">Quest Type: </label>
                <div className="select">
                    <select id="questType" type="text" name="questType" placeholder ="Quest Type">
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Special">Special</option>
                    </select>
                </div>
            </div>

            <div className="col-1 questBox">
                <label htmlFor ="questExperience">Quest Experiece: </label>
                <input id="questExperience" type="number" name="questExperience" placeholder ="EXP Reward" min="0"/>
            </div>
            <div className="col-2 questBox">
                <input type="file" name="sampleFile" id="fileData" />
            </div>
            
            <textarea id="questContent" className="questContent" name="questContent" placeholder ="Details of the Quest"></textarea>
            <input type="hidden" name="_csrf" value={csrfToken}/>
            <input id="groupName" type="hidden" name="groupName" value={groupName} />
            <input type="hidden" name="_csrf" value={csrfToken}/>
            <input className ="makeQuestSubmit" type="submit" value ="Make Quest"/>
        </form>
    );
};

const QuestList = function(props)
{
    console.log(props.quests.length);
    if(props.quests.length === 0)
    {
        return(
            <div className="questList">
                <h3 className="emptyQuest">No Quests Yet</h3>
            </div>
        );
    }
    
    const questNodes = props.quests.map(function(quest)
    {
        return(
            <form id="curQuestForm" name ="curQuestForm"
                onSubmit ={deleteQuest}
                action ="/deleteQuest"
                method="POST"
                className="curQuestForm"
                >
            <div key={quest._id} className="quest">
                <img src={`/retrieve?name=${quest.imageName}`} alt="domo face" className="scrollQuest"/>
                <h3 className="questName">Name: {quest.name}</h3>
                <h3 className="questType">Quest Type: {quest.questType}</h3>
                <h3 className="questExperience">EXP: {quest.questExperience}</h3>
                <h4 className="questContent">Quest Content: {quest.questContent}</h4>
                <input type="submit" name="deleteQuest" value="Delete Quest" />
                <input type ="hidden" name ="_id" value ={quest._id}/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
            </div>
            </form>
        );
    });
    return (
        <div className="questList">
            {questNodes}
        </div>
    );
};

const loadGroupQuestsFromServer = () =>{
    console.log("Trying to Load Quests")
    sendAjax('GET', `/getGroupQuests?groupName=${groupPage}`, null, (data) =>{
        ReactDOM.render(
            <QuestList quests ={quests} csrf = {csrfToken} />, document.querySelector("#quests")
        );
    });
};

const showGroup = (groupName) => {
    groupPage = groupName;
    sendAjax('GET', `/getGroup?groupName=${groupName}`, null, (data) =>{
        ReactDOM.render(
            <QuestForm groupName={groupPage} csrf ={csrfToken}/>, document.querySelector("#groups")
        );
        sendAjax('GET', `/getGroupQuests?groupName=${groupPage}`, null, (questData) =>{
            console.log(questData);
        });
    });
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
    groupsListed = [];
    
    const groupNodes = props.groups.map(function(group)
    {
        if(!groupsListed.includes(group.groupName)){
            groupsListed.push(group.groupName);
            return(
                <div key={group._id} className="quest">
                    <h3 className="groupName">Name: {group.groupName}</h3>
                    <div className="button groupButtons">
                        <div className="btn btn-one">
                            <a name={`${group.groupName}`} onClick={() => showGroup(group.groupName)}>Group Page Link</a>
                        </div>
                    </div>
                    
                    <input type="hidden" name="_csrf" value={props.csrf}/>
                </div>
            );
        }
        
    });
    return (
        <div className="groupList">
            <a></a>
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
    var urlParams = new URLSearchParams(window.location.search);
    const hasGroup = urlParams.has('group'); 
    const groupToShow = urlParams.get('group'); // "edit"
    ReactDOM.render(
        <GroupForm csrf ={csrf}/>, document.querySelector("#groupCreation")
    );
    if(hasGroup) {
        showGroup(groupToShow);
    }
    else {    
        loadGroupsFromServer();
    }

    
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
