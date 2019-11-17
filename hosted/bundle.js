"use strict";

var csrfToken = null;
var handleQuest = function handleQuest(e) {
    e.preventDefault();

    $("#questMessage").animate({ width: 'hide' }, 350);

    if ($("#questName").val() == '' || $("#questExp").val() == '' || $("#questType").val() == '' || $("#questContent").val() == '') {
        handleError("Gamer! All fields are required");
        return false;
    }

    sendAjax('POST', $("#questForm").attr("action"), $("#questForm").serialize(), function () {
        loadQuestsFromServer();
    });

    return false;
};

var completeQuest = function completeQuest(e) {
    e.preventDefault();
};

var deleteQuest = function deleteQuest(e) {
    e.preventDefault();

    //data.quests = $("#questList").props;
    console.log($("#curQuestForm").serialize());

    //Delete in our database and reload quests. 
    sendAjax('POST', $("#curQuestForm").attr("action"), $("#curQuestForm").serialize(), function () {
        loadQuestsFromServer();
    });
};
var changePassword = function changePassword(e) {
    e.preventDefault();

    console.log($("#curQuestForm").serialize());
    sendAjax('POST', $("#changePswdForm").attr("action"), $("#changePswdForm").serialize());
};
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
var ChangePasswordForm = function ChangePasswordForm(props) {
    return React.createElement(
        "form",
        { id: "changePswdForm",
            name: "changePswdForm",
            onSubmit: changePassword,
            action: "/changePswd",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "label",
            { htmlFor: "username" },
            "Username: "
        ),
        React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
        React.createElement(
            "label",
            { htmlFor: "currPass" },
            "Current Password: "
        ),
        React.createElement("input", { id: "currPass", type: "password", name: "currPass", placeholder: "password" }),
        React.createElement(
            "label",
            { htmlFor: "pass" },
            "New Password: "
        ),
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
        React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Confirm Password Change" })
    );
};

var createChangePasswordForm = function createChangePasswordForm(csrf) {
    ReactDOM.render(React.createElement(ChangePasswordForm, { csrf: csrf }), document.querySelector("#pswdChange"));
};

var QuestForm = function QuestForm(props) {
    return React.createElement(
        "form",
        { id: "questForm", name: "questForm",
            onSubmit: handleQuest,
            action: "/maker",
            method: "GET",
            className: "questForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "questName", type: "text", name: "name", placeholder: "Quest Name" }),
        React.createElement(
            "label",
            { htmlFor: "Quest Type" },
            "Quest Type: "
        ),
        React.createElement(
            "select",
            { id: "questType", type: "text", name: "questType", placeholder: "Quest Type" },
            React.createElement(
                "option",
                { value: "Daily" },
                "Daily"
            ),
            React.createElement(
                "option",
                { value: "Weekly" },
                "Weekly"
            ),
            React.createElement(
                "option",
                { value: "Monthly" },
                "Monthly"
            ),
            React.createElement(
                "option",
                { value: "Special" },
                "Special"
            )
        ),
        React.createElement(
            "label",
            { htmlFor: "questExperience" },
            "Quest Experiece: "
        ),
        React.createElement("input", { id: "questExperience", type: "number", name: "questExperience", placeholder: "EXP Reward", min: "0" }),
        React.createElement("textarea", { id: "questContent", "class": "text", name: "questContent", placeholder: "Details of the Quest" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeQuestSubmit", type: "submit", value: "Make Quest" })
    );
};
var QuestList = function QuestList(props) {
    if (props.quests.length === 0) {
        return React.createElement(
            "div",
            { className: "questList" },
            React.createElement(
                "h3",
                { className: "emptyQuest" },
                "No Quests Yet"
            )
        );
    }
    var questNodes = props.quests.map(function (quest) {
        return React.createElement(
            "form",
            { id: "curQuestForm", name: "curQuestForm",
                onSubmit: deleteQuest,
                action: "/deleteQuest",
                method: "POST",
                className: "curQuestForm"
            },
            React.createElement(
                "div",
                { key: quest._id, className: "quest" },
                React.createElement("img", { src: "/assets/img/scrollQuest.png", alt: "domo face", className: "scrollQuest" }),
                React.createElement(
                    "h3",
                    { className: "questName" },
                    "Name: ",
                    quest.name
                ),
                React.createElement(
                    "h3",
                    { className: "questType" },
                    "Quest Type: ",
                    quest.questType
                ),
                React.createElement(
                    "h3",
                    { className: "questExperience" },
                    "EXP: ",
                    quest.questExperience
                ),
                React.createElement(
                    "h4",
                    { className: "questContent" },
                    "Quest Content: ",
                    quest.questContent
                ),
                React.createElement("input", { type: "submit", name: "deleteQuest", value: "Delete Quest" }),
                React.createElement("input", { type: "hidden", name: "_id", value: quest._id }),
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf })
            )
        );
    });
    return React.createElement(
        "div",
        { className: "questList" },
        questNodes
    );
};
var PendingQuestList = function PendingQuestList(props) {
    if (props.quests.length === 0) {
        return React.createElement(
            "div",
            { className: "pendingQuestList" },
            React.createElement(
                "h3",
                { className: "emptyQuest" },
                "No Quests Yet"
            )
        );
    }
    var pendingQuestNodes = props.quests.map(function (quest) {

        return React.createElement(
            "form",
            { id: "pendingQuestForm", name: "pendingQuestForm",
                onSubmit: completeQuest,
                action: "/completeQuest",
                method: "POST",
                className: "curQuestForm"
            },
            React.createElement(
                "div",
                { key: quest._id, className: "quest" },
                React.createElement("img", { src: "/assets/img/scrollQuest.png", alt: "domo face", className: "scrollQuest" }),
                React.createElement(
                    "h3",
                    { className: "questName" },
                    "Name: ",
                    quest.name
                ),
                React.createElement(
                    "h3",
                    { className: "questType" },
                    "Quest Type: ",
                    quest.questType
                ),
                React.createElement(
                    "h3",
                    { className: "questExperience" },
                    "EXP: ",
                    quest.questExperience
                ),
                React.createElement(
                    "h4",
                    { className: "questContent" },
                    "Quest Content: ",
                    quest.questContent
                ),
                React.createElement("input", { type: "submit", name: "deleteQuest", value: "Delete Quest" }),
                React.createElement("input", { type: "hidden", name: "_id", value: quest._id }),
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf })
            )
        );
    });
    return React.createElement(
        "div",
        { className: "pendingQuestList" },
        pendingQuestNodes
    );
};
var AccountData = function AccountData(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "h3",
            { className: "accountName" },
            React.createElement(
                "b",
                null,
                "User:"
            ),
            " ",
            props.account.username,
            " "
        ),
        React.createElement(
            "h3",
            { className: "accountAthletics" },
            React.createElement(
                "b",
                null,
                "Athletics:"
            ),
            " ",
            props.account.athletics
        ),
        React.createElement(
            "h3",
            { className: "accountDexterity" },
            React.createElement(
                "b",
                null,
                "Dexterity:"
            ),
            " ",
            props.account.dexterity
        ),
        React.createElement(
            "h3",
            { className: "accountCharisma" },
            React.createElement(
                "b",
                null,
                "Charisma:"
            ),
            " ",
            props.account.charisma
        )
    );
};

var loadQuestsFromServer = function loadQuestsFromServer() {
    sendAjax('GET', '/getQuests', null, function (data) {
        ReactDOM.render(React.createElement(QuestList, { quests: data.quests, csrf: csrfToken }), document.querySelector("#quests"));
    });
};
var loadPendingQuestsFromServer = function loadPendingQuestsFromServer() {
    sendAjax('GET', '/getPendingQuests', null, function (data) {
        ReactDOM.render(React.createElement(QuestList, { quests: data.quests, csrf: csrfToken }), document.querySelector("#quests"));
    });
};
var loadAccountFromServer = function loadAccountFromServer() {
    sendAjax('GET', '/getAccount', null, function (data) {
        ReactDOM.render(React.createElement(AccountData, { account: data.account }), document.querySelector("#accountData"));
    });
};

var setup = function setup(csrf) {
    var changePswdBtn = document.querySelector("#changePswdBtn");
    changePswdBtn.addEventListener("click", function (e) {
        e.preventDefault();
        createChangePasswordForm(csrf);
        return false;
    });
    ReactDOM.render(React.createElement(QuestForm, { csrf: csrf }), document.querySelector("#makeQuest"));
    ReactDOM.render(React.createElement(QuestList, { csrf: csrf, quests: [] }), document.querySelector("#quests"));
    loadQuestsFromServer();
    loadAccountFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
        csrfToken = result.csrfToken;
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#questMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#questMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
