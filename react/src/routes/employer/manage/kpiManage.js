/**
 * 文件说明：员工指标管理页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-07-20
 */
import SearchUI from '../search/searchUI'
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import Style from '../../../components/employer/employer.less'
import ExamineRes from '../../../components/employer/ExamineRes'
import message from '../../../components/commonApp/message'
/**
 * 功能：员工考核结果列表转化成卡片样式数据源
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-07-20
 * @param year 考核历史结果年度
 * @param list 考核历史结果列表
 * @param display 是否可以新增下一季度指标
 * @returns {Array} 卡片样式数据源
 */
function transToCard(year, list, display,begin_time,end_time) {
  //debugger
  let cardResList = [];
  if (list && list.length) {
    for (let i = 0; i < list.length; i++) {
      let flag = false;
      for (let j = 0; j < cardResList.length; j++) {
        if (cardResList[j].year == list[i].year) {
          list[i].key = cardResList[j].res.length;
          cardResList[j].res.splice(0, 0, list[i]);
          flag = true;
          j = cardResList.length;
        }
      }
      if (flag == false) {
        list[i].key = 0;
        cardResList.splice(cardResList.length, 0, {
          'key': cardResList.length + 1,
          'display': 'true',
          'year': list[i].year,
          'res': [list[i]]
        })
      }
    }
    if (display == true) {
      if (year == cardResList[0].year) {
        //可添加指标后，判断当前时间是否在开始时间-结束时间之内
        if(timestamp(begin_time)<new Date().getTime()<timestamp(end_time))
        cardResList[0].res.splice(cardResList[0].res.length, 0, {});
      } else {
        if(timestamp(begin_time)<new Date().getTime()<timestamp(end_time))
        cardResList.splice(0, 0, {'key': cardResList.length + 1, 'display': 'true', 'year': year, 'res': [{}]});
      }
    }
  } else {
    if (display == true) {
      if(timestamp(begin_time)<new Date().getTime()<timestamp(end_time))
      cardResList.splice(0, 0, {'key': cardResList.length + 1, 'display': 'true', 'year': year, 'res': [{}]});
    }
  }
  return cardResList;
}

//将字符串格式的时间转换成时间戳
function timestamp(param){
var date = param;
date = date.substring(0,19);    
date = date.replace(/-/g,'/'); 
var timestamp = new Date(date).getTime();
return timestamp
}

/**
 * 功能：员工指标管理
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-07-20
 */
function KpiManage(SearchUI) {
  return class KpiManage extends React.Component {

    stateMap = {
      0: '待提交',
      1: '待审核',
      2: '审核未通过',
      3: '待评价',
      4: '待确认',
      5: '复议',
      6: '待评级',
      7: '待评级',
      8: '待评级',
      9: '待评级',
      10: '考核完成',
       A:'完成情况未填报'
    };
    state = {
      cardResList: [],
      thead: [
        {
          title: '年度',
          dataIndex: 'year'
        },
        {
          title: '季度',
          dataIndex: 'season',
          render: (text) => `第${text}季度`
        },
        {
          title: '部门',
          dataIndex: 'dept_name',
          width: '40%'
        },
        {
          title: '姓名',
          dataIndex: 'staff_name',
        },
        {
          title: '状态',
          dataIndex: 'state',
          render: (text) => {
            return this.stateMap[text]
          }
        },
        {
          title: '贡献度',
          dataIndex: 'cont_degree'
        },
        {
          title: '考核评级',
          dataIndex: 'rank'
        }
      ]
    };

    /**
     * 功能：组件渲染完后执行操作
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     */
    componentDidMount() {
      this.init()
    }

    /**
     * 功能：父组件变化后执行操作
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     */
    componentWillReceiveProps() {
      this.init()
    }

    /**
     * 功能：页面数据初始化
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     */
    init() {
      const {list, display,begin_time,end_time} = this.props;
      const year = new Date().getFullYear().toString();
      let cardResList = transToCard(year, list, display,begin_time,end_time);  // 将查询到的考核历史记录转换成卡片需要的数据
      this.setState({
        cardResList
      })
    }


    /**
     * 功能：新增下一季度指标按钮事件
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     */
    addKpi = () => {
      const {dispatch} = this.props;
      let query = {
        flag: "0"
      }
      dispatch(routerRedux.push({
        pathname: '/humanApp/employer/manage/kpiAdd', query
      }));
    };

    /**
     * 功能：考核结果卡片点击事件
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param record 考核记录
     */
    cardClickHandle = (record) => {
      const {staff_id, year, season, state} = record;
      if (season == 0) {
        message.info("年度考核无指标详情！");
        return
      }
      const {dispatch} = this.props;
      let query = {
        staff_id,
        year,
        season,
      }
      if (!state || state === '0') {
        query["flag"] = "0";
        dispatch(routerRedux.push({
          pathname: '/humanApp/employer/manage/kpiAdd', query
        }));
      } else if (state === '2') {
        query["flag"] = "1";
        dispatch(routerRedux.push({
          pathname: '/humanApp/employer/manage/kpiModify', query
        }));
      }else if (state === 'A') {//2020 11-9 四季度新增 完成情况未填报状态
        query["flag"] = "2";
        dispatch(routerRedux.push({
          pathname: '/humanApp/employer/manage/kpiFinish', query
        }));
      }
      else if (state === '3') {
        query["flag"] = "2";
        dispatch(routerRedux.push({
          pathname: '/humanApp/employer/manage/kpiFinish', query
        }));
      } else {
        let needRevocation = false;
        if (state === '1') {
          needRevocation = true;  // 撤销
        }
        let query = {
          staff_id,
          year,
          season,
          needRevocation
        }
        dispatch(routerRedux.push({
          pathname: '/humanApp/employer/manage/searchDetail',
          query
        }));
      }

    };

    /**
     * 功能：切换某年度考核指标的显示/隐藏
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-07-20
     * @param cardResList 考核结果卡片样式数据源
     * @param item tabs标签
     */
    changeDisplay = (cardResList, item) => {
      item.display = item.display == 'true' ? 'false' : 'true';
      this.setState({
        cardResList
      })
    }

    render() {
      const {cardResList} = this.state;
      return <div className={Style.wrap}>
        {this.state.cardResList.map((i, index) =>
          <div key={index.toString()}>
            <div className={Style.div_year} onClick={() => this.changeDisplay(cardResList, i)}>
              <div>{i.year + '年度'}</div>
            </div>
            <div style={{display: i.display == 'true' ? 'block' : 'none', clear: 'both'}}>
              {i.res.map((res, index) =>
                <ExamineRes key={index.toString()} {...res} cardClickHandle={() => this.cardClickHandle(res)}/>
              )
              }
            </div>
          </div>
        )}
      </div>
    }
  }
}

/**
 * 功能：state数据注入组件
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-07-20
 * @param state 状态树
 */
function mapStateToProps(state) {
  const {year, season, list, display,begin_time,end_time} = state.manage;
  if (list.length) {
    list.map((i, index) => i.key = index)
  }
  return {
    year,
    season,
    list:[...list],
    loading: state.loading.models.manage,
    display,
    begin_time,
    end_time
  };
}

export default connect(mapStateToProps)(KpiManage(SearchUI))

