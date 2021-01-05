/**
 * 作者：郭西杰
 * 创建日期：2020-09-02
 * 邮箱：guoxj116@chinaunicom.cn
 * 文件说明：培训管理-我的小目标 
 */
import React, { Component } from 'react';
import { connect } from "dva";
import Cookie from 'js-cookie';
import moment from 'moment';
import 'moment/locale/zh-cn';
import imgURL from './mygoal.jpg';
import styles from './Goal.less';
moment.locale('zh-cn');
import { Form, Button, Card, Table, Input, Icon, message } from 'antd';
import { routerRedux } from "dva/router";
const FormItem = Form.Item;
 
class myTrainGoal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OUDataList: [],
      OU: Cookie.get("OU"),
      user_id: Cookie.get("staff_id"),
      user_name: Cookie.get("username"),
      year: '',
      target_context: '',
      isSaveClickable: true,
      isEdit: true,
      ProfessionalQualificationSource: {
        name: [''],
      },
      courseSource: {
        name: [''],
      },
      abilitySource: {
        name: [''],
      },
      bookSource: {
        name: [''],
      },
    };
  };
  componentWillReceiveProps() {
    const { ProfessionalQueryList, courseQueryList, abilityQueryList, bookQueryList, targetQueryList } = this.props;
    if (ProfessionalQueryList != undefined && ProfessionalQueryList.length != 0) {
      this.setState({
        ProfessionalQualificationSource: {
          name: this.props.ProfessionalQueryList.map(item => item.target_context_0)
        },
      });
    }
    if (courseQueryList != undefined && courseQueryList.length != 0) {
      this.setState({
        courseSource: {
          name: this.props.courseQueryList.map(item => item.target_context_1)
        },
      });
    }

    if (abilityQueryList != undefined && abilityQueryList.length != 0) {
      this.setState({
        abilitySource: {
          name: this.props.abilityQueryList.map(item => item.target_context_2)
        },
      });
    }
    if (bookQueryList != undefined && bookQueryList.length != 0) {
      this.setState({
        bookSource: {
          name: this.props.bookQueryList.map(item => item.target_context_3)
        },
      });
    }
    if (targetQueryList != [] && targetQueryList != '' && targetQueryList != undefined) {
      this.setState({
        target_context: this.props.targetQueryList[0].target_context_4
      });
    }
  }
  // 跳转
  gotoDetail3 = () => {
    let date = new Date;
    const currentDate = date.getFullYear();
    let queryYear = this.state.year === '' ? currentDate : this.state.year;
    let arg_params = {
      arg_year: queryYear
    };

    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/personalClassQueryIndex/certificationList',
      query: arg_params
    }));
  };
  addNewComponent1 = (e) => {
    this.setState((prevState) => {
      return {
        ProfessionalQualificationSource: {
          ...this.state.ProfessionalQualificationSource,
          name: [...prevState.ProfessionalQualificationSource.name, '']
        }
      }
    });
  }
  deleteNewComponent1 = (e, index) => {
    this.setState(() => {
      return {
        ProfessionalQualificationSource: {
          ...this.state.ProfessionalQualificationSource,
          name: this.state.ProfessionalQualificationSource.name.filter((_, i) => i !== index)
        }
      }
    });
  }
  onShiftChange1 = (e, index) => {
    let tempArray = [];
    for (let i = 0; i < this.state.ProfessionalQualificationSource.name.length; i++) {
      if (index == i) {
        tempArray[i] = e.target.value;
      } else {
        tempArray[i] = this.state.ProfessionalQualificationSource.name[i];
      }
    }
    this.setState(() => {
      return {
        ProfessionalQualificationSource: {
          ...this.state.ProfessionalQualificationSource,
          name: tempArray
        }
      }
    });
  }

  addNewComponent2 = (e) => {
    this.setState((prevState) => {
      return {
        courseSource: {
          ...this.state.courseSource,
          name: [...prevState.courseSource.name, '']
        }
      }
    });
  }
  deleteNewComponent2 = (e, index) => {
    this.setState(() => {
      return {
        courseSource: {
          ...this.state.courseSource,
          name: this.state.courseSource.name.filter((_, i) => i !== index)
        }
      }
    });
  }
  onShiftChange2 = (e, index) => {
    let tempArray = [];
    for (let i = 0; i < this.state.courseSource.name.length; i++) {
      if (index == i) {
        tempArray[i] = e.target.value;
      } else {
        tempArray[i] = this.state.courseSource.name[i];
      }
    }
    this.setState(() => {
      return {
        courseSource: {
          ...this.state.courseSource,
          name: tempArray
        }
      }
    });
  }

  addNewComponent3 = (e) => {
    this.setState((prevState) => {
      return {
        abilitySource: {
          ...this.state.abilitySource,
          name: [...prevState.abilitySource.name, '']
        }
      }
    });
  }
  deleteNewComponent3 = (e, index) => {
    this.setState(() => {
      return {
        abilitySource: {
          ...this.state.abilitySource,
          name: this.state.abilitySource.name.filter((_, i) => i !== index)
        }
      }
    });
  }
  onShiftChange3 = (e, index) => {
    let tempArray = [];
    for (let i = 0; i < this.state.abilitySource.name.length; i++) {
      if (index == i) {
        tempArray[i] = e.target.value;
      } else {
        tempArray[i] = this.state.abilitySource.name[i];
      }
    }
    this.setState(() => {
      return {
        abilitySource: {
          ...this.state.abilitySource,
          name: tempArray
        }
      }
    });
  }

  addNewComponent4 = (e) => {
    this.setState((prevState) => {
      return {
        bookSource: {
          ...this.state.bookSource,
          name: [...prevState.bookSource.name, '']
        }
      }
    });
  }
  deleteNewComponent4 = (e, index) => {
    this.setState(() => {
      return {
        bookSource: {
          ...this.state.bookSource,
          name: this.state.bookSource.name.filter((_, i) => i !== index)
        }
      }
    });
  }
  onShiftChange4 = (e, index) => {
    let tempArray = [];
    for (let i = 0; i < this.state.bookSource.name.length; i++) {
      if (index == i) {
        tempArray[i] = e.target.value;
      } else {
        tempArray[i] = this.state.bookSource.name[i];
      }
    }
    this.setState(() => {
      return {
        bookSource: {
          ...this.state.bookSource,
          name: tempArray
        }
      }
    });
  }
  onShiftChange5 = (e) => {
    this.setState({
      target_context: e.target.value,
    });
  }
  gotoHome = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/train_do'
    }));
  }
  editGoal = () => {
    const { dispatch } = this.props;
    this.setState({
      isEdit:false,
    });
  }

  saveInfo = () => {
    const { dispatch } = this.props;
    this.setState({ isSaveClickable: false });
    let arg_batch_id = this.state.user_id + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);
    let date = new Date;
    const user_id = Cookie.get('userid');
    const currentYear = date.getFullYear();
    let ProfessionalQualificationSource = this.state.ProfessionalQualificationSource.name;
    let courseSource = this.state.courseSource.name;
    let abilitySource = this.state.abilitySource.name;
    let bookSource = this.state.bookSource.name;
    let target_context = this.state.target_context;
    let totalList = [];
    /*非空校验*/
    if (courseSource[0] === null || courseSource[0] === '' || courseSource[0] === undefined) {
      message.error('课程名称不能为空');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (abilitySource[0] === null || abilitySource[0] === '' || abilitySource[0] === undefined) {
      message.error('提升能力不能为空');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (bookSource[0] === null || bookSource[0] === '' || bookSource[0] === undefined) {
      message.error('书目不能为空');
      this.setState({ isSaveClickable: true });
      return;
    }
    /*封装信息*/
    ProfessionalQualificationSource.map((item) => {
      let personData1 = {
        arg_user_id: user_id,
        arg_target_type: '0',
        arg_target_context: item,
        arg_target_year: currentYear,
        arg_batch_id,
      };
      totalList.push(personData1);
    })
    courseSource.map((item) => {
      let personData2 = {
        arg_user_id: user_id,
        arg_target_type: '1',
        arg_target_context: item,
        arg_target_year: currentYear,
        arg_batch_id,
      };
      totalList.push(personData2);
    })
    abilitySource.map((item) => {
      let personData3 = {
        arg_user_id: user_id,
        arg_target_type: '2',
        arg_target_context: item,
        arg_target_year: currentYear,
        arg_batch_id,
      };
      totalList.push(personData3);
    })
    bookSource.map((item) => {
      let personData4 = {
        arg_user_id: user_id,
        arg_target_type: '3',
        arg_target_context: item,
        arg_target_year: currentYear,
        arg_batch_id,
      };
      totalList.push(personData4);
    })
    let personData5 = {
      arg_user_id: user_id,
      arg_target_type: '4',
      arg_target_context: target_context,
      arg_target_year: currentYear,
      arg_batch_id,
    };
    totalList.push(personData5);
    /*接口调用*/
    return new Promise((resolve) => {
      dispatch({
        type: 'myTrainGoalModel/goalSave',
        totalList,
        resolve
      }); 
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ isSaveClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/myTrainGoal'
          }));
        }, 500);
      }
      if (resolve === 'false') {
        this.setState({ isSaveClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/myTrainGoal'
      }));
    });
  };
  render() {
    return (
      <div>
        <br />
        <Form>
          <div className={styles['box1']}> 
            <br></br>
            <img src={imgURL} style={{ maxWidth: 300, height: 'auto' }} />
            <br></br>
          </div>
          <div className={styles['box2']}>
            <br></br>
            <span ><p className={styles['font1']}>听说，把目标写下来更容易实现哦~~</p></span>
            <span><p className={styles['font1']}>{new Date().getFullYear()}年我的学习目标</p></span>
            <span><p className={styles['font2']}>1.完成几个职业资格认证(<Button onClick={this.gotoDetail3} className={styles['font5']}>查看认证清单</Button>) <a className={styles['font4']}>(支持增加或减少，允许为空)</a></p></span>
            {
              this.state.ProfessionalQualificationSource.name.map((element, index) => (
                <div key={index}>
                  <Input disabled= {this.state.isEdit? "disabled":false} style={{ width: '230px', height: '30px' }} className={styles['card1']} value={element} onChange={(value) => { this.onShiftChange1(value, index) }} prefix={<Icon type="user" />} placeholder="请填写职业资格认证" />
                  <a  style={{display: this.state.isEdit? "none":false }} onClick={(e) => this.addNewComponent1(e)} className={styles['font6']}>添加</a>
                  {index != 0 &&
                    <a  style={{display: this.state.isEdit? "none":false }} onClick={(e) => this.deleteNewComponent1(e, index)} className={styles['font7']}> 删除</a>
                  }
                </div>
              ))
            } 
            <span><p className={styles['font2']}>2.学习几门课程
          <a className={styles['font4']}>(您可以查看中国联通学院、51CTO平台、联通智享平台或者院内培训计划等选择课程)(不能为空，至少写一门课程)</a></p></span>
            {
              this.state.courseSource.name.map((element, index) => (
                <div key={index}>
                  <Input disabled= {this.state.isEdit? "disabled":false} style={{ width: '230px', height: '30px' }} className={styles['card1']} value={element} onChange={(value) => { this.onShiftChange2(value, index) }} prefix={<Icon type="user" />} placeholder="请填写课程名称" />
                  <a style={{display: this.state.isEdit? "none":false }} onClick={(e) => this.addNewComponent2(e)} className={styles['font6']}>添加</a>
                  {index != 0 &&
                    <a style={{display: this.state.isEdit? "none":false }} onClick={(e) => this.deleteNewComponent2(e, index)} className={styles['font7']}> 删除</a>
                  }
                </div>
              ))
            }
            <span><p className={styles['font2']}>3.提升几项能力 <a className={styles['font4']}>（不能为空，至少写一项能力）</a></p></span>
            {
              this.state.abilitySource.name.map((element, index) => (
                <div key={index}>
                  <Input disabled= {this.state.isEdit? "disabled":false} style={{ width: '230px', height: '30px' }} className={styles['card1']} value={element} onChange={(value) => { this.onShiftChange3(value, index) }} prefix={<Icon type="user" />} placeholder="请填写能力名称" />
                  <a style={{display: this.state.isEdit? "none":false }} onClick={(e) => this.addNewComponent3(e)} className={styles['font6']}>添加</a>
                  {index != 0 &&
                    <a style={{display: this.state.isEdit? "none":false }} onClick={(e) => this.deleteNewComponent3(e, index)} className={styles['font7']}> 删除</a>
                  }
                </div>
              ))
            }
            <span><p className={styles['font2']}>4.读几本书<a className={styles['font4']}>（不能为空，至少写一项能力）</a></p></span>
            {
              this.state.bookSource.name.map((element, index) => (
                <div key={index}>
                  <Input disabled= {this.state.isEdit? "disabled":false} style={{ width: '230px', height: '30px' }} className={styles['card1']} value={element} onChange={(value) => { this.onShiftChange4(value, index) }} prefix={<Icon type="user" />} placeholder="请填写书名" />
                  <a style={{display: this.state.isEdit? "none":false }} onClick={(e) => this.addNewComponent4(e)} className={styles['font6']}>添加</a>
                  {index != 0 &&
                    <a style={{display: this.state.isEdit? "none":false }} onClick={(e) => this.deleteNewComponent4(e, index)} className={styles['font7']}> 删除</a>
                  }
                </div>
              ))
            }
            <span><p className={styles['font2']}>5.好的开始是成功的一半！希望今年所有的计划都能达成！给自己说句加油鼓劲的话吧! <a className={styles['font4']}>(非必填)</a></p></span>
            <Input disabled= {this.state.isEdit? "disabled":false} style={{ width: '700px', height: '30px' }} className={styles['card1']} value={this.state.target_context} onChange={(value) => { this.onShiftChange5(value) }} prefix={<Icon type="user" />} placeholder="请填写一句话" />
            <div style={{ textAlign: 'center' }}>
              <br></br>
          <Button onClick={this.editGoal}>编辑</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={this.saveInfo} disabled={!this.state.isSaveClickable}>{this.state.isSaveClickable ? '提交' : '正在处理中...'}</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={this.gotoHome}>关闭</Button>
            </div>
          </div>
        </Form>
        <br /><br />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.myTrainGoalModel,
    ...state.myTrainGoalModel
  };
}
myTrainGoal = Form.create()(myTrainGoal);
export default connect(mapStateToProps)(myTrainGoal);

