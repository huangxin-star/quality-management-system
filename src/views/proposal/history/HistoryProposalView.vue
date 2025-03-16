<!-- src/views/proposal/history/HistoryProposalView.vue -->
<template>
  <div class="history-proposal-container">
    <!-- 搜索筛选区域 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" :inline="true">
        <el-form-item label="提案标题">
          <el-input
            v-model="filterForm.title"
            placeholder="搜索提案标题"
            clearable
            @clear="handleFilter"
          />
        </el-form-item>
        
        <el-form-item label="提案类型">
          <el-select
            v-model="filterForm.type"
            placeholder="选择类型"
            clearable
            @change="handleFilter"
          >
            <el-option
              v-for="item in proposalTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态">
          <el-select
            v-model="filterForm.status"
            placeholder="选择状态"
            clearable
            @change="handleFilter"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="提交日期">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            @change="handleFilter"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleFilter">搜索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 数据表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="table-header">
          <span class="header-title">提案列表</span>
          <div class="header-actions">
            <el-button type="success" @click="exportData">导出数据</el-button>
            <el-button type="primary" @click="$router.push('/proposal/submit')">新建提案</el-button>
          </div>
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="proposalList"
        border
        stripe
        style="width: 100%"
        @row-click="handleRowClick"
      >
        <el-table-column type="expand">
          <template #default="props">
            <div class="expand-content">
              <p><strong>问题描述：</strong>{{ props.row.description }}</p>
              <p v-if="props.row.suggestedSolution"><strong>解决方案建议：</strong>{{ props.row.suggestedSolution }}</p>
              <p v-if="props.row.resolution"><strong>最终解决方案：</strong>{{ props.row.resolution }}</p>
              <p v-if="props.row.tags && props.row.tags.length">
                <strong>标签：</strong>
                <el-tag 
                  v-for="tag in props.row.tags" 
                  :key="tag" 
                  size="small" 
                  class="tag-item"
                >
                  {{ tag }}
                </el-tag>
              </p>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="id" label="ID" width="80" />
        
        <el-table-column prop="title" label="提案标题" min-width="200">
          <template #default="scope">
            <el-link type="primary" @click.stop="viewProposalDetail(scope.row.id)">
              {{ scope.row.title }}
            </el-link>
          </template>
        </el-table-column>
        
        <el-table-column prop="type" label="类型" width="120">
          <template #default="scope">
            <el-tag :type="getTypeTagType(scope.row.type)">
              {{ getTypeLabel(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="priority" label="优先级" width="100">
          <template #default="scope">
            <el-tag :type="getPriorityTagType(scope.row.priority)">
              {{ getPriorityLabel(scope.row.priority) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="department" label="责任部门" width="120" />
        
        <el-table-column prop="createdAt" label="创建日期" width="120">
          <template #default="scope">
            {{ formatDate(scope.row.createdAt) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="expectedCompletionDate" label="预期完成日期" width="120">
          <template #default="scope">
            {{ formatDate(scope.row.expectedCompletionDate) }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button 
              size="small" 
              type="primary" 
              plain
              @click.stop="viewProposalDetail(scope.row.id)"
            >
              查看
            </el-button>
            
            <el-dropdown 
              @command="(command) => handleCommand(command, scope.row)" 
              trigger="click"
              @click.stop
            >
              <el-button size="small" type="primary">
                更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="track">跟踪</el-dropdown-item>
                  <el-dropdown-item 
                    command="close" 
                    v-if="scope.row.status !== 'closed' && scope.row.status !== 'rejected'"
                  >
                    关闭
                  </el-dropdown-item>
                  <el-dropdown-item 
                    command="reopen" 
                    v-if="scope.row.status === 'closed' || scope.row.status === 'rejected'"
                  >
                    重新打开
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 提案详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="提案详情"
      width="70%"
      destroy-on-close
    >
      <proposal-detail 
        v-if="dialogVisible" 
        :proposal-id="currentProposalId"
        @update="fetchProposals"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useProposalStore } from '@/store/proposal'
import { formatDate } from '@/utils/formatters'
import ProposalDetail from '../components/ProposalDetail.vue'

const router = useRouter()
const proposalStore = useProposalStore()

const loading = ref(false)
const proposalList = ref([])
const dialogVisible = ref(false)
const currentProposalId = ref(null)

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 筛选表单
const filterForm = reactive({
  title: '',
  type: '',
  status: '',
  dateRange: null
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

// 获取提案数据
const fetchProposals = async () => {
  loading.value = true
  
  try {
    // 构建查询参数
    const params = {
      page: pagination.currentPage,
      limit: pagination.pageSize,
      title: filterForm.title || undefined,
      type: filterForm.type || undefined,
      status: filterForm.status || undefined
    }
    
    // 添加日期范围参数
    if (filterForm.dateRange && filterForm.dateRange.length === 2) {
      params.startDate = filterForm.dateRange[0]
      params.endDate = filterForm.dateRange[1]
    }
    
    const result = await proposalStore.fetchProposals(params)
    proposalList.value = result.items || []
    pagination.total = result.total || 0
  } catch (error) {
    console.error('Fetch proposals error:', error)
    ElMessage.error('获取提案列表失败')
  } finally {
    loading.value = false
  }
}

// 初始化
onMounted(() => {
  fetchProposals()
})

// 处理筛选
const handleFilter = () => {
  pagination.currentPage = 1
  fetchProposals()
}

// 重置筛选条件
const resetFilter = () => {
  filterForm.title = ''
  filterForm.type = ''
  filterForm.status = ''
  filterForm.dateRange = null
  handleFilter()
}

// 分页处理
const handleSizeChange = (size) => {
  pagination.pageSize = size
  fetchProposals()
}

const handleCurrentChange = (page) => {
  pagination.currentPage = page
  fetchProposals()
}

// 查看提案详情
const viewProposalDetail = (id) => {
  currentProposalId.value = id
  dialogVisible.value = true
}

// 处理行点击
const handleRowClick = (row) => {
  viewProposalDetail(row.id)
}

// 处理下拉菜单命令
const handleCommand = (command, row) => {
  switch (command) {
    case 'edit':
      router.push(`/proposal/edit/${row.id}`)
      break
    case 'track':
      router.push(`/proposal/track/${row.id}`)
      break
    case 'close':
      closeProposal(row.id)
      break
    case 'reopen':
      reopenProposal(row.id)
      break
  }
}

// 关闭提案
const closeProposal = (id) => {
  ElMessageBox.confirm('确定要关闭该提案吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await proposalStore.updateProposalStatus(id, 'closed')
      ElMessage.success('提案已关闭')
      fetchProposals()
    } catch (error) {
      ElMessage.error('操作失败')
    }
  }).catch(() => {
    // 取消操作
  })
}

// 重新打开提案
const reopenProposal = (id) => {
  ElMessageBox.confirm('确定要重新打开该提案吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await proposalStore.updateProposalStatus(id, 'in_progress')
      ElMessage.success('提案已重新打开')
      fetchProposals()
    } catch (error) {
      ElMessage.error('操作失败')
    }
  }).catch(() => {
    // 取消操作
  })
}

// 导出数据
const exportData = () => {
  ElMessage.success('数据导出功能待实现')
  // 实际应用中应调用后端API生成导出文件
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
.history-proposal-container {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.expand-content {
  padding: 15px;
}

.tag-item {
  margin-right: 5px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>