const models = require('../models');
const Account = models.Account;
const Friend = models.Friend;
const Quest = models.Quest;
const profilePage = (req, res) => {
    Friend.FriendModel.findByUser(req.session.account.username, (err, docs) => {
        if(err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }
        
        return res.render('profile', { csrfToken: req.csrfToken(), friends: docs });
    });
};

const addFriend = (request,response) => {
    const req = request;
    const res = response;

    console.log(req.body);
    return Account.AccountModel.findByUsername(req.body.name, (err, docs) => {
        if(docs) {
            const friendData = {
                user: req.session.account.username,
                friend: req.body.name,
            };
            
            const newFriend = new Friend.FriendModel(friendData);
            
            const friendPromise = newFriend.save();
                
            friendPromise.then(() => res.json({ redirect: '/maker' }));
        
            friendPromise.catch((err2) => {
                console.log(err2);
                if(err2.code === 11000) {
                    return res.status(400).json({ error: 'Friend already exists.' });
                }
                
                return res.status(400).json({ error: 'An error occurred' });
            });
            
            return friendPromise;
        }
    });
};

const getFriends = (request, response) => {
    const req = request;
    const res = response;

    return Friend.FriendModel.findByUser(req.session.account.username, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }

        return res.json({ friends: docs });
    });
};

const getUserQuests = (request, response)=>{
    const req = request;
    const res = response;

    console.log()
      
    return Friend.FriendModel.findByUser(req.session.account.username, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }

        for(let i = 0; i<docs.length; i++)
        {
        return Account.AccountModel.findByUsername(docs[i].friend, (err2, doc2) => {
            if(err2)
            {
                console.log(err2);
                return res.status(400).json({ error: 'An error occured in Getting' });
            }
 
            console.log(doc2._id);
            return Quest.QuestModel.findbyOwner(doc2._id, (err, doc3) => {
                if (err) {
                console.log(err);
                return res.status(400).json({ error: 'An error occured in Getting' });
                }
                return res.json({ quests: doc3 });
            });
        });
        }
    });
    
  };
/*
const getPendingQuests = (request, response) =>{
    const req = request;
    const res = response;
}
*/
module.exports.getFriends = getFriends;
module.exports.profilePage = profilePage;
module.exports.getUserQuests = getUserQuests;
module.exports.addFriend = addFriend;