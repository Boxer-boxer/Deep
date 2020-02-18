import React from 'react';
import './App.css';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

import EntryForm from './Components/EntryEditor/EntryEditor'
import UserTest from './Components/UserTest/UserTest'
import Profile from './Components/Profile/Profile'
import Journals from './Components/Journals/Journals'
import RecoverPassword from './Components/RecoverPassword/RecoverPassword'


import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

class App extends React.Component {
	constructor() {
		super()
		this.state = {
			route: '',
			account_type: '',
			user:'',
			email: '',
			userID: '',
			username: '',
			msg: '',
			register_user: '',
			register_pass: '',
			register_email: '',
			login_email: '',
			login_pass: '',
			login_msg: '',
			current_journal: '',
			view_article: {'':''},
			recover_active: false
		}

		this.eraseLocal = this.eraseLocal.bind(this)
		this.onProfile = this.onProfile.bind(this)
		this.onReturn = this.onReturn.bind(this)
		this.onRegister = this.onRegister.bind(this)
		this.changeRegistUser = this.changeRegistUser.bind(this)
		this.changeRegistPass = this.changeRegistPass.bind(this)
		this.changeRegistEmail = this.changeRegistEmail.bind(this)
		this.Regist = this.Regist.bind(this)
		this.onReturnLogin = this.onReturnLogin.bind(this)
		this.changeLoginEmail = this.changeLoginEmail.bind(this)
		this.changeLoginPass = this.changeLoginEmail.bind(this)
		this.Login = this.Login.bind(this)
		this.anotherJournal = this.anotherJournal.bind(this)
		this.activateRecover = this.activateRecover.bind(this)
	}

	async componentDidMount() {

		const username =await localStorage.getItem('username')
		const account =await localStorage.getItem('account_type')
	  	const email =await localStorage.getItem('email')
	  	const userID =await localStorage.getItem('userID')
	  	const route =await localStorage.getItem('route')
	  	const journal = await localStorage.getItem('journal')
	  	const journal_name = await localStorage.getItem('journal_name')

		if(email === 'undefined' || username === 'undefined' || userID === 'undefined' ){
			this.setState({route:''})
			localStorage.setItem('route', '')
		}

		if((email && !journal) || (username && !journal) || (userID && !journal)){
			this.setState({route:'journal'})
		}

		if(localStorage.getItem('view_mode')==='true'){
			this.setState({route:'view'})
			if(localStorage.getItem('view_article')){
				const userID = localStorage.getItem('userID');
				const email = localStorage.getItem('email');
				const entry_id = localStorage.getItem('view_article')

				fetch('http://localhost:4500/view_article', {
		      		method: 'post' ,
		      		headers: {"Content-Type": "application/json"},
					body: JSON.stringify({
						'entry_id': entry_id,
						'userID': userID,
						'email': email
				})
			})
			.then(response => response.json())
			.then(data => this.setState({'view_article': data}))
			if(this.state.view_article.length === 0){
				window.location.reload();
			}
			}
		}

	  	this.setState({username: username})
	  	this.setState({account_type: account })
	  	this.setState({email: email })
	  	this.setState({userID: userID})
	  	this.setState({current_journal: journal_name})
	  }

	eraseLocal(){
		this.setState({route:''})
	  	localStorage.clear();
	  	localStorage.setItem('route', '')
	  	window.location.reload();
	  }

	anotherJournal(){
		localStorage.removeItem('journal')
		localStorage.removeItem('journal_name')
		this.setState({route:'journal'})
		localStorage.setItem('route', 'journal')
	}

	onProfile(){
	  	this.setState({route:'profile'})
	}

	activateRecover(){
		this.setState({recover_active: !this.state.recover_active})
	}

	onReturn(){
		this.setState({route:'home'})
	}

	onReturnLogin(){
		localStorage.setItem('route', '')
		this.setState({route:''})
	}


	onRegister(){
		this.setState({route:'register'})
		localStorage.setItem('route', 'register')
	}

	changeRegistUser(event){
		this.setState({register_user: event.target.value})
	}

	changeRegistEmail(event){
		this.setState({register_email: event.target.value})
	}

	changeRegistPass(event){
		this.setState({register_pass: event.target.value})
	}

	changeLoginEmail(event){
		this.setState({login_email: event.target.value})
	}

	changeLoginPass(event){
		this.setState({login_pass: event.target.value})
	}



	Regist() {
		fetch('http://localhost:4500/register', {
      		method: 'post' ,
      		headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				'user': this.state.register_user,
				'email': this.state.register_email,
				'password': this.state.register_pass
			})
		}).then(response => response.json())
		  .then(data => this.setState({msg: data.msg, route: data.route}))
	}

	Login() {
		fetch('http://localhost:4500/login', {
      		method: 'post' ,
      		headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				'email': this.state.register_email,
				'password': this.state.register_pass
			})
		}).then(response => response.json())
		  .then(data => this.setState({login_msg: data.login_msg, username: data.username.user, }, function(err, suc){
		  		if(data.username.user !== "undefined" 
		  			&& data.username.email !== "undefined"
		  			&& data.username.userID !== "undefined"
		  			&& data.username.account_type !== "undefined" ) {
				  		localStorage.setItem('username', data.username.user)
						localStorage.setItem('email', data.username.email)
						localStorage.setItem('userID', data.username.userID)
						localStorage.setItem('account_type', data.username.account_type)
						localStorage.setItem('route', "journal")
						setTimeout(function() {window.location.reload()}, 150)
		  		} /*else {
		  			localStorage.setItem('route', 'login')
		  		}*/
				/*if(localStorage.getItem('email') !== 'undefined' || localStorage.getItem('userID') !== 'undefined') {
				}*/
		  }))

	}


	stopView(){
		localStorage.removeItem('view_mode')
		localStorage.removeItem('view_article')
		window.location.reload()
	}


  render(){

    const responseFacebook = (response) => {
      localStorage.clear();
      this.setState({
      	account_type:'facebook',
      	user: response.name,
      	email: response.email,
      	userID: response.userID
      }, function(){
      	fetch('http://localhost:4500/user_get_or_create', {
      		method: 'post' ,
      		headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				'account_type': 'facebook',
				'user': response.name,
				'email': response.email,
				'userID': response.userID
		})
		}).then(response => response.json())
		  .then(data => this.setState({username: data.username.user, route:data.route}, function(err, suc){
				localStorage.setItem('username', data.username.user)
				localStorage.setItem('email', data.username.email)
				localStorage.setItem('userID', data.username.userID)
				localStorage.setItem('account_type', data.username.account_type)
				localStorage.setItem('route', data.route)
		  }), 
				)
			

      	})}


    const responseGoogle = (response) => {
      localStorage.clear();
      this.setState({
      	account_type:'google',
      	user: response.w3.ig,
      	email: response.w3.U3,
      	userID: response.w3.Eea
      }, function(){
      	fetch('http://localhost:4500/user_get_or_create', {
      		method: 'post' ,
      		headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				'account_type': 'google',
				'user': response.w3.ig,
				'email': response.w3.U3,
				'userID': response.w3.Eea
		})
		}).then(response => response.json())
		  .then(data => this.setState({username: data.username.user, route: data.route}, function(err, suc){
				localStorage.setItem('username', data.username.user)
				localStorage.setItem('email', data.username.email)
				localStorage.setItem('userID', data.username.userID)
				localStorage.setItem('account_type', data.username.account_type)
				localStorage.setItem('route', data.route)
		  }), 
				)
			

      	})}

       if(this.state.route === 'pass_recover') return(
       	<div> recover </div>
       	)

      if(localStorage.getItem('route') ===  "view" || this.state.route === "view") return(
			<div className="App_root">
				<h1 className="app-name col-12 text-center mb-4"> Deep </h1>
				<span className="col-10 col-lg-6 offset-lg-3 offset-1 mb-4 title-card">
					<div className="entryTitle"> 
						{this.state.view_article.title 
							? <h4> {this.state.view_article.title} </h4>
							: <h4> Untitled </h4>
						} 
					</div>
						{this.state.view_article.created_on
							? <p className="date">Started on: {this.state.view_article.created_on.split('T')[0]}</p>
							: <div> Loading </div>
						}

				</span> 
				<div className="col-10 col-lg-6 offset-lg-3 offset-1 mb-4 content-card">
						<p className="entry_post" dangerouslySetInnerHTML={{__html: this.state.view_article.content}}></p>
				</div>

				<button className="returnButton" onClick={this.stopView}> ‹ </button>
			</div> 
			)

		
	  if(/*this.state.route === '' || */localStorage.getItem('route') === '' || !localStorage.getItem('route')) return (
		    <div className="App">

					<div className="native_login">
						<h1 className="app-name mb-4"> Deep </h1>

						<input className="mb-2 mt-4 col-6 col-lg-4" type="email" placeholder="E-mail" onChange={this.changeRegistEmail}/> <br />
						<input className="mb-2 col-6 col-lg-4" type="password" onChange={this.changeRegistPass}/> <br />
						<input className="mb-2 col-6 col-lg-4 loginButton" type="button" value="Login" onClick={this.Login} />
						<p className="col-12 col-lg-12 text-center login-message-appear">{this.state.login_msg}</p>
					

						<div className="socialMediaLogin offset-lg-4 col-lg-4 offset-sm-3 col-sm-6 mb-4">
							<FacebookLogin
								appId="553211538798917" 
							    fields="name,email,picture"
							    callback={responseFacebook}
							/>


							<GoogleLogin
								clientId="905160559565-3390r2a261lfbv0nl3qhc8eiopj2dckj.apps.googleusercontent.com" 
							    buttonText="Login with Google"
							    onSuccess={responseGoogle}
							    onFailure={responseGoogle}
							/>
						</div>
				</div>
	    	<span className="col-12 mt-4 mb-4"> Don't have an account? Create one now. </span> <br />
	    	<button className="mb-2 col-6 col-lg-4 loginButton" onClick={this.onRegister}>Register</button>
	    	<br />

	    	<span className="col-12 mt-4 mb-4"> Lost your password? </span> <br />
	    	<button className="mb-2 col-6 col-lg-4 loginButton" onClick={this.activateRecover}>Recover</button>
	    	{this.state.recover_active === true
		    	?<RecoverPassword />
				: <span> </span>
			}	
		    </div>
		)

	if(localStorage.getItem('route') === 'register') return (
	<div className="">
		<div className="">
			<h1 className=" col-12 text-center mt-4"> Register </h1>
			<div className="col-12 text-center mt-4"> <input className="inputRegister" type="text" onChange={this.changeRegistUser} placeholder="Name"/> </div>
			<div className="col-12 text-center mt-2"> <input className="inputRegister" type="email" onChange={this.changeRegistEmail} placeholder="E-mail" /> </div>
			<div className="col-12 text-center mt-2"> <input className="inputRegister" type="password" onChange={this.changeRegistPass}  placeholder="Password" /> </div>
			<div className="col-12 text-center mt-4">
				<input type="button" className="Goback" value="Go back" onClick={this.onReturnLogin}/> 
				<input type="button" className="GoRegister" value="Register" onClick={this.Regist} />
			</div>	
			<div className="col-12 text-center mt-2">{this.state.msg}</div>
		</div>
	</div>
	)   


	if(this.state.route === 'profile') return (
	<div> <Profile />
	<button onClick={this.onReturn}>Return</button>

	</div>
	)   

	if(/*this.state.route === 'journal' ||*/ localStorage.getItem('route') === 'journal') return (
		<div>
			<Journals userID={this.state.userID} email={this.state.email} username={this.state.username} user={this.state.user}/>
		</div>
	)

	if(localStorage.getItem('route') === 'create')	return(
			<div className="App">
			    <button className="returnButton" onClick={this.anotherJournal}> &#8249; </button>

				{/*<button onClick={this.onProfile}> Profile </button>
			    <button onClick={this.eraseLocal}> Log off </button>*/}

			   	<h1 class="text-center mt-4 mb-4 col-sm-12 app-name"> Deep </h1>

			    <EntryForm user={this.state.user} account_type={this.state.account_type} email={this.state.email} userID={this.state.userID} />

			</div>
		)  
	   
	   
  }
}

export default App;
