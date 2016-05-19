import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import '../common/css/main.css';

class App extends Component {
  // script = {[
  //   {'src': 'http://st.haiziwang.com/static/tracker/tracker-201605.js'},
  //   {'src': 'http://st.haiziwang.com/vendor/wechatShare-1.0.js'}
  // ]}
  render() {
    const { children } = this.props;
    return (
      <div>
        <Helmet
          title="教育频道"
        />
        {children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node
};

export default connect()(App);
