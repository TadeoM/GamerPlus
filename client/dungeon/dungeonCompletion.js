let csrfToken = null;
let goldValue = "0";
let experienceValue = "0";
let url = null;
let parsedGold = 0;
let parsedExperience = 0;

let accountExperience = 0;
let experienceNeeded=1000;

let gotReward = false;

const handleGetReward = (e) =>{
e.preventDefault();
let formData = new FormData();

    let dungeonGold = parsedGold;
    let dungeonExperience = parsedExperience;
   
    formData.append('gold', dungeonGold);
    formData.append('experience', dungeonExperience);
    
    formData.append('_csrf', csrfToken);

    fetch(`/getReward?_csrf=${csrfToken}`,
    {
        method: "POST",
        body: formData,
    })
    .then(
        function(response){
            if(response.status === 200){
                console.log("Got Reward");
                gotReward=true;
                if(gotReward)
                {
                    let divForm = document.querySelector("#dungeonForm");
                    divForm.remove();
                }
                loadAccountFromServer();
                ReactDOM.render(
                    <DungeonSuccess/>,document.querySelector("#dungeonInfo")
                )
            }
        }
    );
    return false;

}
const showProfile = (e) => {
    showProfile("PROFILE");
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
            <h3 className="dungeonGold" name="gold" id="gold">Gold Earned: {parsedGold}</h3>
            <h3 className="dungeonExperience" name="experience" id="experience">Experience Earned: {parsedExperience}</h3>
            <input type="submit" name="getReward" value="Get Reward" />
            <input type="hidden" name="_csrf" value={props.csrf}/>
        </div>
         </form>
        </div>
    );
};
const DungeonSuccess = function()
{
    return(
        <h3>You Got Your Reward!</h3>
    )
}

const ProfileBar = function(props) {

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
    accountExperience = props.account.experience;
    experienceNeeded = props.account.experienceNeeded;
    return (
        <div>
            <img id="char" src={`/assets/img/${props.account.profilePic}`} alt="character"/>
            <h3 className="accountName"><b>User:</b> {props.account.username} </h3>
           
            <h3 className="accountLevel" name="level">Level:{props.account.level}</h3>
            <h3 className="accountExperience" name="experience">Experience: {props.account.experience}</h3>
            <h3 className="accountExperienceNeeded" name="experienceNeeded">Experience Needed To Level Up: {props.account.experienceNeeded}</h3>
        </div>
    );
};

const getUrlInfo = ()=>{
    url=new URL(window.location.href);
    goldValue = url.searchParams.get("gold")
    experienceValue = url.searchParams.get("experience");
    parsedGold = parseInt(goldValue);
    parsedExperience = parseInt(experienceValue);
    console.log(url);

}

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

const setup = function(csrf) 
{
    const changePswdBtn = document.querySelector("#changePswdBtn");
    changePswdBtn.addEventListener("click", (e) => {
        e.preventDefault();
        createChangePasswordForm(csrf);
        return false;
    });
    if(!gotReward)
    {
        ReactDOM.render(
            <DungeonData csrf ={csrf}/>, document.querySelector("#dungeonInfo")
        );
    }
  
    const profileButton = document.querySelector("#profileButton");

    profileButton.addEventListener("click", (e) => {
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
    getUrlInfo();
    setup();
    
});