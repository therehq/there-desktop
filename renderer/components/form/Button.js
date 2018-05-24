import styled, { css } from 'styled-components'
import { darken, shade } from 'polished'

import { transition } from '../../utils/styles/mixins'

export default ({ disabled, ...props }) => (
  <Button disabledStyle={disabled} disabled={disabled} {...props} />
)

const Button = styled.button`
  padding: 7px 12px;
  font-size: 15px;
  background: transparent;
  border: none;
  outline: none;
  color: blue;
  cursor: pointer;
  border-radius: 6px;
  background: ${p => (p.primary ? p.theme.colors.subtle : 'transparent')};

  ${transition('background', 'color', 'opacity', 'visibility')};

  &:hover {
    background: ${p =>
      p.primary ? shade(0.95, p.theme.colors.subtle) : p.theme.colors.subtle};
    color: ${darken(0.2, 'blue')};
  }

  &:active {
    background: ${p => shade(0.9, p.theme.colors.subtle)};
  }

  ${p =>
    p.disabledStyle &&
    css`
      color: #777;
      background: ${p => p.theme.colors.subtle};
      cursor: not-allowed;

      &:hover {
        color: #777;
      }
    `};

  ${p =>
    p.isHidden &&
    css`
      opacity: 0;
      visibility: hidden;
    `};
`
