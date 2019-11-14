// add after fix to part 30
const handleQuest = (e) =>{
    e.preventDefault();

    $("#questMessage").animate({width:'hide'},350);

    if($("#questName").val()==''|| $("#questExp").val()==''||$("#questType").val()=='')
    {
        handleError("Rawr! All fields are required");
        return false;
    }

    sendAjax('POST',$("#questForm").attr("action"), $("#questForm").serialize(), function(){
        loadQuestsFromServer();
        
    });
    
    return false;
};

const deleteQuest = (e) =>{
    e.preventDefault();

    
    //data.quests = $("#questList").props;
    console.log( $("#curQuestForm").serialize());

    //Delete in our database and reload quests. 
    sendAjax('GET',$("#curQuestForm").attr("action"), $("#curQuestForm").serialize(), function(){
        loadQuestsFromServer();
        
    });
    
}
///Editing Quests///
/*
const editQuest = (props) =>{
    e.preventDefault();
    sendAjax('POST',$("#editQuestForm").attr("action"), $("#editQuestForm").serialize(),function(){
        loadQuestsFromServer();
        
    });
};
const editQuestForm = function(props)
{
    const editAbleQuest=props.quests.map(function(quest)
{
    return(
        <form id="editQuestForm" name="editQuestForm"
        onSubmit ={handleQuest}
        action ="/editQuest"
        method="POST"
        className ="questForm"
        >
            <label htmlFor ="name">Name: </label>
            <input id="questName" type="text" name="name" placeholder ="Quest Name"/>
            <label htmlFor ="Quest Type">Quest Type: </label>
            <select id="questType" type="text" name="questType" placeholder ="Quest Type" onChange={handleChange}>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Special">Special</option>
                </select>
            <label htmlFor ="questExperience">Quest Experiece: </label>
            <input id="questExperience" type="number" name="questExperience" placeholder ="EXP Reward"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className ="makeQuestSubmit" type="submit" value ="Make Quest"/>
            </form>
    );
});
   return(
    <div className="editQuestForm">
        {questForm}
    </div>
   );
}
*/

const QuestForm = (props) =>{
    return(
        <form id="questForm" name="questForm"
        onSubmit ={handleQuest}
        action ="/maker"
        method="GET"
        className ="questForm"
        >
            <label htmlFor ="name">Name: </label>
            <input id="questName" type="text" name="name" placeholder ="Quest Name"/>
            <label htmlFor ="Quest Type">Quest Type: </label>
            <select id="questType" type="text" name="questType" placeholder ="Quest Type">
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Special">Special</option>
                </select>
            <label htmlFor ="questExperience">Quest Experiece: </label>
            <input id="questExperience" type="number" name="questExperience" placeholder ="EXP Reward" min="0"/>
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
    console.log(quest._id);
    return(
        <form id="curQuestForm" name ="curQuestForm"
            onSubmit ={deleteQuest}
            action ="/deleteQuest"
            method="POST"
            className="curQuestForm"
            >
        <div key={quest._id} className="quest">
            <img src="/assets/img/scrollQuest.png" alt="domo face" className="scrollQuest"/>
            <h3 className="questName">Name: {quest.name}</h3>
            <h3 className="questType">Quest Type: {quest.questType}</h3>
            <h3 className="questExperience">EXP: {quest.questExperience}</h3>
            <input type="submit" name="deleteQuest" value="Delete Quest" />
            <input type ="hidden" name ="_id" value ={quest._id}/>
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
const AccountData = function(props) {
    return (
        <div >
            <h3 className="accountName"><b>User:</b> {props.account.username} </h3>
            <h3 className="accountAthletics"><b>Athletics:</b> {props.account.athletics}</h3>
            <h3 className="accountDexterity"><b>Dexterity:</b> {props.account.dexterity}</h3>
            <h3 className="accountCharisma"><b>Charisma:</b> {props.account.charisma}</h3>
        </div>
    );
};

const loadQuestsFromServer = () =>{
    sendAjax('GET', '/getQuests', null, (data) =>{
        ReactDOM.render(
            <QuestList quests ={data.quests}/>, document.querySelector("#quests")
        );
    });
};
const loadAccountFromServer = () => {
    sendAjax('GET', '/getAccount', null, (data) =>{
        ReactDOM.render(
            <AccountData account={data.account} />, document.querySelector("#accountData")
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
    loadAccountFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});

