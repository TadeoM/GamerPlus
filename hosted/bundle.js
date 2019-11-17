"use strict";

// add after fix to part 30

var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer();
    });

    return false;
};

var showProfile = function showProfile(e) {
    showProfile("PROFILE");
};

var DomoForm = function DomoForm(props) {
    return React.createElement(
        "form",
        { id: "domoForm",
            onSubmit: handleDomo,
            name: "domoForm",
            action: "/maker",
            method: "POST",
            className: "domoForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
        React.createElement(
            "label",
            { htmlFor: "age" },
            "Age: "
        ),
        React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: "Domo Age" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
    );
};

var DomoList = function DomoList(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No Domos yet"
            )
        );
    }

    var domoNodes = props.domos.map(function (domo) {
        return React.createElement(
            "div",
            { key: domo._id, className: "domo" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "domoName" },
                "Name: ",
                domo.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "domoAge" },
                "Age: ",
                domo.age,
                " "
            )
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        domoNodes
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
                "button",
                null,
                "To Profile"
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

var loadDomosFromServer = function loadDomosFromServer() {
    sendAjax('GET', '/getDomos', null, function (data) {
        ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
    });
};

var loadAccountFromServer = function loadAccountFromServer() {
    sendAjax('GET', '/getAccount', null, function (data) {
        console.log(data.account.athletics);
        ReactDOM.render(React.createElement(AccountData, { account: data.account }), document.querySelector("#accountData"));
        ReactDOM.render(React.createElement(ProfileBar, { account: data.account }), document.querySelector("#profileContent"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));

    var signupButton = document.querySelector("#profileButton");

    signupButton.addEventListener("click", function (e) {
        e.preventDefault();
        showProfile();
        return false;
    });

    loadDomosFromServer();
    loadAccountFromServer();
    $("#profileContent").animate({ width: 'hide' }, 0);
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
