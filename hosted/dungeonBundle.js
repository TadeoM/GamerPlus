"use strict";

var csrfToken = null;
var goldValue = 0;
var experienceValue = 0;
var url = null;
var handleGetReward = function handleGetReward(e) {
    e.preventDefault();
    sendAjax('POST', $("#dungeonForm").attr("action"), $("#dungeonForm").serialize());
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
                    { className: "dungeonGold", name: "gold" },
                    "Gold Earned: ",
                    goldValue
                ),
                React.createElement(
                    "h4",
                    { className: "dungeonExperience", name: "experience" },
                    "Experience Earned: ",
                    experienceValue
                ),
                React.createElement("input", { type: "submit", name: "getReward", value: "Get Reward" }),
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf })
            )
        )
    );
};
/*
const ProfileBar = function(props) {

    accountAthletics = props.account.athletics;
    accountWisdom = props.account.wisdom;
    accountCharisma = props.account.charisma;
    return (
        <div className="profileBox">
            <div> 
                <img id="char" src={`/assets/img/${props.account.profilePic}`} alt="character"/>
                <div className="button" id="profileBar">
                    <div className="btn btn-one">
                        <a href="/profile">To Profile</a>
                    </div>
                </div>
            </div>
            <h3>
                <span id="profileStats">
                    <h3 className="accountName"><b>User:</b> {props.account.username} </h3>
                    <h3 className="accountAthletics"><b>Athletics:</b> {props.account.athletics}</h3>
                    <h3 className="accountWisdom"><b>Wisdom:</b> {props.account.wisdom}</h3>
                    <h3 className="accountCharisma"><b>Charisma:</b> {props.account.charisma}</h3>
                    <h3 className="accountGold"><b>Gold:</b> {props.account.gold}</h3>
                    <h3 className="accountExperience"><b>Experience:</b> {props.account.experience}</h3>
                    <h3 className="accountGem"><b>Gem:</b> {props.account.gem}</h3>
                    <h3 className="accountLevel"><b>Level:</b> {props.account.level}</h3>
                </span>
            </h3>
        </div>
    );
};
const AccountData = function(props) {
    return (
        <div>
            <img id="char" src={`/assets/img/${props.account.profilePic}`} alt="character"/>
            <h3 className="accountName"><b>User:</b> {props.account.username} </h3>
        </div>
    );
};
*/
var getUrlInfo = function getUrlInfo() {
    url = new URL(window.location.href);
    goldValue = url.searchParams.get("gold");
    experienceValue = url.searchParams.get("experience");
    console.log(url);
};
/*
const loadAccountFromServer = () => {
    sendAjax('GET', '/getAccount', null, (data) =>{
        ReactDOM.render(
            <AccountData account={data.account} />, document.querySelector("#accountData")
        );
        ReactDOM.render(
            <ProfileBar account={data.account} />, document.querySelector("#profileContent")
        );
    });
};
*/
var setup = function setup(csrf) {
    var changePswdBtn = document.querySelector("#changePswdBtn");
    changePswdBtn.addEventListener("click", function (e) {
        e.preventDefault();
        createChangePasswordForm(csrf);
        return false;
    });
    ReactDOM.render(React.createElement(DungeonData, { csrf: csrf }), document.querySelector("#dungeonInfo"));
    var signupButton = document.querySelector("#profileButton");

    signupButton.addEventListener("click", function (e) {
        e.preventDefault();
        showProfile();
        return false;
    });
    //loadAccountFromServer();
    //$("#profileContent").animate({ width:'hide'}, 0);
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
