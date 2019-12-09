const models = require('../models');

const Group = models.Group;
const Account = models.Account

const groupPage = (req, res) => {
    Group.GroupModel.findByGroup(req.body.groupName, (err, docs) => {
        console.log(req.query.groupName);
        if(err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }
        
        return res.render('group', { csrfToken: req.csrfToken(), groups: docs });
    });
};

const addMember = (request,response) => {
    const req = request;
    const res = response;


    return Account.AccountModel.findByUsername(req.body.groupMember, (error, docs) => {
        console.log("Found a User");
        if(docs) {
            const memberData = {
                groupName: req.body.groupName,
                groupMember: req.session.account.username,
                groupOwner: req.body.groupOwner,
            };
            
            const newMember = new Group.GroupModel(memberData);
            
            const memberPromise = newMember.save();
            memberPromise.then(() => res.json({ redirect: '/groupPage' }));
             
            memberPromise.catch((err) => {
                console.log(err);
                if(err.code === 11000) {
                    return res.status(400).json({ error: 'Member already exists in group.' });
                }
                
                return res.status(400).json({ error: 'An error occurred' });
            });
              
            return memberPromise;
        }
        return res.status(400).json({ error: 'User does not exist' });
    });
};

const getOneGroup = (request, response) => {
    const req = request;
    const res = response;
    
    console.log(req.query)
    return Group.GroupModel.findByGroup(req.query.groupName, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }

        return res.json({ members: docs });
    });
};

const getGroups = (request, response) => {
    const req = request;
    const res = response;
    
    return Group.GroupModel.findByUser(req.session.account.username, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }

        return res.json({ groups: docs });
    });
};

module.exports.getGroups = getGroups;
module.exports.getOneGroup = getOneGroup;
module.exports.groupPage = groupPage;
module.exports.addMember = addMember;
