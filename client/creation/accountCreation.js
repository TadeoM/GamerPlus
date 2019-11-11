const handleCreation = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#accountAthletics").val() == '' || $("#accountDexterity").val() == '' || $("#accountCharisma").val() == '') {
        handleError("RAWR! Fill in the stats you fuck.");
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
            <input id="accountAthletics" onchange="checkValues()" type="number" name="athletics" placeholder="1"/>
            <label htmlFor="wisdom">Wisdom: </label>
            <input id="accountWisdom" onchange="checkValues()" type="number" name="wisdom" placeholder="1"/>
            <label htmlFor="charisma">Charisma: </label>
            <input id="accountCharisma" onchange="checkValues()" type="number" name="charisma" placeholder="1"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeAccountSubmit" type="submit" value="Make Account"/>
        </form>
    );
};

const createAcountWindow = (csrf) => {
    ReactDOM.render(
        <AccountForm csrf={csrf} />,
        document.querySelector("#accountCreator")
    );
};

const checkValues = () => {
    let maxTotal = 10;
    console.log("HE");

    const athletics = document.querySelector("#accontAthletics");
    const wisdom = document.querySelector("#accontWisdom");
    const charisma = document.querySelector("#accontCharisma");

    let currentTotal = athletics.val() + wisdom.val() + charisma.val();
    if(currentTotal > maxTotal){
        console.log("Too big");
    }
};

const setup = (csrf) => {
    createAcountWindow(csrf); // default view
    const accountForm = document.querySelector("#accountAthletics");
    
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});