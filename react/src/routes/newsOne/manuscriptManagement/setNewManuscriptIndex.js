/**
 * 作者：郭银龙 
 * 日期：2020-9-28
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：稿件填报
 */ 
import Cookie from 'js-cookie';
import React  from 'react';
import {connect } from 'dva';
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
import {Button,DatePicker,TreeSelect,Upload, Icon, Radio, Input, Select ,Modal,Table,Popconfirm} from 'antd'
import styles from './setNewstyle.less'
import moment from 'moment';
import FileUpload from './fileUpload';        //上传功能组件
const dateFormat = 'YYYY-MM-DD HH:mm:ss'; 
const {RangePicker} = DatePicker;
const TreeNode = TreeSelect.TreeNode;
const Search = Input.Search; 
const {Option} = Select;    
const RadioGroup = Radio.Group; 
class setNewManuscript extends React.PureComponent {
	state = {
		beginTime: this.props.startTime, 
		endTime: this.props.endTime,
		value: this.props.checkValue,
    inforid:"",
    tijiaorenValue:"",//提交人value
    editorState: BraftEditor.createEditorState(null),
    outputHTML: '' // 编辑器输出内容

    }
	//得到时间保存时间
	changeDate = (date,dateString) => {
			this.props.dispatch({
				type: 'setNewManuscript/changeDate',
				startTime: dateString, 
			})
	}; 
returnModel =(value,value2,value3)=>{
	let saveData = {
    startTime: this.props.startTime,
    }
    let outputHTML =this.state.outputHTML
	if(value2!==undefined){
		this.props.dispatch({
			type:'setNewManuscript/'+value,
            record : value2,
            saveData,
            outputHTML,
            name : value3,
		})
	}else{
		this.props.dispatch({
			type:'setNewManuscript/'+value,
		})
	}
};
//富文本编辑器
handleChange = (editorState) => {
  this.setState({
    editorState: editorState,
    outputHTML: editorState.toHTML()
  }, () => {
  })
}


	//----------------------页面渲染----------------------//
	render() {
        const { checkObjectAndContentList, checkContentList, qudaoDataList,author,authorList,querySecretFileList,examineImgId} = this.props;
        //单位
        checkObjectAndContentList.length == 0 ? [] : checkObjectAndContentList.map((item, index) => { //申请单位
			          item.key = item.deptId;
                item.title = item.deptName
                item.value = item.deptId
                item.disabled = true;
                item.children.map((v, i) => {
				        v.key = index + '-' + i;
                v.title = v.deptName
                v.value = v.deptId
			          })
        });
        

        //提交人
        checkContentList.length === 0 ? [] : checkContentList.map((item ,index) => { 
                item.key = index;
                item.title = item.deptName
                item.value = item.deptId
                item.disabled = true;
                item.children.map((v, i) => {
				        v.key = index + '-' + i;
                v.title = v.userName
                v.value = v.userName
			          })
        })
        //渠道
        qudaoDataList.length == 0 ? [] : qudaoDataList.map((item,index) => { 
              item.key = index;
              item.title = item.channelName
              item.value = item.id
              item.disabled = true;
              item.children.map((v, i) => {
              v.key = index + '-' + i;
              v.title = v.channelName
              v.value = v.channelName
              })
            });
        //作者
        let authList = authorList.length === 0 ? [] : authorList.map((item) => { 
			return <Option key={item.id} value={item.roleName}>{item.roleName}</Option>
		})
        const formItems = author.length == 0 ? [] :author.map((item, index) => (
            <div style={{marginTop:10}} key={index}>
                        <span className={styles.lineKey}>
                            <b className={styles.lineStar}></b>
                        </span>
                        <span className={styles.lineColon}></span>
                            <Select  
                            style={{ width: 120 }}
                            onChange={(e)=>this.returnModel('onAuthorCheck',e,index)}
                            value={this.props.authorTypeName[index]}
                            placeholder="请选择">
                                    <Option value="文稿作者">文稿作者</Option>
                                    <Option value="图片作者">图片作者</Option>
                                    <Option value="视频剪辑人员">视频剪辑人员</Option>
                                    <Option value="H5编辑人员">H5编辑人员</Option>
                                    {/* <Option value="其他">其他</Option> */}
                            </Select>
                            <TreeSelect
                                        showSearch
                                        value={this.props.authorDept[index]}
                                        style={{ minWidth: "180px", maxWidth: 260 }}
                                        dropdownStyle={{ maxHeight: 500, minHeight: 200,minWidth: 400 , overflow: 'auto' }}
                                        placeholder="请选择部门"
                                        treeData={checkObjectAndContentList}
                                        allowClear
                                        multiple
                                        // treeDefaultExpandAll
                                        treeDefaultExpandedKeys={Cookie.get('OUID')}
                                        onChange={(e)=>this.returnModel('onDanWeiAuthorList',e,index)}
                                    >
                                    </TreeSelect>
                                    <TreeSelect
                                        showSearch
                                        style={{ minWidth: "180px", maxWidth: 260 }}
                                        dropdownStyle={{ maxHeight: 500, minHeight: 200,width: 540 , overflow: 'auto' }}
                                        placeholder="请选择姓名"
                                        treeData={checkContentList}
                                        allowClear
                                        multiple
                                        treeDefaultExpandAll
                                        value={this.props.authorBy[index]}
                                        onChange={(e)=>this.returnModel('onAuthorList',e,index)}
                                    >
                                    </TreeSelect>
                                    <Icon type="plus-circle" onClick={()=>this.returnModel('add',item) }  style={{marginRight:"20px"}}/>
                                    {(author).length > 1 ? (
                                        <Icon
                                            className="dynamic-delete-button"
                                            type="minus-circle-o"
                                            onClick={()=>this.returnModel('remove',index) }
                                    />
                        ) : null}
                    </div>
                 
                    ));
        //附件上传
        
          //       //富文本编辑器上传
          //       const controls = [
          //         'undo', 'redo', 'separator',
          //         'font-size', 'line-height', 'letter-spacing', 'separator',
          //         'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
          //         'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator',
          //         'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
          //         'link', 'separator', 'hr', 'separator',
          //         // 'media',
          //         'separator',
          //         'clear'
          //       ]
          //     const extendControls = [
          //         {
          //           key: 'antd-uploader',
          //           type: 'component',
          //           component: ( 
          //             <div className="photoList" >
          //             <FileUpload
          //               accept="image/*"
          //               showUploadList={false}
          //               dispatch={this.props.dispatch}
          //               fileList ={examineImgId}
          //               loading = {this.props.loading}
          //               pageName='setNewManuscript'
          //               len = {this.props.examineImgId && this.props.examineImgId.length}
          //             >
          //               <button type="primary" 
          //               className="control-item button upload-button" 
          //               data-title="插入图片">
          //                 <Icon type="picture" theme="filled" />
          //               </button>
          //             </FileUpload>
          //             </div>
          //             )
          //   }
          // ]

        const  columns = [
          {
            title: '序号',
            dataIndex: '',
            width: '8%',
            key:'index',
            render: (text, record, index) => {
              return (<span>{index+1}</span>);
            },
          }, {
            title: '文件名称',
            dataIndex: 'upload_name',
            key:'key',
            width: '40%',
            render: (text) => {
              return <div style={{ textAlign: 'left' }}>{text}</div>;
            },
          }, {
            title: '操作',
            dataIndex: '',
            key:'opration',
            width: '22%',
            render: (text, record) => {
              return (
                <div style={{ textAlign: 'center' }}>
                  <Popconfirm
                    title="确定删除该文件吗?"
                    // onConfirm={(e) => this.deleteUpload(e,record)}
                    onConfirm={(e)=>this.returnModel('deleteEvidenceFile',record)}
                  >
                    <Button
                      type="primary"
                      size="small"
                    >
                      删除
                    </Button>
                  </Popconfirm>
      
      
                </div>
              );
            },
          }, 
        ] 
      
                    return(
            
            <div className={styles.pageContainer}>
						<h2 style = {{textAlign:'center',marginBottom:30}}>稿件填报</h2>
						
              <div className={styles.lineOut}>
                      <span className={styles.lineKey}>
                      <b className={styles.lineStar}>*</b> 稿件名称
                      </span>
                      <span className={styles.lineColon}>：</span>
                      <Input style={{width:'570px'}} placeholder = "请输入" value={this.props.theme}  onChange={(e)=>this.returnModel('theme',e)}/>
              </div>
            <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                     <b className={styles.lineStar}>*</b>新闻事实发生时间
                    </span>
                    <span className={styles.lineColon}>：</span>
                    <span>
                    <DatePicker 
                            showTime={{ defaultValue: moment('YYYY/MM/DD HH:mm:ss') }}
                            onChange = {this.changeDate} 
                            placeholder="新闻事实发生时间"
                            format="YYYY-MM-DD HH:mm:ss"
                            style = {{width:200, marginRight:10}}
                            value={this.props.startTime == '' ? null : moment(this.props.startTime, dateFormat)}
                            
                            />
						
                    </span>
          	</div>
              <div className={styles.lineOut}>
              <span className={styles.lineKey}>
                  <b className={styles.lineStar}>*</b>申请单位
              </span>
              <span className={styles.lineColon}>：</span>
              <TreeSelect
							showSearch
							style={{ width: 570 }}
							value={this.props.checkObject}
                            dropdownStyle={{ maxHeight: 500, minHeight: 200, overflow: 'auto' }}
							placeholder="请选择"
							treeData={checkObjectAndContentList}
							allowClear
							multiple
              // treeDefaultExpandAll
              treeDefaultExpandedKeys={Cookie.get('OUID')}
							onChange={(e)=>this.returnModel('onObjectChange',e)}
						>
						</TreeSelect>
            </div>
            <div className={styles.lineOut}>
              <span className={styles.lineKey}>
                  <b className={styles.lineStar}>*</b> 提交人
              </span>
              <span className={styles.lineColon}>：</span>

              {Cookie.get('username')}
            </div>
            <div className={styles.lineOut}>
								<span className={styles.lineKey}>
									<b className={styles.lineStar}>*</b>
									审核流程
								</span>
								<span className={styles.lineColon}>：</span>
                <RadioGroup 
                onChange={(e)=>this.returnModel('changecheckValue',e)}
                  value={this.props.checkValue}>
									<Radio value={"院级"}>院级</Radio>
									<Radio value={"分院级"}>分院级</Radio>
                  <Radio value={"外部媒体"}>外部媒体</Radio>
								</RadioGroup>
            </div>

            <div   >
            <span className={styles.lineKey}>
            <b className={styles.lineStar}>*</b>
                作者
            </span>
            <span className={styles.lineColon}>：</span>
              {formItems}
            </div>
            <div className={styles.lineOut}>
								<span className={styles.lineKey}>
									<b className={styles.lineStar}>*</b>
									稿件类型
								</span>
								<span className={styles.lineColon}>：</span>
                <RadioGroup 
                onChange={(e)=>this.returnModel('onChangeGaoJian',e)}
                value={this.props.changecheckGaoJianValue}>
                  <Radio value={"p"}>党建稿件</Radio>
                  {/* <Radio value={"i"}>项目类稿件</Radio> */}
                  <Radio value={"b"}>其他稿件</Radio>
								</RadioGroup>
            </div>
            <div className={styles.lineOut}>
								<span className={styles.lineKey}>
									<b className={styles.lineStar}>*</b>
									是否已领取其他专项奖励
								</span>
								<span className={styles.lineColon}>：</span>
                  <RadioGroup
                  onChange={(e)=>this.returnModel('onJiangLi',e)}
                  value={this.props.checkJiangLiValue}>
									<Radio value={"1"}>是</Radio>
									<Radio value={"0"}>否</Radio>
								</RadioGroup>
            </div>
            <div className={styles.lineOut}>
								<span className={styles.lineKey}>
									<b className={styles.lineStar}>*</b>
									是否原创
								</span>
								<span className={styles.lineColon}>：</span>
                <RadioGroup   
                  onChange={(e)=>this.returnModel('onOriginal',e)}
                  value={this.props.checkOriginalValue}>
									<Radio value={"1"}>是</Radio>
									<Radio value={"0"}>否</Radio>
								</RadioGroup>
            </div>
            <div className={styles.lineOut}>
								<span className={styles.lineKey}>
									<b className={styles.lineStar}>*</b>
									素材是否涉密
								</span>
								<span className={styles.lineColon}>：</span>
                  <RadioGroup   
                  onChange={(e)=>this.returnModel('onSecret',e)}
                  value={this.props.checkSecretValue}>
									<Radio value={"1"}>是</Radio>
									<Radio value={"0"}>否</Radio>
								</RadioGroup>
                {querySecretFileList?
                    <a style={{color:"red"}} href={querySecretFileList.url} target="_blank">{querySecretFileList.fileName}</a>
                :""}
            </div>
            <div className={styles.lineOut}>
								<span className={styles.lineKey}>
									<b className={styles.lineStar}>*</b>
									宣传素材上传
								</span>
								<span className={styles.lineColon}>：</span>
                <FileUpload dispatch={this.props.dispatch} passFuc = {this.saveData} pageName='setNewManuscript'/>
                <Table
                      columns={ columns }
                      loading={ this.props.loading }
                      dataSource={ this.props.tableUploadFile}
                      className={ styles.orderTable }
                      pagination = { false }
                      style={{width:500,marginTop:'10px',marginLeft:200}}
                      bordered={ true }
                      /> 
            </div>
            {/* <div className={styles.lineOut}>
								<span className={styles.lineKey}>
									<b className={styles.lineStar}></b>
								</span>
								<span className={styles.lineColon}></span>
                  <div style={{width:800,height:500,overflow:"hidden",display:"inline-block"}}>
                      <BraftEditor 
                      style={{width:"100%",height:"100%",backgroundColor:"rgb(245 244 244)"}}
                        value={this.props.outputHTML!=""?this.props.outputHTML:this.state.editorState} 
                        onChange={this.handleChange}
                        extendControls={extendControls}
                        controls={controls}
                        />
                        <Modal visible={this.props.previewVisible} footer={null} onCancel={()=>this.returnModel('handleCancel')}>
                          <img alt="example" style={{ width: '100%' }} src={this.props.previewImage} />
                      </Modal>
                  </div>
            </div> */}

           
            <div className={styles.lineOut}>
								<span className={styles.lineKey}>
									<b className={styles.lineStar}>*</b>
									拟宣传渠道
								</span>
								<span className={styles.lineColon}>：</span>
                <TreeSelect
                      showSearch
                      value={this.props.channelValue}
                      style={{ minWidth: "200px", maxWidth: 940 }}
                      dropdownStyle={{ maxHeight: 500, minHeight: 200,minWidth: 400 , overflow: 'auto' }}
                      placeholder="请选择"
                      treeData={qudaoDataList}
                      allowClear
                      multiple
                      treeDefaultExpandAll
                      onChange={(e)=>this.returnModel('onChannel',e)}
                  >
                  </TreeSelect>

            </div>
            <div className={styles.lineOut}>
								<span className={styles.lineKey}>
									<b className={styles.lineStar}>*</b>
									宣传类型
								</span>
								<span className={styles.lineColon}>：</span>
                  <RadioGroup 
                  onChange={(e)=>this.returnModel('onType',e)}
                  value={this.props.checkTypeValue}>
									<Radio value={"中心工作"}>中心工作</Radio>
									<Radio value={"企业文化"}>企业文化</Radio>
                  <Radio value={"思想作风"}>思想作风</Radio>
								</RadioGroup>
            </div>
            <div className={styles.lineOut}>
								<span className={styles.lineKey}>
									<b className={styles.lineStar}>*</b>
									宣传形式
								</span>
								<span className={styles.lineColon}>：</span>
                <RadioGroup 
                onChange={(e)=>this.returnModel('onForm',e)}
                value={this.props.checkonFormValue}>
                    <Radio value={"图文"}>图文</Radio>
                    <Radio value={"图片"}>图片</Radio>
                    <Radio value={"视频"}>视频</Radio>
                    <Radio value={"H5"}>H5</Radio>
                    <Radio value={"其他"}>其他</Radio>
                    </RadioGroup>
                    {
                this.props.checkonFormValue=== "其他"?
                <div style={{marginTop:'10px',display:"inline-block"}} >
                    <Input style={{width:'150px'}} value={this.props.checkonFormValue2} onChange={(e)=>this.returnModel('onForm2',e)}/>
                </div>
                :
                null
            }
								        
            </div>
            <div className={styles.lineOut}>
								<span className={styles.lineKey}>
									<b className={styles.lineStar}>*</b>
									紧急程度
								</span>
								<span className={styles.lineColon}>：</span>
                                <RadioGroup 
                                onChange={(e)=>this.returnModel('onUrgency',e)}
                                value={this.props.checkUrgencyValue}>
                                <Radio value={"0"}>办公室新闻宣传负责人审核</Radio>
                                <Radio value={"1"}>办公室主任及以上领导审核</Radio>
								</RadioGroup>
            </div>
            {
            this.props.checkUrgencyValue=== "1"?
              <div style={{marginTop:'10px'}} >
                 <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    <b style={{color:"red",marginRight:'5px'}}>*</b>
                    紧急原因
                </span>
                <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
                <Input style={{width:'500px'}} value={this.props.urgentText} onChange={(e)=>this.returnModel('urgentText',e)}/>
              </div>
              :
              null
          }
            <div className={styles.lineOut}>
								<span className={styles.lineKey}>
									<b className={styles.lineStar}>*</b>
									是否符合年度宣传计划
								</span>
								<span className={styles.lineColon}>：</span>
                                <RadioGroup 
                                onChange={(e)=>this.returnModel('onPlan',e)}
                                value={this.props.checkPlanValue}>
									<Radio value={"1"}>是</Radio>
									<Radio value={"0"}>否</Radio>
								</RadioGroup>
            </div>
            <div className = {styles.buttonOut}>
                            <Button type="primary"
                               onClick={()=>this.returnModel('saveSubmit','保存')}
                               >保存</Button>
                            <Button type="primary"
                             style = {{marginLeft: 5}}
                              onClick={()=>this.returnModel('saveSubmit','提交')}
                              >提交</Button>
                               <Button style = {{marginLeft: 5}}  size="default" type="primary" >
                                <a href="javascript:history.back(-1)">取消</a>
                              </Button>
            </div>
          </div>
		)
					
	}
}

function mapStateToProps (state) {
  return {
    loading: state.loading.models.setNewManuscript, 
    ...state.setNewManuscript
  };
}

export default connect(mapStateToProps)(setNewManuscript);
