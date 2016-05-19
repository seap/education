import React, { Component, PropTypes } from 'react';
import styles from './main.scss';
import img1 from './1.png';

export default class Toogle extends Component {
  render() {
    const { value, onToogle } = this.props;

    return (
      <div onClick={onToogle} className={`${styles.toogleBox} red`} id={styles.testId}>
        {value}
        <br />
        <img src={img1} />
      </div>
    );
  }
}

Toogle.propTypes = {
  value: PropTypes.string.isRequired,
  onToogle: PropTypes.func.isRequired
};
