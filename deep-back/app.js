const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');

//import models

const Entry = require('./models/entries')
const User = require('./models/user')
const Journal = require('./models/journal')

/*===============Setting up database=================*/

const mongoose = require('mongoose');

try {
 mongoose.connect('mongodb+srv://boxerboxer92:GeR07F7bTvyAPW39@cluster0-hkw8u.mongodb.net/deep?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true })
} catch (error) {
  console.log(error);
}
	
var db = mongoose.connection

/*=====================test=========================*/

db.once('open', function(){
	console.log("DB is connected and ready to rock and roll");
});

db.on("error", function(err){
	console.log(err);
});

/*=====================Crypto=========================*/

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = "somethinghere".substr(0, 32); 
/*crypto.randomBytes(32)*/; //Don't like this solution... Add this to process.ENV
const iv = crypto.randomBytes(16);

function encrypt(text) {
 let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
 let encrypted = cipher.update(text, 'binary');
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
 let iv = Buffer.from(text.iv, 'hex');
 let encryptedText = Buffer.from(text.encryptedData, 'hex');
 let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}



/*================Validation for users===================*/

const validation = require('./utilities/Validation')

/*===================================================*/


const app = express();

app.use(bodyParser.text());
app.use(bodyParser.json({limit: '100mb'}));

app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(cors());


/*PORT = process.env.PORT;
*/

PORT = 4500

/* ======================= Utilities ================================ */

makeid= (length) => {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}


create_user= (ac_type, email, user, password, ID, res) => {
	User.find({account_type:ac_type, email:email}, function(err, user_array){
		if(err){
			res.status(400).json(err)
		} else {
			if(user_array.length > 0) {
				res.send({msg:'This user already exists. Have you forgotten your password?'})
			} else {
				User.create({
					account_type: ac_type,
					user: user,
					email: email,
					password: encrypt(password),
					userID: ID,
				})
				res.send({msg:'User created!', route:'login'})
			}
		}
	})
}


validate_and_login = (User, email, pass, res) => {
	if(email.length === 0 || pass.length === 0){
		res.send({login_msg:"Please insert a valid e-mail/password", username:'', route:'login'})
	} else {
		User.find({email: email}, function(err, user){
			if(err){
				res.send({login_msg:"Unable to connect", username:'', route:'login'})
			} else {
				if(user.length > 0) {
					for(var u in user){
						if(user[u].account_type === 'native' && pass === decrypt(user[u].password)) {
						res.send({login_msg:"Success", username:user[u], route:'journal'})
						} 
				}	
				} else {
					res.send({login_msg:"This info is not valid. Please insert a valid e-mail and/or Password", username:'', route:'login'})
				} 
			}
		})
		}
}

renderEntries = (user_id, user_email, journal) => {
	User.find({userID: user_id, email:user_email}, function(err, user){
			if(err){
				res.status(400).json(err)
			} else {

				Entry.find({user: user,  journal: journal}, function(err, entry){
					if(err){
						res.status(400).json(err)
					} else { 
					decry_array = [];
					for(i=0; i<entry.length; i++){
						title = decrypt(entry[i].title)
						content = decrypt(entry[i].content)
						entry_obj = {
							id:entry[i].id,
							title: title,
							content: content,
							created_on: entry[i].created_on
						}
						decry_array.push(entry_obj)
						}

						res.send({
							entry: decry_array		
						})
					}
				})
			}
		})	
}

async function decrypt_arr_entries(entry){ 
	decry_array = [];
	for(i=0; i<entry.length; i++){
		title = decrypt(entry[i].title)
		content =  decrypt(entry[i].content)
		entry_obj =  {
			id:  entry[i].id,
			title:  title,
			content:  content,
			created_on:  entry[i].created_on,
			journal: entry[i].journal
		}
	decry_array.push(entry_obj)
	}
	
	return decry_array
}



/*======================Journal Selection Screen======================*/
app.get('/', (req,res)=>{
	res.send("working!")
})


app.post('/journals', async (req, res) =>{
	var { userID, email} =  req.body
	const a_userID =  userID;
	const a_email =  email;

	user = User.findOne({userID:  a_userID, email:  a_email}, function(err, user){
		if(err){
			return err
		} else {
			return user
		}
	})

	q_user = await user

	journal = Journal.find({user: q_user}, function(err, journals){
		if(err){
			return err
		} else {
			return journals
		}
	})

	q_journal = await journal

	entries = Entry.find({user: q_user}, function(err, entries){
		if(err){
			return err 
		} else {
			return entries
		}
	})

	q_entries = await entries

	if(!a_userID || !a_email){
		res.send({ is_loading: true })
	} else {
		res.send({ journals: q_journal, entries_length: q_journal.length, total_entries: q_entries.length , is_loading: false })

	}
})

app.post('/create_journal', (req, res) =>{
	const {email, userID, journal_title} = req.body 

	User.findOne({userID: userID, email: email}, function(err, user){
		if(err){
			console.log(err)
		} else {
			console.log("creating!")
			Journal.create({
					user: user,
					name: journal_title,
					created_on: Date.now(),
					id: makeid(26)
				}, function(err, success){
					if(err) {
						res.send({msg: "Something went wrong, please try again", is_loading:false})
					} else {
						console.log("created")
						res.send({msg: "Journal created with success", is_loading:false})
					}
				})
		}
	})
})


/*======================Main Page======================*/
app.post('/', (req, res) => {
	const {userID, email, journal} = req.body

	//notification test
  	console.log("==========###### this is / endpoint!#######==============")
  	const {subscription} = req.body
  	console.log(subscription)
	//	


	User.find({userID: userID, email:email}, function(err, user){
			if(err){
				res.status(400).json(err)
				console.log("Failed to fetch User")
			} else {
				Entry.find({user: user, journal:journal}, async function(err, entry){
					if(err){
						res.status(400).json(err)
						console.log("Failed to find the entry")
					} else {
						if(entry.length > 0){
							decry_array = await decrypt_arr_entries(entry)
								.then(res.send({ 
									entry: decry_array		
								}))
						} else {
							res.send({empty: true})
						}

					}
				})
			}
		})
})

app.post('/send', async (req, res) => {
	const {entry_value, entry_title, created_on, userID, email, journal, subscription} = req.body
	console.log(req.body)

	user_1 = await User.find({userID: userID, email:email});

	entry_1 = {
		user: user_1[0],
		title: encrypt(entry_title) || "",	
		content: encrypt(entry_value),
		created_on: created_on,
		journal: journal
	}

	await Entry.create(entry_1, async function(err, entry){
		if(err){
			/*res.status(400).json(err)*/
		} else {
			await user_1[0].posts.push(entry)
			await user_1[0].save()
		}
		
	})

	await User.find({userID: userID, email:email}, async function(err, user){
		if(err){
			/*res.status(400).json(err)*/
		} else {
			Entry.find({user: user, journal: journal}, function(err, entry){
				if(err){
					/*res.status(400).json(err)*/
				} else {
				decry_array = [];
				for(i=0; i<entry.length; i++){
					title = decrypt(entry[i].title)
					content = decrypt(entry[i].content)
					entry_obj = {
						id:entry[i].id,
						title: title,
						content: content,
						created_on: entry[i].created_on
					}
					decry_array.push(entry_obj)
					}

					res.send({
						msg:entry_value + " " + entry_title + " " + created_on,
						entry: decry_array		
					})
				}
			})
		}
	})

	
		
	

})


app.post('/erase', async (req, res) => {
	/*Entry.collection.drop();*/
	const {entry_id, userID, email, journal} = req.body

	await Entry.deleteOne({_id: entry_id})

	renderEntries = (userID, email, journal)
})



app.post('/edit', async (req, res) => {

	const {entry_id, new_title, new_content, email, userID} = req.body

	if(new_content.length > 0 ){
		const entry_1 = await Entry.findOne({_id: entry_id})
		
		await entry_1.updateOne({
				title: encrypt(new_title), 
				content: encrypt(new_content)
		})
		
		await entry_1.save()

		res.send({warning:false})
	} else {
		res.send({warning: true})
	}

})

app.post('/view_all', async(req, res)=> {
	const {email, userID} = req.body 

	User.find({userID: userID, email:email}, function(err, user){
			if(err){
				res.status(400).json(err)
				console.log("Failed to fetch User")
			} else {
				Entry.find({user: user}, async function(err, entry){
					if(err){
						res.status(400).json(err)
						console.log("Failed to find the entry")
					} else {
						if(entry.length > 0){
							console.log("Entries were found:")
							console.log(entry)
							send_entries = []

							decry_array = await decrypt_arr_entries(entry)
							for(i=0; i<decry_array.length;i++){
								_journal = Journal.find({id: decry_array[i].journal}, function(err, jo){
										if(err){
											return err
										} else {
											if(jo){
												console.log("jo[0]")
												console.log(jo[0])
												return jo[0].name
											} else {
												console.log("No journal")
											}
										}
									})
								jo_title = await _journal

								_entry = {
									"id": decry_array[i].id,
									"title": decry_array[i].title,
									"content": decry_array[i].content,
									"created_on": decry_array[i].created_on,
									"journal": await jo_title[0].name.toString()
								}
								send_entries.push(_entry);
							}
							res.send({entry: send_entries,
								is_loading: false})


						} else {
							res.send({empty: true})
						}

					}
				})
			}
		})

/*	q_user = User.findOne({userID: userID, email:email}, function(err, user){
		return user
	});
	q_entries = await Entry
		.find({user:user})
		.populate('Journal')
		.select('journal name')
		//.then(decrypt_arr_entries(q_entries))

	console.log(q_entries);*/


})

app.post('/view_article', async (req, res) => {
	const {entry_id, email, userID} = req.body

	user = User.findOne({userID:  userID, email:  email}, function(err, user){
		if(err){
			return err
		} else {
			return user
		}
	})

	q_user = await user

	entry = Entry.findOne({_id: entry_id, user: q_user}, function(err, entry){
		if(err){
			return err
		} else {
			return entry
		}
	});

	q_entry = await entry

	r_entry = {
		id: q_entry.id,
		user: q_entry.user,
		title: decrypt(q_entry.title),
		content: decrypt(q_entry.content),
		created_on: q_entry.created_on,
		journal: q_entry.journal
	}


	res.send(r_entry)
})

/*==================User Logic will go here=============*/

app.post('/register', (req, res) => {

	const {user, email, password} = req.body;
	const account_type = "native";

	let userID = makeid(30)

	user_check = validation.isUserValid(user);
	pass_check = validation.isPassValid(password);
	email_check = validation.isEmailValid(email)


	if(user_check){
		if(pass_check) {
			if(email_check) {
				create_user(account_type, email, user, password, userID, res)
			} else {
				res.send({msg: 'This e-mail is not valid, please try another.', route:'register'})
			}
		} else {
			res.send({msg: 'Password must contain at least 8 characters. Password should must contain special, numeral and literal characters', route:'register'})
		}
	} else {
		res.send({msg: "User must have between 3 and 20 characters and can't contain special characters", route:'register'})
	}
})


app.post('/login', (req, res) => {
	
	const {email, password} = req.body 
	validate_and_login(User, email, password, res)

})

app.post('/user_get_or_create', async (req, res) => {
	const {account_type, user, email, userID} = req.body;

	User.find({userID}, async function(err, user_instance){
		if(err){
			res.status(400).json(err)
		} else {
			if(user_instance.length > 0) {
				res.send({username: user_instance[0], route: 'journal'})
			} else {
				await User.create({
				account_type: account_type,
				user: user,
				email: email,
				userID: userID,

				}, function(err, created_user) {
					if(err){
						res.status(400).json(err)
					} else {
					res.send({username: created_user[0], route: 'journal'})
					}
				})

			}	
		}
	})

})

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('sgKey');

app.post('/password', (req, res)=> {
	const {email} = req.body;

	User.find({email: email, account_type: 'native'}, function(err, user){
		if(err){
			console.log(err)
		} else {
			if(user.length > 0){
				en_user = encrypt(user[0].userID);
				
				const send_email = {
					from: "password_recover@deep.com",
					to: email,
					Subject: "Deep - Password Recovery",
					html: `<strong>Here</strong> is a link for your password or whatever, lol <br/ > 
							delete this e-mail or whatever if you don't wanna get hacked lol
							<br /> <a href=' http://localhost:4500/pass_recov/${makeid(26)}-${en_user.iv}-${en_user.encryptedData}-${makeid(26)}'> here's a link, lol</a>`
				}

				sgMail.send(send_email)

				res.send({ msg: "An e-mail was sent to this account"})



			} else {
				res.send({ msg: "Couldn't find a user with that E-mail address. Please create an account or login through facebook or google"})
			}
		}
	})

	// Find user by this e-mail with a native account
	// If no such user is found --> Send msg "No user, create an account"
	// If user is found - use the e-mail to send a message ... what message that is is another story.

})

const {check,validationResult} = require('express-validator');

app.get('/pass_recov/:slug', (req, res) =>{
	const {slug} = req.params
	const msg = " " ;
	info = slug.split('-')
	en_userID = {
		iv: info[1],
		encryptedData: info[2]
	}
	User.find({userID: decrypt(en_userID)}, function(err, user){
		console.log(decrypt(user[0].password));
		context = {user_email:user[0].email, user_id: user[0].id, msg: msg, slug:slug}
		res.render('recover_pass.ejs', context)
	})

})

app.post('/pass_recov/:slug', (req, res) => {
	const{pass1, pass2, slug} = req.body
	
	info = slug.split('-')
	en_userID = {
		iv: info[1],
		encryptedData: info[2]
	}
	
	let msg = " " ; 

	pass1_check = validation.isPassValid(pass1);
	pass2_check = validation.isPassValid(pass2);

	if(pass1_check, pass2_check){
		if(pass1 === pass2) {
			User.find({userID: decrypt(en_userID)}, function(err, user){
				if(err){
					console.log(err)
				} else {
					
					user[0].updateOne({
						password: encrypt(pass1)
					}, function(err,succ){
						if(err){console.log(err)} else { console.log(succ)}
					})

					user[0].save();

				}
			})
			res.redirect('http://localhost:3000/')
		} else {
			msg="Your passwords don't match, please try again."
			context = {msg: msg, slug:slug}
			res.render('recover_pass.ejs', context)
		}
	} else {
		msg="Your password must contain at least 8 characters, composed of numbers, letters and special characters"
		context = {msg: msg, slug:slug}
		res.render('recover_pass.ejs', context)
	}

// OLd password:
/*password
:
iv:"7e65f0a1bcdc8ab25f27874ccb074ee2"
4e660037ad419c6b40a5b5430c6c737a
encryptedData :"1f775eae705a338d16d852d663dafa19"
6EuXW9ipANewXLD7cEg9RfP1tmZzXv
 */

	/*console.log(req.body.email)
	// Change the password here! 
	res.redirect('http://localhost:3000/') //Redirect Home*/
})

// Create a get - using the encrypted data... IV + Encrypted_data ?
// Get that encrypted data, translate it into data that can be used to fetch the user
// have a form to create new password
// update the user with the new password 

/*================Profile logic goes here================*/

app.post('/profile', (req, res) => {
	const {userID, email} = req.body;

	User.find({userID: userID, email:email}, function(err, user){
		if(err){
			res.status(400).json(err)
		} else {
			Entry.find({user: user}, function(err, entry){
				if(err){
					res.status(400).json(err)
				} else {
				res.send({post_count: entry.length,
						last_entry: entry[entry.length-1].created_on})
				}
				
			})
		}
		})
})

/*=======================================================*/

/*==================================PUSH NOTIFICATION KEYS*/
const webpush = require('web-push');

publicVapidKey = "publicVapidKey"

privateVapidKey = "privateVapidKey"

webpush.setVapidDetails('mailto: jorgedasilvarodrigues92@gmail.com', publicVapidKey, privateVapidKey);


app.post('/subscribe', async (req, res) => {
  console.log("==========###### this is /subscription endpoint!#######==============")
  console.log(req.body)
  const subscription = req.body

  const payload = JSON.stringify({
	title: 'Deep',
	body: 'Don\'t forget your daily writing session.',
  })
/*  if(process.env){
  	console.log(app.onbeforeunload)
  } else {
  	console.log("weh")
  }
	app.onbeforeunload = setTimeout(function(){
	 	 webpush.sendNotification(subscription, payload)
		    .then(result => console.log("result" + result))
		    .catch(e => console.log(e.stack))
	 }, 4000)*/

//86400000
	
  res.status(200).json({'success': true})
})

app.use(require('express-static')('./'));
/*=============================================================*/

app.listen(PORT)
console.log('running on: ' + PORT)


//https://www.codementor.io/saurabharch/web-push-notification-full-stack-application-with-node-js-restful-api-nnonfcilg