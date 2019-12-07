"use strict";

var csrfToken = null;

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
        console.log("FUCK");
        if (response.status === 200) {
            console.log("Group made");
            loadGroupsFromServer();
        } else {
            console.log("response.error");
        }
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
        React.createElement("input", { className: "makeGroupSubmit", type: "submit", value: "Make Quest" })
    );
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
    var groupNodes = props.groups.map(function (group) {
        console.log(group.groupOwner);
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
                "h3",
                { className: "groupOwner" },
                "Group Owner: ",
                group.groupOwner.toString()
            ),
            React.createElement(
                "h4",
                { className: "groupMember" },
                "Group Member: ",
                group.groupMember
            ),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf })
        );
    });
    return React.createElement(
        "div",
        { className: "groupList" },
        groupNodes
    );
};

var loadGroupsFromServer = function loadGroupsFromServer() {
    sendAjax('GET', '/getGroups', null, function (data) {
        ReactDOM.render(React.createElement(GroupList, { groups: data.groups, csrf: csrfToken }), document.querySelector("#groups"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(GroupForm, { csrf: csrf }), document.querySelector("#groupCreation"));

    loadGroupsFromServer();
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
