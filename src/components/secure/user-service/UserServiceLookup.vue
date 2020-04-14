<template>
  <div>
    <vue-simple-suggest ref="autoComplete"
      :list="autoCompleteProvider"
      value-attribute="serviceName"
      display-attribute="serviceName"
      :destyled=true
      :styles="autoCompleteStyles"
      @select="selectSuggestion">
      <b-input-group>
        <b-form-input type="text" v-model="mutableServiceName"/>
        <b-button slot="append" :disabled="!mutableServiceName" @click="clear">
          <i class="fa fa-eraser"></i>
        </b-button>
      </b-input-group>
    </vue-simple-suggest>
  </div>
</template>

<script>
import ServiceService from '@/services/ServiceService'
import AutoCompleteMixin from '@/mixins/AutoCompleteMixin'

export default {
  name: 'user-group-lookup',
  mixins: [AutoCompleteMixin],
  props: {
    serviceName: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      mutableServiceName: this.serviceName
    }
  },
  methods: {
    autoCompleteProvider (query) {
      return ServiceService.services({
        pageIndex: 0,
        pageSize: 10,
        filter: query
      }).then((response) => {
        return response.data.serviceNameList || []
      })
    },
    clear () {
      this.mutableServiceName = ''
      this.$refs.autoComplete.clearSuggestions()
    },
    selectSuggestion (suggestion) {
      if (suggestion) {
        this.mutableServiceName = suggestion
        this.$emit('select-record', suggestion)
      }
    }
  },
  watch: {
    serviceName: function (val) {
      this.mutableServiceName = val
    }
  }
}
</script>

<style lang="scss">
.z-1000 {
  z-index: 1000;
}
.suggest-list .hover {
  background-color: #007bff;
  color: #fff;
}
</style>
