// Packages
import electron from 'electron'
import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import { Subscribe } from 'unstated'
import { mutation } from 'urql'

// Utilities
import gql from '../utils/graphql/gql'
import { client } from '../utils/urql/client'
import { Person, Place } from '../utils/graphql/fragments'

// Local
import Cog from '../vectors/Cog'
import Reload from '../vectors/Reload'
import TinyButton from './TinyButton'
import QuestionMark from '../vectors/QuestionMark'
import SortModeContainer from './tray/SortModeContainer'
import { LoggedIn } from './LoggedIn'

class Toolbar extends React.Component {
  menuHandler = null

  state = { loading: false }

  render() {
    // There are 2 modes for the Toolbar
    return (
      <Wrapper {...this.props}>
        <Subscribe to={[SortModeContainer]}>
          {sortMode =>
            sortMode.state.enabled
              ? this.renderSortingMode(sortMode)
              : this.renderNormalMode()
          }
        </Subscribe>
      </Wrapper>
    )
  }

  renderNormalMode() {
    const { loading } = this.state

    return (
      <InnerWrapper>
        <LoggedIn>
          {isLoggedIn =>
            isLoggedIn && (
              <ButtonsWrapper>
                <TinyButtonPadded
                  key="1"
                  primary={true}
                  onClick={this.addClicked}
                >
                  Add
                </TinyButtonPadded>
                <TinyButtonPadded
                  key="2"
                  data-wenk-dark={true}
                  data-wenk-length="medium"
                  data-wenk="Update your timezone and location if you moved"
                  className="wenk-align--center"
                >
                  Sync Time
                </TinyButtonPadded>
              </ButtonsWrapper>
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
      </InnerWrapper>
    )
  }

  renderSortingMode(sortMode) {
    return (
      <div>
        <InnerWrapper center={true}>
          <SortingTitle>Sorting</SortingTitle>
          <TinyButtonPadded primary={true}>Done</TinyButtonPadded>
          <TinyButtonPadded onClick={sortMode.disable}>Undo</TinyButtonPadded>
        </InnerWrapper>
      </div>
    )
  }

  reloadClicked = async () => {
    this.setState({ loading: true })

    client
      .executeMutation(
        mutation(gql`
          mutation {
            followingList {
              people {
                ...Person
              }
              places {
                ...Place
              }
            }
          }
          ${Person}
          ${Place}
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

// Animtaions
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`

const Wrapper = styled.div`
  flex: 0 0 auto;
  padding: ${lessSpacing}px 0 ${lessSpacing}px ${spacing}px; /* On the settings size, we don't need padding */
  box-sizing: border-box;
  margin-top: auto;

  border-radius: 0 0 5px 5px;
  border-top: 1px solid ${p => p.theme.colors.lighter};
  background: ${p => p.theme.colors.light};
`

const InnerWrapper = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: ${p => (p.center ? 'center' : 'unset')};

  animation: ${fadeIn} 180ms cubic-bezier(0.175, 0.885, 0.32, 1.1);
`

const IconButtonWrapper = styled.button`
  display: inline-block;
  margin-left: ${p => (p.first ? 'auto' : '0')};
  padding: 4px ${p => (p.sidePadding ? spacing : iconBtnNormalPadding)}px 4px
    ${iconBtnNormalPadding}px;
  box-sizing: border-box;

  opacity: 0.3;
  border: none;
  cursor: pointer;
  background: none;
  letter-spacing: 0;
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

const ButtonsWrapper = styled.div``

const SortingTitle = styled.span`
  position: absolute;
  left: 0;
  letter-spacing: 0.3px;
  font-size: ${p => p.theme.sizes.fontSizeTiny}px;
  color: rgba(255, 255, 255, 0.2);
`
