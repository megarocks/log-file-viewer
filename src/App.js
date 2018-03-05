import React, { Component } from 'react';
import styled from 'styled-components';

const StyledApp = styled.div`
  width: 80%;
  margin: 0 auto;
  display: grid;
  grid-template-rows: 85px auto;
  height: 100vh;
`

const StyledGrid = styled.div`
  overflow-y: scroll;
  display: grid;
  grid-template-columns: max-content max-content auto;
  grid-gap: 15px;
`


class App extends Component {
  state = {
    parsedLogArray: []
  }

  async componentWillMount() {
    const response = await fetch('http://localhost:3001/log')
    const text = await response.text()
    const logArray = text.split('\n')
    const parsedLogArray = logArray.map(entry => {
      const entryParts = entry.split(' ')
      return {
        date: entryParts.shift(),
        time: entryParts.shift(),
        severity: entryParts.shift(),
        message: entryParts.join(' ')
      }
    })
    this.setState({
      parsedLogArray
    })
    console.log(parsedLogArray)
  }

  render() {
    const { parsedLogArray } = this.state
    return (
      <StyledApp>
        <div className="App__statistics">
          <ul>
            <li>INFO: 0</li>
            <li>WARNING: 0</li>
            <li>ERROR: 0</li>
          </ul>
        </div>
        <StyledGrid>
          { parsedLogArray.map(entry => (
            <React.Fragment>
              <div>{entry.date} {entry.time}</div>
              <div>{entry.severity}</div>
              <div>{entry.message}</div>
            </React.Fragment>
          ))
          }
        </StyledGrid>
      </StyledApp>
    );
  }
}

export default App;
