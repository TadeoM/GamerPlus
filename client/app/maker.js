let csrfToken = null;
let quests = [];
let accountAthletics = 0;
let accountCharisma = 0;
let accountWisdom = 0;

let accountExperience = 0;
let experienceNeeded=1000;

let levelUpJSON = {

}
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
const levelUp = (e) =>{
    e.preventDefault();

    sendAjax('POST',$("#levelUpForm").attr("action"), $("#levelUpForm").serialize(), function(){
        experienceNeeded = experienceNeeded*3;
        
    });

}
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

const changePassword = (e) =>{
    e.preventDefault();

    console.log($("#curQuestForm").serialize());
    sendAjax('POST',$("#changePswdForm").attr("action"), $("#changePswdForm").serialize());
}

const showProfile = (e) => {
    showProfile("PROFILE");
}

const ChangePasswordForm = (props)=>{
    return (
        <form id="changePswdForm" 
            name="changePswdForm"
            onSubmit={changePassword}
            action="/changePswd"
            method="POST"
            className="mainForm"
        >
             <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username"/>
            <label htmlFor="currPass">Current Password: </label>
            <input id="currPass" type="password" name="currPass" placeholder="password"/>
            <label htmlFor="pass">New Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password"/>
            <input id="pass2" type="password" name="pass2" placeholder="password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Confirm Password Change"/>

        </form>
    ); 
};

const createChangePasswordForm =(csrf) => {
    ReactDOM.render(
        <ChangePasswordForm csrf={csrf} />,
        document.querySelector("#pswdChange")
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
    accountAthletics = props.account.athletics;
    accountWisdom = props.account.wisdom;
    accountCharisma = props.account.charisma;
    accountExperience = props.account.experience;
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
                    <h3 className="accountGold"><b>Gold:</b> {props.account.gold}</h3>
                    <h3 className="accountExperience"><b>Experience:</b> {props.account.experience}</h3>
                    <h3 className="accountGem"><b>Gem:</b> {props.account.gem}</h3>
                    <h3 className="accountLevel"><b>Level:</b> {props.account.level}</h3>
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
            <form id="levelUpForm" name="levelUpForm"
            onSubmit="levelUp"
            action="/levelUp"
            method="POST"
            className="levelUpForm"
            >
            <h3 className="accountLevel" name="level">Level:{props.account.level}</h3>
            <h3 className="accountExperience" name="experience">Experience: {props.account.experience}</h3>
            <h3 className="accountExperienceNeeded" name="experienceNeeded">Experience Needed To Level Up: {experienceNeeded}</h3>
 
            <input type="submit" name="levelUp" value="Level Up" />
            <input type="hidden" name="_csrf" value={props.csrf}/>
            </form>
        </div>
    );
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
            <AccountData account={data.account} csrf={csrfToken} />, document.querySelector("#accountData")
        );
        ReactDOM.render(
            <ProfileBar account={data.account} />, document.querySelector("#profileContent")
        );
    });
};

const SetUpDungeon = ()=>
{
    const dungeonBtn = document.querySelector("#goToDungeonButton");

    if(accountAthletics>accountCharisma&& accountAthletics>accountWisdom)
    {
        dungeonBtn.href = "assets/dungeons/AthleticChar.html";
    }
    else if(accountCharisma>accountAthletics && accountCharisma>accountWisdom)
    {
        dungeonBtn.href = "assets/dungeons/CharismaticChar.html";
    }
    else if(accountWisdom>accountAthletics && accountWisdom>accountCharisma)
    {
        dungeonBtn.href = "assets/dungeons/WisdomChar.html";
    }
    else
    {
        dungeonBtn.href = "assets/dungeons/WisdomChar.html";
    }


}

const setup = function(csrf) {
    const changePswdBtn = document.querySelector("#changePswdBtn");
    changePswdBtn.addEventListener("click", (e) => {
        e.preventDefault();
        createChangePasswordForm(csrf);
        return false;
    });
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
    SetUpDungeon();
    
});

