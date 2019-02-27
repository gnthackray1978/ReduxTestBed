import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './main.css';

// const App = () => (
//   <div className="App">
//
//     <h1 className="App-Title">Hello Parcel x React</h1>
//   </div>
// );

ReactDOM.render(<App />, document.getElementById('root'));

// Hot Module Replacement
// if (module.hot) {
//   module.hot.accept();
// }