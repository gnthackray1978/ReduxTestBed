import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Grid from '@material-ui/core/Grid';
import './SideDrawer.css';

const styles = {
  list: {
    width: 300,
  },

  fullList: {
    width: 'auto',
  },
  mygrid:{
    margin:'0px'
  },

  label: {

    textAlign: 'center',

  },
};

 class SideDrawer extends Component {

   constructor(props) {
      super(props);
     this.state = {
       modalShow: this.props.show ,
     };
   }

   componentDidMount() {
     console.log('-componentDidMount:');
     this.props.onOpenClick(()=>{
       this.setState({ modalShow: true });
     });
   }

   toggleDrawer(state){
     if(this.state.modalShow != state)
      this.setState({ modalShow: state });
   }


  render() {

    const { classes } = this.props;

    return (
      <div>
        <Drawer open={this.state.modalShow} >
          <div  className={classes.list}>
            <div className = "inner">
            <Grid container spacing={24} className={classes.mygrid}>
              <Grid item xs={12}>
                <b className ={classes.label}>Hello there</b>
              </Grid>
              <Grid item xs={4}>
                <Button onClick={()=>{ }}  className ={classes.label}>Default</Button>
              </Grid>
              <Grid item xs={4}>
                <Button onClick={()=>{ }} className ={classes.label}>Select</Button>
              </Grid>
              <Grid item xs={4}>
                <Button onClick={()=>{ this.toggleDrawer(false);}}
                  className ={classes.label}>Close</Button>
              </Grid>
            </Grid>
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

SideDrawer.defaultProps = {
  show: false,

};

SideDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SideDrawer);
