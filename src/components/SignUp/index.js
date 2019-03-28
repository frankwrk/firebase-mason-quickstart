import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Canvas } from 'mason-library';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

// const SignUpPage = () => (
//   <div>
//     <h1>SignUp</h1>
//     <SignUpForm />
//   </div>
// );

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

class SignUpPage extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(data) {
    this.props.firebase
    .doCreateUserWithEmailAndPassword(data.email, data.password)
    .then(authUser => {
      // Create a user in your Firebase realtime database
      return this.props.firebase.user(authUser.user.uid).set({
        name: data.name,
        email: data.email,
      });
    })
    .then(() => {
      this.props.history.push(ROUTES.HOME);
    })
    .catch(error => {
      this.setState({ error: error.message })
    });
  }

  render() {
    return (
      <div>
        <Canvas
          id="5c981f96581fdf00032c8ef9"
          children={<span>{this.state.error}</span>}
          willSendData={(form) => {
            this.onSubmit(form.data)
            return false; // Don't actually submit the form
          }}
        />
      </div>
    );
  }
}

// const SignUpForm = compose(
//   withRouter,
//   withFirebase,
// )(SignUpFormBase);

export default compose(
  withRouter,
  withFirebase,
)(SignUpPage);
