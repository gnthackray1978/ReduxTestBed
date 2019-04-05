import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import PersonListToolbar from "./PersonListToolbar.jsx";
import { connect } from "react-redux";
import {desc,stableSort,getSorting,filterRecordSet} from "./personListUtils.js";
import {setData ,setOrder,setSelected,setPage,setRowsPerPage,setNameFilter } from "../../actions/creators.jsx";

const rows = [
  { id: 'date', numeric: true, disablePadding: false, label: 'Birth Year' },
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' }

];

class PersonListHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>

          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={'left' }
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this,
          )}
          <TableCell padding="checkbox">
            Select
          </TableCell>
        </TableRow>
      </TableHead>
    );
  }
}

PersonListHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  //onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};


const styles = theme => ({
  root: {
    width: '100%',
    marginLeft:'10px'
  },
  table: {
    minWidth: 400,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    height:'35px',
    marginLeft :'0px'
  },
  tablePagination:{
    marginTop: '11px'
  },

  toolBar: {
    paddingLeft :'12px'
  }
});

class PersonList extends React.Component {
  constructor(props) {
     super(props);
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.props.orderBy === property && this.props.order === 'desc') {
      order = 'asc';
    }
    this.props.setOrder(order, orderBy);
  };



  handleClick = (event, id) => {
    const { selected } = this.props;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    //personlist
    this.props.setSelected(newSelected);
  };

  handleChangePage = (event, page) => {
    this.props.setPage(page);
  };

  handleChangeRowsPerPage = event => {
      this.props.setRowsPerPage(event.target.value );
  };

  isSelected = id => this.props.selected.indexOf(id) !== -1;



  render() {

    const { classes } = this.props;
    const { persons, order, orderBy, selected, rowsPerPage, page,filter } = this.props;



  //  console.log('render :' + order +' -'+ orderBy +' -'+ selected +' -'+ rowsPerPage +' -'+ page);
//
        //<PersonListToolbar numSelected={selected.length} />

    let personsFiltered = filterRecordSet(persons, filter);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, personsFiltered.length - page * rowsPerPage);



    return (
      <div>


        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
              <PersonListHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}

                onRequestSort={this.handleRequestSort}
                rowCount={personsFiltered.length}
              />
              <TableBody>
                {stableSort(personsFiltered, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(n => {
                    const isSelected = this.isSelected(n.id);
                    return (
                      <TableRow
                        hover
                        onClick={event => this.handleClick(event, n.id)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={n.id}
                        selected={isSelected}
                      >
                        <TableCell align="left" width = "125">{n.date}</TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          {n.name}
                        </TableCell>
                        <TableCell padding="checkbox">
                          <Checkbox checked={isSelected} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </div>

        <Toolbar className={classes.toolBar}>
          <TextField
            id="filled-name"
            label="Name Filter"
            className={classes.textField}
            InputLabelProps ={{
                    shrink: true,
                }}
            onChange = {(evt)=>{
              //console.log('txt changed');
              this.props.setNameFilter(evt.target.value);
            }}
            margin="normal"
            variant="outlined"
          />
          <TablePagination
            className={classes.tablePagination}
            rowsPerPageOptions={[rowsPerPage]}
            component="div"
            count={personsFiltered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Toolbar>


      </div>
    );
  }
}

PersonList.propTypes = {
  classes: PropTypes.object.isRequired,
};


const mapStateToProps = state => {

//  console.log('mapStateToProps personlist');
  return {
    rowsPerPage :  state.rowsPerPage,
    page :  state.page,
    selected :  state.selection,
    order :  state.order,
    orderBy : state.orderBy,
    persons : state.persons.map(x => {
     return { id: x.id, name: x.name, date : x.date};
   }),
   filter : state.gedPersonListFilter

  };
};

const mapDispatchToProps = dispatch => {

  return {

    setRowsPerPage: rowsPerPage => {
      dispatch(setRowsPerPage(rowsPerPage));
    },

    setPage: (page) => {
      dispatch(setPage(page));
    },

    setSelected: (selection) => {
      dispatch(setSelected(selection));
    },

    setOrder: (order, orderBy) => {
      dispatch(setOrder(order,orderBy));
    },

    setNameFilter: (filter) => {
      dispatch(setNameFilter(filter));
    }
  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PersonList));
