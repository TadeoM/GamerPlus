const models = require('../models');

const Friend = models.Friend;
const Account = models.Account;

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
    return Account.AccountModel.findByUsername(req.body.name, (error, docs) => {
        if(docs) {
            const friendData = {
                user: req.session.account.username,
                friend: req.body.name,
            };
            
            const newFriend = new Friend.FriendModel(friendData);
            
            const friendPromise = newFriend.save();
                
            friendPromise.then(() => res.json({ redirect: '/maker' }));
        
            friendPromise.catch((err) => {
                console.log(err);
                if(err.code === 11000) {
                    return res.status(400).json({ error: 'Friend already exists.' });
                }
                
                return res.status(400).json({ error: 'An error occurred' });
            });
            
            return friendPromise;
        }
        return res.status(400).json({ error: 'No Docs' });
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

module.exports.getFriends = getFriends;
module.exports.profilePage = profilePage;
module.exports.addFriend = addFriend;