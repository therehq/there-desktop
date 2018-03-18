// Packages
import electron from 'electron'
import { Component } from 'react'
import styled from 'styled-components'
import { Connect, query, mutation } from 'urql'

// Utilities
import { closeWindowAndShowMain } from '../../../utils/windows/helpers'
import { Person as PersonFragment } from '../../../utils/graphql/fragments'

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
    const shouldQuery = name.trim()

    return (
      <Wrapper>
        <InputWrapper>
          <Input
            big={true}
            fullWidth={true}
            textAlign="left"
            iconComponent={Person}
            placeholder="Name"
            value={name}
            onChange={e => this.setState({ name: e.target.value })}
          />
        </InputWrapper>

        <ListWrapper>
          <Connect
            query={shouldQuery && query(AllUsers, { name })}
            mutation={{
              followUser: mutation(FollowUser),
            }}
            shouldInvalidate={this.shouldInvalidate}
          >
            {({ data, followUser }) =>
              name.trim() &&
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
    closeWindowAndShowMain()
  }

  shouldInvalidate = () => {
    if (this.state.fetched === false) {
      this.setState({ fetched: true })

      const sender = electron.ipcRenderer || false

      if (!sender) {
        return false
      }

      sender.send('reload-main')
    }

    if (this.state.name !== '') {
      this.setState({ name: '' })
    }

    return false
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
      people {
        ...Person
      }
    }
  }
  ${PersonFragment}
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

const InputWrapper = styled.div`
  flex: 0 1 auto;
`
