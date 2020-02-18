import React, {Component} from 'react';

class UserTest extends Component {
	constructor(props){
		super(props)
		this.state = {
			user: "",
			token: ""
		}
	}

	async componentDidMount(){

		/*let search = window.location.search;
		let token = search.split('?code=')[1]

		await this.setState({token: token})		
		await console.log(this.state.token)
	
		fetch("http://localhost:4500/auth/facebook/callback", {
			method: 'GET',
		}).then(response => response.json())
		.then(data => this.setState({user: data.user}))*/

	}



	render() {
		return (
			<div>
			<h1> Welcome, {this.state.name} </h1>
			</div>
		)
	}
}

export default UserTest