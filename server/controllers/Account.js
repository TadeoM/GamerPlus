 const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const creatorPage = (req, res) => {
    Account.AccountModel.findByUsername(req.session.account.username, (err, docs) => {
        if(err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }
        
        return res.render('creation', { csrfToken: req.csrfToken(), account: docs });
    });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

    // force cast top strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'Gamer! All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);
  
    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

    // cast to string to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'Gamer! All fields are requires' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Gamer! Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);

      return res.json({ redirect: '/creator' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

const changePassword = (request, response) =>{
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.currPass = `${req.body.currPass}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;
  if (!req.body.username || !req.body.currPass || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'Gamer! All fields are requires' });
  }

  if(req.body.currPass === req.body.pass)
  {
    return res.status(400).json({ error: 'Cannot use the same password gamer' });
  }
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.authenticate(req.body.username, 
    req.body.currPass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }
    
    return Account.AccountModel
    .generateHash
    (req.body.pass, (salt, hash) => {
      return Account.AccountModel.updateOne({ username: req.session.account.username },
        { salt, password: hash }, (error) => {           
        if(error) {             
            return res.status(400).json({error});           
        }
        return res.json({message: "password successfully changed"});         
      });
    });
  });
}
const getAccount = (request, response) => {
  const req = request;
  const res = response;

  let username = "";
  if(req.query.user){
    username = req.query.user;
  }
  else {
    username = req.session.account.username;
  }
  return Account.AccountModel.findByUsername(username, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ account: docs });
  });
};

const createStats = (request, response) => {
  const req = request;
  const res = response;

  return Account.AccountModel.findByUsername(req.session.account.username, (err, doc) => {
    const updateAccount = doc;
    updateAccount.athletics = req.body.athletics;
    updateAccount.wisdom = req.body.wisdom;
    updateAccount.charisma = req.body.charisma;
    

    switch(req.body.profilePic) {
      case "slide1":
        updateAccount.profilePic = "BarbarianChar.png"
        break;
      case "slide2":
        updateAccount.profilePic = "BardChar.png"
        break;
      case "slide3":
        updateAccount.profilePic = "BeastMasterChar.png"
        break;
      case "slide4":
        updateAccount.profilePic = "DruidChar.png"
        break;
      case "slide5":
        updateAccount.profilePic = "FighterChar.png"
        break;
      case "slide6":
        updateAccount.profilePic = "PirateChar.png"
        break;
      case "slide7":
        updateAccount.profilePic = "PaladinChar.png"
        break;
      case "slide8":
        updateAccount.profilePic = "RogueChar.png"
        break;
      case "slide9":
        updateAccount.profilePic = "ShamanChar.png"
        break;
      default:
        break;
     }

    console.log(updateAccount.profilePic);
    const savePromise = updateAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(updateAccount);

      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((error) => {
      console.log(error);

      if (error.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  console.log(req);
  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.getAccount = getAccount;
module.exports.creatorPage = creatorPage;
module.exports.createStats = createStats;
module.exports.changePassword = changePassword;
