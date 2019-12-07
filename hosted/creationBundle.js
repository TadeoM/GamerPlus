"use strict";

var csrfToken = null;
var handleCreation = function handleCreation(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    var maxTotal = 10;

    var athletics = $("#accountAthletics");
    var wisdom = $("#accountWisdom");
    var charisma = $("#accountCharisma");

    if (athletics.val() == '' || wisdom.val() == '' || charisma.val() == '') {
        handleError("RAWR! Fill in the stats you fuck.");
        return false;
    }

    var currentTotal = Number(athletics.val()) + Number(wisdom.val()) + Number(charisma.val());

    if (currentTotal < maxTotal) {
        handleError("You still have stats to allocate dumbass!");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    var selections = document.querySelector(".slider").children;
    for (var i = 0; i < selections.length; i++) {
        if (selections[i].checked) {
            $("#profilePic")[0].value = selections[i].title;
        }
    }

    sendAjax('POST', $("#accountForm").attr("action"), $("#accountForm").serialize(), redirect);

    return false;
};

var AccountForm = function AccountForm(props) {
    return React.createElement(
        "form",
        { id: "accountForm",
            onSubmit: handleCreation,
            name: "accountForm",
            action: "/creator",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "div",
            { id: "messageArea" },
            React.createElement(
                "h3",
                null,
                React.createElement(
                    "span",
                    { id: "errorMessage" },
                    "Wrong username or password"
                )
            )
        ),
        React.createElement(
            "label",
            { htmlFor: "athletics" },
            "Athletics: "
        ),
        React.createElement("input", { id: "accountAthletics", onChange: checkValues, type: "number", name: "athletics", placeholder: "1", min: "1" }),
        React.createElement(
            "label",
            { htmlFor: "wisdom" },
            "Wisdom: "
        ),
        React.createElement("input", { id: "accountWisdom", onChange: checkValues, type: "number", name: "wisdom", placeholder: "1", min: "1" }),
        React.createElement(
            "label",
            { htmlFor: "charisma" },
            "Charisma: "
        ),
        React.createElement("input", { id: "accountCharisma", onChange: checkValues, type: "number", name: "charisma", placeholder: "1", min: "1" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { type: "hidden", id: "profilePic", name: "profilePic", value: "" }),
        React.createElement("input", { className: "makeAccountSubmit", type: "submit", value: "Make Account" })
    );
};

var createAcountWindow = function createAcountWindow(csrf) {
    ReactDOM.render(React.createElement(AccountForm, { csrf: csrf }), document.querySelector("#content"));
};

var createCarousel = function createCarousel(csrf) {
    ReactDOM.render(React.createElement(CharacterSelector, { csrf: csrf }), document.querySelector("#carousel"));
};

var checkValues = function checkValues(e) {
    var maxTotal = 10;

    var athletics = $("#accountAthletics");
    var wisdom = $("#accountWisdom");
    var charisma = $("#accountCharisma");

    var currentTotal = Number(athletics.val()) + Number(wisdom.val()) + Number(charisma.val());
    if (currentTotal > maxTotal) {
        var inputLocation = document.querySelector("#" + e.target.id);
        var decreaseAmount = currentTotal - maxTotal;

        inputLocation.value -= decreaseAmount;
    }
};

var setup = function setup(csrf) {
    createAcountWindow(csrf); // default view
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
