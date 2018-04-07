import styled from 'styled-components'

const Wrapper = styled.div`
  height: 100%;
  padding: ${p => p.theme.sizes.sidePadding}px;
  overflow: hidden; /* for safety, to not leak elements into whole UI */
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1 1 auto;

  border-radius: 5px 5px 0 0;
  background: ${p => p.theme.colors.light};
`

export default Wrapper
