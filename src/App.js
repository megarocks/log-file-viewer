import React, { Component } from 'react'
import styled from 'styled-components'

import LogEntriesList from './LogEntriesList'


const StyledList = styled.ul`
  display: flex;
  list-style: none;
  margin: 24px 0 0 0;
  padding: 0;
`
const StyledListItem = styled.li`
  padding: 0 36px 0 0;
  font-size: 18px;
  font-weight: bold;
`
const StyledApp = styled.div`
  width: 80%;
  margin: 0 auto;
  display: grid;
  grid-template-rows: 85px auto;
  height: 100vh;
`

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      parsedLogArray: [],
      latestViewedIdx: 0,
      statistics: new Map()
    }
  }

  async componentDidMount() {
    const response = await fetch('http://localhost:3001/log')
    const text = await response.text()
    const logArray = text.split('\n')
    const parsedLogArray = logArray.map((entry, idx) => {
      const entryParts = entry.split(' ')
      return {
        idx,
        date: entryParts.shift(),
        time: entryParts.shift(),
        severity: entryParts.shift(),
        message: entryParts.join(' ')
      }
    })
    this.setState({ parsedLogArray })
  }

  setLatestViewed = (idx) => (isVisible) => {
    if (!isVisible || idx <= this.state.latestViewedIdx) return
    console.log(idx, this.state.latestViewedIdx)
    const arrayOfEverBeenVisibleRows = this.state.parsedLogArray.slice(0, idx)
    const statistics = arrayOfEverBeenVisibleRows.reduce((accumulator, entry) => {
      if (accumulator.has(entry.severity)) {
        accumulator.set(entry.severity, accumulator.get(entry.severity) + 1)
      } else {
        accumulator.set(entry.severity, 0)
      }
      return accumulator
    }, new Map())
    this.setState({ statistics, latestViewedIdx: idx })
  }

  render() {
    const { statistics, parsedLogArray } = this.state

    return (
      <StyledApp>
        <div className="App__statistics">
        <StyledList>
          <StyledListItem>INFO: {statistics.get('INFO')}</StyledListItem>
          <StyledListItem>WARNING: {statistics.get('WARNING')}</StyledListItem>
          <StyledListItem>ERROR: {statistics.get('ERROR')}</StyledListItem>
        </StyledList>
        </div>
        <LogEntriesList items={parsedLogArray} itemHeight={19} setLatestViewed={this.setLatestViewed} itemBuffer={3} innerRef={(gridElementRef) => { this.gridElementRef = gridElementRef}} />
      </StyledApp>
    );
  }
}

export default App;
