import styled from 'styled-components'

const Label = ({
  label,
  secondary,
  children,
  checkboxMode = false,
  ...props
}) => (
  <Wrapper {...props}>
    {checkboxMode ? children : null}
    <Text checkboxMode={checkboxMode}>
      {label} {secondary && <Secondary>{secondary}</Secondary>}
    </Text>
    {!checkboxMode ? children : null}
  </Wrapper>
)

export default Label

const Wrapper = styled.label`
  margin-top: 7px;
`

const Text = styled.span`
  display: ${p => (p.checkboxMode ? 'inline-block' : 'block')};
  margin-left: ${p => (p.checkboxMode ? 5 : 0)}px;
  margin-bottom: 4px;
  font-size: 14px;
  color: ${p => p.theme.colors.darkText};
`

const Secondary = styled.small`
  opacity: 0.7;
`
