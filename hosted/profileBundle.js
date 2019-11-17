"use strict";

var handleFriend = function handleFriend(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
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
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "friendName", type: "text", name: "name", placeholder: "Domo Name" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeFriendSubmit", type: "submit", value: "Add Friend" })
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
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "friend face", className: "friendFace" }),
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

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(FriendForm, { csrf: csrf }), document.querySelector("#addFriend"));
    showFriends();
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
    $("#messageArea").animate({ width: 'toggle' }, 0);
    $(".mainForm").effect("shake");
};

var showProfile = function showProfile(message) {
    $("#profileContent").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
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
