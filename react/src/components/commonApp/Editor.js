/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：富文本编辑器组件
 */
import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Cookie from 'js-cookie';
import style from './Editor.css';

function uploadImageCallBack(file) {
  return new Promise(
    (resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/filemanage/fileupload');
    //  xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=');
      const data = new FormData();
      data.append('arguserid', Cookie.get('userid'));
      data.append('argappname', 'portalFileUpdate')
      data.append('argtenantid', '10010');
      data.append('argyear', new Date().getFullYear());
      data.append('argmonth', new Date().getMonth()+1);
      data.append('argday', new Date().getDate());
      data.append('filename', file);
      // data.append('image', file);
      // xhr.send(data);
      xhr.send(data);
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        // resolve(response.filename.RelativePath);
        resolve({ data: { link:response.filename.RelativePath} });
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    }
  );
}

class EditorConvertToHTML extends Component {
  state = {
    editorState: EditorState.createEmpty(),
  }
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  }
  getData=()=>{
    const{editorState}=this.state;
    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  }
  componentWillReceiveProps(newProps){
    if(newProps.data&&newProps.data.length!=0){
      const blocksFromHtml = htmlToDraft(newProps.data[0].n_content);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState
      })
    }
  }

  render() {
    const { editorState } = this.state;
    return (
      <div className='editorContainer'>
        <Editor
          editorState={editorState}
          localization={{
            locale: 'zh',
          }}
          toolbar={{
           options: ['image'],
           image: {
             uploadCallback: uploadImageCallBack ,
             alignmentEnabled: false,
             defaultSize: {
                height: '100%',
                width: '100%',
              },
             inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg'},
         }}

          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}

export default EditorConvertToHTML;
