"use strict";

var handleCreation = function handleCreation(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#accountAthletics").val() == '' || $("#accountDexterity").val() == '' || $("#accountCharisma").val() == '') {
        handleError("RAWR! Fill in Athletics you fuck.");
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
        React.createElement("input", { id: "accountAthletics", type: "text", name: "athletics", placeholder: "Account Athletics" }),
        React.createElement(
            "label",
            { htmlFor: "wisdom" },
            "Wisdom: "
        ),
        React.createElement("input", { id: "accountWisdom", type: "text", name: "wisdom", placeholder: "Account Wisdom" }),
        React.createElement(
            "label",
            { htmlFor: "charisma" },
            "Charisma: "
        ),
        React.createElement("input", { id: "accountCharisma", type: "text", name: "charisma", placeholder: "Account Charisma" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeAccountSubmit", type: "submit", value: "Make Account" })
    );
};

var createAcountWindow = function createAcountWindow(csrf) {
    ReactDOM.render(React.createElement(AccountForm, { csrf: csrf }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
    createAcountWindow(csrf); // default view
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
    $("#questMessage").animate({ width: 'toggle' }, 350);
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
