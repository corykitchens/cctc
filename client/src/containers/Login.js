import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {browserHistory} from 'react-router';
import Title from '../components/Title';
import ContentMessage from '../components/ContentMessage';
import Container from '../components/Container';
import Card from '../components/Card';
import Columns from '../components/Columns';
import Column from '../components/Column';


class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: 'Ransomware',
      subtitle: 'Login',
      username: '',
      password: '',
      modalText: ''
    }
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.auth = this.auth.bind(this);
  }

  handleUsernameChange(e) {
      this.setState({username: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handleSubmit(e) {
    console.log('Woohoo submit');
    e.preventDefault();
    const { attempt } = this.state;
    this.props.attemptPassword(attempt);
  }

  auth() {
    fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then(resp => resp.json())
    .then(results => {
      const { token } = results;
      localStorage.setItem('token', token);

    })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <Container>
        <Columns>
          <Column>
            <Card className="card-container">
            <Title title={this.state.title} classes={'title has-text-danger has-text-centered'}/>
            <Title title={this.state.subtitle} classes={'subtitle has-text-danger has-text-centered'} />
            <Columns>
              <div className="column is-half is-offset-one-quarter">
                <div className="content login-form">
                  <div className="field">
                    <label className="label">Team Username</label>
                    <input className="input" type="text" placeholder="Team Name" value={this.state.username} onChange={this.handleUsernameChange}/>
                  </div>
                    <label className="label">Password</label>
                  <input className="input" type="password" placeholder="Password" value={this.state.password}  onChange={this.handlePasswordChange}/>
                    <div class="has-text-centered">
                      <button className="button is-info is-rounded has-text-centered submit-btn" onClick={this.auth}>Login</button>
                    </div>
                </div>
              </div>
            </Columns>
            </Card>
          </Column>
        </Columns>
      </Container>

    )
  }
}

export default Login;