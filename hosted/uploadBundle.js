"use strict";

var csrfToken = null;

// File Upload Test
var handleUpload = function handleUpload(e) {
    e.preventDefault();

    $("#questMessage").animate({ width: 'hide' }, 350);

    if ($("#questName").val() == '' || $("#questExp").val() == '' || $("#questType").val() == '' || $("#questContent").val() == '') {
        handleError("Gamer! All fields are required");
        return false;
    }

    sendAjax('POST', $("#uploadForm").attr("action"), $("#uploadForm").serialize(), function () {});

    return false;
};

var UploadFile = function UploadFile(props) {
    console.log(csrfToken);
    return React.createElement(
        "form",
        { id: "uploadForm",
            name: "uploadForm",
            action: "/upload",
            method: "POST",
            encType: "multipart/form-data",
            className: "mainForm"
        },
        React.createElement("input", { type: "hidden", name: "_csrf", value: csrfToken }),
        React.createElement("input", { type: "file", name: "sampleFile" }),
        React.createElement("input", { type: "submit", value: "Upload!" })
    );
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(UploadFile, null), document.querySelector("#uploadArea"));
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        csrfToken = result.csrfToken;
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