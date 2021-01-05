/**
 * 作者：贾茹
 * 日期：2020-9-30
 * 邮箱：18311475903@163.com
 * 文件说明：新闻共享平台-宣传渠道备案模块填报页面
 */
import React from 'react';
import {connect } from 'dva';
import { Table, Spin, Button, Select,Input,Pagination,Popconfirm ,TreeSelect} from "antd";
import styles from '../index.less';
import DeptRadioGroup from './deptModal.js';
const { TextArea } = Input;
const myDate = new Date();
const date = myDate.toLocaleString( ).substr(0,10);

class PublicityChannelsWrite extends React.Component{
    state = {
        isUploadingFile: false, // 是否正在上传文件
      };
      //传递数据给model层
      returnModel =(value,value2)=>{
        //console.log(value,value2);
        if(value2!==undefined){
          this.props.dispatch({
            type:'publicityChannelsWrite/'+value,
            record : value2,
          })
        }else{
          //console.log('aaa');
          this.props.dispatch({
            type:'publicityChannelsWrite/'+value,
          })
        }

      };
      //宣传数据类型下拉框数据传递
      handleChannelTypeChange=(value)=>{
     // console.log(value,typeof(value))
        this.props.dispatch({
          type:'publicityChannelsWrite/saveType',
          record: value,
        })
      };

      //点击返回跳转到列表首页
      handleReturn = ()=>{
        this.props.dispatch(routerRedux.push({
          pathname: 'adminApp/newsOne/publicityChannelsIndex',
        }))
      };
      //主办部门院级部门联动
      handleProvinceChange = value => {
        this.setState({
          cities: this.props.deptsData[value],
          secondCity: this.props.deptsData[value][0],
        });
        this.props.dispatch({
          type:'publicityChannelsWrite/saveProvinceChange',
          record: value,
        })
      };

      onSecondCityChange = value => {
        this.setState({
          secondCity: value,
        });
        this.props.dispatch({
          type:'publicityChannelsWrite/onSecondCityChange',
          record: value,
        })
      };


  render() {
    const { checkObjectAndContentList} = this.props;
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
    return (
      <div className={styles.outerField}>
      <div className={styles.out}>
          <div className={styles.title}>
            宣传渠道表单申请填报
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               <b className={styles.lineStar}>*</b>
               备案时间
            </span>
            <span className={styles.lineColon}>:</span>
            <span>{date}</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
               <b className={styles.lineStar}>*</b>
               宣传渠道类型
            </span>
            <span className={styles.lineColon}>:</span>
            <Select  className={styles.lineSelect} onChange={this.handleChannelTypeChange}>
              {this.props.channelTypes.map((i)=>
              <Select.Option key={i.channelName} value={i.channelName}>{i.channelName}</Select.Option>
              )}
            </Select>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey2}>
               <b className={styles.lineStar}>*</b>
               宣传渠道名称
            </span>
            <span className={styles.lineColon3}>:</span>
            <Input value={ this.props.channelName } style={{width:'500px'}} onChange={(e)=>this.returnModel('handleChannelTypeChange',e)}/>
          </div>

          <div className={styles.lineOut}>
            <span className={styles.lineKey}>
              <b className={styles.lineStar}>*</b>
              主办部门
            </span>
            <span className={styles.lineColon}>:</span>
            <TreeSelect
							showSearch
							style={{ width: 500 }}
							value={this.props.checkObject}
              dropdownStyle={{ maxHeight: 500, minHeight: 200, overflow: 'auto' }}
							placeholder="请选择"
							treeData={checkObjectAndContentList}
							allowClear
              /* multiple */
							treeDefaultExpandAll
							onChange={(e)=>this.returnModel('onObjectChange',e)}
						>
						</TreeSelect>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey2}>
               <b className={styles.lineStar}>*</b>
              申请名义
            </span>
            <span className={styles.lineColon3}>:</span>
            <Input value={ this.props.applyReason } style={{width:'500px'}} onChange={(e)=>this.returnModel('handleApplyReasonChange',e)}/>
            <span className={styles.warning}>例如：软件研究院/某个单位</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey2}>
               <b className={styles.lineStar}>*</b>
              功能定位
            </span>
            <span className={styles.lineColon3}>:</span>
            <TextArea
              style={{width:'570px'}}
              value={this.props.functionOrientation}
              rows={4}
              onChange={(e)=>this.returnModel('handleFunctionChange',e)}
            />
            <span className={styles.warning}>注意：300字以内</span>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey2}>
               <b className={styles.lineStar}>*</b>
               日常运营人信息
            </span>
            <span className={styles.lineColon3}>:</span>
            <div>
              <span>
                姓名：
                <Input value={ this.props.dateName } style={{width:'170px'}} onChange={(e)=>this.returnModel('handleDateNameChange',e)}/>
              </span>
              <span className={styles.tel}>
                电话：
                <Input value={ this.props.dateTel } style={{width:'170px'}} onChange={(e)=>this.returnModel('handleDateTelChange',e)}/>
              </span>
            </div>
            <div className={styles.riqi}>
              <span style={{marginLeft:'185px'}}>
                部门：
                <Input value={ this.props.dateDept } style={{width:'370px'}} onChange={(e)=>this.returnModel('handleDateDeptChange',e)}/>
              </span>
            </div>
            <div className={styles.riqi}>
              <span style={{marginLeft:'185px'}}>
                邮箱：
                <Input value={ this.props.dateMail } style={{width:'250px'}} onChange={(e)=>this.returnModel('handleDateMailChange',e)}/>
              </span>

            </div>
          </div>
          <div className={styles.lineOut}>
            <span className={styles.lineKey2}>
               <b className={styles.lineStar}>*</b>
               单位负责人信息
            </span>
            <span className={styles.lineColon3}>:</span>
            <div>
              <span>
                姓名：
                <Input value={ this.props.deptPersonName } style={{width:'170px'}} onChange={(e)=>this.returnModel('handleDeptPersonNameChange',e)}/>
              </span>
              <span className={styles.tel}>
                电话：
                <Input value={ this.props.datePersonTel } style={{width:'170px'}} onChange={(e)=>this.returnModel('handleDatePersonTelChange',e)}/>
              </span>
            </div>
            <div className={styles.riqi}>
              <span style={{marginLeft:'185px'}}>
                部门：
                <Input value={ this.props.datePersonDept } style={{width:'370px'}} onChange={(e)=>this.returnModel('handleDatePersonDeptChange',e)}/>
              </span>

            </div>
            <div className={styles.riqi}>
              <span style={{marginLeft:'185px'}}>
                邮箱：
                <Input value={ this.props.datePersonMail } style={{width:'250px'}} onChange={(e)=>this.returnModel('handleDatePersonMailChange',e)}/>
              </span>

            </div>
          </div>
          <div style={{width:'250px',margin:'20px auto'}}>
            <div style={{margin:'0 auto'}}>
              <Button type="primary" style={{float:'left'}} onClick={()=>this.returnModel('saveChannel')}>保存</Button>
              <Button type="primary" style={{marginLeft:'30px'}} onClick={()=>this.returnModel('submission')}>提交</Button>
              <Button type="primary" style={{float:'right'}} onClick={()=>this.returnModel('canCel')}>取消</Button>
            </div>
          </div>

      </div>
    </div>
    );
  }
}

function mapStateToProps (state) {

  return {
    loading: state.loading.models.publicityChannelsWrite,
    ...state.publicityChannelsWrite
  };
}
export default connect(mapStateToProps)(PublicityChannelsWrite);
