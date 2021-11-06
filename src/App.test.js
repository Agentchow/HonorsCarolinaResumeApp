import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Unauthenticated from './components/Unauthenticated'
import Main from './components/Main'
import {render, fireEvent} from "@testing-library/react"

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('renders login', ()=> {
  const {queryByTitle} = render(<Main />);
  const btn = queryByTitle("loginButton");
  expect(btn).toBeTruthy
});