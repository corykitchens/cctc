import React, { Component } from 'react';
import CountdownClock from '../components/CountdownClock';
import PasswordInput from '../components/PasswordInput';
import Title from '../components/Title';
import ContentMessage from '../components/ContentMessage';
import Container from '../components/Container';
import Card from '../components/Card';
import Columns from '../components/Columns';
import Column from '../components/Column';


import PasswordManager from '../components/PasswordManager';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Ransomware',
      subtitle: 'Data deleted in:',
      debug: true,
    }
  }

  render() {
    return (
      <Container>
        <Columns>
          <Column>
            <Card>
            {/* Ransomware Title */}
            <Title title={this.state.title} classes={'title has-text-danger has-text-centered'}/>
            {/* End Ransomware Title */}
            {/* Sub Title */}
            <Title title={this.state.subtitle} classes={'subtitle has-text-danger has-text-centered'} />
            {/* End Sub Title */}
            {/* Countdown Clock */}
            <CountdownClock />
            {/* End Countdown Clock */}
            {/* Ransom Message */}
            <ContentMessage message="Unless 2 BitCoin is received by haxxzor@tempmail.com" />
            {/* End Ransom Message */}
            {/* Instruction Message */}
            <ContentMessage message="To access admin functions: enter the following passwords:" />
            {/* End Instruction Message */}
            <PasswordManager />
            </Card>
          </Column>
        </Columns>

        {/* Debug Mode */}
        <Columns>
          <Column>
          <h3>Found Passwords: {this.state.correctAttempts}</h3>
          </Column>
        </Columns>
        {/* End Debug Mode*/}
      </Container>
    )
  }
}

export default Main;