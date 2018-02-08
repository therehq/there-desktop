import styled, { css } from 'styled-components'
import { lighten } from 'polished'

import { transition } from '../utils/styles/mixins'

const ListBtnRow = ({
  iconComponent: IconComponent,
  children,
  title,
  fullWidth = true,
  highlight = false,
  ...props
}) => (
  <Wrapper
    {...props}
    data-label={children || title}
    highlight={highlight}
    fullWidth={fullWidth}
  >
    <IconWrapper>
      <IconComponent />
    </IconWrapper>
    <Info>
      {children || title} <Arrow> →</Arrow>
    </Info>
  </Wrapper>
)

export default ListBtnRow

const photoSize = 40

const wrapperHighlighted = css`
  background: ${p => lighten(0.05, p.theme.colors.subtle)};
  color: ${p => p.theme.colors.primaryOnLight};
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  /* Full Width-ify :) */
  ${p =>
    p.fullWidth
      ? css`
          width: 100%;
          padding: 5px ${p => p.theme.sizes.sidePaddingLarge}px;
        `
      : null};

  /* Remove Button-style */
  color: ${p => p.theme.colors.primaryOnLight};
  border-bottom: 1px solid #eee;
  background: transparent;
  cursor: pointer;

  ${transition('background', 'color')};

  &:hover,
  &:focus {
    ${wrapperHighlighted};
  }

  ${p => (p.highlight ? wrapperHighlighted : null)};
`

const IconWrapper = styled.div`
  flex: 0 0 auto;
  width: ${photoSize}px;
  height: 35px;
  overflow: hidden;
  margin-right: 12px;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  svg {
    fill: ${p => p.theme.colors.primaryOnLight};
  }
`

const Info = styled.div`
  flex: 1 1 auto;
  width: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px;
`

const Arrow = styled.span`
  margin-left: auto;
`
