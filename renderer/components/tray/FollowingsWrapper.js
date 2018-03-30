import styled from 'styled-components'

const FollowingsWrapper = styled.div`
  flex: 1 1 auto;
  width: 100%;
  overflow: auto;
  border-radius: 4px 4px 0 0;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;

  ::-webkit-scrollbar {
    display: none;
  }
`

export default FollowingsWrapper
