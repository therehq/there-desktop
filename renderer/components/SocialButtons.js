import styled from 'styled-components'
import { shade } from 'polished'

import { transition } from '../utils/styles/mixins'
import TwitterLogo from '../vectors/TwitterLogo'

export const TwitterButton = ({ ...props }) => (
  <BaseButton {...props} bg="#00ACED">
    <IconWrapper>
      <TwitterLogo />
    </IconWrapper>
    Sign in with Twitter
  </BaseButton>
)

const BaseButton = styled.button`
  display: inline-flex;
  align-items: center;

  padding: 9px 13px;
  font-size: 16px;
  font-weight: 600;

  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 5px;
  background: ${p => p.bg};
  color: #fff;

  svg {
    display: block;
    height: 20px;
    width: auto;

    path {
      fill: white;
    }
  }

  ${transition('box-shadow', 'background')};

  &:focus {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  }

  &:hover {
    background: ${p => shade(0.85, p.bg)};
  }
`

const IconWrapper = styled.span`
  margin-right: 8px;
`
