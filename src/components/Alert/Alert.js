import React from 'react';
import * as styles from './Alert.module.css';

export default class Alert extends React.Component {
  timer = null;
  state = {
    show: true
  };

  componentDidMount() {
    this.timer = window.setTimeout(() => {
      this.setState({ show: false });
    }, 5000);
  }

  componentWillMount() {
    window.clearInterval(this.timer);
  }

  render() {
    return (
      this.state.show && (
        <div
          className={`${styles.alertBox} ${this.props.type === 'success' &&
            styles.success} ${this.props.type === 'error' && styles.error}`}
        >
          {this.props.children}
        </div>
      )
    );
  }
}
