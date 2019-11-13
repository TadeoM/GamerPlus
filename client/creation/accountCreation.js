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
                className="accountForm form-creator"
            >
                <div className="row mb-3">
                    <div className="col-md-3"></div>
                    <div className="col-md-6 grid-box">
                        <div>
                            <label htmlFor="athletics">Athletics: </label>
                            <input id="accountAthletics" onChange={checkValues} type="number" name="athletics" placeholder="1" min="1" />
                        </div>
                        <div>
                            <label htmlFor="wisdom">Wisdom: </label>
                            <input id="accountWisdom" onChange={checkValues} type="number" name="wisdom" placeholder="1" min="1" />
                        </div>

                        <div >
                            <label htmlFor="charisma">Charisma: </label>
                            <input id="accountCharisma" onChange={checkValues} type="number" name="charisma" placeholder="1" min="1" />
                        </div>
                        <div >
                            <input type="hidden" name="_csrf" value={props.csrf}/>
                            <input className="makeAccountSubmit" type="submit" value="Make Account"/>
                        </div>
                    </div>
                    <div className="col-md-3"></div>
                </div>
                
                
            </form>
        

    );
};

const CharacterSelector = (props) => {
    
}

const createAcountWindow = (csrf) => {
    ReactDOM.render(
        <AccountForm csrf={csrf} />,
        document.querySelector("#accountCreator")
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
    //createCarousel(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});