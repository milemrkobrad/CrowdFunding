import React, { Component } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Menu, Container } from 'semantic-ui-react'
import './App.css'
import { Campaign } from './components/Campaign'
import { Home } from './components/Home'
import { NotFound } from './components/NotFound'
import history from './history'

class App extends Component{
  render(){
    return(
      // <h1>hello</h1>
      <Router history={history}>
        <Container>
          <Menu secondary>
            <Menu.Item
             name='home'
             onClick={this.navigateToHome}
             />             
          </Menu>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/campaigns/:address' component={Campaign} />
            <Route component={NotFound} />
          </Switch>
        </Container>
      </Router>
    );
  }
  
  navigateToHome(e){
    e.preventDefault();
    history.push('/');
    window.location.reload();
  }
}

export default App;
