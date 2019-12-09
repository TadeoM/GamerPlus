"use strict";

var csrfToken = null;
var goldValue = "0";
var experienceValue = "0";
var url = null;
var parsedGold = 0;
var parsedExperience = 0;
var accountAthletics = 0;
var accountCharisma = 0;
var accountWisdom = 0;

var accountExperience = 0;
var experienceNeeded = 1000;

var handleGetReward = function handleGetReward(e) {
    e.preventDefault();
    var formData = new FormData();

    var dungeonGold = parsedGold;
    var dungeonExperience = parsedExperience;

    formData.append('gold', dungeonGold);
    formData.append('experience', dungeonExperience);

    formData.append('_csrf', csrfToken);

    fetch("/getReward?_csrf=" + csrfToken, {
        method: "POST",
        body: formData
    }).then(function (response) {
        if (response.status === 200) {
            console.log("Got Reward");
            var divForm = document.querySelector("#dungeonForm");
            divForm.remove();
            ReactDOM.render(React.createElement(DungeonSuccess, null), document.querySelector("#dungeonInfo"));
        }
    });
    return false;
};
var showProfile = function showProfile(e) {
    showProfile("PROFILE");
};
var levelUp = function levelUp(e) {
    e.preventDefault();

    var formData = new FormData();

    var currExp = accountExperience;
    var expNeeded = experienceNeeded;
    console.log(currExp);
    console.log(expNeeded);

    formData.append('experience', currExp);
    formData.append('experienceNeeded', expNeeded);

    formData.append('_csrf', csrfToken);
    console.log(formData);
    fetch("/levelUp?_csrf=" + csrfToken, {
        method: "POST",
        body: formData
    }).then(function (response) {
        if (response.status === 200) {
            console.log("Leveled Up");
            window.onload = response.redirect;
        } else if (response.status === 400) {
            console.log("Not enough Experience Man");
        }
    });
    return false;
};
var DungeonData = function DungeonData(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "form",
            { id: "dungeonForm", name: "dungeonForm",
                onSubmit: handleGetReward,
                action: "/getReward",
                method: "POST",
                className: "dungeonForm"
            },
            React.createElement(
                "div",
                null,
                React.createElement("img", { src: "/assets/img/treasurechest.jpg", alt: "Treasure", className: "treasurechest" }),
                React.createElement(
                    "h3",
                    { className: "dungeonGold", name: "gold", id: "gold" },
                    "Gold Earned: ",
                    parsedGold
                ),
                React.createElement(
                    "h3",
                    { className: "dungeonExperience", name: "experience", id: "experience" },
                    "Experience Earned: ",
                    parsedExperience
                ),
                React.createElement("input", { type: "submit", name: "getReward", value: "Get Reward" }),
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf })
            )
        )
    );
};
var DungeonSuccess = function DungeonSuccess() {
    return React.createElement(
        "h3",
        null,
        "You Got Your Reward!"
    );
};

var ProfileBar = function ProfileBar(props) {

    accountAthletics = props.account.athletics;
    accountWisdom = props.account.wisdom;
    accountCharisma = props.account.charisma;
    return React.createElement(
        "div",
        { className: "profileBox" },
        React.createElement(
            "div",
            null,
            React.createElement("img", { id: "char", src: "/assets/img/" + props.account.profilePic, alt: "character" }),
            React.createElement(
                "div",
                { className: "button", id: "profileBar" },
                React.createElement(
                    "div",
                    { className: "btn btn-one" },
                    React.createElement(
                        "a",
                        { href: "/profile" },
                        "To Profile"
                    )
                )
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
                    { className: "accountGem" },
                    React.createElement(
                        "b",
                        null,
                        "Gem:"
                    ),
                    " ",
                    props.account.gem
                ),
                React.createElement(
                    "h3",
                    { className: "accountLevel" },
                    React.createElement(
                        "b",
                        null,
                        "Level:"
                    ),
                    " ",
                    props.account.level
                )
            )
        )
    );
};
var AccountData = function AccountData(props) {
    accountExperience = props.account.experience;
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
            "form",
            { id: "levelUpForm", name: "levelUpForm",
                onSubmit: levelUp,
                action: "/levelUp",
                method: "POST",
                className: "levelUpForm"
            },
            React.createElement(
                "h3",
                { className: "accountLevel", name: "level" },
                "Level:",
                props.account.level
            ),
            React.createElement(
                "h3",
                { className: "accountExperience", name: "experience" },
                "Experience: ",
                props.account.experience
            ),
            React.createElement(
                "h3",
                { className: "accountExperienceNeeded", name: "experienceNeeded" },
                "Experience Needed To Level Up: ",
                experienceNeeded
            ),
            React.createElement("input", { type: "submit", name: "levelUp", value: "Level Up" }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf })
        )
    );
};

var getUrlInfo = function getUrlInfo() {
    url = new URL(window.location.href);
    goldValue = url.searchParams.get("gold");
    experienceValue = url.searchParams.get("experience");
    parsedGold = parseInt(goldValue);
    parsedExperience = parseInt(experienceValue);
    console.log(url);
};

var loadAccountFromServer = function loadAccountFromServer() {
    sendAjax('GET', '/getAccount', null, function (data) {
        ReactDOM.render(React.createElement(AccountData, { account: data.account }), document.querySelector("#accountData"));
        ReactDOM.render(React.createElement(ProfileBar, { account: data.account }), document.querySelector("#profileContent"));
    });
};

var setup = function setup(csrf) {
    var changePswdBtn = document.querySelector("#changePswdBtn");
    changePswdBtn.addEventListener("click", function (e) {
        e.preventDefault();
        createChangePasswordForm(csrf);
        return false;
    });
    ReactDOM.render(React.createElement(DungeonData, { csrf: csrf }), document.querySelector("#dungeonInfo"));
    var profileButton = document.querySelector("#profileButton");

    profileButton.addEventListener("click", function (e) {
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
    getUrlInfo();
    setup();
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
