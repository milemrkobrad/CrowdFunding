import './App.css'

class App extends Component{
  render(){
    return(
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
    )
  }
  
  navigateToHome(){
    e.preventDefault();
    history.pushState('/');
  }
}

export default App;
