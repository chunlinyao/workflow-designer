let AutoCompleteMixin = {
  props: {
    minLength: {
      type: Number,
      default: 3
    },
    maxSuggestions: {
      type: Number,
      default: 5
    }
  },
  data: function () {
    return {
      autoCompleteStyles: {
        vueSimpleSuggest: 'position-relative',
        inputWrapper: '',
        defaultInput: 'form-control',
        suggestions: 'suggest-list list-group position-absolute z-1000',
        suggestItem: 'suggest-list-item list-group-item'
      }
    }
  }
}

export default AutoCompleteMixin
