import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';

import createUser from '../services/createUser.js';

@CSSModules(null, { errorWhenNotFound: false })
export default class RegistForm extends Component {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    return (
      <form method="post" onSubmit={this.onSubmit}>
        <label styleName="form-item">
          Display Name
          <input ref={c => this._displayName = c} />
        </label>
        <label styleName="form-item">
          Mail
          <input ref={c => this._mail = c} />
        </label>
        <label styleName="form-item">
          Password
          <input ref={c => this._password = c} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }

  onSubmit(e) {
    createUser(mail, password, displayName);
  }
}
