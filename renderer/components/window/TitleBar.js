import styled from 'styled-components'

const TitleBar = styled.div`
  flex: 0 0 auto;
  width: 100vw;
  height: 38px;

  /* Reserve top space for window controls */
  /* padding-left: 80px; */

  text-align: center;
  line-height: 38px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1px;

  -ms-overflow-style: scrollbar;
  -webkit-app-region: drag;

  background: ${p =>
    p.highlight
      ? p.highlight === 'light' ? `#f2f2f2` : p => p.theme.colors.lighter
      : `transparent`};
`

export default TitleBar
