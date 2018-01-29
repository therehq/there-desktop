import jstz from 'jstz'

export const getTimezoneName = () => jstz.determine().name()
