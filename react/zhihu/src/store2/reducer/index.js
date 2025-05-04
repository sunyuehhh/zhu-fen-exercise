import { combineReducers } from 'redux';
import demoReducer from './demoReducer';

const reducer = combineReducers({
    demo: demoReducer,
});
export default reducer;