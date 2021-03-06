import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import htmlToDraft from 'html-to-draftjs';


export default class RichTextEditor extends Component {
  state = {
    editorState: EditorState.createEmpty(),
  }

  onEditorStateChange= (editorState) => {
    this.setState({
      editorState,
    });
  };
  getRichText =()=>{
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }
  setRichText =(html)=>{
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState,
      });
    }
  }
  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          // wrapperClassName="demo-wrapper"
          // editorClassName="demo-editor"
          editorStyle={{border:"1px solid black",paddingLeft:"15px",lineHeight:'1.2em',minHeight:"120px"}}
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}