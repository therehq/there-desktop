import styled from 'styled-components'

const MiniLogo = ({ size, ...props }) => (
  <Image src="/static/app-icon.png" size={size} {...props} />
)

export default MiniLogo

const Image = styled.img`
  width: ${p => p.size || 'auto'};
  height: ${p => p.size || 'auto'};

  display: inline;
  margin: 0;
  padding: 0;
`
