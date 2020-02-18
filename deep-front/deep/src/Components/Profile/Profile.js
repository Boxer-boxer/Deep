import React, {Component} from 'react';
import CountUp from 'react-countup';

class Profile extends Component {
	constructor(props){
		super(props)
		this.state = {
			username: "Unavailable",
			account_type: "Unavailable",
			email: "Unavailable",
			userID: "Unavailable",
			post_count: 0,
			last_entry: '',
		}
	}




	async componentDidMount() {
		const username =await localStorage.getItem('username')
		const account =await localStorage.getItem('account_type')
	  	const email =await localStorage.getItem('email')
	  	const userID =await localStorage.getItem('userID')
	  	const route =await localStorage.getItem('route')

	  	this.setState({username: username})
	  	this.setState({account_type: account })
	  	this.setState({email: email })
	  	this.setState({userID: userID})

	  	fetch('http://localhost:4500/profile', {
	  		method: 'post' ,
      		headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				'userID': userID,
				'email': email,
			})
	  	}).then(response => response.json())
	  		.then(data => this.setState({
	  				post_count: data.post_count,
	  				last_entry: data.last_entry
	  		}))

	}


render() {


	return(
		<div className="App">
			<h1> {this.state.username} </h1>
			<img className="profilePic" src="https://images.pexels.com/photos/1878304/pexels-photo-1878304.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" />
			<h5> {this.state.account_type} </h5>
			<h3> {this.state.email} </h3>
			<div> Post count: 
				<CountUp start={0} end={this.state.post_count} delay={0}>
				  {({ countUpRef }) => (
				    <div>
				      <span ref={countUpRef} />
				    </div>
				  )}
				</CountUp>
			</div> <br/>
			<div> Last entry: <br />
				{this.state.last_entry.replace('T', ", ").substring(0, 20)}
			</div>
		</div>
		)
}

}
export default Profile