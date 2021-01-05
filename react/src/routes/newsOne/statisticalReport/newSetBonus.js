/**
 * 作者：郭银龙
 * 创建日期： 2020-10-20
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 加分项修改
 */
import React  from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import {Button,Input,Select,Radio,TreeSelect,Checkbox, Row, Col,Table,Popconfirm } from 'antd'
import styles from './setNewstyle.less'
import FileUpload from './import.js';   
const Option = Select.Option;
const RadioGroup = Radio.Group; 
class newSetBonus extends React.PureComponent {
  state={ }
    returnModel =(value,value2)=>{
        if(value2!==undefined){
            this.props.dispatch({
                type:'newSetBonus/'+value,
                record : value2,
            })
        }else{
            this.props.dispatch({
                type:'newSetBonus/'+value,
            })
        }
    };
	//----------------------页面渲染----------------------//
	render() {
        const {  deptList,dataList} = this.props;
        deptList.length == 0 ? [] : deptList.map((item, index) => { //申请单位
                item.key = index;
                      item.title = item.deptName
                      item.value = item.deptId
                      item.disabled=true
                      item.children.map((v, i) => {
                      v.key = index + '-' + i;
                      v.title = v.deptName
                      v.value = v.deptId
                    })
              });
        const  columns1 = [
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
						<h2 style = {{textAlign:'center',marginBottom:30}}>加分项修改</h2>
                       
                       {dataList?
                        <div style = {{overflow:"hidden",margin:"20px" }}>
                        <div className={styles.lineOut}>
                              <span className={styles.lineKey}>
                              <b className={styles.lineStar}>*</b>  加分事项
                              </span>
                              <span className={styles.lineColon}>：</span>
                              <Input style={{width:'570px'}} placeholder = "请输入加分事项" 
                              value={this.props.titleName}  
                              onChange={(e)=>this.returnModel('jiafenxiang',e)}/>
                        </div>
                        <div className={styles.lineOut}>
                              <span className={styles.lineKey}>
                                  <b className={styles.lineStar}></b>
                                  获得奖励
                              </span>
                              <span className={styles.lineColon}>：</span>
                              <RadioGroup   
                              onChange={(e)=>this.returnModel('reward',e)}
                              value={this.props.rewardValue}
                              >
                                  <Radio value={"0"}>院级奖励</Radio>
                                  <Radio value={"1"}>集团级奖励</Radio>
                                  <Radio value={"2"}>集团级以上</Radio>
                              </RadioGroup>
                        </div>
                        <div className={styles.lineOut}>
                          <span className={styles.lineKey}>
                              <b className={styles.lineStar}></b>
                              加分奖励
                          </span>
                          <span className={styles.lineColon}>：</span>
                            <Row style={{display:"inline-block"}}>
                              <Radio.Group 
                              onChange={(e)=>this.returnModel('reward2',e)}
                              value={this.props.reward2Value}>
                                  <Radio value={1}>
                                  工号 ：
                                  {this.props.reward2Value==1?
                                    <Input style={{width:'180px'}} placeholder = "请输入工号"
                                    value={this.props.jobNumberValue}  
                                    onChange={(e)=>this.returnModel('jobNumber',e)}/>
                                    :""}
                                  </Radio>
                                  <Radio value={2}>
                                  单位：
                                  {this.props.reward2Value==2?
                                  <TreeSelect
                                        showSearch
                                        value={this.props.selectDeptValue}
                                        style={{ minWidth: "250px", maxWidth: 300 }}
                                        dropdownStyle={{ maxHeight: 500, minHeight: 200,width: 540 , overflow: 'auto' }}
                                        placeholder="请选择"
                                        treeData={deptList}
                                        treeDefaultExpandAll
                                        onChange={(e)=>this.returnModel('selectDept',e)}
                                    >
                                    </TreeSelect>
                                  :""} 
                                  </Radio>
                              </Radio.Group>
                            </Row>
                        <div className={styles.lineOut}>
                            <span className={styles.lineKey}>
                            <b className={styles.lineStar}>*</b> 证明材料
                            </span>
                            <span className={styles.lineColon}>：</span>
                            <FileUpload dispatch={this.props.dispatch} passFuc = {this.saveData} pageName='newSetBonus'/>
                            <Table
                            columns={ columns1 }
                            loading={ this.props.loading }
                            dataSource={ this.props.tableUploadFile }
                            className={ styles.orderTable }
                            pagination = { false }
                            style={{width:500,marginTop:'10px',marginLeft:200}}
                            bordered={ true }
                            />
                      </div>
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
              :""}
            </div>
		)
	}
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.newSetBonus, 
    ...state.newSetBonus
  };
}
export default connect(mapStateToProps)(newSetBonus);
