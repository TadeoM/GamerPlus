let csrfToken = null;
let goldValue = 0;
let experienceValue = 0;
let url = null;
const handleGetReward = (e) =>{
e.preventDefault();
sendAjax('POST', $("#dungeonForm").attr("action"), $("#dungeonForm").serialize(), redirect);

}
const DungeonData = function(props) {
    return (
        <div>
          <form id="dungeonForm" name ="dungeonForm"
            onSubmit ={handleGetReward}
            action ="/getReward"
            method="POST"
            className="dungeonForm"
        >
        <div>
            <img src="/assets/img/treasurechest.jpg" alt="Treasure" className="treasurechest"/>
            <h3 className="dungeonGold">Gold Earned: {goldValue}</h3>
            <h4 className="dungeonExperience">Experience Earned: {experienceValue}</h4>
            <input type="submit" name="getReward" value="Get Reward" />
            <input type="hidden" name="_csrf" value={props.csrf}/>
        </div>
         </form>
        </div>
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
const getUrlInfo = ()=>{
    url=new URL(window.location.href);
    goldValue = url.searchParams.get("gold")
    experienceValue = url.searchParams.get("experience");
    console.log(url);

}
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
const setup = function(csrf) 
{
    const changePswdBtn = document.querySelector("#changePswdBtn");
    changePswdBtn.addEventListener("click", (e) => {
        e.preventDefault();
        createChangePasswordForm(csrf);
        return false;
    });
    ReactDOM.render(
        <DungeonData csrf ={csrf}/>, document.querySelector("#dungeonInfo")
    );
    const signupButton = document.querySelector("#profileButton");

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        showProfile();
        return false;
    });
    //loadAccountFromServer();
    //$("#profileContent").animate({ width:'hide'}, 0);
};
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
        csrfToken = result.csrfToken;
    });
};
$(document).ready(function() {
    getToken();
    getUrlInfo();
    setup();
    
});