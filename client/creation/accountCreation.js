let csrfToken = null;
const handleCreation = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    let maxTotal = 10;

    const athletics = $("#accountAthletics");
    const wisdom = $("#accountWisdom");
    const charisma = $("#accountCharisma");

    if(athletics.val() == '' || wisdom.val() == '' || charisma.val() == '') {
        handleError("RAWR! Fill in the stats you fuck.");
        return false;
    }

    let currentTotal = Number(athletics.val()) + Number(wisdom.val()) + Number(charisma.val());

    if(currentTotal < maxTotal){
        handleError("You still have stats to allocate dumbass!");
        return false;
    }

    console.log($("input[name=_csrf]").val());
    
    const selections = document.querySelector(".slider").children;
    for (let i = 0; i < selections.length; i++) {
        if(selections[i].checked) {
            $("#profilePic")[0].value = selections[i].title;
        }
    }
    
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
                className="mainForm"
            >
                <div id="messageArea">
                    <h3><span id="errorMessage">Wrong username or password</span></h3>
                </div>
                <label htmlFor="athletics">Athletics: </label>
                <input id="accountAthletics" onChange={checkValues} type="number" name="athletics" placeholder="1" min="1" />
                <label htmlFor="wisdom">Wisdom: </label>
                <input id="accountWisdom" onChange={checkValues} type="number" name="wisdom" placeholder="1" min="1" />
                <label htmlFor="charisma">Charisma: </label>
                <input id="accountCharisma" onChange={checkValues} type="number" name="charisma" placeholder="1" min="1" />
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input type="hidden" id="profilePic" name="profilePic" value="" />
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

const createCarousel = (csrf) => {
    ReactDOM.render(
        <CharacterSelector csrf={csrf} />,
        document.querySelector("#carousel")
    )
}

const checkValues = (e) => {
    let maxTotal = 10;

    const athletics = $("#accountAthletics");
    const wisdom = $("#accountWisdom");
    const charisma = $("#accountCharisma");
    

    let currentTotal = Number(athletics.val()) + Number(wisdom.val()) + Number(charisma.val());
    if(currentTotal > maxTotal){
        let inputLocation = document.querySelector(`#${e.target.id}`);
        let decreaseAmount = currentTotal - maxTotal;

        inputLocation.value -= decreaseAmount;
        
    }
};

const setup = (csrf) => {
    createAcountWindow(csrf); // default view
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
        csrfToken = result.csrfToken;
    });
};

$(document).ready(function() {
    getToken();
});