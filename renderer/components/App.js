import React from 'react'
import styled from 'styled-components'

import Popover from './Popover'
import Toolbar from './Toolbar'
import Person from './Person'
import JoinBox from './JoinBox'
import AddFirstOne from './AddFirstOne'

const App = () => (
  <Popover>
    <Layout>
      {/* <PeopleScrollWrapper>
        <Person />
        <Person
          photo={require('../assets/demo/phil.jpg')}
          hour={1}
          minute={10}
          timezone="GMT +1:00"
          name="Phil"
          city="London"
          day="Tue"
        />
        <Person noBorder={true} />
      </PeopleScrollWrapper>
      <JoinBox /> */}

      <AddFirstOne />

      <Toolbar />
    </Layout>
  </Popover>
)

export default App

const Layout = styled.div`
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
`

const PeopleScrollWrapper = styled.div`
  flex: 1 1 auto;
  width: 100%;
  overflow: auto;
  border-radius: 4px 4px 0 0;

  > *:first-child {
    padding-top: 3px;
  }
`
