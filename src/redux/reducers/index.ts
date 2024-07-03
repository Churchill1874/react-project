// reducers/index.js
import { combineReducers } from 'redux';
import counterReducer from '@/redux/reducers/authSlice';

const rootReducer = combineReducers({
    counter: counterReducer,
});

export default rootReducer;
