<!-- src/views/dashboard/DashboardView.vue -->
<template>
  <div class="dashboard-container">
    <!-- 欢迎卡片 -->
    <el-card class="welcome-card">
      <div class="welcome-content">
        <div class="welcome-info">
          <h2>欢迎回来，{{ userInfo.username }}</h2>
          <p>今天是 {{ currentDate }}，{{ greeting }}</p>
        </div>
        <div class="quick-actions">
          <el-button type="primary" @click="$router.push('/proposal/submit')">新建提案</el-button>
          <el-button type="success" @click="$router.push('/proposal/analyze')">查看分析</el-button>
        </div>
      </div>
    </el-card>
    
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="24" :sm="12" :md="6" v-for="(stat, index) in stats" :key="index">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" :style="{ backgroundColor: stat.bgColor }">
            <el-icon><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-title">{{ stat.title }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 图表行 -->
    <el-row :gutter="20" class="chart-row">
      <!-- 最近提案趋势 -->
      <el-col :xs="24" :sm="24" :md="16">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="header-title">最近提案趋势</span>
              <el-radio-group v-model="timeRange" size="small" @change="fetchDashboardData">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="quarter">本季度</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="trendChartRef" class="chart-container">
            <div v-loading="loading" class="chart"></div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 提案类型占比 -->
      <el-col :xs="24" :sm="24" :md="8">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="header-title">提案类型占比</span>
            </div>
          </template>
          <div ref="typeChartRef" class="chart-container">
            <div v-loading="loading" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 待处理提案和动态 -->
    <el-row :gutter="20" class="content-row">
      <!-- 待处理提案 -->
      <el-col :xs="24" :sm="24" :md="12">
        <el-card shadow="hover" class="todo-card">
          <template #header>
            <div class="card-header">
              <span class="header-title">待处理提案</span>
              <el-button type="text" @click="$router.push('/proposal/history')">
                查看全部
              </el-button>
            </div>
          </template>
          <div v-loading="loading" class="todo-list">
            <el-empty v-if="pendingProposals.length === 0" description="没有待处理提案" />
            <el-table v-else :data="pendingProposals" style="width: 100%" :show-header="false">
              <el-table-column width="60">
                <template #default="scope">
                  <el-tag :type="getPriorityTagType(scope.row.priority)" size="small">
                    {{ getPriorityLabel(scope.row.priority) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="title" label="提案标题">
                <template #default="scope">
                  <el-link type="primary" @click="viewProposal(scope.row.id)">
                    {{ scope.row.title }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column prop="department" label="部门" width="100" />
              <el-table-column prop="createdAt" label="创建日期" width="100">
                <template #default="scope">
                  {{ formatDate(scope.row.createdAt) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      
      <!-- 最近动态 -->
      <el-col :xs="24" :sm="24" :md="12">
        <el-card shadow="hover" class="activity-card">
          <template #header>
            <div class="card-header">
              <span class="header-title">最近动态</span>
            </div>
          </template>
          <div v-loading="loading" class="activity-timeline">
            <el-empty v-if="recentActivities.length === 0" description="没有最近活动" />
            <el-timeline v-else>
              <el-timeline-item
                v-for="(activity, index) in recentActivities"
                :key="index"
                :timestamp="formatDateTime(activity.timestamp)"
                :type="getActivityType(activity.type)"
                :color="getActivityColor(activity.type)"
              >
                <div class="activity-content">
                  <div class="activity-title">{{ activity.title }}</div>
                  <div class="activity-meta">
                    <span>{{ activity.user }}</span>
                    <el-tag size="small" :type="getActivityTagType(activity.type)">
                      {{ activity.action }}
                    </el-tag>
                  </div>
                  <div class="activity-description" v-if="activity.description">
                    {{ activity.description }}
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 部门绩效卡片 -->
    <el-card shadow="hover" class="performance-card">
      <template #header>
        <div class="card-header">
          <span class="header-title">部门绩效</span>
          <el-radio-group v-model="performanceMetric" size="small" @change="updatePerformanceChart">
            <el-radio-button label="count">提案数量</el-radio-button>
            <el-radio-button label="time">处理时间</el-radio-button>
            <el-radio-button label="rate">解决率</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div ref="performanceChartRef" class="performance-chart-container">
        <div v-loading="loading" class="chart"></div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useProposalStore } from '@/store/proposal'
import { formatDate } from '@/utils/formatters'
import * as echarts from 'echarts'

const router = useRouter()
const userStore = useUserStore()
const proposalStore = useProposalStore()

// 图表引用
const trendChartRef = ref(null)
const typeChartRef = ref(null)
const performanceChartRef = ref(null)

// 图表实例
let trendChart = null
let typeChart = null
let performanceChart = null

// 状态
const loading = ref(false)
const timeRange = ref('month')
const performanceMetric = ref('count')

// 用户信息
const userInfo = computed(() => {
  return userStore.userInfo
})

// 当前日期和问候语
const currentDate = computed(() => {
  return formatDate(new Date(), 'YYYY年MM月DD日')
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) {
    return '凌晨好！'
  } else if (hour < 9) {
    return '早上好！'
  } else if (hour < 12) {
    return '上午好！'
  } else if (hour < 14) {
    return '中午好！'
  } else if (hour < 17) {
    return '下午好！'
  } else if (hour < 19) {
    return '傍晚好！'
  } else {
    return '晚上好！'
  }
})

// 统计数据
const stats = reactive([
  {
    title: '本月提案总数',
    value: 0,
    icon: 'Document',
    bgColor: '#409EFF'
  },
  {
    title: '待处理提案',
    value: 0,
    icon: 'Timer',
    bgColor: '#E6A23C'
  },
  {
    title: '已完成提案',
    value: 0,
    icon: 'CheckCircle',
    bgColor: '#67C23A'
  },
  {
    title: '平均响应时间',
    value: '0小时',
    icon: 'Clock',
    bgColor: '#F56C6C'
  }
])

// 待处理提案
const pendingProposals = ref([])

// 最近活动
const recentActivities = ref([])

// 初始化
onMounted(async () => {
  await fetchDashboardData()
  
  // 初始化图表
  initCharts()
  
  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize)
  
  // 组件卸载时移除事件监听并销毁图表
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    disposeCharts()
  })
})

// 销毁图表
const disposeCharts = () => {
  if (trendChart) trendChart.dispose()
  if (typeChart) typeChart.dispose()
  if (performanceChart) performanceChart.dispose()
}

// 调整图表大小
const handleResize = () => {
  if (trendChart) trendChart.resize()
  if (typeChart) typeChart.resize()
  if (performanceChart) performanceChart.resize()
}

// 获取仪表盘数据
const fetchDashboardData = async () => {
  loading.value = true
  
  try {
    // 构建查询参数
    const params = {
      timeRange: timeRange.value
    }
    
    // 调用API获取仪表盘数据
    // 这里使用模拟数据，实际应用中应从API获取
    const dashboardData = getMockDashboardData()
    
    // 更新统计数据
    updateStats(dashboardData)
    
    // 更新待处理提案
    pendingProposals.value = dashboardData.pendingProposals || []
    
    // 更新最近活动
    recentActivities.value = dashboardData.recentActivities || []
    
    // 更新图表数据
    updateCharts(dashboardData)
  } catch (error) {
    console.error('Fetch dashboard data error:', error)
  } finally {
    loading.value = false
  }
}

// 更新统计数据
const updateStats = (data) => {
  if (!data) return
  
  stats[0].value = data.monthlyTotal || 0
  stats[1].value = data.pendingCount || 0
  stats[2].value = data.completedCount || 0
  stats[3].value = `${data.avgResponseTime || 0}小时`
}

// 初始化图表
const initCharts = () => {
  // 趋势图表
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value.querySelector('.chart'))
  }
  
  // 类型占比图表
  if (typeChartRef.value) {
    typeChart = echarts.init(typeChartRef.value.querySelector('.chart'))
  }
  
  // 部门绩效图表
  if (performanceChartRef.value) {
    performanceChart = echarts.init(performanceChartRef.value.querySelector('.chart'))
  }
}

// 更新图表数据
const updateCharts = (data) => {
  if (!data) return
  
  // 更新趋势图表
  if (trendChart) {
    const trendOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['新建', '解决', '关闭']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.trendData?.dates || []
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '新建',
          type: 'bar',
          stack: 'total',
          data: data.trendData?.created || []
        },
        {
          name: '解决',
          type: 'bar',
          stack: 'total',
          data: data.trendData?.resolved || []
        },
        {
          name: '关闭',
          type: 'bar',
          stack: 'total',
          data: data.trendData?.closed || []
        }
      ]
    }
    
    trendChart.setOption(trendOption)
  }
  
  // 更新类型占比图表
  if (typeChart) {
    const typeOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: data.typeData?.map(item => item.name) || []
      },
      series: [
        {
          name: '提案类型',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data.typeData || []
        }
      ]
    }
    
    typeChart.setOption(typeOption)
  }
  
  // 更新部门绩效图表
  updatePerformanceChart(data)
}

// 更新部门绩效图表
const updatePerformanceChart = (data) => {
  if (!performanceChart) return
  
  // 如果参数是事件对象，则使用上次的数据
  const chartData = typeof data === 'object' && !Array.isArray(data) && data !== null && !(data instanceof Event) 
    ? data 
    : getMockDashboardData()
  
  const performanceData = chartData.departmentData
  if (!performanceData) return
  
  let seriesData
  let title
  
  switch (performanceMetric.value) {
    case 'count':
      seriesData = performanceData.map(item => item.count)
      title = '提案数量'
      break
    case 'time':
      seriesData = performanceData.map(item => item.avgTime)
      title = '平均处理时间(天)'
      break
    case 'rate':
      seriesData = performanceData.map(item => item.resolveRate)
      title = '解决率(%)'
      break
  }
  
  const option = {
    title: {
      text: title,
      subtext: '按部门',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: performanceData.map(item => item.name)
    },
    series: [
      {
        name: title,
        type: 'bar',
        data: seriesData
      }
    ]
  }
  
  performanceChart.setOption(option)
}

// 查看提案详情
const viewProposal = (id) => {
  router.push(`/proposal/history?id=${id}`)
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

// 格式化日期时间
const formatDateTime = (dateString) => {
  return formatDate(dateString, 'YYYY-MM-DD HH:mm')
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

// 获取活动标签样式
const getActivityTagType = (type) => {
  const typeMap = {
    create: 'success',
    update: 'warning',
    comment: 'info',
    resolve: 'primary'
  }
  return typeMap[type] || 'info'
}

// 获取模拟仪表盘数据（实际应用中应从API获取）
const getMockDashboardData = () => {
  return {
    monthlyTotal: 68,
    pendingCount: 15,
    completedCount: 53,
    avgResponseTime: 4.5,
    
    pendingProposals: [
      {
        id: 1,
        title: '产品A质量异常分析报告',
        priority: 'high',
        department: '生产部',
        createdAt: '2023-03-10'
      },
      {
        id: 2,
        title: '包装材料优化方案',
        priority: 'medium',
        department: '研发部',
        createdAt: '2023-03-12'
      },
      {
        id: 3,
        title: '新功能开发需求评估',
        priority: 'urgent',
        department: '研发部',
        createdAt: '2023-03-15'
      },
      {
        id: 4,
        title: '客户反馈处理流程优化',
        priority: 'low',
        department: '市场部',
        createdAt: '2023-03-16'
      }
    ],
    
    recentActivities: [
      {
        title: '提交了新提案',
        user: '张三',
        action: '创建',
        type: 'create',
        description: '提交了"客户反馈处理流程优化"提案',
        timestamp: '2023-03-16T10:30:00'
      },
      {
        title: '更新了提案状态',
        user: '李四',
        action: '更新',
        type: 'update',
        description: '将"产品A质量异常分析报告"状态更新为"处理中"',
        timestamp: '2023-03-15T16:45:00'
      },
      {
        title: '解决了提案',
        user: '王五',
        action: '解决',
        type: 'resolve',
        description: '解决了"生产线效率提升方案"提案',
        timestamp: '2023-03-14T14:20:00'
      },
      {
        title: '添加了评论',
        user: '赵六',
        action: '评论',
        type: 'comment',
        description: '在"新功能开发需求评估"中添加了评论',
        timestamp: '2023-03-14T11:15:00'
      }
    ],
    
    trendData: {
      dates: ['03-10', '03-11', '03-12', '03-13', '03-14', '03-15', '03-16'],
      created: [5, 7, 3, 8, 6, 9, 4],
      resolved: [3, 4, 5, 6, 7, 2, 1],
      closed: [2, 3, 1, 4, 5, 3, 2]
    },
    
    typeData: [
      { value: 42, name: '缺陷处理' },
      { value: 28, name: '改进建议' },
      { value: 18, name: '新功能需求' },
      { value: 12, name: '流程优化' }
    ],
    
    departmentData: [
      { name: '研发部', count: 35, avgTime: 5.2, resolveRate: 86 },
      { name: '质量部', count: 28, avgTime: 3.8, resolveRate: 92 },
      { name: '生产部', count: 20, avgTime: 4.5, resolveRate: 78 },
      { name: '市场部', count: 15, avgTime: 6.1, resolveRate: 75 }
    ]
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-info h2 {
  margin: 0 0 5px 0;
  font-size: 22px;
  color: #303133;
}

.welcome-info p {
  margin: 0;
  color: #606266;
}

.quick-actions {
  display: flex;
  gap: 10px;
}

.stat-row {
  margin-bottom: 20px;
}

.stat-card {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  padding: 15px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  color: white;
  font-size: 24px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-title {
  font-size: 14px;
  color: #909399;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
}

.chart-container {
  height: 300px;
  position: relative;
}

.chart {
  width: 100%;
  height: 100%;
}

.content-row {
  margin-bottom: 20px;
}

.todo-card, .activity-card {
  height: 400px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.todo-list, .activity-timeline {
  overflow-y: auto;
  flex: 1;
}

.activity-content {
  margin-bottom: 10px;
}

.activity-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.activity-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #909399;
  margin-bottom: 5px;
}

.activity-description {
  color: #606266;
  font-size: 13px;
}

.performance-card {
  margin-bottom: 20px;
}

.performance-chart-container {
  height: 400px;
}
</style>