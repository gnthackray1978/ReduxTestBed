import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import './main.css';
import { Provider } from "react-redux";
import store from "./store";

// const App = () => (
//   <div className="App">
//
//     <h1 className="App-Title">Hello Parcel x React</h1>
//   </div>
// );

ReactDOM.render(<Provider store={store}><App/></Provider>,document.getElementById('root'));

// Hot Module Replacement
// if (module.hot) {
//   module.hot.accept();
// }
