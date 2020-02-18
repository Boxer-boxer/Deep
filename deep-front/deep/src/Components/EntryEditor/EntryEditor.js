import React, {Component} from 'react';
import PreEntries from "../PreEntries/PreEntries";
import { Editor } from "@tinymce/tinymce-react";

import FroalaEditorComponent from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

class EntryEditor extends Component {
	constructor(props) {
		super(props) 
		this.state = {
			entry_title: "",
			entry_value: "",
			pre_entries: [{'':''}],
			is_loading: true,
			submitted: false,
			warning: '',
			empty: false,
			view_mode: false,
		}
	}

    componentDidMount(){
    	const user = this.props.user || localStorage.username
    		,userID = this.props.userID || localStorage.userID
    		,email = this.props.email || localStorage.email
    		,account_type = this.props.account_type || localStorage.account_type


	
		fetch('http://localhost:4500/', {
      		method: 'post' ,
      		headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				'account_type': account_type,
				'user': user,
				'email': email,
				'userID': userID,
				'journal': localStorage.getItem('journal')
			})
		})
		.then(response=> response.json())
		.then(data => this.setState({
					pre_entries: data.entry,
					is_loading: false
				}))


	}


	inputRegister = (event) => {

		this.setState({entry_value: event})
	}

	titleRegister = (event) => {
		if(event.target.value.length === 0){
			this.setState({entry_title: "Untitled"})
			console.log("untitled")
		} else {
			this.setState({entry_title: event.target.value})
			console.log("titled")
		}
	}

	logRegister = (event) => {
		console.log(event.target.getContent())
	}

	Submit = async (ev) => {
		if(this.state.entry_value.length > 0) {
		this.setState({is_loading:true})
		fetch("http://localhost:4500/send", {
			method: 'POST',
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				'entry_title': this.state.entry_title,
				'entry_value': this.state.entry_value,
				'created_on': Date.now(),
				'email': localStorage.getItem('email'),
				'userID': localStorage.getItem('userID'),
				'journal': localStorage.getItem('journal')
			})
		})
		.then(response => response.json())
		.then(data => this.setState({
						is_loading: false,
						submitted:true,
						pre_entries: data.entry,
						is_loading: false,
						warning: "",
						entry_title: "",
						entry_value: "",
						empty: data.empty
					})) 
		.then(window.location.reload)
		} else {
			this.setState({warning: "Content can't be empty!"})
			setTimeout(
			    function() {
			        this.setState({warning: ""});
			    }
			    .bind(this),
			    5000
			);
		}}
	

	RenderEntries = () => {
		if(this.state.pre_entries) {
			return(
				<div>
					{this.state.pre_entries.map((item, key) => 
						<PreEntries pre_entries={item} key={item.id} />
						).reverse()}
				</div>
				)
		} else {
			return(
				<div> 
					Please create a new entry! 
				</div>
				)
		}
		
	}


	render() {
	

		return (
			<div>
				{this.state.is_loading === true
				? <div> 
					<h1> is_loading </h1> 
					<p> Please be patient </p>
				</div>

				: <div> 
					
					<button type="button" className="submitButton" onClick={this.Submit.bind(this)}> <img src="https://img.icons8.com/windows/32/000000/checkmark.png" /> </button> <br />
					
					<div className="col-10 col-lg-6 offset-lg-3 offset-1 mb-4 title-card">
						<input type="text" onChange={this.titleRegister} placeholder="Insert Title"/> <br />
						<p> Started now </p>
					</div>

					<div className="separator mt-2 mb-2 col-4 offset-4"></div> 

					<FroalaEditorComponent
						  tag='textarea'
						  config={{
						  	placeholderText: 'Insert text here...' 
						  }}
						  onModelChange={this.inputRegister} 
						/>

					
					<p className="warning-red"> {this.state.warning} </p>
					
					<br />
					<h2 className="mb-4 mt-4"> Your most recent entries </h2>
					{this.RenderEntries()}
				
			   </div>
		
		}
		</div>
	)
	}

}

export default EntryEditor


/*	*/					/*<Editor className="textBox mb-4"
					         init={{
					           min_width: 200,
					           height: 500,
					           menubar: false,
					           plugins: [
					             'advlist autolink autoresize lists link image charmap print preview anchor',
					             'searchreplace visualblocks code fullscreen',
					             'insertdatetime media table paste code help wordcount'
					           ],
					           toolbar:
					             'undo redo | formatselect | bold italic backcolor | \
					             alignleft aligncenter alignright alignjustify | \
					             bullist numlist outdent indent | removeformat | help'
					         }} onChange={this.inputRegister} />
					*/