import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as IndexActions from '../actions';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Loader from '../components/Loader';

const style = {
  container: {
    position: 'relative',
  },
  bindForm: {
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
    marginLeft: '50%'
  },
  divider: {
    textAlign: 'right',
    marginTop: 10,
  }
};

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clazzIndex: 0
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    const { fetchMyInfo, fetchClassList } = this.props.actions;
    fetchMyInfo();
    fetchClassList();
  }

  handleClassChange = (event, index, value) => {
    console.log(index);
    this.setState({
      clazzIndex: index
    })
  }

  handleSubmit = () => {
    const { isFetching } = this.props.actions;
    if (isFetching) {
      return;
    }
  }

  handleClose = () => {
    const { confirmMessage } = this.props.actions;
    confirmMessage();
  }

  renderMyInfo() {
    const { myInfo, classList } = this.props.value.app;
    if (!classList || classList.length < 1) {
      return;
    }
    const menuList = classList.map((clazz) => <MenuItem key={clazz.id} value={clazz.id} primaryText={clazz.clazz_name} />);
    if (myInfo && classList) {
      return (
        <div>
        <TextField
          id="studentName"
          floatingLabelText="姓名"
          value={myInfo.student_name}
          disabled={true}
          fullWidth={true} />
        <TextField
          id="studentId"
          floatingLabelText="学号"
          value={myInfo.student_no}
          disabled={true}
          fullWidth={true} />
        <SelectField
          id="clazzId"
          value={classList[this.state.clazzIndex].id}
          floatingLabelText="班级"
          onChange={this.handleClassChange} fullWidth={true}>
          {menuList}
        </SelectField>
        <TextField
         id="price"
         floatingLabelText="价格（元）"
         value={classList[this.state.clazzIndex].cost}
         disabled={true}
         fullWidth={true} />
         </div>
      )
    }
  }
  render() {
    const { myInfo } = this.props.value.app;
    return (
       <MuiThemeProvider  muiTheme={ getMuiTheme({userAgent: this.props.value.userAgent}) }>
         <div style={style.container}>
         <AppBar
           title="学生付款"
         />
         {this.renderMyInfo()}
         <div style={style.bindForm} >
          <RaisedButton
            id="bind"
            label="付款"
            style={{width:180}}
            onTouchTap={this.handleSubmit}
            primary={true}
            fullWidth={true} />
         </div>
         {this.renderDialog()}
         {this.renderLoading()}
         </div>
       </MuiThemeProvider>
    );
  }

  renderDialog() {
    const { message } = this.props.value.app;
    if (!message) {
      return;
    }
    const actions = [
      <FlatButton
        label="确认"
        primary={true}
        onClick={this.handleClose}
      />
    ];
    return (
      <Dialog
          actions={actions}
          modal={true}
          open={true}
          onRequestClose={this.handleClose} >
        {message}
      </Dialog>
    );
  }

  renderLoading() {
    const { isFetching } = this.props.value.app;
    return (
      <Loader visible={ isFetching } />
    );
  }
}

Payment.propTypes = {
};

const mapStateToProps = state => ({ value: state });

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(IndexActions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
