import React, { Component } from 'react';
import './App.css';
import Users from './Users';
import Container from './Container';
import SearchBar from './SearchBar';

class App extends Component {
  render() {
    return (
      <div>
        <h1> Google Maps Component </h1>
        <Users />
        <SearchBar />
        <Container />
      </div>
    );
  }
}

export default App
