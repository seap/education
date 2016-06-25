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

import {Card, CardActions, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';

import IconMic from 'material-ui/svg-icons/av/mic';
import IconMicOff from 'material-ui/svg-icons/av/mic-off';
import IconHearing from 'material-ui/svg-icons/action/record-voice-over';
import IconClear from 'material-ui/svg-icons/content/clear';
import IconSave from 'material-ui/svg-icons/file/cloud-done';
import IconSubmit from 'material-ui/svg-icons/file/cloud-upload';

import Loader from '../../components/Loader';
import TitleRefresh from '../../components/TitleRefresh';
import { dateFormat } from '../../common/js/utility';

class TaskDetail extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const { fetchTaskDetail, wxConfig} = this.props.actions;
    wxConfig && wxConfig();
    fetchTaskDetail && fetchTaskDetail(this.props.params);
  }

  playRemoteAudio(url) {
    let audioPlayer = this.refs.audio;
    audioPlayer.src = url;
    audioPlayer.play();
  }

  renderTaskOperation() {
    const { currentTask, isRecording } = this.props.value.app;
    const { startRecord, stopRecord, saveTask } = this.props.actions;

    if (currentTask.status == 'nocom') {
      return (
        <CardActions style={{textAlign: 'center'}}>
          <RaisedButton
            label="开始录音"
            icon={<IconMic />}
            disabled={isRecording}
            onClick={startRecord}
            primary={true} />
          <RaisedButton
            label="结束录音"
            icon={<IconMicOff />}
            disabled={!isRecording}
            onClick={stopRecord}
            primary={true} />
            <Divider style={{marginTop: 10, marginBottom: 10}}/>
            <RaisedButton
              label="保存作业"
              icon={<IconSave />}
              onClick={saveTask}
              primary={true} />
            <RaisedButton
              label="提交作业"
              icon={<IconSubmit />}
              onClick={() => saveTask(true)}
              primary={true} />
        </CardActions>
      );
    } else if (currentTask.status == 'compl') { //已批改
      return (
        <div>
        <Divider />
        <List>
          <Subheader>老师批改</Subheader>
          <ListItem
            primaryText="批改语音"
            leftIcon={<IconHearing />}
            onTouchTap={() => this.playRemoteAudio(currentTask.teacher_corre)}  />
        </List>
        <CardText>
          备注：{currentTask.corre_content}
        </CardText>
        <CardText>
          评分：{currentTask.score}
        </CardText>

        </div>
      );

    }

  }
  renderTaskDetail() {
    const { isRecording, currentTask, localRecordList } = this.props.value.app;
    const { playRecord, deleteRecord, deleteRemoteRecord } = this.props.actions;
    if (currentTask) {
      return (
        <Card>
          <CardHeader
            title={currentTask.task_name}
            subtitle={dateFormat(new Date(parseInt(currentTask.create_date)*1000), 'yyyy-MM-dd')}
          />
          <Divider />
          <CardText>
            {currentTask.task_content}
          </CardText>
          <Divider />

          <List>
            <Subheader>我的语音作业</Subheader>
            <audio ref='audio' />
            { currentTask.student_answers.map((e, index) =>
              <ListItem
                key={index}
                primaryText={e.name}
                leftIcon={<IconHearing />}
                onTouchTap={() => this.playRemoteAudio(e.student_answer)}
                rightIconButton={currentTask.status == 'nocom'? <FlatButton style={{height:48}} icon={<IconClear />} onClick={() => deleteRemoteRecord(e)} /> : null} />
            )}

            { localRecordList.map((e, index) =>
              <ListItem
                key={index}
                primaryText={e.name}
                leftIcon={<IconHearing />}
                onTouchTap={() => playRecord(e)}
                rightIconButton={<FlatButton style={{height:48}} icon={<IconClear />} onClick={() => deleteRecord(e)} />} />
            )}
          </List>
          {this.renderTaskOperation()}
        </Card>
      );
    }
  }

  renderLoading() {
    const { isFetching } = this.props.value.app;
    return (
      <Loader visible={ isFetching } />
    );
  }

  handleClose = () => {
    const { confirmMessage } = this.props.actions;
    confirmMessage();
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

  render() {
    return (
      <div>
      <Helmet title="作业详情" />
        <MuiThemeProvider muiTheme={ getMuiTheme({userAgent: this.props.value.userAgent}) }>
        <div>
          {this.renderTaskDetail()}
          {this.renderDialog()}
        </div>
        </MuiThemeProvider>
        <TitleRefresh />
        {this.renderLoading()}
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
