import { graphql } from 'gatsby'
import { isNil } from 'lodash'

export const query = graphql`
  fragment Buttons on Button {
    action
    class
    disabled
    href
    icon
    newTab
    text
    download
  }
`

export const isAction = action => !isNil(action) && action !== 'noop'

// Transforms 'class' to 'className' to be react-compliant
export const transform = buttons =>
  buttons.map(({ class: className, ...rest }) => {
    return { className: className, ...rest }
  })
