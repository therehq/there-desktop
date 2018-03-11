import { Component } from 'react'
import styled from 'styled-components'

import Input from '../../form/Input'
import Select from '../../form/Select'
import FormRow from '../../form/Row'
import Label from '../../form/Label'

class ManualAddForm extends Component {
  render() {
    const { ...props } = this.props
    return (
      <Wrapper {...props}>
        <Photo>&nbsp;</Photo>
        <Form>
          <FormRow>
            <Input style={{ maxWidth: 120 }} placeholder="First Name" />
            <Input style={{ maxWidth: 120 }} placeholder="Last Name" />
          </FormRow>
          <Spacing />
          <Input
            fullWidth={true}
            placeholder="Twitter (for photo)"
            iconComponent={AtSign}
          />
          <Spacing />
          <Label label="Timezone">
            <Select fullWidth={true}>
              <option>+3:30 UTC - Tehran</option>
            </Select>
          </Label>
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
  margin-right: 18px;
  margin-top: 5px;

  background: linear-gradient(45deg, #eee 0%, #f7f7f7 100%);
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
  height: 12px;
`

const AtSign = styled.span`
  display: inline-block;
  line-height: 1;

  :before {
    content: '@';
    vertical-align: 2px;
  }
`
