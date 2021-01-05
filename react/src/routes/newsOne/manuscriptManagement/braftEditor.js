/**
 * 作者：郭银龙
 * 日期：2020-10-28
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：富文本编辑器
 */ 
import 'braft-editor/dist/index.css'
import React from 'react'
import BraftEditor from 'braft-editor'
import FileUpload from './fileUpload';   
import {Modal} from 'antd'
export default class BasicDemo extends React.Component {

  state = {
    editorState: BraftEditor.createEditorState(null),
        outputHTML: '' // 编辑器输出内容
  }


  //富文本编辑器
  handleChange = (editorState) => {
    this.setState({
      editorState: editorState,
      outputHTML: editorState.toHTML()
    }, () => {
      console.log(editorState)
      console.log(this.state.outputHTML)
    })
  }

  render () {

 //富文本编辑器上传功能
 const controls = [
  'undo', 'redo', 'separator',
  'font-size', 'line-height', 'letter-spacing', 'separator',
  'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
  'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator',
  'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
  'link', 'separator', 'hr', 'separator',
  'separator',
  'clear'
]
const extendControls = [
  {
    key: 'antd-uploader',
    type: 'component',
    component: (
      <div style = {{width: 270,marginLeft: 10,marginBottom:10}}>
        <FileUpload
        accept="image/*"
        showUploadList={false}
        dispatch={this.props.dispatch}
        fileList ={examineImgId}
        loading = {this.props.loading}
        pageName='setNewManuscript'
        len = {this.props.examineImgId && this.props.examineImgId.length}
      >
        <button type="primary" 
        className="control-item button upload-button" 
        data-title="插入图片">
          <Icon type="picture" theme="filled" />
        </button>
      </FileUpload>
      </div>
     
      
    )
  }
]
    return (
      <div style={{width:800,height:500,overflow:"hidden",display:"inline-block"}}>
          <BraftEditor 
          style={{width:"100%",height:"100%",backgroundColor:"#f7ad9c"}}
          value={this.props.outputHTML!=""?this.props.outputHTML:this.state.editorState} 
            onChange={this.handleChange}
            extendControls={extendControls}
            controls={controls}
            />
            <Modal visible={this.props.previewVisible} footer={null} onCancel={()=>this.returnModel('handleCancel')}>
              <img alt="example" style={{ width: '100%' }} src={this.props.previewImage} />
          </Modal>
      </div>
    )

  }

}