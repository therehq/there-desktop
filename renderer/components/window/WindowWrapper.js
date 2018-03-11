import styled from 'styled-components'

const NoTitleBarWindow = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;

  color: ${p => p.theme.colors.darkText};

  /* Make window draggable */
  -ms-overflow-style: scrollbar;
  -webkit-app-region: drag;

  display: flex;
  flex-direction: column;
`

export default NoTitleBarWindow
