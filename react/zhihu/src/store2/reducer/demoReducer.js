import * as TYPES from '../action-types';
import _ from '../../assets/utils';

let initial = {
    num: 10
};
export default function demoReducer(state = initial, action) {
    state = _.clone(state);
    let {payload=1}=action;//payload:记录每一次累加的数字
    switch (action.type) {
        // 更新登录者信息
        case TYPES.DEMO_COUNT:
          console.log('先走reudcer')
            state.num+=payload;
            break;
        default:
    }
    return state;
};


