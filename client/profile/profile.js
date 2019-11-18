const handleFriend = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({ width:'hide'}, 350);
    
    if($("#domoName").val() == '' || $("#domoAge").val() == '') {
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
            <label htmlFor="name">Name: </label>
            <input id="friendName" type="text" name="name" placeholder="Domo Name"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeFriendSubmit" type="submit" value="Add Friend"/>
        </form>
    );    
}

const AccountData = function(props) {
    return (
        <div>
            <h3 className="accountName"><b>User:</b> {props.account.username} </h3>
            <h3 className="accountAthletics"><b>Athletics:</b> {props.account.athletics}</h3>
            <h3 className="accountWisdom"><b>Wisdom:</b> {props.account.wisdom}</h3>
            <h3 className="accountCharisma"><b>Charisma:</b> {props.account.charisma}</h3>
        </div>
    );
};

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
                <img src="/assets/img/domoface.jpeg" alt="friend face" className="friendFace" />
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
    changePswdBtn.addEventListener("click", (e) => {
        e.preventDefault();
        createChangePasswordForm(csrf);
        return false;
    });
    ReactDOM.render(
        <FriendForm csrf={csrf} />, document.querySelector("#addFriend")
    );
    showFriends();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});
