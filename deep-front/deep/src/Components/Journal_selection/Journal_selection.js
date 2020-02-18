import React, {Component} from 'react';

class Journal_selection extends Component {
	constructor(props){
		super(props)
		this.state = {
			is_loading: true,
			journals: [{"":""}]
		}
	}


	handleClick(journal_id, journal_name, user) {
		localStorage.setItem('journal', journal_id)
		localStorage.setItem('journal_name', journal_name)		
		localStorage.setItem('route', 'create')
		window.location.reload()
	}


	render() {

		return (
		<div className="col-8 offset-2 journal_div">

			{!this.state.journals
			? <div> Loading </div>
			: 

			<div className="journal_box col-12 mb-4" onClick={() => this.handleClick(this.props.journals.id, this.props.journals.name, this.props.journals.user)}>
				<div className="" >
						<h4 className="journal_name">{this.props.journals.name}</h4>
				</div>
			</div>
			}
	
		</div>

		)
		
		}
	}

export default Journal_selection
