"use strict";

var csrfToken = null;
var groupsListed = [];
var groupPage = "";
var quests = [];

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
    console.log(groupPage);

    formData.append('questName', questName);
    formData.append('questExp', questExp);
    formData.append('questType', questType);
    formData.append('questContent', questContent);
    formData.append('groupName', groupPage);
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
            loadGroupQuestsFromServer();
        }
    });

    return false;
};

var handleGroup = function handleGroup(e) {
    e.preventDefault();

    $("#groupMessage").animate({ width: 'hide' }, 350);

    if ($("#groupName").val() == '' || $("#groupOwner").val() == '') {
        handleError("Gamer! All fields are required");
        return false;
    }

    var formData = new FormData();
    var groupName = document.querySelector('#groupName').value;
    var groupOwner = document.querySelector('#groupOwner').checked;
    var groupMember = document.querySelector('#groupMember').value;

    formData.append('groupName', groupName);
    formData.append('groupOwner', groupOwner);
    formData.append('groupMember', groupMember);
    formData.append('_csrf', csrfToken);

    fetch("/addMember?_csrf=" + csrfToken, {
        method: "POST",
        body: formData
    }).then(function (response) {
        loadGroupsFromServer();
    });

    return false;
};

var GroupForm = function GroupForm(props) {
    return React.createElement(
        "form",
        { id: "groupForm", name: "groupForm",
            onSubmit: handleGroup,
            action: "/addMember",
            encType: "multipart/form-data",
            className: "mainForm"
        },
        React.createElement(
            "label",
            null,
            "Group Creation"
        ),
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "groupName", type: "text", name: "name", placeholder: "Group Name" }),
        React.createElement("input", { id: "groupOwner", type: "checkbox", name: "owner", value: "owner" }),
        " Owner",
        React.createElement("br", null),
        React.createElement(
            "label",
            { htmlFor: "newMember" },
            "New Member: "
        ),
        React.createElement("input", { id: "groupMember", type: "text", name: "newMember", placeholder: "New Member" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: csrfToken }),
        React.createElement("input", { className: "makeGroupSubmit", type: "submit", value: "Make Group" }),
        React.createElement(
            "a",
            { href: "/groupPage", className: "navButton", id: "groupButton" },
            "All Groups"
        )
    );
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
        React.createElement("input", { id: "groupName", type: "hidden", name: "groupName", value: groupName }),
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

var loadGroupQuestsFromServer = function loadGroupQuestsFromServer() {
    console.log("Trying to Load Quests");
    sendAjax('GET', "/getGroupQuests?groupName=" + groupPage, null, function (data) {
        ReactDOM.render(React.createElement(QuestList, { quests: quests, csrf: csrfToken }), document.querySelector("#quests"));
    });
};

var showGroup = function showGroup(groupName) {
    groupPage = groupName;
    sendAjax('GET', "/getGroup?groupName=" + groupName, null, function (data) {
        ReactDOM.render(React.createElement(QuestForm, { groupName: groupPage, csrf: csrfToken }), document.querySelector("#groups"));
        sendAjax('GET', "/getGroupQuests?groupName=" + groupPage, null, function (questData) {
            console.log(questData);
        });
    });
};

var GroupList = function GroupList(props) {
    if (props.groups.length === 0) {
        return React.createElement(
            "div",
            { className: "groupList" },
            React.createElement(
                "h3",
                { className: "emptyGroup" },
                "No Groups Yet"
            )
        );
    }
    groupsListed = [];

    var groupNodes = props.groups.map(function (group) {
        if (!groupsListed.includes(group.groupName)) {
            groupsListed.push(group.groupName);
            return React.createElement(
                "div",
                { key: group._id, className: "quest" },
                React.createElement(
                    "h3",
                    { className: "groupName" },
                    "Name: ",
                    group.groupName
                ),
                React.createElement(
                    "div",
                    { className: "button groupButtons" },
                    React.createElement(
                        "div",
                        { className: "btn btn-one" },
                        React.createElement(
                            "a",
                            { name: "" + group.groupName, onClick: function onClick() {
                                    return showGroup(group.groupName);
                                } },
                            "Group Page Link"
                        )
                    )
                ),
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf })
            );
        }
    });
    return React.createElement(
        "div",
        { className: "groupList" },
        React.createElement("a", null),
        groupNodes
    );
};

var loadGroupsFromServer = function loadGroupsFromServer() {
    sendAjax('GET', '/getGroups', null, function (data) {
        ReactDOM.render(React.createElement(GroupList, { groups: data.groups, csrf: csrfToken }), document.querySelector("#groups"));
    });
};

var setup = function setup(csrf) {
    var urlParams = new URLSearchParams(window.location.search);
    var hasGroup = urlParams.has('group');
    var groupToShow = urlParams.get('group'); // "edit"
    ReactDOM.render(React.createElement(GroupForm, { csrf: csrf }), document.querySelector("#groupCreation"));
    if (hasGroup) {
        showGroup(groupToShow);
    } else {
        loadGroupsFromServer();
    }
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
