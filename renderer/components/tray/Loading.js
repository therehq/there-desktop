import styled, { keyframes } from 'styled-components'
import ContentLoader from 'react-content-loader'

// Utilities
import theme from '../../utils/styles/theme'

export default () => (
  <Wrapper>
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
  </Wrapper>
)

const LoadingRow = () => (
  <ContentLoader
    height={54}
    width={320}
    speed={1}
    primaryColor={theme.colors.light}
    secondaryColor={theme.colors.lighter}
  >
    <circle cx="33" cy="27" r="21.14" />
    <rect x="65" y="34" rx="3" ry="3" width="50" height="6.24" />
    <rect x="65" y="14" rx="7" ry="7" width="60.8" height="13" />
    <rect x="238" y="33.05" rx="3" ry="3" width="71" height="6" />
    <rect x="254" y="14.5" rx="5" ry="5" width="55" height="12.5" />
  </ContentLoader>
)

const fadeIn = keyframes`
  0% { opacity: 0.2; transform: translateY(15px); }
  100% { opacity: 1; transform: translateY(0); }
`

const Wrapper = styled.div`
  animation: ${fadeIn} 300ms ease;
`
