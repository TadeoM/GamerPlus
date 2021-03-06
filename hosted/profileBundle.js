"use strict";

var handleFriend = function handleFriend(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#friendName").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#friendForm").attr("action"), $("#friendForm").serialize(), function () {
        showFriends();
    });

    return false;
};

var FriendForm = function FriendForm(props) {
    return React.createElement(
        "form",
        {
            id: "friendForm",
            onSubmit: handleFriend,
            name: "friendForm",
            action: "/addFriend",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "label",
            { htmlFor: "friendName" },
            "Friend Name: "
        ),
        React.createElement("input", { id: "friendName", type: "text", name: "friendName", placeholder: "Friend Name" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeFriendSubmit", type: "submit", value: "Add Friend" })
    );
};

var showFriends = function showFriends(props) {
    sendAjax('GET', '/getFriends', null, function (data) {
        console.log(data.friends);
        ReactDOM.render(React.createElement(FriendList, { friends: data.friends }), document.querySelector("#friendList"));
    });
};

var FriendList = function FriendList(props) {
    if (props.friends.length === 0) {
        return React.createElement(
            "div",
            { className: "friendList" },
            React.createElement(
                "h3",
                { className: "emptyFriend" },
                "No Friends yet, loser"
            )
        );
    }

    var friendNodes = props.friends.map(function (friend) {
        return React.createElement(
            "div",
            { key: friend.user, className: "friend" },
            React.createElement("img", { src: "/assets/img/gamifyLife.png", alt: "friend face", className: "friendFace" }),
            React.createElement(
                "h3",
                { className: "friendName" },
                "Name: ",
                friend.friend,
                " "
            )
        );
    });

    return React.createElement(
        "div",
        { className: "friendList" },
        friendNodes
    );
};

var AccountData = function AccountData(props) {
    console.log(props.account);
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
            { className: "accountGem" },
            React.createElement(
                "b",
                null,
                "Gems:"
            ),
            " ",
            props.account.gem
        )
    );
};

var loadAccountFromServer = function loadAccountFromServer() {
    sendAjax('GET', '/getAccount', null, function (data) {
        ReactDOM.render(React.createElement(AccountData, { account: data.account }), document.querySelector("#accountData"));
    });
};

var showPasswordChange = function showPasswordChange() {
    $("#changePswdForm").animate({ width: 'toggle' }, 5);
};

var changePassword = function changePassword(e) {
    e.preventDefault();

    console.log($("#curQuestForm").serialize());
    sendAjax('POST', $("#changePswdForm").attr("action"), $("#changePswdForm").serialize(), function () {
        showPasswordChange();
    });
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

var setup = function setup(csrf) {
    var changePswdBtn = document.querySelector("#changePswdBtn");
    createChangePasswordForm(csrf);
    changePswdBtn.addEventListener("click", function (e) {
        e.preventDefault();
        showPasswordChange();
        return false;
    });
    ReactDOM.render(React.createElement(FriendForm, { csrf: csrf }), document.querySelector("#addFriend"));

    showPasswordChange();
    showFriends();
    loadAccountFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
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
    // $(".mainForm").effect("shake");
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
