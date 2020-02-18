import React, {Component} from 'react';
import Journal_selection from '../Journal_selection/Journal_selection'
import WelcomeComponent from '../WelcomeComponent/WelcomeComponent'
import FrontEntries from "../frontEntries/frontEntries";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faTimesCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

class Journals extends Component {
	constructor(props){
		super(props)
		this.state = {
			journal_id: '',
			journal_title: '',
			journal_created_on: '',
			newJournalTitle: '',
			isLoaded: false,
			warning: '',
			msg: '',
			journals: [{'':''}],
			initial_entries: 0,
			final_entries: 0,
			is_loading: false,
			entries: [{"":""}]
		}
		this.onNewJournalTitle = this.onNewJournalTitle.bind(this)
		this.createJournal = this.createJournal.bind(this)
		this.showJournals = this.showJournals.bind(this)
	}

	async componentDidMount(){
		await this.fetchEntries();
		await this.fetchJournals();

	}


	eraseLocal(){
	  	localStorage.clear();
	  	localStorage.setItem('route', '')
	  	window.location.reload();
	}

	async fetchJournals(){
		fetch('http://localhost:4500/journals', {
      		method: 'post' ,
      		headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				'email': localStorage.getItem('email'),
				'userID': localStorage.getItem('userID'),

			})
		}).then(async response => await response.json())
		.then(async data => await this.setState({
				journals: data.journals, 
				final_entries: data.entries_length, 
			})
		)
		
	}

	async fetchEntries(){
		fetch('http://localhost:4500/view_all', {
      		method: 'post' ,
      		headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				'email': localStorage.getItem('email'),
				'userID': localStorage.getItem('userID'),

			})
		})
		.then(async response => await response.json())
		.then(async data => await this.setState({
				entries: data.entry

			})
		)
		
	}

	RenderEntries = () => {
		if(this.state.entries) {
			return(
				<div>
					{this.state.entries.map((item, key) => 
						<FrontEntries pre_entries={item} key={item.id} />
						).reverse()}
				</div>
				)
		} else {
			return(
				<div> 
					No entries to display... 
				</div>
				)
		}
		
	}


	onNewJournalTitle(ev){
		this.setState({newJournalTitle: ev.target.value})
	}

	showJournals(){
		this.setState({showJournals: !this.state.showJournals});
		console.log(this.state.showJournals)
	}

	createJournal(){
		if(this.state.newJournalTitle.length > 0) {
			this.setState({is_loading:true})
			fetch("http://localhost:4500/create_journal", {
			method: 'POST',
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				'journal_title': this.state.newJournalTitle,
				'username': localStorage.getItem('username'),
				'userID': localStorage.getItem('userID'),
				'email': localStorage.getItem('email')
			})
		})
		.then(response => response.json())
		.then(data => this.setState({
						msg: data.msg,
					})
				)

		this.fetchJournals()
		
		setTimeout( function(){
		window.location.reload()
		}, 3000);
		} else {
			this.setState({warning: "Your new Journal needs a title!"})
			setTimeout(
			    function() {
			        this.setState({warning: ""});
			    }
			    .bind(this),
			    5000
			);
		}

	}

render() {

	return(
	<div>

			<div class="welcome">
					<button className="returnButton logOffContainer" type="submit" onClick={this.eraseLocal}> 
						<FontAwesomeIcon icon={faSignOutAlt} />
					</button>
				
					{this.state.is_loading === true
						?<div> Loading </div>
						:<div>
							
						{this.state.initial_entries < this.state.final_entries
 						
						?<div>
	
								<WelcomeComponent />
									<div className="JournalsButton" onClick={this.showJournals}> 									
										 <FontAwesomeIcon icon={faBook} />
									</div>
									<div className="row col-12 " >
										<div className="col-lg-6 col-md-6 col-sm-8 offset-lg-1 mt-4 mb-4 wel_data"> ENTRIES</div>
										<div className="col-lg-2 col-md-2 col-sm-2 mt-4 mb-4 ml-lg-4 wel_data "> JOURNALS </div>
									</div>
								<div className="container-fluid container-entries">
									{this.RenderEntries()}
								</div>


								{this.state.showJournals === true
									?<div className="journals_container">
										<div className="row  "> 
											<div className="closeBtn ml-auto mr-3" onClick={this.showJournals}> 
												<FontAwesomeIcon icon={faTimesCircle} />
											</div>
										</div>
										<div className="row ">
											{this.state.journals.map((item, key) => 
											<Journal_selection journals={item} key={item.id} />
												).reverse()}
											<div className="col-12 text-center journal_entries">
												<div className="CreateJournal mx-auto">
													<span> Create a Journal </span>
													<input type="text" placeholder="My new Journal" onChange={this.onNewJournalTitle} />
													<button type="submit" onClick={this.createJournal}> Create </button>
												</div>
											</div>
										</div>
									</div>
									:<div></div>
								}
								<p> {this.state.warning} </p>
								<p> {this.state.msg} </p>

								
							</div>
						:<div> 
							<WelcomeComponent />
								<div className="JournalsButton" onClick={this.showJournals}> 
									<div id="nav-icon3">
									  <span></span>
									  <span></span>
									  <span></span>
									  <span></span>
									</div>
								</div>
							You don't seem to have a journal yet. Create one to start writing! 
							{this.state.showJournals === true
									?<div className="journals_container">
										<div className="row  "> 
											<div className="closeBtn ml-auto mr-3" onClick={this.showJournals}> X </div>
										</div>
										<div className="row ">
											{this.state.journals.map((item, key) => 
											<Journal_selection journals={item} key={item.id} />
												).reverse()}
											<div className="col-12 text-center journal_entries">
												<div className="CreateJournal mx-auto">
													<span> Create a Journal </span>
													<input type="text" placeholder="My new Journal" onChange={this.onNewJournalTitle} />
													<button type="submit" onClick={this.createJournal}> Create </button>
												</div>
											</div>
										</div>
									</div>
									:<div></div>
								}
						</div>
					
						}
					
					</div>
					}
			</div>

	</div>	
		)

	}

}

export default Journals;
