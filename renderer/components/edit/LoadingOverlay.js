import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${p => p.theme.sizes.loadingOverlayZIndex};

  background: rgba(255, 255, 255, 0.6);
  opacity: 0;

  animation: ${fadeIn} 200ms forwards ease-in;
`

export default LoadingOverlay
