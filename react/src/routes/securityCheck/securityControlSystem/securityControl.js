/**
 * 作者：窦阳春
 * 日期：2019-5-15
 * 邮箱：douyc@itnova.com.cn
 * 功能：安控体系首页
 */
import React  from 'react';
import {connect } from 'dva';
import { Table, Button,DatePicker,Tabs, Switch,Popconfirm, message, Modal, Input, Select, Pagination, Spin, Row, Col } from 'antd'
import styles from '../../securityCheck/securityCheck.less'
import { routerRedux } from 'dva/router';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';// 富文本的 内容数据值
import { Editor } from 'react-draft-wysiwyg';// 组件化标签
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';// 默认编辑器的css样式
import draftjs from 'draftjs-to-html';// 设置 成为 html标签                                                                                                                                   
class securityControl extends React.PureComponent {
	constructor(props) {super(props);}
	state = {
		visibleVlaue: false,
		key: '',
		contentState: {}
  }
  // 输入富文本内容默认提交动作
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  }
  // 修改提交动作
  onEditorChange = (contentState) => {
    this.setState({
      contentState,
    });
  };
  returnModel = (value) => {
		if(value == 'updateDetails'){
			this.props.dispatch(routerRedux.push({
				pathname: '/adminApp/securityCheck/SecurityControlSystem/updateDetails',
			}))
		}else {
			this.props.dispatch({
				type: 'securityControl/' +value
			})
		}
	}
	editModal = (key) => {  
		let visibledata = '';
		const {contentList, roleType } = this.props;
		if(contentList.length>0) {
			if(roleType == '1' || roleType == '2' || roleType == '3'){
				visibledata = true;
			}else{
				visibledata = false;
			}
			let str = contentList[key-1];
			let newhtmlText = str.replace(/<br\/>/g,"<p></p>");
			// newhtmlText = newhtmlText == '' ? ' ' : newhtmlText
			const blocksFromHTML = convertFromHTML(newhtmlText);
			if(blocksFromHTML.contentBlocks) {
				const state = ContentState.createFromBlockArray(
					blocksFromHTML.contentBlocks,
					blocksFromHTML.entityMap,
				);
				// console.log(newhtmlText, 'blocksFromHTML')
				this.setState({
					editorState: EditorState.createWithContent(state),
				})
			}
			this.setState({
				visibleVlaue: visibledata,
				key: key,
				contentState: newhtmlText
			})
		}
	}
	changeVisible = (htmlText) => {
		if(typeof(htmlText) == 'string'){//Editor中点击模态框确定
			// let strNew = htmlText.replace(/<p>/g,"");
			// let newhtmlText = strNew.replace(/<\/p>/g,"<br/>");
			let data = {
				arg_content: htmlText,
				arg_site_id: this.state.key
			}
			// console.log(htmlText, 'htmlText')
			this.props.dispatch({
				type: 'securityControl/updateRule', //draftjs
				data
			})
		}else if(htmlText.blocks!=undefined){
			console.log(draftjs(htmlText), 'htmlText')
			let data = {
				arg_content: draftjs(htmlText),
				arg_site_id: this.state.key
			}
			this.props.dispatch({
				type: 'securityControl/updateRule', //draftjs
				data
			})
		}
		this.setState({
			visibleVlaue: false
		})
	}
	//----------------------页面渲染----------------------//
	render() {
		const {roleType, contentList} = this.props
		let nodeList = []
		for(var i = 1; i<19; i++) {
			nodeList = [...nodeList, this.refs['t' + i]]
		}
		if(contentList.length>0 && nodeList[0] != undefined){
			if(roleType == '1' || roleType == '2' || roleType == '3'){
				nodeList.map((v, i) => {
					v.innerHTML = contentList[i]; 
					v.onmouseover = function() {
					v.style.backgroundColor="#e9f2f7";
					v.style.cursor = 'pointer'
					}
					v.onmouseout = function() {
						v.style.backgroundColor="#fff";
					}
				})
			}else {
				nodeList.map((v, i) => {
					v.innerHTML = contentList[i];
				})
			}
		}
		return(
			<Spin tip="加载中..." spinning={this.props.loading}>
					<div className={styles.pageContainerControl}>
						{/* <h2 style = {{textAlign:'center',marginBottom:30}}>软研院“一统、四级、五纬”安全管理体系</h2>  */}
						{
							(roleType.length>0 && roleType == '1') ? 
							<Button size="large" type="primary" onClick={() => this.returnModel('updateDetails')}>查看更新状态</Button>
							: ''
						}
						<Modal title="编辑器" 
						width = '720px'
						visible = {this.state.visibleVlaue} 
						onCancel = {this.changeVisible} 
						// onOk = {()=>this.changeVisible(draftjs(this.state.contentState))}
						onOk = {()=>this.changeVisible(this.state.contentState)}
						>
						<Editor
					　　editorState = { this.state.editorState } 
					　　onContentStateChange = {this.onEditorChange}
					　　onEditorStateChange = { this.onEditorStateChange }
						/>
						</Modal>
   					<table id = {styles.tab} cellSpacing = '0'>
							<tbody>
							<tr>
									<th className={styles.title} colSpan="8">软件研究院“一统、四级、五维”安全管理体系（迭代版）</th>
							</tr>
							<tr>
									<td className={styles.an} colSpan="3">安委会统一领导</td>
									<td className={styles.role} colSpan="5">主    任：党委书记<br/>副主任：党委成员<br/>成   员：本部各部门、中心和各分院负责人，安全总监</td>
							</tr>
							<tr>
									<td className= {styles.cfWeight} rowSpan="2">管控级别</td>
									<td className= {styles.cfWeight} rowSpan="2">安全负责主体</td>
									<td className= {styles.cfWeight} rowSpan="2">配属</td>
									<td className= {styles.cfWeight} colSpan="5">五个管控维度</td>
							</tr>
							<tr>
									<td className= {styles.cfWeight}>制度办法建设</td>
									<td className= {styles.cfWeight}>机构人员组成</td>
									<td className= {styles.cfWeight}>支撑系统工具</td>
									<td className= {styles.cfWeight}>应急处置预案</td>
									<td className= {styles.cfWeight}>隐患风控清单</td>
							</tr>
							<tr>
									<td className= {styles.colorSet}>一级管控</td>
									<td className = {styles.tt}>安委办</td>
									<td className = {styles.tt}>
										生产运营专业组<br/>信息网络专业组<br/>综合安全专业组
									</td>
									<td className = {styles.tt} ref='t1' onClick={() =>this.editModal(1)}></td>
									<td className = {styles.tt} ref='t2' onClick={() =>this.editModal(2)}>{}</td>
									<td className = {styles.tt} ref='t3' rowSpan="2" onClick={() =>this.editModal(3)}>{}</td>
									<td className = {styles.tt} ref='t4' onClick={() =>this.editModal(4)}>{}</td>
									<td className = {styles.tt} ref='t5' rowSpan="2" onClick={() =>this.editModal(5)}>{}</td>
							</tr>
							<tr>
									<td className= {styles.colorSet}>二级管控</td>
									<td className = {styles.tt}>
										生产运营专业组<br/>信息网络专业组<br/>综合安全专业组
									</td>
									<td className = {styles.tt}>本部各部门、中心及各分院</td>
									<td className = {styles.tt} ref='t6' onClick={() =>this.editModal(6)}>{}</td>
									<td className = {styles.tt} ref='t7' onClick={() =>this.editModal(7)}>{}</td>
									<td className = {styles.tt} ref='t8' onClick={() =>this.editModal(8)}>{}</td>
							</tr>
							<tr>
									<td className= {styles.colorSet}>三级管控</td>
									<td className = {styles.tt}>各部门、中心及各分院</td>
									<td className = {styles.tt}>各生产项目班组（单元）、重要（核心）岗位人员</td>
									<td className = {styles.tt} ref='t9' onClick={() =>this.editModal(9)}>{}</td>
									<td className = {styles.tt} ref='t10' onClick={() =>this.editModal(10)}>{}</td>
									<td className = {styles.tt} ref='t11' onClick={() =>this.editModal(11)}>{}</td>
									<td className = {styles.tt} ref='t12' onClick={() =>this.editModal(12)}>{}</td>
									<td className = {styles.tt} ref='t13' onClick={() =>this.editModal(13)}>{}</td>
							</tr>
							<tr>
									<td className= {styles.colorSet}>四级管控</td>
									<td className = {styles.tt}>各生产单元</td>
									<td className = {styles.tt}>各项目组及第三方单位人员</td>
									<td className ={styles.tt} ref='t14' onClick={() =>this.editModal(14)}>{}</td>
									<td className = {styles.tt} ref='t15' onClick={() =>this.editModal(15)}>{}</td>
									<td className = {styles.tt} ref='t16' onClick={() =>this.editModal(16)}>{}</td>
									<td className = {styles.tt} ref='t17' onClick={() =>this.editModal(17)}>{}</td>
									<td className = {styles.tt} ref='t18' onClick={() =>this.editModal(18)}>{}</td>
							</tr>
							</tbody>
							</table>
          </div>
			 </Spin>
		)
		
	}
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.securityControl, 
    ...state.securityControl
  };
}

export default connect(mapStateToProps)(securityControl);
