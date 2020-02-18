import React, {Component} from 'react';

class WelcomeComponent extends Component {
	constructor(props){
		super(props)
		this.state = {
			user: localStorage.username,
			date: new Date().toJSON().slice(0,10).replace(/-/g,'/'),
			journals: [{"":""}],
			final_entries: 0,
			total_entries: 0,
			is_loading: false
		}
	}

	getData(){
		fetch('http://localhost:4500/journals', {
      		method: 'post' ,
      		headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				'email': localStorage.getItem('email'),
				'userID': localStorage.getItem('userID'),

			})
		})
		.then(async response => await response.json())
		.then(async data => await this.setState({
				journals: data.journals, 
				final_entries: data.entries_length, 
				is_loading: data.is_loading,
				total_entries: data.total_entries
			})
		)

	}

	render() {
		this.getData();
		return (
		<div className="container-fluid">
			<h1 className="text-center p-4 mb-4 col-sm-12 app-name">Deep</h1>
			<h2 className="wel_subs">For Journaling</h2>
			<h4 className="wel_subs wel_text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt </h4>
			<div className="row">
				<div className="col-9 mb-3 pb-2 wel_data"><h2>{this.state.user}</h2></div>
				<h2 className="col-9 mb-3 pb-2 wel_data" >{this.state.date}</h2>
				<h2 className="col-9 mb-3 pb-2 wel_data">Nº de Artigos: {this.state.total_entries} </h2>
				<h2 className="col-9 mb-3 pb-2 wel_data">Nº de Jornais: {this.state.final_entries}</h2>
			</div>
		</div>
		)
		
		}
	}

export default WelcomeComponent
