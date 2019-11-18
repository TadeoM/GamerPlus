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

var showProfile = function showProfile(e) {
    showProfile("PROFILE");
};

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
            className: "mainForm"
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
            "div",
            { className: "select" },
            React.createElement(
                "select",
                { id: "questType slct", type: "text", name: "questType", placeholder: "Quest Type" },
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
        console.log(quest._id);
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

var ProfileBar = function ProfileBar(props) {
    return React.createElement(
        "div",
        { className: "profileBox" },
        React.createElement(
            "div",
            null,
            React.createElement("img", { id: "char", src: "/assets/img/BardChar.png", alt: "character" }),
            React.createElement(
                "div",
                { "class": "button" },
                React.createElement(
                    "div",
                    { "class": "btn btn-one" },
                    React.createElement(
                        "a",
                        { href: "/profile" },
                        "To Profile"
                    )
                )
            )
        ),
        React.createElement(
            "h3",
            null,
            React.createElement(
                "span",
                { id: "profileStats" },
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
                    { className: "accountWisdom" },
                    React.createElement(
                        "b",
                        null,
                        "Wisdom:"
                    ),
                    " ",
                    props.account.wisdom
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
            )
        )
    );
};

var AccountData = function AccountData(props) {
    return React.createElement(
        "div",
        null,
        React.createElement("img", { id: "char", src: "/assets/img/BardChar.png", alt: "character" }),
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
        ReactDOM.render(React.createElement(ProfileBar, { account: data.account }), document.querySelector("#profileContent"));
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
    var signupButton = document.querySelector("#profileButton");

    signupButton.addEventListener("click", function (e) {
        e.preventDefault();
        showProfile();
        return false;
    });
    loadAccountFromServer();
    $("#profileContent").animate({ width: 'hide' }, 0);
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
    if ($.ui) {
        (function () {
            var oldEffect = $.fn.effect;
            $.fn.effect = function (effectName) {
                if (effectName === "shake") {
                    var old = $.effects.createWrapper;
                    $.effects.createWrapper = function (element) {
                        var result;
                        var oldCSS = $.fn.css;

                        $.fn.css = function (size) {
                            var _element = this;
                            var hasOwn = Object.prototype.hasOwnProperty;
                            return _element === element && hasOwn.call(size, "width") && hasOwn.call(size, "height") && _element || oldCSS.apply(this, arguments);
                        };

                        result = old.apply(this, arguments);

                        $.fn.css = oldCSS;
                        return result;
                    };
                }
                return oldEffect.apply(this, arguments);
            };
        })();
    }

    $("#errorMessage").text(message);
    $(".mainForm").effect("shake");
    $("#questMessage").animate({ width: 'toggle' }, 350);
    $("#messageArea").animate({ width: 'toggle' }, 0);
};

var showProfile = function showProfile(message) {
    $("#profileContent").animate({ width: 'toggle' }, 350);
};

var showAd = function showAd() {
    $("#ad").animate({ width: 'toggle' }, 350);
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
