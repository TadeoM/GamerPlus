const handleFriend = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({ width:'hide'}, 350);
    
    if($("#friendName").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#friendForm").attr("action"), $("#friendForm").serialize(), function() {
        showFriends();
    });
    
    return false;
};

const FriendForm = (props) => {
    return (
        <form
            id="friendForm"
            onSubmit={handleFriend}
            name="friendForm"
            action="/addFriend"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="friendName">Friend Name: </label>
            <input id="friendName" type="text" name="friendName" placeholder="Friend Name"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeFriendSubmit" type="submit" value="Add Friend"/>
        </form>
    );    
}

const showFriends = function(props) {
    sendAjax('GET', '/getFriends', null, (data) =>{
        console.log(data.friends);
        ReactDOM.render(
            <FriendList friends={data.friends} />, document.querySelector("#friendList")
        );
    });
};


const FriendList = function(props) {
    if(props.friends.length === 0) {
        return (
            <div className="friendList">
                <h3 className="emptyFriend">No Friends yet, loser</h3>
            </div>
        );
    }
    
    const friendNodes = props.friends.map(function(friend) {
        return (
            <div key={friend.user} className="friend">
                <img src="/assets/img/gamifyLife.png" alt="friend face" className="friendFace" />
                <h3 className="friendName">Name: {friend.friend} </h3>
            </div>
        );
    });
    
    return (
        <div className="friendList">
            {friendNodes}
        </div>
    );
};

const AccountData = function(props) {  
    console.log(props.account)  
    return (
        
        <div>
            <img id="char" src={`/assets/img/${props.account.profilePic}`} alt="character"/>
            <h3 className="accountName"><b>User:</b> {props.account.username} </h3>
            <h3 className="accountAthletics"><b>Athletics:</b> {props.account.athletics}</h3>
            <h3 className="accountWisdom"><b>Wisdom:</b> {props.account.wisdom}</h3>
            <h3 className="accountCharisma"><b>Charisma:</b> {props.account.charisma}</h3>
            <h3 className="accountExperience"><b>Experience:</b> {props.account.experience}</h3>
            <h3 className="accountGold"><b>Gold:</b> {props.account.gold}</h3>
            <h3 className="accountGem"><b>Gems:</b> {props.account.gem}</h3>
        </div>
    );
};

const loadAccountFromServer = () => {
    sendAjax('GET', '/getAccount', null, (data) => {
        ReactDOM.render(
            <AccountData account={data.account} />, document.querySelector("#accountData")
        );
    });
};

const showPasswordChange = () => {
    $("#changePswdForm").animate({width:'toggle'},5);
};

const changePassword = (e) =>{
    e.preventDefault();

    console.log($("#curQuestForm").serialize());
    sendAjax('POST',$("#changePswdForm").attr("action"), $("#changePswdForm").serialize(), () => {
        showPasswordChange();
    });
}

const showProfile = (e) => {
    showProfile("PROFILE");
}

const ChangePasswordForm = (props)=>{
    return (
        <form id="changePswdForm" 
            name="changePswdForm"
            onSubmit={changePassword}
            action="/changePswd"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username"/>
            <label htmlFor="currPass">Current Password: </label>
            <input id="currPass" type="password" name="currPass" placeholder="password"/>
            <label htmlFor="pass">New Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password"/>
            <input id="pass2" type="password" name="pass2" placeholder="password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Confirm Password Change"/>

        </form>
    ); 
};

const createChangePasswordForm =(csrf) => {
    ReactDOM.render(
        <ChangePasswordForm csrf={csrf} />,
        document.querySelector("#pswdChange")
    );
};

const setup = function(csrf) {
    const changePswdBtn = document.querySelector("#changePswdBtn");
    createChangePasswordForm(csrf);
    changePswdBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showPasswordChange();
        return false;
    });
    ReactDOM.render(
        <FriendForm csrf={csrf} />, document.querySelector("#addFriend")
    );
    
    showPasswordChange();
    showFriends();
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
