<template>
  <div class="container mx-auto p-4">
    <el-card class="w-full max-w-4xl mx-auto">
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2"><Document /></el-icon>
          <span class="text-lg font-semibold">会议记录</span>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-4 p-4">
        <div>
          <el-form-item label="会议标题">
            <el-input
                v-model="meetingDetails.title"
                placeholder="输入会议标题"
            />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="会议日期">
            <el-date-picker
                v-model="meetingDetails.date"
                type="date"
                placeholder="选择会议日期"
                class="w-full"
            />
          </el-form-item>
        </div>
      </div>

      <el-divider />

      <div class="p-4 grid grid-cols-2 gap-4">
        <!-- 参会人员 -->
        <div>
          <el-form-item label="参会人员">
            <div class="flex mb-2">
              <el-input
                  v-model="newParticipant"
                  placeholder="输入参会人员姓名"
                  @keyup.enter="addParticipant"
                  class="mr-2"
              />
              <el-button type="primary" @click="addParticipant">
                添加
              </el-button>
            </div>
            <el-tag
                v-for="(participant, index) in meetingDetails.participants"
                :key="index"
                closable
                @close="removeParticipant(index)"
                class="mr-2 mb-2"
            >
              {{ participant }}
            </el-tag>
          </el-form-item>
        </div>

        <!-- 会议议程 -->
        <div>
          <el-form-item label="会议议程">
            <div class="flex mb-2">
              <el-input
                  v-model="newAgendaItem"
                  placeholder="输入议程项目"
                  @keyup.enter="addAgendaItem"
                  class="mr-2"
              />
              <el-button type="primary" @click="addAgendaItem">
                添加
              </el-button>
            </div>
            <el-steps
                :active="meetingDetails.agenda.length"
                direction="vertical"
            >
              <el-step
                  v-for="(item, index) in meetingDetails.agenda"
                  :key="index"
                  :title="item"
                  :description="`议程项目 ${index + 1}`"
              >
                <template #icon>
                  <el-button
                      type="text"
                      @click="removeAgendaItem(index)"
                      class="text-red-500"
                  >
                    删除
                  </el-button>
                </template>
              </el-step>
            </el-steps>
          </el-form-item>
        </div>
      </div>

      <el-divider />

      <div class="p-4 grid grid-cols-2 gap-4">
        <!-- 讨论要点 -->
        <div>
          <el-form-item label="讨论要点">
            <div class="flex mb-2">
              <el-input
                  v-model="newDiscussionPoint"
                  placeholder="输入讨论要点"
                  @keyup.enter="addDiscussionPoint"
                  class="mr-2"
              />
              <el-button type="primary" @click="addDiscussionPoint">
                添加
              </el-button>
            </div>
            <el-collapse>
              <el-collapse-item
                  v-for="(point, index) in meetingDetails.discussionPoints"
                  :key="index"
                  :title="`讨论要点 ${index + 1}`"
              >
                <div class="flex justify-between items-center">
                  <span>{{ point }}</span>
                  <el-button
                      type="text"
                      class="text-red-500"
                      @click="removeDiscussionPoint(index)"
                  >
                    删除
                  </el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
        </div>

        <!-- 会议决议 -->
        <div>
          <el-form-item label="会议决议">
            <div class="flex mb-2">
              <el-input
                  v-model="newDecision"
                  placeholder="输入会议决议"
                  @keyup.enter="addDecision"
                  class="mr-2"
              />
              <el-button type="primary" @click="addDecision">
                添加
              </el-button>
            </div>
            <el-card
                v-for="(decision, index) in meetingDetails.decisions"
                :key="index"
                class="mb-2"
            >
              <div class="flex justify-between items-center">
                <span>{{ decision }}</span>
                <el-button
                    type="text"
                    class="text-red-500"
                    @click="removeDecision(index)"
                >
                  删除
                </el-button>
              </div>
            </el-card>
          </el-form-item>
        </div>
      </div>

      <el-divider />

      <!-- 行动项目 -->
      <div class="p-4">
        <el-form-item label="行动项目">
          <div class="flex mb-2">
            <el-input
                v-model="newActionItem"
                placeholder="输入行动项目"
                @keyup.enter="addActionItem"
                class="mr-2"
            />
            <el-button type="primary" @click="addActionItem">
              添加
            </el-button>
          </div>
          <el-timeline>
            <el-timeline-item
                v-for="(item, index) in meetingDetails.actionItems"
                :key="index"
                :timestamp="new Date().toLocaleDateString()"
            >
              <el-card>
                <div class="flex justify-between items-center">
                  <span>{{ item }}</span>
                  <el-button
                      type="text"
                      class="text-red-500"
                      @click="removeActionItem(index)"
                  >
                    删除
                  </el-button>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-form-item>
      </div>

      <el-divider />

      <!-- 会议备注 -->
      <div class="p-4">
        <el-form-item label="会议备注">
          <el-input
              v-model="meetingDetails.notes"
              type="textarea"
              :rows="3"
              placeholder="输入会议附加备注"
          />
        </el-form-item>
      </div>

      <!-- 底部操作区 -->
      <div class="p-4 flex justify-between items-center">
        <div>
          <el-button type="primary" @click="saveMeetingRecord">
            <el-icon class="mr-1"><DocumentAdd /></el-icon>
            保存
          </el-button>
          <el-button @click="exportMeetingRecord">
            <el-icon class="mr-1"><Download /></el-icon>
            导出
          </el-button>
        </div>
        <div>
          <el-form-item label="下次会议日期">
            <el-date-picker
                v-model="meetingDetails.nextMeetingDate"
                type="date"
                placeholder="选择下次会议日期"
            />
          </el-form-item>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {
  Document,
  DocumentAdd,
  Download
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 初始化会议详情
const meetingDetails = reactive({
  title: '',
  date: '',
  participants: [],
  agenda: [],
  discussionPoints: [],
  decisions: [],
  actionItems: [],
  nextMeetingDate: '',
  notes: ''
})

// 新增项目的临时变量
const newParticipant = ref('')
const newAgendaItem = ref('')
const newDiscussionPoint = ref('')
const newDecision = ref('')
const newActionItem = ref('')

// 添加方法
const addParticipant = () => {
  if (newParticipant.value.trim()) {
    meetingDetails.participants.push(newParticipant.value.trim())
    newParticipant.value = ''
  }
}

const addAgendaItem = () => {
  if (newAgendaItem.value.trim()) {
    meetingDetails.agenda.push(newAgendaItem.value.trim())
    newAgendaItem.value = ''
  }
}

const addDiscussionPoint = () => {
  if (newDiscussionPoint.value.trim()) {
    meetingDetails.discussionPoints.push(newDiscussionPoint.value.trim())
    newDiscussionPoint.value = ''
  }
}

const addDecision = () => {
  if (newDecision.value.trim()) {
    meetingDetails.decisions.push(newDecision.value.trim())
    newDecision.value = ''
  }
}

const addActionItem = () => {
  if (newActionItem.value.trim()) {
    meetingDetails.actionItems.push(newActionItem.value.trim())
    newActionItem.value = ''
  }
}

// 删除方法
const removeParticipant = (index) => {
  meetingDetails.participants.splice(index, 1)
}

const removeAgendaItem = (index) => {
  meetingDetails.agenda.splice(index, 1)
}

const removeDiscussionPoint = (index) => {
  meetingDetails.discussionPoints.splice(index, 1)
}

const removeDecision = (index) => {
  meetingDetails.decisions.splice(index, 1)
}

const removeActionItem = (index) => {
  meetingDetails.actionItems.splice(index, 1)
}

// 保存会议记录
const saveMeetingRecord = () => {
  // 将会议记录保存到本地存储
  localStorage.setItem('meetingRecord', JSON.stringify(meetingDetails))

  ElMessage({
    message: '会议记录已保存',
    type: 'success'
  })
}

// 导出会议记录
const exportMeetingRecord = () => {
  const blob = new Blob([JSON.stringify(meetingDetails, null, 2)], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `meeting_record_${new Date().toISOString().split('T')[0]}.json`
  link.click()

  ElMessage({
    message: '会议记录已导出',
    type: 'success'
  })
}
</script>

<style scoped>
/* 可以添加一些自定义样式 */
.el-card {
  margin-bottom: 20px;
}

.el-steps {
  margin-top: 10px;
}
</style>