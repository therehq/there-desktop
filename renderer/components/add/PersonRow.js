import styled, { css } from 'styled-components'
import { lighten } from 'polished'

import { transition } from '../../utils/mixins'

const PersonRow = ({
  photoUrl,
  name,
  time,
  flag,
  highlight,
  fullWidth = true,
  ...props
}) => (
  <Wrapper
    {...props}
    data-label={name}
    highlight={highlight}
    fullWidth={fullWidth}
  >
    <Photo>
      <img src={photoUrl} title={name} />
    </Photo>

    <Info>
      <Name>{name}</Name>
      <Time>
        {time} {flag}
      </Time>
    </Info>
  </Wrapper>
)

export default PersonRow

const photoSize = 40

const wrapperHighlighted = css`
  background: ${p => lighten(0.05, p.theme.colors.subtle)};
  color: ${p => p.theme.colors.primaryOnLight};

  & img {
    filter: grayscale(0%);
  }
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
  color: #666;
  border-bottom: 1px solid #eee;
  background: transparent;
  cursor: pointer;

  ${transition('background', 'color')};

  & img {
    filter: grayscale(100%);
    transition: filter 100ms;
  }

  &:hover,
  &:focus {
    ${wrapperHighlighted};
  }

  ${p => (p.highlight ? wrapperHighlighted : null)};
`

const Photo = styled.div`
  flex: 0 0 auto;
  width: ${photoSize}px;
  height: ${photoSize}px;
  overflow: hidden;
  margin-right: 12px;
  border-radius: ${photoSize}px;

  img {
    width: ${photoSize}px;
    height: auto;
    cursor: pointer;
  }
`

const Info = styled.div`
  flex: 1 1 auto;
  width: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
`

const Name = styled.span`
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
`

const Time = styled.span`
  margin-left: auto;
  margin-right: 5px;

  font-size: 18px;
  font-variant-numeric: tabular-nums;

  color: #aaa;
  opacity: 0.6;
  cursor: pointer;
`
