import styled from 'styled-components'
import { transition } from '../../utils/styles/mixins'

export const Center = styled.div`
  text-align: center;
`

export const LinkWrapper = styled.div`
  margin-top: auto;

  text-align: center;
  font-size: 14px;
  color: #888;
  opacity: 0.8;

  /* Reserve some padding for hover */
  padding: ${p => p.theme.sizes.sidePaddingLarge}px 0;

  ${transition('opacity')};

  &:hover {
    opacity: 1;
  }
`
