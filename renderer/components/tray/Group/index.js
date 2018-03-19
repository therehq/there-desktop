import React from 'react'

// Utilities
import { setGroupCollapsed, isGroupCollapsed } from '../../../utils/store'

// Local
import Group from './Group'

export default ({ groupKey, ...props }) => (
  <Group
    defaultCollapsed={isGroupCollapsed(groupKey)}
    {...props}
    onCollapse={collapsed => setGroupCollapsed(groupKey, collapsed)}
  />
)
