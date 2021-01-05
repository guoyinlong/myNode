/**
 * 作者：郭银龙
 * 创建日期： 2020-10-20
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 稿件复核修改
 */

import React  from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import {Button,Input,Select,DatePicker,TreeSelect,Icon } from 'antd'
import styles from './setNewstyle.less'
import moment from 'moment';
const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD HH:mm:ss';
const { TextArea } = Input;
class newSetManuscriptReview extends React.PureComponent {
  state={
    //    componentArray: this.props.auth.length>0?this.props.auth:[1], 
    }
    returnModel =(value,value2,value3)=>{
        if(value2!==undefined){
            this.props.dispatch({
                type:'newSetManuscriptReview/'+value,
                record : value2,
                name : value3,
            })
        }else{
            this.props.dispatch({
                type:'newSetManuscriptReview/'+value,
            })
        }
    };
      //得到时间保存时间
      changeDate = (date,dateString) => {
        this.props.dispatch({
          type:"newSetManuscriptReview/changeDate",
          dateString
        });
            };


	//----------------------页面渲染----------------------//
	render() {
       
        const {  fabuqudaoList,checkObjectAndContentList,checkContentList,author} = this.props;
            //发布渠道
            fabuqudaoList.length === 0 ? [] : fabuqudaoList.map((item,index) => { 
                    item.key = index;
                    item.title = item.channelName
                    item.value = item.id
                    item.disabled = true;
                    item.children.map((v, i) => {
                    v.key = index + '-' + i;
                    v.title = v.channelName
                    v.value = v.channelName
                    })
                })
            checkObjectAndContentList.length == 0 ? [] : checkObjectAndContentList.map((item, index) => { //申请单位
              item.key = index;
                    item.title = item.deptName
                    item.value = item.deptId
                    item.children.map((v, i) => {
                    v.key = index + '-' + i;
                    v.title = v.deptName
                    v.value = v.deptId
          })
            });

            checkContentList.length == 0 ? [] : checkContentList.map((item,index) => { 
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
            const formItems = author.length == 0 ? [] :author.map((item, index) => (
              
              <div style={{marginTop:10}} key={index}>
                          <span className={styles.lineKey}>
                              <b className={styles.lineStar}></b>
                          </span>
                          <span className={styles.lineColon}></span>
                         
                              <Select  
                              style={{ width: 120 }}
                              onChange={(e)=>this.returnModel('onAuthorCheck',e,index)}
                              value={this.props.selectauth[index]}
                              placeholder="请选择">
                                  <Option value="文稿作者">文稿作者</Option>
                                  <Option value="图片作者">图片作者</Option>
                                  <Option value="视频剪辑人员">视频剪辑人员</Option>
                                  <Option value="H5编辑人员">H5编辑人员</Option>
                                  {/* <Option value="其他">其他</Option> */}
                              </Select>
                              <TreeSelect
                                  showSearch
                                  value={this.props.selectdept[index]}
                                  style={{ minWidth: "180px", maxWidth: 260 }}
                                  dropdownStyle={{ maxHeight: 500, minHeight: 200,width: 540 , overflow: 'auto' }}
                                  placeholder="请选择"
                                  treeData={checkObjectAndContentList}
                                  allowClear
                                  multiple
                                  treeDefaultExpandAll
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
                                        value={this.props.selectname[index]}
                                        onChange={(e)=>this.returnModel('onAuthorList',e,index)}
                                    >
                                    </TreeSelect>
                         
                          {/* <Select
                              mode="multiple"
                              style={{ minWidth: "180px", maxWidth: 940 }}
                              placeholder="请选择"
                              value={this.props.selectname[index]}
                              onChange={(e)=>this.returnModel('onAuthorList',e,index)}
                          >
                              {contentList}
                          </Select> */}
                    
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
	return(
            <div className={styles.pageContainer}>
						<h2 style = {{textAlign:'center',marginBottom:30}}>稿件复核修改</h2>
                        {/* <Button style = {{float: 'right'}} size="default" type="primary" >
							<a href="javascript:history.back(-1)">返回</a>
						</Button> */}
                        <div style = {{overflow:"hidden",margin:"20px" }}>
                                    <div className={styles.lineOut}>
                                            <span className={styles.lineKey}>
                                            <b className={styles.lineStar}>*</b> 稿件名称
                                            </span>
                                            <span className={styles.lineColon}>：</span>
                                            <Input style={{width:'570px'}} placeholder = "请输入稿件名称" value={this.props.titleName}  onChange={(e)=>this.returnModel('name',e)}/>
                                    </div>
                                    <div className={styles.lineOut}>
                                            <span className={styles.lineKey}>
                                            <b className={styles.lineStar}>*</b>稿件发布时间
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
                                    <div>
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
                                                            发布渠道
                                                        </span>
                                                        <span className={styles.lineColon}>：</span>
                                                        <TreeSelect
                                                        showSearch
                                                        value={this.props.changeQuDaoValue}
                                                        style={{ minWidth: "180px", maxWidth: 260 }}
                                                        dropdownStyle={{ maxHeight: 500, minHeight: 200,width: 540 , overflow: 'auto' }}
                                                        placeholder = "请选择发布渠道"
                                                        treeData={fabuqudaoList}
                                                        allowClear
                                                        multiple
                                                        treeDefaultExpandAll
                                                        onChange={(e)=>this.returnModel('qudao',e)}
                                                        >
                                                     </TreeSelect>
                                    </div>
                                    <div className={styles.lineOut}>
                                            <span className={styles.lineKey}>
                                            <b className={styles.lineStar}>*</b> 复核说明
                                            </span>
                                            <span className={styles.lineColon}>：</span>
                                            <TextArea style={{width:'570px'}} rows={4} placeholder = "请输入复核说明" value={this.props.instructionsValue}  onChange={(e)=>this.returnModel('instructions',e)}/>
                                            {/* <Input style={{width:'570px'}} placeholder = "请输入复核说明" value={this.props.instructionsValue}  onChange={(e)=>this.returnModel('instructions',e)}/> */}
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
            </div>
		)
	}
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.newSetManuscriptReview, 
    ...state.newSetManuscriptReview
  };
}
export default connect(mapStateToProps)(newSetManuscriptReview);
