import React, {Component} from 'react';

class RecoverPassword extends Component {
	constructor(props){
		super(props)
		this.state = {
			email: '',
			msg: ''
		}

		this.onEmailChange = this.onEmailChange.bind(this)
		this.handleClick = this.handleClick.bind(this)
	}

	onEmailChange(ev){
		this.setState({email: ev.target.value});
		console.log(this.state.email)
	}

	handleClick(email) {
		fetch('http://localhost:4500/password', {
      		method: 'post' ,
      		headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				'email': this.state.email,
			})
		})
		.then(response=> response.json())
		.then(data => this.setState({
					msg: data.msg
				}))
	}


	render() {

		return (
		<div className="RecoverPassContainer col-12">
			<div className="col-12 mb-4 mt-4">E-mail:</div> 
			<div className="col-12">
				<input className="emailBar mr-3" type="email" onChange={this.onEmailChange} /> 
				<input className="emailBtn" type="button" value="Send E-mail" onClick={this.handleClick}/>
			</div>
			<br />{this.state.msg} 
		</div> 
		)
		
		}
	}

export default RecoverPassword
