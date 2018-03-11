// Native
import { ipcRenderer, remote } from 'electron'

// Modules
import { Component } from 'react'
import styled from 'styled-components'
import { Connect, query, mutation } from 'urql'

// Local
import gql from '../../../utils/graphql/gql'
import Input from '../../form/Input'
import Person from '../../../vectors/Person'
import AddPerson from '../../../vectors/AddPerson'
import PersonRow from './PersonRow'
import ListBtnRow from '../../ListBtnRow'
import NotificationBox from '../../NotificationBox'
import { StyledButton } from '../../Link'

class PersonSearch extends Component {
  state = {
    name: '',
    fetched: false,
  }

  render() {
    const { onManuallyClick } = this.props
    const { name, fetched } = this.state
    return (
      <Wrapper>
        <Input
          big={true}
          fullWidth={true}
          textAlign="left"
          iconComponent={Person}
          placeholder="Name"
          value={name}
          onChange={e => this.setState({ name: e.target.value })}
        />

        <ListWrapper>
          <Connect
            query={query(AllUsers, { name })}
            mutation={{
              followUser: mutation(FollowUser),
            }}
            shouldInvalidate={() => {
              if (this.state.fetched === false) {
                this.setState({ fetched: true })
                if (ipcRenderer) {
                  ipcRenderer.send('reload-main')
                }
              }
              if (this.state.name !== '') {
                this.setState({ name: '' })
              }
              return false
            }}
          >
            {({ data, followUser }) =>
              name &&
              data &&
              data.allUsersByName &&
              data.allUsersByName.map((item, index) => (
                <PersonRow
                  key={index}
                  onClick={() => this.userPicked(item, followUser)}
                  {...item}
                />
              ))
            }
          </Connect>

          <ListBtnRow
            iconComponent={AddPerson}
            title="Add Person Manually instead"
            onClick={onManuallyClick}
          />
        </ListWrapper>

        <NotificationBox
          visible={fetched}
          onCloseClick={() => this.setState({ fetched: false })}
        >
          💫 Followed successfully!{' '}
          <StyledButton onClick={this.closeWindow}>Close Window</StyledButton>{' '}
          or continue!
        </NotificationBox>
      </Wrapper>
    )
  }

  userPicked = (item, followUser) => {
    followUser({ userId: item.id })
  }

  closeWindow = () => {
    try {
      if (ipcRenderer && remote) {
        ipcRenderer.send('reload-main-and-show')
        remote.getCurrentWindow().close()
      }
    } catch (e) {
      console.log(e)
    }
  }
}

const AllUsers = gql`
  query($name: String!) {
    allUsersByName(name: $name, limit: 7) {
      id
      fullName
      firstName
      lastName
      timezone
      photoUrl
      countryFlag
      city
    }
  }
`

const FollowUser = gql`
  mutation($userId: ID!) {
    followUser(userId: $userId) {
      id
      fullName
      firstName
      lastName
      timezone
      photoUrl
      city
    }
  }
`

export default PersonSearch

const ListWrapper = styled.div`
  flex: 1 1 auto;
  padding-top: 10px;
  overflow: auto;
  margin: 0 ${p => -p.theme.sizes.sidePaddingLarge}px;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
