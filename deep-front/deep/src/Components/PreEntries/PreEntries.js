import React, {Component} from 'react';
import EntryEditor from '../EntryEditor/EntryEditor'
import { Editor } from "@tinymce/tinymce-react";

import FroalaEditorComponent from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';


class PreEntries extends Component {
	constructor(props){
		super(props)
		this.state = {
			edit_mode: false,
			entry_selected: '',
			edited_id: '',
			edited_title: '',
			edited_content: '',
			warning: false,
			view_mode: false,
		}
	}

	onErase = (ev) => {

    	const userID = this.props.userID || localStorage.userID
    		,email = this.props.email || localStorage.email


		fetch('http://localhost:4500/erase', {
      		method: 'post' ,
      		headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				'userID': userID,
				'email': email,
				'entry_id': ev,
				'journal': localStorage.journal
			})
		})
		.then(window.location.reload())

	}

	onEdit = (ev) => {
		this.setState({edit_mode: true, edited_id:ev})
		this.setState({edited_content: this.props.pre_entries.content})
	}

	contentRegister = (ev) => {
		this.setState({edited_content: ev})
	}

	titleRegister = (ev) => {
		if(ev.length === 0){
		this.setState({edited_title: "Untitled"})
	} else {
		this.setState({edited_title: ev.target.value})
	}
	}

	onSave = async (ev) => {
		
		const userID = this.props.userID || localStorage.userID
    		  ,email = this.props.email || localStorage.email


		await fetch('http://localhost:4500/edit', {
      		method: 'post' ,
      		headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				'userID': userID,
				'email': email,
				'entry_id': this.state.edited_id,
				'new_title': this.state.edited_title,
				'new_content': this.state.edited_content
			})
		})
		.then(response => response.json())
		.then(data => this.setState({warning: data.warning}))
		
		console.log("Warning status: " + this.state.warning)
		
		if(this.state.warning === true){
			this.setState({edit_mode:true})
			}else{
			this.setState({edited_id: '', edited_content:'', edited_title:'', edit_mode:false})	
			window.location.reload()
			}

	}

	handleClick(entry_id) {
		localStorage.setItem("view_mode", true)
		localStorage.setItem("view_article", entry_id)
		window.location.reload();
	}


	render() {
	let content = this.props.pre_entries.content
		

		if(this.state.edit_mode===false) return (
			<div className="root_div">
						{console.log(this.props.pre_entries)}
				<div className="entry" onClick={()=>this.handleClick(this.props.pre_entries.id)}>
					
					<div className="col-10 col-lg-6 offset-lg-3 offset-1 mb-4 title-card">
						<p className="date">Started on: {this.props.pre_entries.created_on.split('T')[0]}</p>
						<div className="entryTitle"> {this.props.pre_entries.title.length === 0 
													? <h4> Untitled </h4>
													: <h4> {this.props.pre_entries.title} </h4>
												} </div>
					</div>
					<div className="col-10 col-lg-6 offset-lg-3 offset-1 mb-4 content-card">
						<span className="entry_post" dangerouslySetInnerHTML={{__html: this.props.pre_entries.content.slice(0, 300)}}>

						</span>{this.props.pre_entries.content.length >300
								? <span><h2>...</h2></span>
								: <span></span>
							}
					</div>

				</div>
				<button className="EraseBtn" onClick={this.onErase.bind(this, this.props.pre_entries.id)}> Erase </button>
				<button className="EditBtn" onClick={this.onEdit.bind(this, this.props.pre_entries.id)}> Edit </button>

			</div>
			)
		return(
			<div>
				<input type='text' defaultValue={this.props.pre_entries.title} onChange={this.titleRegister}/>
				<FroalaEditorComponent
						  tag='textarea'
						  config={{
						  	placeholder: 'Insert text here...' 
						  }}
						  model={this.state.edited_content}
						  onModelChange={this.contentRegister} 
						/>

		

				<button onClick={this.onSave.bind(this, this.props.pre_entries)}> Save </button>
				
				{this.state.warning === true 
					?<div><h4 className="warning-red">Content Can't be empty</h4></div>
					:<div> </div>
				}

			</div>
			)
		}
	}

export default PreEntries
/*
onChange={this.inputRegister}

		<Editor initialValue={this.props.pre_entries.content}
					         init={{
					           height: 200,
					           menubar: false,
					           plugins: [
					             'advlist autolink lists link image charmap print preview anchor',
					             'searchreplace visualblocks code fullscreen',
					             'insertdatetime media table paste code help wordcount'
					           ],
					           toolbar:
					             'undo redo | formatselect | bold italic backcolor | \
					             alignleft aligncenter alignright alignjustify | \
					             bullist numlist outdent indent | removeformat | help'
					         }} onChange={this.contentRegister} />


					         					<p className="date">id: {this.props.pre_entries.id} </p>*/