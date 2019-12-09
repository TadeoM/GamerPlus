"use strict";

var csrfToken = null;
var quests = [];
var accountAthletics = 0;
var accountCharisma = 0;
var accountWisdom = 0;

var accountExperience = 0;
var experienceNeeded = 1000;

var levelUpJSON = {};
var handleQuest = function handleQuest(e) {
    e.preventDefault();

    $("#questMessage").animate({ width: 'hide' }, 350);

    if ($("#questName").val() == '' || $("#questExperience").val() == '' || $("#questType").val() == '' || $(".questContent").val() == '' || document.querySelector('#fileData').files.length === 0) {
        console.log("Missing something");
        handleError("Gamer! All fields are required");
        return false;
    }
    var formData = new FormData();
    var imageData = new FormData();
    var picture = document.querySelector('#fileData').files[0];
    if (picture) {
        var imageName = picture.name;
        imageData.append("sampleFile", picture);
        formData.append('imageName', imageName);
    }

    var questName = document.querySelector('#questName').value;
    var questExp = document.querySelector('#questExperience').value;
    var a = document.querySelector('#questType');
    var questType = a.options[a.selectedIndex].text;
    var questContent = document.querySelector('.questContent').value;

    formData.append('questName', questName);
    formData.append('questExp', questExp);
    formData.append('questType', questType);
    formData.append('questContent', questContent);

    formData.append('_csrf', csrfToken);

    fetch("/upload?_csrf=" + csrfToken, {
        method: "POST",
        body: imageData
    }).then(function (response) {
        if (response.status === 200) {
            console.log("Image Uploaded");
        }
    });

    fetch($("#questForm").attr("action") + "?_csrf=" + csrfToken, {
        method: "POST",
        body: formData
    }).then(function (response) {
        if (response.status === 200) {
            console.log("Quest made");
            loadQuestsFromServer();
        }
    });

    return false;
};
var levelUp = function levelUp(e) {
    e.preventDefault();

    sendAjax('POST', $("#levelUpForm").attr("action"), $("#levelUpForm").serialize(), function () {
        experienceNeeded = experienceNeeded * 3;
    });
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
            encType: "multipart/form-data",
            className: "mainForm"
        },
        React.createElement(
            "div",
            { className: "col-1 questBox" },
            React.createElement(
                "label",
                { htmlFor: "name" },
                "Name: "
            ),
            React.createElement("input", { id: "questName", type: "text", name: "name", placeholder: "Quest Name" })
        ),
        React.createElement(
            "div",
            { className: "col-2 questBox" },
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
                )
            )
        ),
        React.createElement(
            "div",
            { className: "col-1 questBox" },
            React.createElement(
                "label",
                { htmlFor: "questExperience" },
                "Quest Experiece: "
            ),
            React.createElement("input", { id: "questExperience", type: "number", name: "questExperience", placeholder: "EXP Reward", min: "0" })
        ),
        React.createElement(
            "div",
            { className: "col-2 questBox" },
            React.createElement("input", { type: "file", name: "sampleFile", id: "fileData" })
        ),
        React.createElement("textarea", { id: "questContent", className: "questContent", name: "questContent", placeholder: "Details of the Quest" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: csrfToken }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: csrfToken }),
        React.createElement("input", { className: "makeQuestSubmit", type: "submit", value: "Make Quest" })
    );
};

var QuestList = function QuestList(props) {
    console.log(props.quests.length);
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
                React.createElement("img", { src: "/retrieve?name=" + quest.imageName, alt: "domo face", className: "scrollQuest" }),
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
    accountAthletics = props.account.athletics;
    accountWisdom = props.account.wisdom;
    accountCharisma = props.account.charisma;
    accountExperience = props.account.experience;
    return React.createElement(
        "div",
        { className: "profileBox" },
        React.createElement(
            "div",
            null,
            React.createElement("img", { id: "char", src: "/assets/img/" + props.account.profilePic, alt: "character" }),
            React.createElement(
                "div",
                { className: "button", id: "profileBar" },
                React.createElement(
                    "div",
                    { className: "btn btn-one" },
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
                ),
                React.createElement(
                    "h3",
                    { className: "accountGold" },
                    React.createElement(
                        "b",
                        null,
                        "Gold:"
                    ),
                    " ",
                    props.account.gold
                ),
                React.createElement(
                    "h3",
                    { className: "accountExperience" },
                    React.createElement(
                        "b",
                        null,
                        "Experience:"
                    ),
                    " ",
                    props.account.experience
                ),
                React.createElement(
                    "h3",
                    { className: "accountGem" },
                    React.createElement(
                        "b",
                        null,
                        "Gem:"
                    ),
                    " ",
                    props.account.gem
                ),
                React.createElement(
                    "h3",
                    { className: "accountLevel" },
                    React.createElement(
                        "b",
                        null,
                        "Level:"
                    ),
                    " ",
                    props.account.level
                )
            )
        )
    );
};

var AccountData = function AccountData(props) {
    return React.createElement(
        "div",
        null,
        React.createElement("img", { id: "char", src: "/assets/img/" + props.account.profilePic, alt: "character" }),
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
            "form",
            { id: "levelUpForm", name: "levelUpForm",
                onSubmit: "levelUp",
                action: "/levelUp",
                method: "POST",
                className: "levelUpForm"
            },
            React.createElement(
                "h3",
                { className: "accountLevel", name: "level" },
                "Level:",
                props.account.level
            ),
            React.createElement(
                "h3",
                { className: "accountExperience", name: "experience" },
                "Experience: ",
                props.account.experience
            ),
            React.createElement(
                "h3",
                { className: "accountExperienceNeeded", name: "experienceNeeded" },
                "Experience Needed To Level Up: ",
                experienceNeeded
            ),
            React.createElement("input", { type: "submit", name: "levelUp", value: "Level Up" }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf })
        )
    );
};

var loadQuestsFromServer = function loadQuestsFromServer() {
    sendAjax('GET', '/getQuests', null, function (data) {
        for (var j = 0; j < data.quests.length; j++) {
            quests.push(data.quests[j]);
        }
        sendAjax('GET', '/getFriends', null, function (friendData) {
            var _loop = function _loop(i) {
                sendAjax('GET', "/getAccount?user=" + friendData.friends[i].friend, null, function (friendAccount) {
                    sendAjax('GET', "/getQuests?user=" + friendAccount.account._id, null, function (friendQuestData) {
                        for (var _j = 0; _j < friendQuestData.quests.length; _j++) {
                            quests.push(friendQuestData.quests[_j]);
                        }
                        if (i === friendData.friends.length - 1) {
                            ReactDOM.render(React.createElement(QuestList, { quests: quests, csrf: csrfToken }), document.querySelector("#quests"));
                        }
                    });
                });
            };

            for (var i = 0; i < friendData.friends.length; i++) {
                _loop(i);
            }
        });
    });
};
var loadPendingQuestsFromServer = function loadPendingQuestsFromServer() {
    sendAjax('GET', '/getPendingQuests', null, function (data) {
        ReactDOM.render(React.createElement(QuestList, { quests: data.quests, csrf: csrfToken }), document.querySelector("#quests"));
    });
};
var loadAccountFromServer = function loadAccountFromServer() {
    sendAjax('GET', '/getAccount', null, function (data) {
        ReactDOM.render(React.createElement(AccountData, { account: data.account, csrf: csrfToken }), document.querySelector("#accountData"));
        ReactDOM.render(React.createElement(ProfileBar, { account: data.account }), document.querySelector("#profileContent"));
    });
};

var SetUpDungeon = function SetUpDungeon() {
    var dungeonBtn = document.querySelector("#goToDungeonButton");

    if (accountAthletics > accountCharisma && accountAthletics > accountWisdom) {
        dungeonBtn.href = "assets/dungeons/AthleticChar.html";
    } else if (accountCharisma > accountAthletics && accountCharisma > accountWisdom) {
        dungeonBtn.href = "assets/dungeons/CharismaticChar.html";
    } else if (accountWisdom > accountAthletics && accountWisdom > accountCharisma) {
        dungeonBtn.href = "assets/dungeons/WisdomChar.html";
    } else {
        dungeonBtn.href = "assets/dungeons/WisdomChar.html";
    }
};

var setup = function setup(csrf) {
    var changePswdBtn = document.querySelector("#changePswdBtn");
    changePswdBtn.addEventListener("click", function (e) {
        e.preventDefault();
        createChangePasswordForm(csrf);
        return false;
    });
    ReactDOM.render(React.createElement(QuestForm, { csrf: csrf }), document.querySelector("#makeQuest"));
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
    SetUpDungeon();
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
