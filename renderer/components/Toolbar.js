// Packages
import electron from 'electron'
import React, { Fragment } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { mutation } from 'urql'

// Local
import gql from '../utils/graphql/gql'
import { client } from '../utils/urql/client'
import { Following } from '../utils/graphql/fragments'
import Cog from '../vectors/Cog'
import Reload from '../vectors/Reload'
import QuestionMark from '../vectors/QuestionMark'
import TinyButton from './TinyButton'
import { LoggedIn } from './LoggedIn'

class Toolbar extends React.Component {
  menuHandler = null

  state = { loading: false }

  render() {
    const { loading } = this.state

    return (
      <Wrapper {...this.props}>
        <LoggedIn>
          {isLoggedIn =>
            isLoggedIn && (
              <Fragment>
                <TinyButtonPadded primary={true} onClick={this.addClicked}>
                  Add
                </TinyButtonPadded>
                <TinyButtonPadded
                  data-wenk-dark={true}
                  data-wenk-length="medium"
                  data-wenk="Update your timezone and location if you moved"
                  className="wenk-align--center"
                >
                  Sync Time
                </TinyButtonPadded>
              </Fragment>
            )
          }
        </LoggedIn>

        <IconButtonWrapper
          first={true}
          disabled={loading}
          aria-label="Reload"
          title="Reload and fetch changes"
          onClick={this.reloadClicked}
        >
          <Spinner loading={loading}>
            <Reload />
          </Spinner>
        </IconButtonWrapper>

        <IconButtonWrapper
          aria-label="Help or Support"
          title="Help / Support"
          onClick={this.helpClicked}
        >
          <QuestionMark />
        </IconButtonWrapper>

        <IconButtonWrapper
          sidePadding={true}
          aria-label="Settings"
          title="Settings"
          onClick={this.settingsClicked}
          innerRef={this.menuHandlerRef}
        >
          <Cog />
        </IconButtonWrapper>
      </Wrapper>
    )
  }

  reloadClicked = async () => {
    this.setState({ loading: true })

    client
      .executeMutation(
        mutation(gql`
          mutation {
            followingList {
              ...Following
            }
          }
          ${Following}
        `),
        true
      )
      .then(() => this.setState({ loading: false }))
      .catch(() => this.setState({ loading: false }))
  }

  helpClicked = () => {
    const sender = electron.ipcRenderer || false
    if (!sender) {
      return
    }

    sender.send('open-chat')
  }

  addClicked = () => {
    const sender = electron.ipcRenderer || false
    if (!sender) {
      return
    }

    sender.send('open-add')
  }

  settingsClicked = () => {
    this.openMenu()
  }

  menuHandlerRef = ref => {
    this.menuHandler = ref
  }

  openMenu = () => {
    const {
      bottom,
      left,
      height,
      width,
    } = this.menuHandler.getBoundingClientRect()

    const sender = electron.ipcRenderer || false

    if (!sender) {
      return
    }

    sender.send('open-menu', { x: left, y: bottom, height, width })
  }
}

export default Toolbar

// Variables
const spacing = p => p.theme.sizes.sidePadding
const lessSpacing = p => p.theme.sizes.sidePadding - 4
const iconBtnNormalPadding = 6 /* Used for all spacing, except the last item which has the global sidePadding */

const Wrapper = styled.div`
  flex: 0 0 auto;
  padding: ${lessSpacing}px 0 ${lessSpacing}px ${spacing}px; /* On the settings size, we don't need padding */
  box-sizing: border-box;
  margin-top: auto;

  display: flex;
  align-items: center;

  border-radius: 0 0 5px 5px;
  border-top: 1px solid ${p => p.theme.colors.lighter};
  background: ${p => p.theme.colors.light};
`

const IconButtonWrapper = styled.button.attrs({
  role: 'button',
  tabIndex: '0',
})`
  display: inline-block;
  margin-left: ${p => (p.first ? 'auto' : '0')};
  padding: 4px ${p => (p.sidePadding ? spacing : iconBtnNormalPadding)}px 4px
    ${iconBtnNormalPadding}px;
  box-sizing: border-box;

  opacity: 0.3;
  border: none;
  cursor: pointer;
  background: none;
  transition: opacity 70ms;

  &:hover {
    opacity: 0.5;
  }

  &:focus {
    outline: none;
  }
`

const TinyButtonPadded = styled(TinyButton)`
  margin-left: ${lessSpacing}px;

  &:first-child {
    margin-left: 0;
  }
`

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const Spinner = styled.div`
  cursor: pointer;

  ${p =>
    p.loading &&
    css`
      animation: ${spin} 1.5s linear infinite;
    `};
`
