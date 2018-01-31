import Link from 'next/link'
import styled from 'styled-components'

import { transition } from '../utils/mixins'

export const StyledLink = styled(Link)`
  display: inline-block;
  padding: 2px 5px;

  font-size: 14px;
  font-weight: 600;

  text-decoration: underline;
  text-decoration-skip: ink;
  text-decoration-style: dotted;
  text-decoration-color: #999;

  color: ${p => p.theme.colors.primaryOnLight};
  background: transparent;
  border-radius: 3px;
  cursor: pointer;

  ${transition('background', 'text-decoration-color')};

  &:hover {
    background: ${p => p.theme.colors.subtle};
    text-decoration-color: ${p => p.theme.colors.subtle};
  }
`

export const StyledButton = StyledLink.withComponent('button').extend`
  border: none;
  outline: none;
  background: none;
`
