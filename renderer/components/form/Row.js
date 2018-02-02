import styled from 'styled-components'

export const Row = styled.div`
  display: flex;
  justify-content: flex-start;

  > div,
  input,
  select,
  button {
    flex: 0 1 auto;
    margin-right: 10px;

    &:last-child {
      margin-right: 0;
    }
  }
`

export default Row
