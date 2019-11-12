const handleCreation = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#accountAthletics").val() == '' || $("#accountDexterity").val() == '' || $("#accountCharisma").val() == '') {
        handleError("RAWR! Fill in the stats you fuck.");
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
                <div class="row mb-3">
                    <div class="col-md-4">
                        <label htmlFor="athletics">Athletics: </label>
                        <input id="accountAthletics" onChange={checkValues} type="number" name="athletics" placeholder="0" min="0" />
                    </div>
                    <div class="col-md-4">
                        <label htmlFor="wisdom">Wisdom: </label>
                        <input id="accountWisdom" onChange={checkValues} type="number" name="wisdom" placeholder="0" min="0" />
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-4">
                        <label htmlFor="charisma">Charisma: </label>
                        <input id="accountCharisma" onChange={checkValues} type="number" name="charisma" placeholder="0" min="0" />
                    </div>
                    <div class="col-md-4">
                        <input type="hidden" name="_csrf" value={props.csrf}/>
                        <input className="makeAccountSubmit" type="submit" value="Make Account"/>
                    </div>
                </div>
                
                
            </form>
        

    );
};

const createAcountWindow = (csrf) => {
    ReactDOM.render(
        <AccountForm csrf={csrf} />,
        document.querySelector("#accountCreator")
    );
};

const checkValues = (e) => {
    let maxTotal = 10;

    const athletics = $("#accountAthletics");
    const wisdom = $("#accountWisdom");
    const charisma = $("#accountCharisma");
    

    let currentTotal = Number(athletics.val()) + Number(wisdom.val()) + Number(charisma.val());
    console.log(currentTotal);
    if(currentTotal > maxTotal){
        let inputLocation = document.querySelector(`#${e.target.id}`);
        
        console.log(inputLocation.value);
        inputLocation.value--;
        
    }
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