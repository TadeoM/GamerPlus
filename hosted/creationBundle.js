"use strict";

var handleCreation = function handleCreation(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#accountAthletics").val() == '' || $("#accountDexterity").val() == '' || $("#accountCharisma").val() == '') {
        handleError("RAWR! Fill in the stats you fuck.");
        return false;
    }
    if ($("#accountAthletics").val() == '') {
        handleError("RAWR! Fill in Athletics you fuck.");
        return false;
    }
    if ($("#accountAthletics").val() == '') {
        handleError("RAWR! Fill in Athletics you fuck.");
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
            className: "accountForm"
        },
        React.createElement(
            "label",
            { htmlFor: "athletics" },
            "Athletics: "
        ),
        React.createElement("input", { id: "accountAthletics", onchange: "checkValues()", type: "number", name: "athletics", placeholder: "1" }),
        React.createElement(
            "label",
            { htmlFor: "wisdom" },
            "Wisdom: "
        ),
        React.createElement("input", { id: "accountWisdom", onchange: "checkValues()", type: "number", name: "wisdom", placeholder: "1" }),
        React.createElement(
            "label",
            { htmlFor: "charisma" },
            "Charisma: "
        ),
        React.createElement("input", { id: "accountCharisma", onchange: "checkValues()", type: "number", name: "charisma", placeholder: "1" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeAccountSubmit", type: "submit", value: "Make Account" })
    );
};

var createAcountWindow = function createAcountWindow(csrf) {
    ReactDOM.render(React.createElement(AccountForm, { csrf: csrf }), document.querySelector("#accountCreator"));
};

var checkValues = function checkValues() {
    var maxTotal = 10;
    console.log("HE");

    var athletics = document.querySelector("#accontAthletics");
    var wisdom = document.querySelector("#accontWisdom");
    var charisma = document.querySelector("#accontCharisma");

    var currentTotal = athletics.val() + wisdom.val() + charisma.val();
    if (currentTotal > maxTotal) {
        console.log("Too big");
    }
};

var setup = function setup(csrf) {
    createAcountWindow(csrf); // default view
    var accountForm = document.querySelector("#accountAthletics");
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
