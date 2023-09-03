import { createStore } from 'react-redux';
import rootReducer from './reducers/index';

const store = createStore(rootReducer);

export default store;
