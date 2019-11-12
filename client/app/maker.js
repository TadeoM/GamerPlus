// add after fix to part 30

const handleDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({ width:'hide'}, 350);
    
    if($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });
    
    return false;
};

const DomoForm = (props) => {
    return (
        <div className="row mb-3">
            <form id="domoForm"
                onSubmit={handleDomo}
                name="domoForm"
                action="/maker"
                method="POST"
                className="domoForm"
            >
                <label htmlFor="name">Name: </label>
                <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
                <label htmlFor="age">Age: </label>
                <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
            </form>
        </div>
    );
};

const DomoList = function(props) {
    if(props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }
    
    const domoNodes = props.domos.map(function(domo) {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name} </h3>
                <h3 className="domoAge">Age: {domo.age} </h3>
            </div>
        );
    });
    
    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const AccountData = function(props) {
    return (
        <div className="row mb-3">
            <div className="col-md-4">
                <h3 className="accountName"><b>User:</b> {props.account.username} </h3>
                <h3 className="accountAthletics"><b>Athletics:</b> {props.account.athletics}</h3>
            </div>
            <div className="col-md-4">
                <h3 className="accountWisdom"><b>Wisdom:</b> {props.account.wisdom}</h3>
                <h3 className="accountCharisma"><b>Charisma:</b> {props.account.charisma}</h3>
            </div>
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) =>{
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

const loadAccountFromServer = () => {
    sendAjax('GET', '/getAccount', null, (data) =>{
        console.log(data.account.athletics);
        ReactDOM.render(
            <AccountData account={data.account} />, document.querySelector("#accountData")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );
    
    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );
    
    loadDomosFromServer();
    loadAccountFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});

