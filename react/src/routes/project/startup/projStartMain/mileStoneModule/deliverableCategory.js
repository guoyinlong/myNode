/**
 * 作者：邓广晖
 * 创建日期：2018-03-06
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：添加交付物类别时的弹出框
 */

import React from 'react';
import {Input,Icon,message,Checkbox,Row,Col,Tooltip} from 'antd';
import {getuuid} from '../../../projConst.js';

/**
 * 作者：邓广晖
 * 创建日期：2018-03-06
 * 功能：添加交付物类别时的弹出框
 */
class DeliverableCategory extends React.PureComponent {

  state = {
    selectedDeliCategory:[],     /*勾选弹出的交付物类别时，缓存勾选的类别的id*/
    newAddDeliverable:[],        /*新添加的交付物类别，{del_name:xxx,del_id:yyy}*/
    newAddIconVisible:true,      /*新增图标的可见状态*/
    newDeliverCategory:'',       /*新输入的交付物类型*/
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-05
   * 功能：点击添加图标时，切换显示方式，切换为可输入
   */
  changeAddShow = (type) => {
    this.setState({
      newAddIconVisible:type === 'add',
      newDeliverCategory:''
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-05
   * 功能：设置输入框的值
   * @param e 输入事件
   */
  setInputContent = (e) => {
    this.setState({
      newDeliverCategory:e.target.value
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-05
   * 功能：新增时点击 对勾
   */
  newAddDeliverCategory = () => {
    let {newDeliverCategory,newAddDeliverable} = this.state;
    newDeliverCategory = newDeliverCategory.trim();
    const {deliverableCategoryList} = this.props;
    if(newDeliverCategory === ''){
      message.error('新增类别不能为空');
      return;
    }
    //判断是否在旧的列表里面
    for(let i = 0; i < deliverableCategoryList.length; i++){
      if(newDeliverCategory === deliverableCategoryList[i].del_name){
        message.error(newDeliverCategory + '，已经存在');
        return;
      }
    }
    //判断是否在新的列表里面
      for(let i = 0; i < newAddDeliverable.length; i++){
          if(newDeliverCategory === newAddDeliverable[i].del_name){
              message.error(newDeliverCategory + '，已经存在');
              return;
          }
      }
    newAddDeliverable.push({
      del_name:newDeliverCategory,
      del_id:getuuid(32,62)
    });
    this.setState({
      newAddDeliverable:[...newAddDeliverable],      /*更新新添加的类别列表*/
      newAddIconVisible:true,                        /*点击勾选确定后，显示添加按钮*/
      newDeliverCategory:'',                         /*清空输入框的内容*/
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-05
   * 功能：弹出添加交付类别对话框，勾选选项时回调
   * @param checkedValues 勾选的值
   */
  selectDeliveryCategory = (checkedValues) => {
    this.setState({
      selectedDeliCategory:checkedValues
    });
  };


  render() {
    let {deliverableCategoryList,currentMileDeliverList} = this.props;
    const {selectedDeliCategory,newAddDeliverable} = this.state;
    //将新添加的类别加入到类别列表
    deliverableCategoryList = deliverableCategoryList.concat(newAddDeliverable);
    //对每一个交付物类别添加 canSelect 属性，等于1代表可以选择，等于0代表不可以选择
    for (let i = 0; i < deliverableCategoryList.length; i++){
      deliverableCategoryList[i].canSelect = '1';
    }
    for(let i = 0; i < deliverableCategoryList.length; i++){
      for (let j = 0; j < currentMileDeliverList.length; j++){
        if(currentMileDeliverList[j] === deliverableCategoryList[i].del_name){
          deliverableCategoryList[i].canSelect = '0';
        }
      }
    }
    //已选择的类别展示，包括里程碑已有和已添加的
    let deliverModalSelectedShow = [];
    //先添加里程碑已有
    for(let i = 0; i < currentMileDeliverList.length; i++){
      deliverModalSelectedShow.push(currentMileDeliverList[i]);
    }
    //添加新添加的
    for(let i = 0; i < selectedDeliCategory.length; i++){
      for(let j = 0; j < deliverableCategoryList.length; j++){
        if(selectedDeliCategory[i] === deliverableCategoryList[j].del_id){
          deliverModalSelectedShow.push(deliverableCategoryList[j].del_name);
          break;
        }
      }
    }
    deliverModalSelectedShow = deliverModalSelectedShow.join('、');

    let deliverableCategory = deliverableCategoryList.map((delCategoryItem, index)=> {
      return (
        <Col span={7} offset={1} key={index}>
          <Checkbox value={delCategoryItem.del_id}
                    style={{paddingBottom:'2px'}}
                    disabled={delCategoryItem.canSelect === '0'}
          >
            {delCategoryItem.del_name}
          </Checkbox >
        </Col>
      )
    });

    return (
      <div>
        <div style={{paddingBottom:5,marginBottom:5}}>
          <Checkbox.Group onChange={this.selectDeliveryCategory}>
            <Row>
              {deliverableCategory}
              <Col span={7} offset={1}>
                {this.state.newAddIconVisible?
                  <div>
                    <Tooltip title={'新增交付物选择类别'}>
                      <Icon type='plus-circle'
                            style={{color:'#bfbaba',fontSize:20,cursor:'pointer',marginTop:5}}
                            onClick={()=>this.changeAddShow('edit')}
                      />
                    </Tooltip>
                  </div>
                  :
                  <div>
                    <Input placeholder={'请输入新的交付物类别'}
                           style={{width:155}}
                           maxLength={'50'}
                           onChange={this.setInputContent}
                    />
                    <Icon type='close'
                          style={{color:'red',fontSize:18,cursor:'pointer'}}
                          onClick={()=>this.changeAddShow('add')}
                    />
                    <Icon type='check'
                          style={{color:'#0cdc0c',fontSize:18,cursor:'pointer',marginLeft:3}}
                          onClick={this.newAddDeliverCategory}
                    />
                  </div>
                }
              </Col>
            </Row>
          </Checkbox.Group>
        </div>
        <div style={{borderTop:'1px solid gainsboro',marginTop:5}}>
          <span style={{fontWeight:'bold'}}>已选择：</span>
          {deliverModalSelectedShow}
        </div>
      </div>
    );
  }
}

export default DeliverableCategory;
