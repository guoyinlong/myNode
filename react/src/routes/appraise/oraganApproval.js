/*
 * 作者：王福江
 * 创建日期：2019-11-13
 * 邮件：wangfj80@chinaunicom.cn
 * 文件说明：组织机构待办评议
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Row, Button } from 'antd';
import Cookie from 'js-cookie';
import message from "../../components/commonApp/message";
import { routerRedux } from "dva/router";

class oraganApproval extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSaveClickable: 'true',
    }
  }
  //提交信息
  saveInfo = () => {
    const { commentData1, commentData2, commentData3 } = this.props;
    //单选信息
    let datalist1 = [];
    for (let i = 0; i < commentData1.length; i++) {
      var radio = document.getElementsByName(commentData1[i].comment_info_id);
      //var selectvalue=null;
      for (let j = 0; j < radio.length; j++) {
        if (radio[j].checked == true) {
          let selval = {
            check_id: commentData1[i].comment_info_id,
            sel_value: radio[j].value
          };
          datalist1.push(selval);
          break;
        }
      }
    }
    if (datalist1.length !== commentData1.length) {
      message.info('有单选信息未勾选，请检查！');
      return;
    }
    //多选信息
    let datalist2 = [];
    for (let i = 0; i < commentData2.length; i++) {
      var checkbox = document.getElementsByName(commentData2[i].comment_info_id);
      //var selectvalue=null;
      for (let j = 0; j < checkbox.length; j++) {
        if (checkbox[j].checked == true) {
          let selval = {
            check_id: commentData2[i].comment_info_id,
            sel_value: checkbox[j].value
          };
          datalist2.push(selval);
        }
      }
    }
    //意见信息
    let datalist3 = [];
    for (let i = 0; i < commentData3.length; i++) {
      var textarea = document.getElementsByName(commentData3[i].comment_info_id);
      for (let j = 0; j < textarea.length; j++) {
        let selval = {
          check_id: commentData3[i].comment_info_id,
          sel_value: textarea[j].value
        };
        datalist3.push(selval);
      }
    }
    this.setState({
      isSaveClickable: false
    });
    const { dispatch } = this.props;
    return new Promise((resolve) => {
      dispatch({
        type: 'oraganApprovalModel/startOraganApproval',
        arg_year: this.props.year,
        datalist1,
        datalist2,
        datalist3,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ isSaveClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/commonApp'
          }));
        }, 500);
      }
      if (resolve === 'false') {
        this.setState({ isSaveClickable: true });
        message.error("提交失败！");
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/commonApp'
      }));
    });
  }
  render() {
    const { commentData1, commentData2, commentData3, year } = this.props;
    //类型1
    let data1list = commentData1.map((item) => {
      let commentarr = item.comment_info_checkbox_name.split(',');
      let conmnentjson = [];
      for (let i = 0; i < commentarr.length; i++) {
        let param = { check_name: commentarr[i] };
        conmnentjson.push(param);
      }
      let infolist = conmnentjson.map((item2) => {
        //console.log("item2=="+JSON.stringify(item2));
        return (
          <td width='25%' valign='top'>
            <p align='center'><h3><strong>{item2.check_name}&nbsp;&nbsp;&nbsp;&nbsp;<input style={{ webkitAppearance: 'radio' }} name={item.comment_info_id} type='radio' value={item2.check_name} /></strong></h3><br /></p>
          </td>
        )
      });
      return (
        <table border="1" cellSpacing="0" width='100%' align="center">
          <tr align="center">
            <td width="100%" valign="center" colSpan="4"><p><h3><strong>{item.comment_info_name}</strong></h3></p><br />
            </td>
          </tr>
          <tr align="center">
            {infolist}
          </tr>
        </table>
      )
    });
    //类型2
    let data2list = commentData2.map((item) => {
      let commentarr = item.comment_info_checkbox_name.split(',');
      let conmnentjson = [];
      for (let i = 0; i < commentarr.length; i++) {
        let param = { check_name: commentarr[i] };
        conmnentjson.push(param);
      }
      let infolist = conmnentjson.map((item2) => {
        return (
          <tr align="center">
            <td width="85%" valign="center" colSpan="3"><p>&nbsp; {item2.check_name}</p><br /></td>
            <td width="15%" valign="center"><p align="right"><input style={{ webkitAppearance: 'checkbox' }} name={item.comment_info_id} type="checkbox" value={item2.check_name} /></p></td>
          </tr>
        )
      });
      return (
        <table border="1" cellSpacing="0" width='100%' align="center">
          <tr align="center">
            <td width="100%" valign="center" colSpan="4"><br /><p><h3><strong>{item.comment_info_name}</strong></h3></p><br />
            </td>
          </tr>
          {infolist}
        </table>
      )
    });
    //类型3
    let data3list = commentData3.map((item) => {
      return (
        <table border="1" cellSpacing="0" width='100%' align="center">
          <tr align="center">
            <td width="100%" valign="top" colSpan="4"><p><br /><h3>
              <strong>{item.comment_info_name}</strong><strong> </strong></h3></p>
              <p><textarea name={item.comment_info_id} rows="4" cols="100"></textarea></p>
            </td>
          </tr>
        </table>

      )
    });

    return (
      <div style={{ height: '60%', overflow: 'scroll' }}>
        <div class="sidebar1" style={{ width: '20%', float: 'left' }}>
          <span>&nbsp;</span>
        </div>
        <div class="content" style={{ width: '60%', float: 'left' }}>
          <Row span={2} style={{ textAlign: 'center' }}><h2>{Cookie.get('OU')}（单位）{year}年度选人用人工作民主评议表</h2></Row>
          <br />
          <Form style={{ align: 'center', marginTop: '10' }}>
            {data1list}
            {data2list}
            {data3list}
          </Form>
          <br /><br />
          <Button onClick={this.saveInfo} >{this.state.isSaveClickable ? '提交' : '正在处理中...'}</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
            </div>
        <div class="sidebar2" style={{ width: '20%', float: 'left' }}>
          <span>&nbsp;</span>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.oraganApprovalModel,
    ...state.oraganApprovalModel
  };
}
oraganApproval = Form.create()(oraganApproval);
export default connect(mapStateToProps)(oraganApproval);

