let WorkflowCrowdProcessMixin = {
  data () {
    return {
      crowdTypeEnumId: 'WF_CROWD_USER',
      userId: '',
      userFullName: '',
      userGroupId: '',
      userGroupDescription: '',
      serviceName: '',
      serviceParameters: ''
    }
  },
  methods: {
    crowdName (crowd) {
      if (crowd.crowdTypeEnumId === 'WF_CROWD_USER') {
        return crowd.userFullName
      } else if (crowd.crowdTypeEnumId === 'WF_CROWD_USER_GROUP') {
        return crowd.userGroupDescription
      } else if (crowd.crowdTypeEnumId === 'WF_CROWD_SERVICE') {
        return crowd.serviceName + '(' + crowd.serviceParameters + ')'
      } else {
        return 'Initiator'
      }
    },
    selectUserRecord (record) {
      this.userId = record.userId
      this.userFullName = record.userFullName
    },
    selectUserGroupRecord (record) {
      this.userGroupId = record.userGroupId
      this.userGroupDescription = record.description
    },
    selectUserServiceRecord (record) {
      this.serviceName = record
    }
  }
}

export default WorkflowCrowdProcessMixin
