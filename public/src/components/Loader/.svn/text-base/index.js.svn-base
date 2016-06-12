import React, { Component, PropTypes } from 'react';
import styles from './loading.scss';

export default class Loader extends Component {

  renderMessage() {
    const { message } = this.props;
    return (
      <p>{ message }</p>
    );
  }

  render() {
    const { visible } = this.props; //传入的isFetching 值判断是否需要展示loader
    const fancyClass= !visible ? '' : 'show';
    return (
      <div className={`${styles['uiLoadingBlock']} ${styles[fancyClass]} `}>
        <div className={`${styles['uiLoadingCnt']}`}>
          <i className={`${styles['uiLoadingBright']}`}></i>
          { this.renderMessage() }
        </div>
      </div>
    );
  }
}

Loader.propTypes = {
  visible: PropTypes.bool,
  message: PropTypes.string
};

//设置默认属性
Loader.defaultProps = {
  visible: false,
  message: '加载中...'
};
