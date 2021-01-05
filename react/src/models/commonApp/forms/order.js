/**
 * 作者：王超
 * 创建日期：2017-10-19
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：工单state,reduers,数据接口定义
 */
export default {
  namespace : 'order',
  state : {
      startValue: new Date(),
    	endValue: null,
  },

  reducers : {
      changeDateVal(state,{startValue,endValue}){
      return{
        ...state,
        startValue,
	      endValue
      };
    }
  }
}
