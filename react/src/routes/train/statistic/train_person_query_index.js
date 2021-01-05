/**
 * 文件说明: 培训统计配置查询界面-综合界面
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2020-01-09
 **/
import React, { Component } from 'react';
import { Button, Row, Checkbox, Col, Select ,Progress} from "antd";
import { connect } from "dva";
import Style from './basicinfo.less'
import Cookie from "js-cookie";

import { routerRedux } from "dva/router";
import { config } from 'chai';

// 新增的图表
import ReactEcharts from 'echarts-for-react';


const { Option } = Select;
class train_config_query_index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        id_card: 0,
        birthday: 0,
        country: 0,
        nation: 0,
        birth_place: 0,
        unicom_age: 0,
        ryy_age: 0,
        rank_level: 0,
        serve_time: 0,
        internal_taecher: 0, 
      },
      year: '',
    };
  };

  // 可选项
  onChange = (checkedValues) => {
    let selected = {
      id_card: 0,
      birthday: 0,
      country: 0,
      nation: 0,
      birth_place: 0,
      unicom_age: 0,
      ryy_age: 0,
      rank_level: 0,
      serve_time: 0,
      internal_taecher: 0,
    }
    for (let i = 0; i < checkedValues.length; i++) {
      selected[checkedValues[i]] = '1';
    }
    this.setState({
      selected: selected
    })

  }

  // 跳转到个人详情界面
  gotoDetail1 = () => {
    let date = new Date;
    const currentDate = date.getFullYear();
    let queryYear = this.state.year === '' ? currentDate : this.state.year;
    let arg_params = {};
    arg_params = {
      arg_page_size: 100,
      arg_page_current: 1,
      arg_queryYear: queryYear,
      arg_querytype: '2001',
      arg_trainyear: 'and train_year= \'' + queryYear + '\' ',
      arg_traintime: 'and 1=1',
      arg_trainlevel: 'and 1=1',
      arg_classlevel: 'and 1=1',
      arg_traintype: 'and 1=1',
      arg_ouid: Cookie.get('OUID'),
      arg_deptid: Cookie.get('dept_id'),
      arg_userid: Cookie.get('userid')
    };
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/personalClassQueryIndex/personalClassQuery',
      query: arg_params
    }));
  };

  // 跳转到个人仍可学
  gotoDetail2 = () => {
    let date = new Date;
    const currentDate = date.getFullYear();
    let queryYear = this.state.year === '' ? currentDate : this.state.year;
    let arg_params = {};
    arg_params = {
      arg_page_size: 100,
      arg_page_current: 1,
      arg_querytype: '2004',
      arg_queryYear: queryYear,
      arg_trainyear: 'and train_year= \'' + queryYear + '\' ',
      arg_traintime: 'and 1=1',
      arg_trainlevel: 'and 1=1',
      arg_classlevel: 'and 1=1',
      arg_traintype: 'and 1=1',
      arg_ouid: Cookie.get('OUID'),
      arg_deptid: Cookie.get('dept_id'),
      arg_userid: Cookie.get('userid')
    };

    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/personalClassQueryIndex/personalClassQuery',
      query: arg_params
    }));
  };
  // 跳转到个人仍可学
  gotoDetail3 = () => {
    let date = new Date;
    const currentDate = date.getFullYear();
    let queryYear = this.state.year === '' ? currentDate : this.state.year;
    let arg_params = {
      arg_year:queryYear
    };
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/personalClassQueryIndex/certificationList',
      query: arg_params
    }));
  };
  //选择年份
  handleYearChange = (value) => {
    this.setState({
      year: value
    })
    const { dispatch } = this.props;
    let formData = {
      'arg_year': value,
    }
    dispatch({
      type: 'train_query_model/trainPersonQueryIndexInit',
      paramData: formData
    });
  };


 
  render() {
    const { year_info, person_info, learn_info } = this.props;
    const { selected } = this.state;

    //获取前三年的年份
    let date = new Date;
    let yearArray = [];
    for (let i = 0; i < 3; i++) {
      yearArray.push(date.getFullYear() - i);
    }

    const currentDate = date.getFullYear();
    const yearList = yearArray.map((item) => {
      return (
        <Option key={item} value={item.toString()}>
          {item}
        </Option>
      )
    });

    const nscore=
    (
    (
     (year_info[0] && year_info[0].totle_score >= 0 && year_info[0].totle_score != undefined && year_info[0].totle_score !== '' ? year_info[0].totle_score : 0) 
     - 
     (person_info[0] && person_info[0].learned_score >= 0 && person_info[0].learned_score !== undefined && person_info[0].learned_score !== '' ? person_info[0].learned_score : 0)
    )
    > 0
     ?   
    ( 
      Math.round(
      (
        (
          (year_info[0] && year_info[0].totle_score >= 0 && year_info[0].totle_score != undefined && year_info[0].totle_score !== '' ? year_info[0].totle_score : 0) 
          - 
          (person_info[0] && person_info[0].learned_score >= 0 && person_info[0].learned_score !== undefined && person_info[0].learned_score !== '' ? person_info[0].learned_score : 0)
         )
      /
      (year_info[0] && year_info[0].totle_score >= 0 && year_info[0].totle_score != undefined && year_info[0].totle_score !== '' ? year_info[0].totle_score : 0)
      )*10000)/100
      
    )
     :
     0
    )
   const nhour=
   (
    (
      (year_info[0] && year_info[0].totle_hour >= 0 && year_info[0].totle_hour != undefined && year_info[0].totle_hour !== '' ? year_info[0].totle_hour : 0)
      -
      (person_info[0] && person_info[0].learned_class_hour >= 0 && person_info[0].learned_class_hour !== undefined && person_info[0].learned_class_hour !== '' ? person_info[0].learned_class_hour : 0)
    ) > 0
      ?
    ( 
      Math.round(
      (
        (
          (year_info[0] && year_info[0].totle_hour >= 0 && year_info[0].totle_hour != undefined && year_info[0].totle_hour !== '' ? year_info[0].totle_hour : 0)
          -
          (person_info[0] && person_info[0].learned_class_hour >= 0 && person_info[0].learned_class_hour !== undefined && person_info[0].learned_class_hour !== '' ? person_info[0].learned_class_hour : 0)
        )
      /
      (year_info[0] && year_info[0].totle_hour >= 0 && year_info[0].totle_hour != undefined && year_info[0].totle_hour !== '' ? year_info[0].totle_hour : 0)
      )*10000)/100
      
    )
    
      :
      0
   )
    
   const nclass=
   (
    (
      (year_info[0] && year_info[0].compulsory_num >= 0 && year_info[0].compulsory_num != undefined && year_info[0].compulsory_num !== '' ? year_info[0].compulsory_num : 0)
      -
      (person_info[0] && person_info[0].learned_compulsory_num >= 0 && person_info[0].learned_compulsory_num !== undefined && person_info[0].learned_compulsory_num !== '' ? person_info[0].learned_compulsory_num : 0)
    ) > 0
      ?
    ( 
      Math.round(
      (
        (
          (year_info[0] && year_info[0].compulsory_num >= 0 && year_info[0].compulsory_num != undefined && year_info[0].compulsory_num !== '' ? year_info[0].compulsory_num : 0)
          -
          (person_info[0] && person_info[0].learned_compulsory_num >= 0 && person_info[0].learned_compulsory_num !== undefined && person_info[0].learned_compulsory_num !== '' ? person_info[0].learned_compulsory_num : 0)
        )
      / 
      (year_info[0] && year_info[0].compulsory_num >= 0 && year_info[0].compulsory_num != undefined && year_info[0].compulsory_num !== '' ? year_info[0].compulsory_num : 0)
      )*10000)/100
      
    )
     :
      0
   )
  //   var needscore=0;
  //   var needhour=0;
  // //  const needclass={};
  //  if(nscore==0){
  //     needscore=100;
  //  }
  //  if(this.nhour==0){
  //    needhour=100;
  //  }else{
  //    needhour=nhour;
  //  }
  //  if(nclass==0){
  //    needclass=100;
  //  }
    // console.log('---------------*********---------------------');
    // console.log(nscore);
    // console.log('---------------*********---------------------');    
    // console.log('---------------!!!!!!!!!---------------------');
    // console.log(needhour);
    // console.log('---------------!!!!!!!!!---------------------');    
    // console.log('---------------?????????---------------------');
    // console.log(nclass);
    // console.log('---------------?????????---------------------');    

      

      

//图开始

const placeHolderStyle = {
  normal: {
      label: {
          show: false
      },
      labelLine: {
          show: false
      },
      color: "rgba(0,0,0,0)",
      borderWidth: 0
  },
  emphasis: {
      color: "rgba(0,0,0,0)",
      borderWidth: 0
  }
};


const dataStyle = {
  normal: {
      formatter: '{c}%',
      position: 'center',
      show: true,
      textStyle: {
          fontSize: '12',
          fontWeight: 'normal',
          color: '#34374E'
      }
  }
};


const option = {
  backgroundColor: '#fff',
  title: [{
      text: '学分完成差距',
      left: '118px',
      top: '115px',
      textAlign: 'center',
      textStyle: {
          fontWeight: 'normal',
          fontSize: '13',
          color: '#AAAFC8',
          textAlign: 'center',
      },
  }, {
      text: '学时完成差距',
      left: '258px',
      top: '115px',
      textAlign: 'center',
      textStyle: {
          color: '#AAAFC8',
          fontWeight: 'normal',
          fontSize: '13',
          textAlign: 'center',
      },
  }, {
    text: '必修课完成差距',
    left: '398px',
    top: '115px',
    textAlign: 'center',
    textStyle: {
        color: '#AAAFC8',
        fontWeight: 'normal',
        fontSize: '13',
        textAlign: 'center',
    },
}
],

  //第一个图表
  series: [{
          type: 'pie',
          hoverAnimation: false, //鼠标经过的特效
          radius: ['35%', '40%'],//内圈半径，外圈半径
          center: ['120px', '70px'],//pie图位置，左右，上下
          startAngle: 225,
          labelLine: {
              normal: {
                  show: false
              }
          },
          label: {
              normal: {
                  position: 'center'
              }
          },
          data: [{
                  value: 100,
                  itemStyle: {
                      normal: {
                          color: '#E1E8EE'
                      }
                  },
              }, {
                  value: 35,
                  itemStyle: placeHolderStyle,
              },

          ]
      },
      //上层环形配置
      {
          type: 'pie',
          hoverAnimation: false, //鼠标经过的特效
          radius: ['35%', '40%'],
          center: ['120px', '70px'],
          startAngle: 225,
          labelLine: {
              normal: {
                  show: false
              }
          },
          label: {
              normal: {
                  position: 'center'
              }
          },
          data: [{
               //   value: 75,
                value:nscore,
                  itemStyle: {
                      normal: {
                          color: '#6F78CC'
                      }
                  },
                  label: dataStyle,
              }, {
                  value: 35,
                  itemStyle: placeHolderStyle,
              },

          ]
      },


      //第二个图表
      {
          type: 'pie',
          hoverAnimation: false,
          radius: ['35%', '40%'],
          center: ['260px', '70px'],
          startAngle: 225,
          labelLine: {
              normal: {
                  show: false
              }
          },
          label: {
              normal: {
                  position: 'center'
              }
          },
          data: [{
                  value: 100,
                  itemStyle: {
                      normal: {
                          color: '#E1E8EE'


                      }
                  },

              }, {
                  value: 35,
                  itemStyle: placeHolderStyle,
              },

          ]
      },

      //上层环形配置
      {
          type: 'pie',
          hoverAnimation: false,
          radius: ['35%', '40%'],
          center: ['260px', '70px'],
          startAngle: 225,
          labelLine: {
              normal: {
                  show: false
              }
          },
          label: {
              normal: {
                  position: 'center'
              }
          },
          data: [{
                //  value: 30,
                value:(nhour),
                  itemStyle: {
                      normal: {
                          color: '#4897f6'
                      }
                  },
                  label: dataStyle,
              }, {
                  value: 35,
                  itemStyle: placeHolderStyle,
              },

          ]
      },

      //第三个图表
      
      {
        type: 'pie',
        hoverAnimation: false,
        radius: ['35%', '40%'],
        center: ['400px', '70px'],
        startAngle: 225,
        labelLine: {
            normal: {
                show: false
            }
        },
        label: {
            normal: {
                position: 'center'
            }
        },
        data: [{
                value: 100,
                itemStyle: {
                    normal: {
                        color: '#E1E8EE'


                    }
                },

            }, {
                value: 35,
                itemStyle: placeHolderStyle,
            },

        ]
    },

    //上层环形配置
    {
        type: 'pie',
        hoverAnimation: false,
        radius: ['35%', '40%'],
        center: ['400px', '70px'],
        startAngle: 225,
        labelLine: {
            normal: {
                show: false
            }
        },
        label: {
            normal: {
                position: 'center'
            }
        },
        data: [{
                //value: 67,
                value:(nclass),
                itemStyle: {
                    normal: {
                        color: '#FF66FF'
                    }
                },
                label: dataStyle,
            }, {
                value: 35,
                itemStyle: placeHolderStyle,
            },

        ]
    },
  ]
};

    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h1>个人培训情况概览</h1></Row>
        年份：
          <Select style={{ width: '10%' }} onSelect={this.handleYearChange} defaultValue={currentDate}>{yearList}</Select>
        <br /><br />
        {/*年度任务,任务目标差距*/}
        <div className={Style.middle}>
          <div className={Style.left}>
            <div className={Style.contentcenter}>
              <p  style={{marginLeft:'180px'}}>
                年度任务
              </p>
              <p style={{marginLeft:'130px'}}>
                
                今年为您安排的课程有&nbsp;&nbsp;<span className={Style.line}>
                {
                  year_info[0] && year_info[0].compulsory_num >= 0 && year_info[0].compulsory_num != undefined && year_info[0].compulsory_num !== ''
                    ?
                    year_info[0].compulsory_num + '门'
                    :
                    '未设定'
                } </span>&nbsp;&nbsp;必修课
              </p>
             
              <p style={{marginLeft:'130px'}}>
                为您设定的学分任务是：<span className={Style.line}>
                {
                  year_info[0] && year_info[0].totle_score >= 0 && year_info[0].totle_score != undefined && year_info[0].totle_score !== ''
                    ?
                    year_info[0].totle_score + '分'
                    :
                    '未设定'
                }</span>
              </p>
              <p style={{marginLeft:'130px'}}>
               为您设定的学时任务是：<span className={Style.line}>
                {
                  year_info[0] && year_info[0].totle_hour >= 0 && year_info[0].totle_hour != undefined && year_info[0].totle_hour !== ''
                    ?
                    year_info[0].totle_hour + '小时'
                    :
                    '未设定'
                }</span>
              </p>
              <p></p>
              <p style={{marginLeft:'130px'}}>
               您可以通过以下途径获得提升成长：
               <p><span className={Style.line}>中国联通学院、51CTO平台、联通智享平台或者院内培训计划</span></p>
              </p>
            </div>
          </div>
          <div className={Style.right}>
            <div className={Style.contentcenter}>
              <p>任务目标差距</p>
                 <ReactEcharts
                    style={{ height: '195px', width: '520px'}}
                    notMerge={true}
                    // lazyUpdate={true}
                    option={option} 
                  />
            </div>
          </div>
        </div>
        {/*个人学习情况,可学课程概览*/}
        <div className={Style.middle}>
          <div className={Style.left}>
            <div className={Style.contentcenter}>
              
              <p classNames={Style.first}>个人学习情况</p>
             
              <Button style={{ textAlign: 'right' ,marginLeft:'180px'}} onClick={this.gotoDetail1}>查看详情</Button>
              {/* <p className={Style.first}> */}
              <p>
                已获得培训学分：<span className={Style.line}>
                {
                  person_info[0] && person_info[0].learned_score >= 0 && person_info[0].learned_score !== null && person_info[0].learned_score !== ''
                    ?
                    person_info[0].learned_score + '分'
                    :
                    0 + '分'
                }</span>
              </p>
              <p>
                已获得线上课程培训学分：<span className={Style.line}>
                {
                  person_info[0] && person_info[0].learned_online_score >= 0 && person_info[0].learned_online_score !== null && person_info[0].learned_online_score !== ''
                    ?
                    person_info[0].learned_online_score + '分'
                    :
                    0 + '分'
                }</span>
              </p>
              <p>
                已获得培训学时：<span className={Style.line}>
                {
                  person_info[0] && person_info[0].learned_class_hour >= 0 && person_info[0].learned_class_hour !== null && person_info[0].learned_class_hour !== ''
                    ?
                    person_info[0].learned_class_hour + '小时'
                    :
                    0 + '小时'
                }</span>
              </p>
              <p>
                已获得必修课程：<span className={Style.line}>
                {
                  person_info[0] && person_info[0].learned_compulsory_num >= 0 && person_info[0].learned_compulsory_num !== null && person_info[0].learned_compulsory_num !== ''
                    ?
                    person_info[0].learned_compulsory_num + '门'
                    :
                    0 + '门'
                }</span>
              </p>
            </div> 
          </div>
          <div className={Style.right}>
            <div className={Style.contentcenter}>
              <p>
                可学课程概览
              </p>
              <Button style={{ textAlign: 'right',marginLeft:'130px'}} onClick={this.gotoDetail2}>查看详情</Button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button style={{ textAlign: 'right' }} onClick={this.gotoDetail3}>认证考试清单详情</Button>
              <p>
                全院级培训：<span className={Style.line}>
                {
                  learn_info[0] && learn_info[0].center_class >= 0 && learn_info[0].center_class !== undefined && learn_info[0].center_class !== ''
                    ?
                    learn_info[0].center_class + '场'
                    :
                    0 + '场'
                }</span>
              </p>
              <p>
                分院级培训：<span className={Style.line}>
                {
                  learn_info[0] && learn_info[0].common_class >= 0 && learn_info[0].common_class !== undefined && learn_info[0].common_class !== ''
                    ?
                    learn_info[0].common_class + '场'
                    :
                    0 + '场'
                }</span>
              </p>
              <p>
                部门级培训：<span className={Style.line}>
                {
                  learn_info[0] && learn_info[0].dept_class >= 0 && learn_info[0].dept_class !== undefined && learn_info[0].dept_class !== ''
                    ?
                    learn_info[0].dept_class + '场'
                    :
                    0 + '场'
                }</span>
              </p>
              <p>
                线上课程：<span className={Style.line}>
                {
                  learn_info[0] && learn_info[0].online_class >= 0 && learn_info[0].online_class !== undefined && learn_info[0].online_class !== ''
                    ?
                    learn_info[0].online_class + '门'
                    :
                    0 + '门'
                }</span>
              </p>
              <p>
                认证考试：<span className={Style.line}>
                {
                  learn_info[0] && learn_info[0].exec_class >= 0 && learn_info[0].exec_class !== undefined && learn_info[0].exec_class !== ''
                    ?
                    learn_info[0].exec_class + '项'
                    :
                    0 + '项'
                }</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    loading: state.loading.models.train_query_model,
    ...state.train_query_model,
  };
}
export default connect(mapStateToProps)(train_config_query_index);



