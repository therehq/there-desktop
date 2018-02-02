import { Component } from 'react'
import styled from 'styled-components'

import Input, { InputRow } from '../Input'

class ManualAddForm extends Component {
  render() {
    const { ...props } = this.props
    return (
      <Wrapper {...props}>
        <Photo>&nbsp;</Photo>
        <Form>
          <InputRow>
            <Input style={{ width: 120 }} placeholder="First Name" />
            <Input style={{ width: 120 }} placeholder="Last Name" />
          </InputRow>
          <Spacing />
          <Input
            fullWidth={true}
            placeholder="Twitter (for photo)"
            iconComponent={AtSign}
          />
        </Form>
      </Wrapper>
    )
  }
}

export default ManualAddForm

const Wrapper = styled.div`
  display: flex;
  max-width: 300px;

  margin-top: 30px;
  margin-right: auto;
  margin-left: auto;
`

const Photo = styled.div`
  --size: 45px;

  flex: 0 0 auto;
  width: var(--size);
  height: var(--size);
  margin-right: 14px;
  margin-top: 5px;

  background: linear-gradient(45deg, #dfdfdf 0%, #f3f3f3 100%);
  border-radius: var(--size);

  img {
    display: block;
    width: var(--size);
    height: auto;
  }
`

const Form = styled.form`
  display: block;
  flex: 1 1 auto;
`

const Spacing = styled.div`
  height: 10px;
`

const AtSign = styled.span`
  display: inline-block;
  line-height: 1;

  :before {
    content: '@';
    vertical-align: 2px;
  }
`
