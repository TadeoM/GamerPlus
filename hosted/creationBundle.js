"use strict";

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
            className: "accountForm form-creator"
        },
        React.createElement(
            "div",
            { className: "row mb-3" },
            React.createElement("div", { className: "col-md-3" }),
            React.createElement(
                "div",
                { className: "col-md-6 grid-box" },
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "label",
                        { htmlFor: "athletics" },
                        "Athletics: "
                    ),
                    React.createElement("input", { id: "accountAthletics", onChange: checkValues, type: "number", name: "athletics", placeholder: "1", min: "1" })
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "label",
                        { htmlFor: "wisdom" },
                        "Wisdom: "
                    ),
                    React.createElement("input", { id: "accountWisdom", onChange: checkValues, type: "number", name: "wisdom", placeholder: "1", min: "1" })
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "label",
                        { htmlFor: "charisma" },
                        "Charisma: "
                    ),
                    React.createElement("input", { id: "accountCharisma", onChange: checkValues, type: "number", name: "charisma", placeholder: "1", min: "1" })
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                    React.createElement("input", { className: "makeAccountSubmit", type: "submit", value: "Make Account" })
                )
            ),
            React.createElement("div", { className: "col-md-3" })
        )
    );
};

var CharacterSelector = function CharacterSelector(props) {};

var createAcountWindow = function createAcountWindow(csrf) {
    ReactDOM.render(React.createElement(AccountForm, { csrf: csrf }), document.querySelector("#accountCreator"));
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
    //createCarousel(csrf);
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
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
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
$('.carousel').carousel();
