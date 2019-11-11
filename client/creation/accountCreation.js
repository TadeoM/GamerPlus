const handleCreation = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#accountAthletics").val() == '' || $("#accountDexterity").val() == '' || $("#accountCharisma").val() == '') {
        handleError("RAWR! Fill in Athletics you fuck.");
        return false;
    }
    if($("#accountAthletics").val() == '') {
        handleError("RAWR! Fill in Athletics you fuck.");
        return false;
    }
    if($("#accountAthletics").val() == '') {
        handleError("RAWR! Fill in Athletics you fuck.");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#accountForm").attr("action"), $("#accountForm").serialize(), redirect);

    return false;
};

const AccountForm = (props) => {
    return (
        <form id="accountForm"
            onSubmit={handleCreation}
            name="accountForm"
            action="/creator"
            method="POST"
            className="accountForm"
        >
            <label htmlFor="athletics">Athletics: </label>
            <input id="accountAthletics" type="text" name="athletics" placeholder="Account Athletics"/>
            <label htmlFor="wisdom">Wisdom: </label>
            <input id="accountWisdom" type="text" name="wisdom" placeholder="Account Wisdom"/>
            <label htmlFor="charisma">Charisma: </label>
            <input id="accountCharisma" type="text" name="charisma" placeholder="Account Charisma"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeAccountSubmit" type="submit" value="Make Account"/>
        </form>
    );
};

const createAcountWindow = (csrf) => {
    ReactDOM.render(
        <AccountForm csrf={csrf} />,
        document.querySelector("#content")
    );
};

const setup = (csrf) => {
    createAcountWindow(csrf); // default view
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});