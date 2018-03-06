import React, { Component } from 'react'
import styled from 'styled-components'
import VisibilitySensor from 'react-visibility-sensor'


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

const StyledGrid = styled.div`
  overflow-y: scroll;
  display: grid;
  grid-template-columns: max-content min-content 1fr;
  grid-column-gap: 25px;
  grid-row-gap: 10px;
  max-width: 100%;
`
const LogEntryMessage = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
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

    const arrayOfEverBeenVisibleRows = this.state.parsedLogArray.slice(0, idx)
    const statistics = arrayOfEverBeenVisibleRows.reduce((accumulator, entry) => {
      if (accumulator.has(entry.severity)) {
        accumulator.set(entry.severity, accumulator.get(entry.severity) + 1)
      } else {
        accumulator.set(entry.severity, 0)
      }
      return accumulator
    }, new Map())
    this.setState({ statistics })
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
        <StyledGrid innerRef={(gridElementRef) => { this.gridElementRef = gridElementRef}}>
          { parsedLogArray.map(entry => (
            <React.Fragment key={entry.idx}>
              <div>{entry.date} {entry.time}</div>
              <div>{entry.severity}</div>
              <LogEntryMessage>
                <VisibilitySensor
                  onChange={this.setLatestViewed(entry.idx)}
                  intervalDelay={7000}
                  scrollCheck
                  scrollDelay={10}
                  resizeCheck
                  containment={this.gridElementRef} />
                {entry.message}
              </LogEntryMessage>
            </React.Fragment>
          ))
          }
        </StyledGrid>
      </StyledApp>
    );
  }
}

export default App;
