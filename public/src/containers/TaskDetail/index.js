import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import * as IndexActions from '../../actions';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';

import IconMic from 'material-ui/svg-icons/av/mic';
import IconMicOff from 'material-ui/svg-icons/av/mic-off';
import IconHearing from 'material-ui/svg-icons/av/hearing';
import IconClear from 'material-ui/svg-icons/content/clear';
import IconSave from 'material-ui/svg-icons/file/cloud-done';
import IconSubmit from 'material-ui/svg-icons/file/cloud-upload';

import TitleRefresh from '../../components/TitleRefresh';

class TaskDetail extends Component {
  constructor() {
    super();
    this.state = {
      isRecording: false
    }
  }

  componentDidMount() {
    const { fetchTaskDetail, wxConfig} = this.props.actions;
    wxConfig && wxConfig();
    fetchTaskDetail && fetchTaskDetail(this.props.params);
  }

  startRecord = () => {
    const { startRecord } = this.props.actions;
    startRecord && startRecord();
    // wx.startRecord();
    this.setState({
      isRecording: true
    });
  }

  stopRecord = () => {
    const { stopRecord } = this.props.actions;
    stopRecord && stopRecord();
    // wx.stopRecord({
    //   success: (res) => {
    //     this.setState({
    //       isRecording: false
    //     });
    //     console.log('stop successed, res', res);
    //
    //     wx.playVoice(res);
    //     console.log('playing...');
    //   }
    // });
  }

  playRecord = () => {

  }

  touchLocalRecord = (event) => {
    console.log(event.target);
  }

  renderTaskDetail() {
    const { currentTask, localRecordList } = this.props.value.app;
    console.log('currentTask ', currentTask);
    if (currentTask) {
      return (
        <Card>
          <CardHeader
            title={currentTask.task_name}
            subtitle="2016-05-29"
          />
          <CardText>
            {currentTask.task_content}
          </CardText>
          <Divider />

          <List>
            <Subheader>我的语音作业</Subheader>
            <ListItem primaryText="59''" leftIcon={<IconHearing />} rightIconButton={<FlatButton style={{height:48}} icon={<IconClear />} />} />
            <ListItem primaryText="30''" leftIcon={<IconHearing />} rightIconButton={<FlatButton style={{height:48}} icon={<IconClear />} />} />
            { localRecordList.map((e)=>
              <ListItem primaryText={e}
                leftIcon={<IconHearing />}
                onTouchTap={this.touchLocalRecord}
                rightIconButton={<FlatButton style={{height:48}} icon={<IconClear />} />} /> )}
          </List>
          <CardActions style={{textAlign: 'center'}}>
            <RaisedButton
              label="开始录音"
              icon={<IconMic />}
              disabled={this.state.isRecording}
              onClick={this.startRecord}
              primary={true} />
            <RaisedButton
              label="结束录音"
              icon={<IconMicOff />}
              disabled={!this.state.isRecording}
              onClick={this.stopRecord}
              primary={true} />
          </CardActions>

          <Divider />
          <CardActions style={{textAlign: 'center'}}>
            <RaisedButton
              label="保存作业"
              icon={<IconSave />}
              onClick={this.saveTask}
              primary={true} />
            <RaisedButton
              label="提交作业"
              icon={<IconSubmit />}
              onClick={this.submitTask}
              primary={true} />
          </CardActions>

        </Card>
      );
    }
  }

  render() {
    return (
      <div>
      <Helmet title="作业详情" />
        <MuiThemeProvider muiTheme={ getMuiTheme({userAgent: this.props.value.userAgent}) }>
        <div>
          {this.renderTaskDetail()}
        </div>
        </MuiThemeProvider>
        <TitleRefresh />
      </div>
    );
  }
}

TaskDetail.propTypes = {
};

const mapStateToProps = state => ({ value: state });

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(IndexActions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetail);
