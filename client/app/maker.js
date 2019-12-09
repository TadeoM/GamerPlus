let csrfToken = null;
let groupsListed = []
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
    
    formData.append('questName', questName);
    formData.append('questExp', questExp);
    formData.append('questType', questType);
    formData.append('questContent', questContent);
    
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
                loadQuestsFromServer();
            }
        }
    );
    
    return false;
};

const completeQuest = (e) =>{
    e.preventDefault();
}

const deleteQuest = (e) =>{
    e.preventDefault();

    
    //data.quests = $("#questList").props;
    console.log( $("#curQuestForm").serialize());

    //Delete in our database and reload quests. 
    sendAjax('POST',$("#curQuestForm").attr("action"), $("#curQuestForm").serialize(), function(){
        loadQuestsFromServer();
        
    });
    
}



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
const PendingQuestList = function(props)
{
    if(props.quests.length === 0)
    {
        return(
            <div className="pendingQuestList">
                <h3 className="emptyQuest">No Quests Yet</h3>
            </div>
        );
    }
const pendingQuestNodes = props.quests.map(function(quest)
{
    return(
        <form id="pendingQuestForm" name ="pendingQuestForm"
            onSubmit ={completeQuest}
            action ="/completeQuest"
            method="POST"
            className="curQuestForm"
        >
        <div key={quest._id} className="quest">
            <img src="/assets/img/scrollQuest.png" alt="domo face" className="scrollQuest"/>
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
    <div className="pendingQuestList">
        {pendingQuestNodes}
    </div>
);
};

const ProfileBar = function(props) {
    return (
        <div className="profileBox">
            <div> 
                <img id="char" src={`/assets/img/${props.account.profilePic}`} alt="character"/>
                <div className="button" id="profileBar">
                    <div className="btn btn-one">
                        <a href="/profile">To Profile</a>
                    </div>
                </div>
            </div>
            <h3>
                <span id="profileStats">
                    <h3 className="accountName"><b>User:</b> {props.account.username} </h3>
                    <h3 className="accountAthletics"><b>Athletics:</b> {props.account.athletics}</h3>
                    <h3 className="accountWisdom"><b>Wisdom:</b> {props.account.wisdom}</h3>
                    <h3 className="accountCharisma"><b>Charisma:</b> {props.account.charisma}</h3>
                </span>
            </h3>
        </div>
    );
};

const AccountData = function(props) {
    return (
        <div>
            <img id="char" src={`/assets/img/${props.account.profilePic}`} alt="character"/>
            <h3 className="accountName"><b>User:</b> {props.account.username} </h3>
        </div>
    );
};

const GroupList = function(props)
{
    if(props.groups.length === 0)
    {
        return(
            <div className="groupList">
                <h3 className="emptyGroup">No Groups Yet</h3>
                <div className="button groupButtons">
                    <div className="btn btn-one">
                        <a href="/groupPage" className="navButton" id="groupButton">Join More Groups</a>
                    </div>
                </div>
            </div>
        );
    }
    groupsListed = []
    
    const groupNodes = props.groups.map(function(group)
    {
        if(!groupsListed.includes(group.groupName)){
            groupsListed.push(group.groupName);
            return(
                <div key={group._id} className="quest">
                    <h3 className="groupName">Name: {group.groupName}</h3>
                    <div className="button groupButtons">
                        <div className="btn btn-one">
                        <a href={`/groupPage?group=${group.groupName}`} name={`${group.groupName}`}>Group Page Link</a>
                        </div>
                    </div>
                    <input type="hidden" name="_csrf" value={props.csrf}/>
                </div>
            );
        }
    });
    return (
        <div className="groupList">
            {groupNodes}
            <div className="button groupButtons">
                <div className="btn btn-one">
                    <a href="/groupPage" className="navButton" id="groupButton">Join More Groups</a>
                </div>
            </div>
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

const loadQuestsFromServer = () =>{
    sendAjax('GET', '/getQuests', null, (data) =>{
        for(let j = 0; j < data.quests.length; j++){
            quests.push(data.quests[j]);
        }
        sendAjax('GET', '/getFriends', null, (friendData) => {
            for(let i = 0; i < friendData.friends.length; i++){
                sendAjax('GET', `/getAccount?user=${friendData.friends[i].friend}`, null, (friendAccount) => {
                    sendAjax('GET', `/getQuests?user=${friendAccount.account._id}`, null, (friendQuestData) => {
                        for(let j = 0; j < friendQuestData.quests.length; j++){
                            quests.push(friendQuestData.quests[j]);
                        }
                        if (i === friendData.friends.length -1 ){
                            ReactDOM.render(
                                <QuestList quests ={quests} csrf = {csrfToken} />, document.querySelector("#quests")
                            );
                        }
                    });
                });
            }
        });
    });
    console.log(quests)
    console.log(quests.length)
    
};
const loadPendingQuestsFromServer = () =>{
    sendAjax('GET', '/getPendingQuests', null, (data) =>{
        ReactDOM.render(
            <QuestList quests ={data.quests} csrf = {csrfToken} />, document.querySelector("#quests")
        );
    });
};
const loadAccountFromServer = () => {
    sendAjax('GET', '/getAccount', null, (data) =>{
        ReactDOM.render(
            <AccountData account={data.account} />, document.querySelector("#accountData")
        );
        ReactDOM.render(
            <ProfileBar account={data.account} />, document.querySelector("#profileContent")
        );
    });
};

const setup = function(csrf) {
    
    loadGroupsFromServer();
    ReactDOM.render(
        <QuestForm csrf ={csrf}/>, document.querySelector("#makeQuest")
    );
    loadQuestsFromServer();
    const signupButton = document.querySelector("#profileButton");

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        showProfile();
        return false;
    });
    loadAccountFromServer();
    
    $("#profileContent").animate({ width:'hide'}, 0);
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

