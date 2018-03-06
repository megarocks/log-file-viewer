import React, { Component } from 'react'
import styled from 'styled-components'
import VisibilitySensor from 'react-visibility-sensor'
import VirtualList from 'react-virtual-list'

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

class LogEntriesList extends Component {
  render = () => {
    const { virtual, itemHeight, setLatestViewed } = this.props

    return (
      <StyledGrid innerRef={(gridElementRef) => { this.gridElementRef = gridElementRef}} style={virtual.style}>
        { virtual.items.map(entry => (
          <React.Fragment key={entry.idx}>
          <div style={{height: itemHeight}}>{entry.date} {entry.time}</div>
          <div style={{height: itemHeight}}>{entry.severity}</div>
          <LogEntryMessage style={{height: itemHeight}}>
            <VisibilitySensor
              onChange={setLatestViewed(entry.idx)}
              intervalDelay={7000}
              scrollCheck
              scrollDelay={10}
              resizeCheck
              containment={this.gridElementRef} />
            {entry.message}
          </LogEntryMessage>
        </React.Fragment>
        ))}
      </StyledGrid>
    )
  }
}

export default LogEntriesList = VirtualList()(LogEntriesList);