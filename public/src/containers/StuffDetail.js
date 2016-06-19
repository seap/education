import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import * as IndexActions from '../actions';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {List, ListItem} from 'material-ui/List';

import {Card, CardHeader} from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import IconPDF from 'material-ui/svg-icons/image/picture-as-pdf';

import Loader from '../components/Loader';
import TitleRefresh from '../components/TitleRefresh';

class StuffDetail extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const { fetchStuffDetail } = this.props.actions;
    fetchStuffDetail && fetchStuffDetail(this.props.params);
  }

  renderStuffDetail() {
    const { stuff } = this.props.value.app;
    if (stuff) {
      return (
        <Card>
          <CardHeader
            title={stuff.stuff_name}
            subtitle="2016-05-29"
          />
          <Divider />
          <List>
            { stuff.stuff_attach.map((e, index) =>
              <a key={index} href={e.attach_url} ><ListItem key={index} primaryText={e.attach_name}
                leftIcon={<IconPDF />}
              /></a> )}
          </List>
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

  render() {
    return (
      <div>
      <Helmet title="辅导材料" />
        <MuiThemeProvider muiTheme={ getMuiTheme({userAgent: this.props.value.userAgent}) }>
        <div>
          {this.renderStuffDetail()}
        </div>
        </MuiThemeProvider>
        <TitleRefresh />
        {this.renderLoading()}
      </div>
    );
  }
}

StuffDetail.propTypes = {
};

const mapStateToProps = state => ({ value: state });

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(IndexActions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(StuffDetail);
