import styled, { css } from 'styled-components'

// Utilities
import { transition } from '../utils/styles/mixins'

const ListBtnRow = ({
  iconComponent: IconComponent,
  children,
  title,
  fullWidth = true,
  noBorder = false,
  highlight = false,
  ...props
}) => (
  <Wrapper
    {...props}
    data-label={children || title}
    highlight={highlight}
    fullWidth={fullWidth}
    noBorder={noBorder}
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

const wrapperHighlighted = p => css`
  background: ${p.theme.colors.subtle};
  color: ${p.theme.colors.primaryOnLight};
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
  -webkit-app-region: no-drag;
  color: ${p => p.theme.colors.primaryOnLight};
  background: transparent;
  border-bottom: ${p => (p.noBorder ? `none` : `1px solid #eee`)};
  cursor: pointer;

  ${transition('background', 'color')};

  &:hover,
  &:focus {
    ${p => wrapperHighlighted(p)};
  }

  ${p => (p.highlight ? wrapperHighlighted(p) : null)};
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
