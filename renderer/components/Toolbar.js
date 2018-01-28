import React from 'react'
import styled from 'styled-components'

import Cog from '../vectors/Cog'
import QuestionMark from '../vectors/QuestionMark'
import TinyButton from './TinyButton'

const Toolbar = () => (
  <Wrapper>
    <TinyButtonPadded primary={true}>Add</TinyButtonPadded>
    <TinyButtonPadded>Sync Time</TinyButtonPadded>

    <IconButtonWrapper
      first={true}
      aria-label="Help or Support"
      title="Help / Support"
    >
      <QuestionMark />
    </IconButtonWrapper>

    <IconButtonWrapper
      sidePadding={true}
      aria-label="Settings"
      title="Settings"
    >
      <Cog />
    </IconButtonWrapper>
  </Wrapper>
)

export default Toolbar

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

  border-top: 1px solid ${p => p.theme.colors.lighter};
  background: ${p => p.theme.colors.light};
`

const IconButtonWrapper = styled.div.attrs({
  role: 'button',
  tabIndex: '0',
})`
  display: inline-block;
  margin-left: ${p => (p.first ? 'auto' : '0')};
  padding: 4px ${p => (p.sidePadding ? spacing : iconBtnNormalPadding)}px 4px
    ${iconBtnNormalPadding}px;
  box-sizing: border-box;

  cursor: pointer;
  opacity: 0.3;
  transition: opacity 70ms;

  &:hover {
    opacity: 0.5;
  }

  &:focus {
    opacity: 0.8;
    outline: none;
  }
`

const TinyButtonPadded = styled(TinyButton)`
  margin-left: ${lessSpacing}px;

  &:first-child {
    margin-left: 0;
  }
`
