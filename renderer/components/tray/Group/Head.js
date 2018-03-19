import styled from 'styled-components'

// Local
import LittleLineArrow from '../../../vectors/LittleLineArrow'

const Head = ({ children, collapsed, ...props }) => (
  <Wrapper {...props}>
    {children}
    <ArrowWrapper collapsed={collapsed}>
      <LittleLineArrow />
    </ArrowWrapper>
  </Wrapper>
)
export default Head

const ArrowWrapper = styled.div`
  margin-left: auto;
  transform: rotate(${p => (p.collapsed ? 180 : 0)}deg);
  opacity: 0.3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 150ms ease, transform 150ms ease;

  svg {
    display: inline-block;
  }
`

const Wrapper = styled.header`
  width: 100%;
  margin-top: 7px;
  padding: 7px ${p => p.theme.sizes.sidePadding}px 7px
    ${p => p.theme.sizes.sidePadding}px;
  display: flex;
  align-items: center;

  font-size: ${p => p.theme.sizes.fontSizeTiny}px;
  letter-spacing: 0.3px;
  font-weight: 600;
  cursor: pointer;
  color: ${p => p.theme.colors.lightMutedText};
  background: ${p => p.theme.colors.dimLight};

  transition: background 200ms ease;

  &:hover {
    background: ${p => p.theme.colors.light};

    ${ArrowWrapper} {
      opacity: 0.5;
    }
  }

  &:active {
    background: ${p => p.theme.colors.lighter};
  }
`
