/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    // Lit hosts and shadow parts use selectors the standard config does not know.
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['host', 'modal'] }],
    'selector-class-pattern': '^[a-z][a-z0-9-]*$',
    'scss/dollar-variable-pattern': '^[a-z][a-z0-9-]*$',
    'declaration-empty-line-before': null,
    'at-rule-empty-line-before': null,
    'scss/at-mixin-argumentless-call-parentheses': 'never',
    'no-descending-specificity': null,
  },
}
