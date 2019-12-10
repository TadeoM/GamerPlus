const handleError = (message) => {
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
    // $(".mainForm").effect("shake");
    $("#questMessage").animate({width:'toggle'},350);
    $("#messageArea").animate({width:'toggle'}, 0);
};

const showProfile = (message) => {
    $("#profileContent").animate({width:'toggle'},350);
};

const showAd = () => {
    $("#ad").animate({width:'toggle'},350);
}

const redirect = (response) => {
    $("#questMessage").animate({width:'hide'},350);
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};