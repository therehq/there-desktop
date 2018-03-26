import styled, { css, keyframes } from 'styled-components'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

export const FieldWrapper = styled.div`
  margin-top: ${p => (p.moreTop ? '22px' : '12px')};

  ${p =>
    p.animation &&
    css`
      animation: ${fadeIn} 100ms ${p.animationDelay} backwards ease-out;
    `};
`
