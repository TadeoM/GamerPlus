"use strict";

var csrfToken = null;
var handleGetReward = function handleGetReward(e) {
    e.preventDefault();
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
};
var getReward = function getReward() {};
var loadInfoFromDungeon = function loadInfoFromDungeon(e) {};
var DungeonData = function DungeonData(props) {
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
        )
    );
};

var setup = function setup(csrf) {
    var changePswdBtn = document.querySelector("#changePswdBtn");
    changePswdBtn.addEventListener("click", function (e) {
        e.preventDefault();
        createChangePasswordForm(csrf);
        return false;
    });
    var getRewardButton = document.querySelector("#getReward");
    getRewardButton.addEventListener("click", function (e) {
        e.preventDefault();
        getReward();
        return false;
    });
    ReactDOM.render(React.createElement(DungeonData, { csrf: csrf }), document.querySelector("#dungeonInfo"));
    var signupButton = document.querySelector("#profileButton");

    signupButton.addEventListener("click", function (e) {
        e.preventDefault();
        showProfile();
        return false;
    });
    loadAccountFromServer();
    $("#profileContent").animate({ width: 'hide' }, 0);
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
