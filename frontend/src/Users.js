import React, { Component } from 'react';

class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(users => this.setState({users: users}, () => console.log('Users fetched...', users)));
  }

  render() {
    return (
      <div>
        <h2>Users</h2>
        <ul>
          {this.state.users.map(user =>
            <li key={user.id}> { user.firstName }</li>
          )}
        </ul>
      </div>
    );
  }
}

export default Users;
