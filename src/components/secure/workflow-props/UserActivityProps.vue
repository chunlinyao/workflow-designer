<template>
  <div>
    <b-form class="mb-4">
      <b-form-row>
        <b-form-group class="col-md-12">
          <label>Activity Description</label>
          <b-form-input v-model="mutableUserData.activityDescription"/>
        </b-form-group>
      </b-form-row>
      <b-form-row>
        <b-form-group class="col-md-12">
          <label>Task Type</label>
          <b-form-radio-group v-model="mutableUserData.taskTypeEnumId">
            <b-form-radio v-for="(enumObj, index) in taskTypes" :key="index" :value="enumObj.enumId">{{ enumObj.description }}</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </b-form-row>
      <b-form-row>
        <b-form-group class="col-md-12">
          <label>Task Tags</label>
          <b-form-input v-model="mutableUserData.tags"/>
        </b-form-group>
      </b-form-row>
      <b-form-row>
        <b-form-group class="col-md-12">
          <label>Join Operator</label>
          <b-form-radio-group v-model="mutableUserData.joinOperator">
            <b-form-radio value="AND">And</b-form-radio>
            <b-form-radio value="OR">Or</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </b-form-row>
      <b-form-row>
        <b-form-group class="col-md-12">
          <label>Crowds <b-link class="ml-1" @click="showCrowdForm"><i class="fas fa-plus-circle"></i></b-link></label>
          <div>
            <div class="card-body bd bg-gray-100 mb-3" v-if="crowdFormVisible">
              <b-form>
                <b-form-row>
                  <b-form-group class="col-md-12">
                    <label>Crowd</label>
                    <div>
                      <table class="w-100">
                        <tr>
                          <td>
                            <b-form-select v-model="crowdTypeEnumId" class="mb-0">
                              <option v-for="(enumObj, index) in crowdTypes" :key="index" :value="enumObj.enumId">{{ enumObj.description }}</option>
                            </b-form-select>
                          </td>
                          <td>&nbsp;</td>
                          <td>
                            <user-lookup
                              title="User"
                              :userId="userId"
                              :userFullName="userFullName"
                              @select-record="selectUserRecord"
                              v-show="crowdTypeEnumId === 'WF_CROWD_USER'"/>
                            <user-group-lookup
                              title="User Group"
                              :userGroupId="userGroupId"
                              :description="userGroupDescription"
                              @select-record="selectUserGroupRecord"
                              v-show="crowdTypeEnumId === 'WF_CROWD_USER_GROUP'"/>
                            <user-service-lookup v-model="serviceName"
                              :serviceName="serviceName"
                              @select-record="selectUserServiceRecord"
                              v-show="crowdTypeEnumId === 'WF_CROWD_SERVICE'"/>
                            <b-form-input class="m-0" :disabled="true" v-show="crowdTypeEnumId === 'WF_CROWD_INITIATOR'"/>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </b-form-group>
                </b-form-row>
                <b-form-row v-if="crowdTypeEnumId==='WF_CROWD_SERVICE'">
                  <b-form-group class="col-md-12">
                    <label>Parameters</label>
                    <b-form-input v-model="serviceParameters"/>
                  </b-form-group>
                </b-form-row>
                <b-form-row v-if="mutableUserData.taskTypeEnumId === 'WF_TASK_APPROVAL' && (crowdTypeEnumId === 'WF_CROWD_USER_GROUP' || crowdTypeEnumId === 'WF_CROWD_SERVICE' )">
                  <b-form-group class="col-md-6">
                    <label>Minimum Approvals</label>
                    <b-form-input v-model="minApprovals" type="number"/>
                  </b-form-group>
                  <b-form-group class="col-md-6">
                    <label>Minimum Rejections</label>
                    <b-form-input v-model="minRejections" type="number"/>
                  </b-form-group>
                </b-form-row>

                <b-button @click="createCrowd" variant="primary" class="mr-2">Submit</b-button>
                <b-button @click="hideCrowdForm" class="mr-2">Cancel</b-button>
              </b-form>
            </div>

            <table class="table table-bordered outlined table-vcenter m-0">
              <thead class="thead-light">
              <tr>
                <th class="text-center" style="width: 50px;">#</th>
                <th>Crowd</th>
                <th v-if="mutableUserData.taskTypeEnumId === 'WF_TASK_APPROVAL'">Minimum Approvals</th>
                <th class="text-center">Options</th>
              </tr>
              </thead>
              <tr v-for="(crowd, index) in mutableUserData.crowds" :key="index">
                <td class="text-center">
                  {{index + 1}}
                </td>
                <td class="workflow-crowd">{{ crowdName(crowd) }}</td>
                <td v-if="mutableUserData.taskTypeEnumId === 'WF_TASK_APPROVAL'">
                  <span><i class="fas fa-thumbs-up text-success"></i> {{ crowd.minApprovals }}</span>
                  <span class="mx-2"></span>
                  <span><i class="fas fa-thumbs-down text-danger"></i> {{ crowd.minRejections }}</span>
                </td>
                <td class="text-center">
                  <div class="btn-group">
                    <b-button size="sm" @click="deleteCrowd(index)">
                      <i class="fa fa-times"></i>
                    </b-button>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </b-form-group>
      </b-form-row>
      <b-form-row v-if="mutableUserData.taskTypeEnumId === 'WF_TASK_MANUAL'">
        <b-form-group class="col-md-12">
          <label>Summary</label>
          <b-form-input v-model="mutableUserData.summary"/>
        </b-form-group>
      </b-form-row>
      <b-form-row v-if="mutableUserData.taskTypeEnumId === 'WF_TASK_MANUAL'">
        <b-form-group class="col-md-12">
          <label>Description</label>
          <b-form-textarea v-model="mutableUserData.description" :rows="4"/>
        </b-form-group>
      </b-form-row>
      <b-form-row v-if="mutableUserData.taskTypeEnumId === 'WF_TASK_VARIABLE'">
        <b-form-group class="col-md-12">
          <label>Variable</label>
          <b-form-select v-model="mutableUserData.variableId">
            <option v-for="(variable, index) in variables" :key="index" :value="variable.variableId">{{ variable.variableName }}</option>
          </b-form-select>
        </b-form-group>
      </b-form-row>
      <b-form-row>
        <table class="table table-bordered outlined table-vcenter mb-4">
          <thead class="thead-light">
            <tr>
              <th class="text-center" style="width: 50px;">#</th>
              <th>Field</th>
              <th>Required</th>
              <th>Title</th>
              <th class="text-center">Options<b-button size="sm" @click="addField">
                  <i class="fa fa-plus"></i>
                </b-button></th>
            </tr>
          </thead>
          <tr v-for="(field, index) in mutableUserData.fields" :key="index">
            <td class="text-center">
              {{index + 1}}
            </td>
            <td>
              <b-form-select v-model="field.fieldName" :options="fields" value-field="fieldName" text-field="displayName"/>
            </td>
            <td>
              <b-form-select v-model="field.required" :options="booleanOptions" value-field="key" text-field="key"/>
            </td>
            <td>
              <b-form-input v-model="field.title" type="text" />
            </td>
            <td class="text-center">
              <div class="btn-group">
                <b-button size="sm" @click="deleteField(index)">
                  <i class="fa fa-times"></i>
                </b-button>

              </div>
            </td>
          </tr>
        </table>
      </b-form-row>
      <b-form-row>
        <b-form-group class="col-md-6">
          <label>Timeout</label>
          <b-form-input v-model="mutableUserData.timeoutInterval" type="number"/>
        </b-form-group>
        <b-form-group class="col-md-6">
          <label>&nbsp;</label>
          <b-form-select v-model="mutableUserData.timeoutUomId">
            <option v-for="(interval, index) in mutableUserData.timeIntervals" :key="index" :value="interval.uomId">{{ interval.description }}</option>
          </b-form-select>
        </b-form-group>
      </b-form-row>

      <b-button @click="save" class="mr-2" variant="primary">Save</b-button>
      <b-button @click="cancel" class="mr-2">Cancel</b-button>
    </b-form>
  </div>
</template>

<script>
import UserLookup from '@/components/secure/user/UserLookup'
import UserGroupLookup from '@/components/secure/user-group/UserGroupLookup'
import UserServiceLookup from '@/components/secure/user-service/UserServiceLookup'
import WorkflowProcessMixin from '@/mixins/WorkflowProcessMixin'
import WorkflowCrowdProcessMixin from '@/mixins/WorkflowCrowdProcessMixin'
import WorkflowTimeoutProcessMixin from '@/mixins/WorkflowTimeoutProcessMixin'
import EnumService from '@/services/EnumService'
import EntityFieldService from '@/services/EntityFieldService'
import WorkflowService from '@/services/WorkflowService'

export default {
  name: 'user-activity-props',
  mixins: [WorkflowProcessMixin, WorkflowCrowdProcessMixin, WorkflowTimeoutProcessMixin],
  data: function () {
    return {
      taskTypes: [],
      fields: [],
      crowdTypes: [],
      crowdFormVisible: false,
      booleanOptions: [{ key: 'Y' }, { key: 'N' }],
      minApprovals: 1,
      minRejections: 1,
      serviceName: '',
      serviceParameters: '',
      variables: []
    }
  },
  components: {
    UserLookup,
    UserGroupLookup,
    UserServiceLookup
  },
  methods: {
    async load () {
      let self = this
      EnumService.enum({
        enumTypeId: 'WorkflowTaskType',
        orderByField: 'sequenceNum,description'
      }).then(function (response) {
        self.taskTypes = response.data || []
      })

      EnumService.enum({
        enumTypeId: 'WorkflowCrowdType',
        orderByField: 'sequenceNum,description'
      }).then(function (response) {
        self.crowdTypes = response.data || []
      })

      WorkflowService.workflowVariables({
        workflowId: this.workflow.workflowId,
        orderByField: 'variableName'
      }).then(function (response) {
        self.variables = response.data.workflowVariableList || []
      })
      EntityFieldService.entityFields({
        entityName: this.workflow.primaryViewEntityName,
        orderByField: 'fieldName'
      }).then(function (response) {
        self.fields = response.data || []
        if (!self.mutableUserData.fields) {
          self.$set(self.mutableUserData, 'fields', [])
        }
        if (!self.mutableUserData.tags) {
          self.mutableUserData.tags = ''
        }
      })
    },
    showCrowdForm () {
      this.crowdFormVisible = true
    },
    hideCrowdForm () {
      this.crowdFormVisible = false
    },
    createCrowd () {
      this.mutableUserData.crowds.push({
        crowdTypeEnumId: this.crowdTypeEnumId,
        userId: this.userId,
        userFullName: this.userFullName,
        userGroupId: this.userGroupId,
        userGroupDescription: this.userGroupDescription,
        serviceName: this.serviceName,
        serviceParameters: this.serviceParameters,
        minApprovals: this.minApprovals,
        minRejections: this.minRejections
      })
    },
    deleteCrowd (index) {
      this.mutableUserData.crowds.splice(index, 1)
    },
    addField () {
      let field = this.fields[0]
      if (field) {
        let fieldName = field.fieldName
        this.mutableUserData.fields.push({
          fieldName: fieldName,
          required: 'N',
          title: ''
        })
      }
    },
    deleteField (index) {
      this.mutableUserData.fields.splice(index, 1)
    }
  },
  mounted () {
    this.load()
  }
}
</script>
