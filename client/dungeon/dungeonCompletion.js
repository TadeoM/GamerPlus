let csrfToken = null;
const handleGetReward = (e) =>{
e.preventDefault();
sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

}
const getReward = ()=>
{
   
}
const loadInfoFromDungeon = (e)=>{

}
const DungeonData = function(props) {
    return (
        <div>
            <img id="char" src={`/assets/img/${props.account.profilePic}`} alt="character"/>
            <h3 className="accountName"><b>User:</b> {props.account.username} </h3>
        </div>
    );
};

const setup = function(csrf) 
{
    const changePswdBtn = document.querySelector("#changePswdBtn");
    changePswdBtn.addEventListener("click", (e) => {
        e.preventDefault();
        createChangePasswordForm(csrf);
        return false;
    });
    const getRewardButton = document.querySelector("#getReward");
    getRewardButton.addEventListener("click", (e) => {
        e.preventDefault();
        getReward();
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
    loadAccountFromServer();
    $("#profileContent").animate({ width:'hide'}, 0);
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