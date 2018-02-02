import { Component } from 'react'
import styled from 'styled-components'
import Downshift from 'downshift'

import Input from '../Input'
import Person from '../../vectors/Person'
import AddPerson from '../../vectors/AddPerson'
import PersonRow from './PersonRow'
import ListBtnRow from '../ListBtnRow'

class PersonSearch extends Component {
  render() {
    const { items } = this.props
    const itemsWithBtn = [
      ...items,
      {
        customComponent: props => (
          <ListBtnRow
            {...props}
            iconComponent={AddPerson}
            title="Add Person Manually"
          />
        ),
      },
    ]

    return (
      <Downshift defaultIsOpen={true}>
        {({ highlightedIndex, getInputProps, getItemProps, getRootProps }) => (
          <Wrapper {...getRootProps({ refKey: 'innerRef' })}>
            <Input
              big={true}
              fullWidth={true}
              textAlign="left"
              iconComponent={Person}
              {...getInputProps({ placeholder: 'Name' })}
            />

            <ListWrapper>
              {itemsWithBtn.map(
                (item, index) =>
                  item.customComponent ? (
                    <item.customComponent
                      key={index}
                      highlight={highlightedIndex === index}
                      {...getItemProps({ item: '' })}
                    />
                  ) : (
                    <PersonRow
                      key={index}
                      highlight={highlightedIndex === index}
                      {...getItemProps({ item: item.name })}
                      {...item}
                    />
                  )
              )}
            </ListWrapper>
          </Wrapper>
        )}
      </Downshift>
    )
  }
}

export default PersonSearch

const ListWrapper = styled.div`
  flex: 1 1 auto;
  padding-top: 10px;
  overflow: auto;
  margin: 0 ${p => -p.theme.sizes.sidePaddingLarge}px;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
