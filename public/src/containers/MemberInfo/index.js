import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import * as IndexActions from '../../actions';

import Loader from '../../components/Loader';

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
  },
  item: {
    color: '#000'
  }
};

class MemberInfo extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    const { fetchMyInfo } = this.props.actions;
    fetchMyInfo();
  }

  handleClose = () => {
    const { confirmMessage } = this.props.actions;
    confirmMessage();
  }

  renderMyInfo() {
    const { myInfo } = this.props.value.app;
    if (myInfo) {
      return (
        <div style={{padding: 10}}>
        <TextField
          id="studentId"
          inputStyle={style.item}
          floatingLabelText="学号"
          value={myInfo.student_no}
          disabled={true}
          fullWidth={true} />
        <TextField
          id="studentName"
          inputStyle={style.item}
          floatingLabelText="学生姓名"
          value={myInfo.student_name}
          disabled={true}
          fullWidth={true} />
        <TextField
          id="parentName"
          inputStyle={style.item}
          floatingLabelText="家长姓名"
          value={myInfo.parent_name}
          disabled={true}
          fullWidth={true} />
        <TextField
          id="phone"
          inputStyle={style.item}
          floatingLabelText="联系电话"
          value={myInfo.phone}
          disabled={true}
          fullWidth={true} />
        <TextField
          id="remark"
          inputStyle={style.item}
          floatingLabelText="备注"
          value={myInfo.remark? myInfo.remark: ' '}
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
         <Helmet title="个人信息" />
         <AppBar
           title="个人信息"
         />
         {this.renderMyInfo()}
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
      /> ];

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

MemberInfo.propTypes = {
};

const mapStateToProps = state => ({ value: state });

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(IndexActions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(MemberInfo);
