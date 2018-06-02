import { Connect, query } from 'urql'

// Utilities
import { Following } from '../utils/graphql/fragments'

// Local
import Caret from '../vectors/Caret'

export const ConnectedCaret = () => (
  <Connect query={query(PinnedList)} shouldInvalidate={shouldInvalidate}>
    {({ fetching, data, loaded }) => (
      <Caret hasPinneds={!fetching && loaded && data.pinnedList.length > 0} />
    )}
  </Connect>
)

const PinnedList = `#graphql
  query {
    pinnedList {
    ...Following
    }
  }
  ${Following}
`

const shouldInvalidate = changedTypenames => {
  const relatedTypenames = [
    'User',
    'ManualPlace',
    'ManualPerson',
    'Refresh',
    'UserPinResponse',
  ]
  const allTypenames = new Set(relatedTypenames.concat(changedTypenames))

  if (allTypenames.size !== relatedTypenames.length + changedTypenames.length) {
    return true
  }
}
