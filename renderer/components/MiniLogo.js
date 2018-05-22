import styled from 'styled-components'

const MiniLogo = ({ type = 'normal', size, ...props }) => (
  <Image
    src={
      type === 'counters'
        ? '/static/app-icon-counters.svg'
        : '/static/app-icon.png'
    }
    size={size}
    {...props}
  />
)

export default MiniLogo

const Image = styled.img`
  width: ${p => p.size || 'auto'};
  height: ${p => p.size || 'auto'};

  display: inline-block;
  line-height: 1;
  margin: 0;
  padding: 0;
`
