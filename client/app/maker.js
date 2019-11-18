let csrfToken = null;

const handleQuest = (e) =>{
    e.preventDefault();

    $("#questMessage").animate({width:'hide'},350);

    if($("#questName").val()==''|| $("#questExp").val()==''||$("#questType").val()==''||$("#questContent").val()=='')
    {
        handleError("Gamer! All fields are required");
        return false;
    }

    sendAjax('POST',$("#questForm").attr("action"), $("#questForm").serialize(), function(){
        loadQuestsFromServer();
        
    });
    
    return false;
};

const completeQuest = (e) =>{
    e.preventDefault();

    sendAjax('POST',$("#pendingQuestForm").attr("action"), $("#pendingQuestForm").serialize(), function(){
        loadPendingQuestsFromServer();
        
    });
}

const deleteQuest = (e) =>{
    e.preventDefault();

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

const QuestForm = (props) =>{
    return(
        <form id="questForm" name="questForm"
        onSubmit ={handleQuest}
        action ="/maker"
        method="GET"
        className ="mainForm"
        >
            <label htmlFor ="name">Name: </label>
            <input id="questName" type="text" name="name" placeholder ="Quest Name"/>
            <label htmlFor ="Quest Type">Quest Type: </label>
            <div className="select">
                <select id="questType slct" type="text" name="questType" placeholder ="Quest Type">
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Special">Special</option>
                </select>
            </div>
            <label htmlFor ="questExperience">Quest Experiece: </label>
            <input id="questExperience" type="number" name="questExperience" placeholder ="EXP Reward" min="0"/>
            <textarea id="questContent" class="text" name="questContent" placeholder ="Details of the Quest"></textarea>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className ="makeQuestSubmit" type="submit" value ="Make Quest"/>
        </form>
    );
};

const QuestList = function(props)
{
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
                <img src="/assets/img/scrollQuest.png" alt="Quest Scroll" className="scrollQuest"/>
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
                <h3 className="emptyQuest">Your Friends Don't Have Quests Yet!</h3>
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
            <img src="/assets/img/scrollQuest.png" alt="Quest Scroll" className="scrollQuest"/>
            <h3 className="questName">Name: {quest.name}</h3>
            <h3 className="questType">Quest Type: {quest.questType}</h3>
            <h3 className="questExperience">EXP: {quest.questExperience}</h3>
            <h4 className="questContent">Quest Content: {quest.questContent}</h4>
            <input type="submit" name="completeQuest" value="Complete Quest" />
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input type="hidden" name="experience" value={quest.questExperience}/>
            <input type="hidden" name="questID" value={quest._id}/>
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
                <img id="char" src="/assets/img/BardChar.png" alt="character"/>
                <div class="button">
                    <div class="btn btn-one">
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
            <img id="char" src="/assets/img/BardChar.png" alt="character"/>
            <h3 className="accountName"><b>User:</b> {props.account.username} </h3>
        </div>
    );
};

const loadQuestsFromServer = () =>{
    sendAjax('GET', '/getQuests', null, (data) =>{
        ReactDOM.render(
            <QuestList quests ={data.quests} csrf = {csrfToken} />, document.querySelector("#quests")
        );
    });
};
const loadPendingQuestsFromServer = () =>{
    sendAjax('GET', '/getFriends', null, (data) =>{
        for (let i = 0; i < data.friends.length; i++) {
            
            sendAjax('GET', '/getUserQuests', data.friends[i].friend, (dataPartTwo) =>{
                console.log(data.friends[i].friend);
                ReactDOM.render(
                    <PendingQuestList quests ={dataPartTwo.quests} csrf = {csrfToken} />, document.querySelector("#pendingQuests")
                );
            });
        };
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
 
    ReactDOM.render(
        <QuestForm csrf ={csrf}/>, document.querySelector("#makeQuest")
    );
    ReactDOM.render(
        <QuestList csrf = {csrf} quests ={[]}/>, document.querySelector("#quests")
    );
    loadQuestsFromServer();
    const signupButton = document.querySelector("#profileButton");

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        showProfile();
        return false;
    });
    loadAccountFromServer();
    loadPendingQuestsFromServer();
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

