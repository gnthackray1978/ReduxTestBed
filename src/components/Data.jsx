import React, { Component } from 'react'
import { Grid, Col,Row, Image ,Modal,Container,Button } from 'react-bootstrap';
import SideDrawer from './SideDrawer';
import './data.css';


export default class Data extends Component {
  constructor(...args) {
   super(...args);

//   this.state = { modalShow: false };

//   this.getAlert = this.getAlert.bind(this);

//   console.log('-constructor:' + this.props.mode);
 }

 // getAlert() {
 //
 //    if(this.state.modalShow)
 //      this.setState({ modalShow: false });
 //    else
 //      this.setState({ modalShow: true });
 // }

 componentDidMount() {
   console.log('-componentDidMount:');
//   this.props.setClick(this.getAlert);
 }

 // componentWillUnmount() {
 //   console.log('-componentWillUnmount' + this.props.mode);
 // }
 // getSnapshotBeforeUpdate(){
 //    console.log('-getSnapshotBeforeUpdate' + this.props.mode);
 //    return null;
 // }
 // componentDidUpdate(){
 //   //
 //    console.log('-componentDidUpdate' + this.props.mode);
 // }
 // shouldComponentUpdate(){
 //    console.log('-shouldComponentUpdate' + this.props.mode);
 //    return true;
 // }

 // <Button variant="primary" onClick={() => this.setState({ modalShow: true })} >
 //   Launch modal with grid
 // </Button>
 render() {

   return (
     <div>
       <SideDrawer onOpenClick={this.props.setClick} />
     </div>

   );
 }

}




// class App extends React.Component {
//   constructor(...args) {
//     super(...args);
//
//     this.state = { modalShow: false };
//   }
//
//   render() {
//     let modalClose = () => this.setState({ modalShow: false });
//
//     return (
//       <ButtonToolbar>
//         <Button
//           variant="primary"
//           onClick={() => this.setState({ modalShow: true })}
//         >
//           Launch modal with grid
//         </Button>
//
//         <SideDrawer show={this.state.modalShow} onHide={modalClose} />
//       </ButtonToolbar>
//     );
//   }
// }

//render(<App />);
