<!-- src/views/proposal/components/ProposalDetail.vue -->
<template>
  <div class="proposal-detail-container" v-loading="loading">
    <template v-if="proposal">
      <div class="detail-header">
        <div class="title-section">
          <h2 class="proposal-title">{{ proposal.title }}</h2>
          <div class="proposal-meta">
            <el-tag :type="getTypeTagType(proposal.type)" class="meta-tag">
              {{ getTypeLabel(proposal.type) }}
            </el-tag>
            <el-tag :type="getPriorityTagType(proposal.priority)" class="meta-tag">
              {{ getPriorityLabel(proposal.priority) }}
            </el-tag>
            <el-tag :type="getStatusTagType(proposal.status)" class="meta-tag">
              {{ getStatusLabel(proposal.status) }}
            </el-tag>
          </div>
        </div>
        
        <div class="action-section">
          <el-button 
            v-if="canEdit" 
            type="primary" 
            plain
            @click="handleEdit"
          >
            编辑
          </el-button>
          <el-button 
            v-if="proposal.status !== 'closed' && proposal.status !== 'rejected'" 
            type="warning" 
            plain
            @click="handleChangeStatus('closed')"
          >
            关闭提案
          </el-button>
          <el-button 
            v-if="proposal.status === 'closed' || proposal.status === 'rejected'" 
            type="success" 
            plain
            @click="handleChangeStatus('in_progress')"
          >
            重新打开
          </el-button>
        </div>
      </div>
      
      <el-divider />
      
      <el-descriptions :column="3" border>
        <el-descriptions-item label="提案ID">{{ proposal.id }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ proposal.creator }}</el-descriptions-item>
        <el-descriptions-item label="创建日期">{{ formatDate(proposal.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="所属产品">{{ proposal.product }}</el-descriptions-item>
        <el-descriptions-item label="责任部门">{{ proposal.department }}</el-descriptions-item>
        <el-descriptions-item label="预期完成日期">{{ formatDate(proposal.expectedCompletionDate) }}</el-descriptions-item>
      </el-descriptions>
      
      <el-tabs class="detail-tabs" type="border-card">
        <el-tab-pane label="问题描述">
          <div class="content-section">
            <div class="section-title">问题描述</div>
            <div class="section-content">{{ proposal.description || '无' }}</div>
          </div>
          
          <div class="content-section">
            <div class="section-title">解决方案建议</div>
            <div class="section-content">{{ proposal.suggestedSolution || '无' }}</div>
          </div>
          
          <el-divider />
          
          <div class="tag-section" v-if="proposal.tags && proposal.tags.length">
            <div class="section-title">标签</div>
            <div class="tag-list">
              <el-tag 
                v-for="tag in proposal.tags" 
                :key="tag" 
                size="small" 
                class="tag-item"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
          
          <div class="attachment-section" v-if="proposal.attachments && proposal.attachments.length">
            <div class="section-title">附件</div>
            <div class="attachment-list">
              <div 
                v-for="attachment in proposal.attachments" 
                :key="attachment.id" 
                class="attachment-item"
              >
                <el-icon><Document /></el-icon>
                <el-link type="primary" :href="attachment.url" target="_blank">
                  {{ attachment.name }}
                </el-link>
                <span class="attachment-size">{{ formatFileSize(attachment.size) }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="进度跟踪">
          <div class="progress-timeline">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in activityList"
                :key="index"
                :timestamp="formatDateTime(activity.timestamp)"
                :type="getActivityType(activity.type)"
                :color="getActivityColor(activity.type)"
              >
                <div class="timeline-content">
                  <div class="timeline-title">{{ activity.title }}</div>
                  <div class="timeline-operator">操作人: {{ activity.operator }}</div>
                  <div class="timeline-description" v-if="activity.description">
                    {{ activity.description }}
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
          
          <el-divider />
          
          <div class="add-comment">
            <div class="section-title">添加更新</div>
            <el-form :model="commentForm">
              <el-form-item>
                <el-input
                  v-model="commentForm.content"
                  type="textarea"
                  :rows="3"
                  placeholder="添加进度更新或评论..."
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitComment" :loading="submitting">
                  提交
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="解决方案" v-if="proposal.status === 'resolved' || proposal.status === 'closed'">
          <div class="content-section">
            <div class="section-title">最终解决方案</div>
            <div class="section-content">{{ proposal.resolution || '尚未提供最终解决方案' }}</div>
          </div>
          
          <div class="content-section" v-if="canAddResolution">
            <div class="section-title">添加或更新解决方案</div>
            <el-form :model="resolutionForm">
              <el-form-item>
                <el-input
                  v-model="resolutionForm.content"
                  type="textarea"
                  :rows="5"
                  placeholder="描述如何解决了这个问题..."
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitResolution" :loading="submitting">
                  保存解决方案
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>
    
    <div v-else-if="!loading" class="no-data">
      <el-empty description="未找到提案信息" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useProposalStore } from '@/store/proposal'
import { formatDate } from '@/utils/formatters'

const props = defineProps({
  proposalId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['update'])

const router = useRouter()
const proposalStore = useProposalStore()

const loading = ref(true)
const submitting = ref(false)
const proposal = ref(null)
const activityList = ref([])

// 表单数据
const commentForm = reactive({
  content: ''
})

const resolutionForm = reactive({
  content: ''
})

// 提案类型选项
const proposalTypes = [
  { value: 'defect', label: '缺陷处理' },
  { value: 'improvement', label: '改进建议' },
  { value: 'new_feature', label: '新功能需求' },
  { value: 'process', label: '流程优化' },
  { value: 'other', label: '其他' }
]

// 状态选项
const statusOptions = [
  { value: 'pending', label: '待处理' },
  { value: 'in_progress', label: '处理中' },
  { value: 'resolved', label: '已解决' },
  { value: 'closed', label: '已关闭' },
  { value: 'rejected', label: '已拒绝' }
]

// 获取提案详情
const fetchProposalDetail = async () => {
  loading.value = true
  
  try {
    const data = await proposalStore.fetchProposalById(props.proposalId)
    proposal.value = data
    
    // 假设解决方案已存在，则预填表单
    if (data.resolution) {
      resolutionForm.content = data.resolution
    }
    
    // 获取活动记录
    fetchActivityList()
  } catch (error) {
    console.error('Fetch proposal detail error:', error)
    ElMessage.error('获取提案详情失败')
  } finally {
    loading.value = false
  }
}

// 获取活动记录列表
const fetchActivityList = async () => {
  // 这里应该从API获取活动记录
  // 以下为模拟数据
  activityList.value = [
    {
      id: 1,
      title: '创建提案',
      type: 'create',
      description: '提案已创建',
      operator: '张三',
      timestamp: '2023-03-10T09:30:00'
    },
    {
      id: 2,
      title: '状态更新',
      type: 'update',
      description: '状态从 待处理 更新为 处理中',
      operator: '李四',
      timestamp: '2023-03-11T14:20:00'
    },
    {
      id: 3,
      title: '添加评论',
      type: 'comment',
      description: '已经开始调查问题原因，预计本周内可以给出初步方案。',
      operator: '王五',
      timestamp: '2023-03-12T11:15:00'
    },
    {
      id: 4,
      title: '解决方案',
      type: 'resolve',
      description: '问题已解决，等待验证。',
      operator: '赵六',
      timestamp: '2023-03-15T16:45:00'
    }
  ]
}

// 是否可以编辑
const canEdit = computed(() => {
  return proposal.value && proposal.value.status !== 'closed'
})

// 是否可以添加解决方案
const canAddResolution = computed(() => {
  return proposal.value && 
    (proposal.value.status === 'resolved' || proposal.value.status === 'in_progress')
})

// 初始化
onMounted(() => {
  fetchProposalDetail()
})

// 提交评论
const submitComment = async () => {
  if (!commentForm.content.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }
  
  submitting.value = true
  
  try {
    // 这里应该调用API提交评论
    // 模拟提交成功
    setTimeout(() => {
      // 添加到活动列表
      activityList.value.push({
        id: activityList.value.length + 1,
        title: '添加评论',
        type: 'comment',
        description: commentForm.content,
        operator: '当前用户',
        timestamp: new Date().toISOString()
      })
      
      // 重置表单
      commentForm.content = ''
      
      ElMessage.success('评论已添加')
      submitting.value = false
    }, 500)
  } catch (error) {
    console.error('Submit comment error:', error)
    ElMessage.error('提交评论失败')
    submitting.value = false
  }
}

// 提交解决方案
const submitResolution = async () => {
  if (!resolutionForm.content.trim()) {
    ElMessage.warning('请输入解决方案内容')
    return
  }
  
  submitting.value = true
  
  try {
    // 这里应该调用API提交解决方案
    // 模拟API调用
    setTimeout(async () => {
      // 更新本地数据
      proposal.value.resolution = resolutionForm.content
      
      // 如果状态不是已解决，则更新状态
      if (proposal.value.status !== 'resolved') {
        await handleChangeStatus('resolved', false)
      }
      
      // 添加到活动列表
      activityList.value.push({
        id: activityList.value.length + 1,
        title: '更新解决方案',
        type: 'resolve',
        description: '更新了解决方案',
        operator: '当前用户',
        timestamp: new Date().toISOString()
      })
      
      ElMessage.success('解决方案已保存')
      submitting.value = false
      
      // 通知父组件更新
      emit('update')
    }, 500)
  } catch (error) {
    console.error('Submit resolution error:', error)
    ElMessage.error('保存解决方案失败')
    submitting.value = false
  }
}

// 处理编辑提案
const handleEdit = () => {
  router.push(`/proposal/edit/${props.proposalId}`)
}

// 处理状态变更
const handleChangeStatus = async (status, showMessage = true) => {
  try {
    // 调用API更新提案状态
    await proposalStore.updateProposalStatus(props.proposalId, status)
    
    // 更新本地数据
    proposal.value.status = status
    
    // 添加到活动列表
    const statusLabel = getStatusLabel(status)
    activityList.value.push({
      id: activityList.value.length + 1,
      title: '状态更新',
      type: 'update',
      description: `状态更新为 ${statusLabel}`,
      operator: '当前用户',
      timestamp: new Date().toISOString()
    })
    
    if (showMessage) {
      ElMessage.success(`提案状态已更新为"${statusLabel}"`)
    }
    
    // 通知父组件更新
    emit('update')
  } catch (error) {
    console.error('Update status error:', error)
    if (showMessage) {
      ElMessage.error('更新状态失败')
    }
  }
}

// 格式化日期时间
const formatDateTime = (dateString) => {
  return formatDate(dateString, 'YYYY-MM-DD HH:mm')
}

// 格式化文件大小
const formatFileSize = (size) => {
  if (!size) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024
    i++
  }
  
  return `${size.toFixed(2)} ${units[i]}`
}

// 获取活动类型图标
const getActivityType = (type) => {
  const typeMap = {
    create: 'success',
    update: 'warning',
    comment: 'info',
    resolve: 'primary'
  }
  return typeMap[type] || 'info'
}

// 获取活动颜色
const getActivityColor = (type) => {
  const colorMap = {
    create: '#67C23A',
    update: '#E6A23C',
    comment: '#909399',
    resolve: '#409EFF'
  }
  return colorMap[type] || '#909399'
}

// 获取类型标签样式
const getTypeTagType = (type) => {
  const typeMap = {
    defect: 'danger',
    improvement: 'success',
    new_feature: 'primary',
    process: 'warning',
    other: 'info'
  }
  return typeMap[type] || 'info'
}

// 获取类型显示标签
const getTypeLabel = (type) => {
  const typeObj = proposalTypes.find(item => item.value === type)
  return typeObj ? typeObj.label : type
}

// 获取优先级标签样式
const getPriorityTagType = (priority) => {
  const priorityMap = {
    low: 'info',
    medium: 'success',
    high: 'warning',
    urgent: 'danger'
  }
  return priorityMap[priority] || 'info'
}

// 获取优先级显示标签
const getPriorityLabel = (priority) => {
  const priorityMap = {
    low: '低',
    medium: '中',
    high: '高',
    urgent: '紧急'
  }
  return priorityMap[priority] || priority
}

// 获取状态标签样式
const getStatusTagType = (status) => {
  const statusMap = {
    pending: 'info',
    in_progress: 'primary',
    resolved: 'success',
    closed: 'info',
    rejected: 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取状态显示标签
const getStatusLabel = (status) => {
  const statusObj = statusOptions.find(item => item.value === status)
  return statusObj ? statusObj.label : status
}
</script>

<style scoped>
.proposal-detail-container {
  width: 100%;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.title-section {
  flex: 1;
}

.proposal-title {
  margin: 0 0 10px 0;
  font-size: 20px;
  color: #303133;
}

.proposal-meta {
  display: flex;
  gap: 10px;
}

.meta-tag {
  margin-right: 5px;
}

.action-section {
  display: flex;
  gap: 10px;
}

.content-section {
  margin-bottom: 20px;
}

.section-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
  color: #303133;
}

.section-content {
  line-height: 1.6;
  color: #606266;
  white-space: pre-line;
}

.tag-section {
  margin-top: 20px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag-item {
  margin-bottom: 5px;
}

.attachment-section {
  margin-top: 20px;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.attachment-size {
  color: #909399;
  font-size: 12px;
  margin-left: 5px;
}

.detail-tabs {
  margin-top: 20px;
}

.progress-timeline {
  padding: 10px;
}

.timeline-content {
  line-height: 1.4;
}

.timeline-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.timeline-operator {
  font-size: 13px;
  color: #606266;
  margin-bottom: 5px;
}

.timeline-description {
  color: #606266;
  white-space: pre-line;
}

.add-comment {
  margin-top: 20px;
}

.no-data {
  display: flex;
  justify-content: center;
  padding: 50px 0;
}
</style>