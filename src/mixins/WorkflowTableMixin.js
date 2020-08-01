import WorkflowService from '@/services/WorkflowService'

let WorkflowTableMixin = {
  props: {
    defaultWorkflowTypeEnumId: {
      type: String,
      default: null
    },
    defaultWorkflowTableFilter: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      workflowTypeEnumId: this.defaultWorkflowTypeEnumId,
      workflowTableFilter: this.defaultWorkflowTableFilter,
      workflowTableBusy: false,
      workflowTableTotalRows: 0,
      workflowTableCurrentPage: 1,
      workflowTablePerPage: 10,
      workflowTablePageOptions: [10, 25, 50],
      workflowTableFields: {
        workflowHeaderId: {
          label: 'HEAD ID',
          sortable: true
        },
        version: {
          label: 'VER',
          sortable: true
        },
        workflowId: {
          label: 'ID',
          sortable: true
        },
        workflowName: {
          label: 'Workflow Name',
          sortable: true
        },
        workflowTypeName: {
          label: 'Workflow Type',
          sortable: true
        }
      }
    }
  },
  methods: {
    workflowDataProvider (ctx) {
      let self = this
      return WorkflowService.workflows({
        pageIndex: ctx.currentPage - 1,
        pageSize: ctx.perPage,
        orderByField: ctx.sortDesc ? '-' + ctx.sortBy : ctx.sortBy,
        filter: ctx.filter,
        workflowTypeEnumId: this.workflowTypeEnumId
      }).then(function (response) {
        self.workflowTableTotalRows = response.data.totalRows
        return response.data.workflowList || []
      })
    },
    workflowStatusClass (item) {
      return item.disabled === 'Y' ? 'line-through' : ''
    },
    refreshWorkflowTable () {
      this.$refs.workflowTable.refresh()
    },
    async publishWorkflow (item) {
      await WorkflowService.publishWorkflow({
        workflowId: item.workflowId
      })
      this.refreshWorkflowTable()
    },
    copyModelData (item) {
      this.copyTextToClipboard(item.modelData)
    },
    fallbackCopyTextToClipboard (text) {
      var textArea = document.createElement('textarea')
      textArea.value = text

      // Avoid scrolling to bottom
      textArea.style.top = '0'
      textArea.style.left = '0'
      textArea.style.position = 'fixed'

      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        var successful = document.execCommand('copy')
        var msg = successful ? 'successful' : 'unsuccessful'
        console.log('Fallback: Copying text command was ' + msg)
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err)
      }

      document.body.removeChild(textArea)
    },
    copyTextToClipboard (text) {
      if (!navigator.clipboard) {
        this.fallbackCopyTextToClipboard(text)
        return
      }
      navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!')
      }, function (err) {
        console.error('Async: Could not copy text: ', err)
      })
    }
  }
}

export default WorkflowTableMixin
