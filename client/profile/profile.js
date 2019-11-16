const handleFriend = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({ width:'hide'}, 350);
    
    if($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#friendForm").attr("action"), $("#friendForm").serialize(), function() {
        addFriend();
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
    sendAjax('GET', '/getAccount', null, (data) =>{
        ReactDOM.render(
            <FriendList friends={data.account.friendList} />, document.querySelector("#friendList")
        );
    });
};


const FriendList = function(props) {
    if(props.friendList.length === 0) {
        return (
            <div className="friendList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }
    
    const friendNodes = props.friendList.map(function(friend) {
        return (
            <div key={friend._id} className="friend">
                <img src="/assets/img/domoface.jpeg" alt="friend face" className="friendFace" />
                <h3 className="friendName">Name: {friend.username} </h3>
            </div>
        );
    });
    
    return (
        <div className="friendList">
            {friendNodes}
        </div>
    );
};

const setup = function(csrf) {
    ReactDOM.render(
        <FriendForm friends={data.account.friendList} />, document.querySelector("#addFriend")
    );
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});
