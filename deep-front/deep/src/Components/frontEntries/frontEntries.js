import React, {Component} from 'react';
import EntryEditor from '../EntryEditor/EntryEditor'
import { Editor } from "@tinymce/tinymce-react";

import FroalaEditorComponent from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';


class FrontEntries extends Component {
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
			is_loading: false,
			view_journals: false
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
		console.log(entry_id)
		localStorage.setItem("view_mode", true)
		localStorage.setItem("view_article", entry_id)
		window.location.reload();

	}


	render() {
	let content = this.props.pre_entries.content


		if(this.state.edit_mode===false && content) return (
			<div className="root_div">

				<div className="row" >
					
					<div className="row col-6 offset-lg-1 mb-4" onClick={()=>this.handleClick(this.props.pre_entries.id)} >
	
					 		<p className="col-3">{this.props.pre_entries.created_on.split('T')[0]}</p>
							<div className="col-8 text-left"> {this.props.pre_entries.title.length === 0 
														? <h4> Untitled </h4>
														: <h4> {this.props.pre_entries.title} </h4>
													} </div>
						
					
							<span className="col-12 entry_post" dangerouslySetInnerHTML={{__html: this.props.pre_entries.content.slice(0, 300)}}></span>	
							{this.props.pre_entries.content.length >300
								? <span className="ellipses"><h2>...</h2></span>
								: <span></span>
							}
					
					</div>
					<div className="col-2 col-sm-6 col-md-2 col-lg-2 mb-4 ml-4  ">
						{this.props.pre_entries.journal}
						<button className="mb-4 offset-lg-1 float-right erasebutton" onClick={this.onErase.bind(this, this.props.pre_entries.id)}> Erase </button>
					</div>
				<hr />
				</div>
			
			</div>
			)
		return(
			<div class=" text-center">
				
				<div class="lds-roller "><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
			</div>
			)
		}
	}

export default FrontEntries
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