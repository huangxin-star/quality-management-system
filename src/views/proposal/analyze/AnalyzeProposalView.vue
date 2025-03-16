<!-- src/views/defect/DefectAnalysisForm.vue -->
<template>
  <div class="defect-analysis-container">
    <!-- 待处理提案提示及切换 -->
    <div class="proposal-header">
      <div class="proposal-status">
        <el-tag type="warning">您当前有待处理提案 {{ pendingProposals.length }} 条</el-tag>
      </div>
      <div class="proposal-navigation">
        <el-button-group>
          <el-button
              :disabled="currentIndex === 0"
              @click="switchProposal(currentIndex - 1)"
          >
            <el-icon>
              <ArrowLeft/>
            </el-icon>
            上一条
          </el-button>
          <el-button
              :disabled="currentIndex >= pendingProposals.length - 1"
              @click="switchProposal(currentIndex + 1)"
          >
            下一条
            <el-icon>
              <ArrowRight/>
            </el-icon>
          </el-button>
        </el-button-group>
        <div class="proposal-index">
          当前第 {{ currentIndex + 1 }} 条 / 共 {{ pendingProposals.length }} 条
        </div>
      </div>
    </div>
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span class="header-title">不良原因分析与对策表单</span>
          <el-button type="primary" @click="submitForm" :loading="loading">提交</el-button>
        </div>
      </template>

      <el-form
          ref="defectFormRef"
          :model="defectForm"
          :rules="defectRules"
          label-width="140px"
          label-position="right"
      >
        <!-- 基本信息 -->
        <el-divider content-position="left">基本信息</el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="不良现象编号" prop="defectCode">
              <el-input v-model="defectForm.defectCode" placeholder="请输入不良现象编号" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="填写日期" prop="createDate">
              <el-date-picker
                  v-model="defectForm.createDate"
                  type="date"
                  placeholder="选择日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分析人" prop="analyst">
              <el-input v-model="defectForm.analyst" placeholder="请输入分析人姓名" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任部门" prop="department">
              <el-select v-model="defectForm.department" placeholder="请选择责任部门" style="width: 100%">
                <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 不良原因分析 -->
        <el-divider content-position="left">不良原因分析</el-divider>

        <el-form-item label="不良现象描述" prop="defectDescription">
          <el-input
              v-model="defectForm.defectDescription"
              type="textarea"
              :rows="3"
              placeholder="请详细描述不良现象"
          />
        </el-form-item>

        <el-form-item label="不良原因" prop="defectCause">
          <el-input
              v-model="defectForm.defectCause"
              type="textarea"
              :rows="3"
              placeholder="请分析不良原因"
          />
        </el-form-item>

        <el-form-item label="问题分类" prop="problemCategory">
          <el-select v-model="defectForm.problemCategory" placeholder="请选择问题分类" style="width: 100%">
            <el-option v-for="item in problemCategoryOptions" :key="item.value" :label="item.label"
                       :value="item.value"/>
          </el-select>
        </el-form-item>
        <!-- 使用 el-row 和 el-col 创建并排布局 -->
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="是否NPI漏失" prop="isNpiMissed">
              <el-radio-group v-model="defectForm.isNpiMissed">
                <el-radio label="yes">是</el-radio>
                <el-radio label="no">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否为重复发生" prop="isRepeated">
              <el-radio-group v-model="defectForm.isRepeated">
                <el-radio label="yes">是</el-radio>
                <el-radio label="no">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="根本原因分析" prop="rootCause">
          <el-input
              v-model="defectForm.rootCause"
              type="textarea"
              :rows="3"
              placeholder="请分析根本原因"
          />
        </el-form-item>

        <!-- 对策 -->
        <el-divider content-position="left">改进对策</el-divider>

        <el-form-item label="短期对策" prop="shortTermMeasures">
          <el-input
              v-model="defectForm.shortTermMeasures"
              type="textarea"
              :rows="3"
              placeholder="请输入短期改进对策"
          />
        </el-form-item>

        <el-form-item label="长期对策" prop="longTermMeasures">
          <el-input
              v-model="defectForm.longTermMeasures"
              type="textarea"
              :rows="3"
              placeholder="请输入长期改进对策"
          />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="计划完成日期" prop="planCompletionDate">
              <el-date-picker
                  v-model="defectForm.planCompletionDate"
                  type="date"
                  placeholder="选择计划完成日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任人" prop="responsible">
              <el-input v-model="defectForm.responsible" placeholder="请输入责任人"/>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 验证 -->
        <el-divider content-position="left">改进效果验证</el-divider>

        <el-form-item label="验证方法" prop="verificationMethod">
          <el-input
              v-model="defectForm.verificationMethod"
              type="textarea"
              :rows="2"
              placeholder="请描述验证方法"
          />
        </el-form-item>

        <el-form-item label="验证结果" prop="verificationResult">
          <el-radio-group v-model="defectForm.verificationResult">
            <el-radio label="effective">有效</el-radio>
            <el-radio label="partial">部分有效</el-radio>
            <el-radio label="ineffective">无效</el-radio>
            <el-radio label="pending">待验证</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="验证说明" prop="verificationDescription">
          <el-input
              v-model="defectForm.verificationDescription"
              type="textarea"
              :rows="2"
              placeholder="请描述验证结果说明"
          />
        </el-form-item>

        <!-- 附件 -->
        <el-divider content-position="left">附件资料</el-divider>

        <el-form-item label="相关图片">
          <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :file-list="fileList"
              :on-change="handleFileChange"
              :on-remove="handleFileRemove"
          >
            <el-icon>
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue'
import {ArrowLeft, ArrowRight, Plus} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'

// 表单引用
const defectFormRef = ref(null)

// 加载状态
const loading = ref(false)

// 文件列表
const fileList = ref([])

// 部门选项
const departmentOptions = [
  {value: 'production', label: '生产部'},
  {value: 'quality', label: '质量部'},
  {value: 'engineering', label: '工程部'},
  {value: 'rd', label: '研发部'}
]

// 问题分类选项
const problemCategoryOptions = [
  {value: 'man', label: '人员(Man)'},
  {value: 'machine', label: '设备(Machine)'},
  {value: 'material', label: '材料(Material)'},
  {value: 'method', label: '方法(Method)'},
  {value: 'measurement', label: '测量(Measurement)'},
  {value: 'environment', label: '环境(Environment)'}
]

// 表单数据
const defectForm = reactive({
  // 基本信息
  defectCode: 'DEF-202503-0042', // 模拟生成的编号
  createDate: new Date().toISOString().split('T')[0],
  analyst: 'admin', // 默认为当前用户
  department: '',

  // 不良原因分析
  defectDescription: '在SMT贴片过程中发现芯片偏移现象，偏移位置随机，偏移距离约0.2-0.5mm，影响产品焊接质量和电气性能。',
  defectCause: '经检查发现主要问题来自于设备吸嘴磨损和压力不稳定，导致芯片放置过程中发生轻微位移。同时发现贴片机微调参数未根据不同型号芯片进行针对性设置。',
  problemCategory: 'machine',
  rootCause: '1. 吸嘴长期使用导致磨损，吸力不均匀\n2. 设备定期保养制度执行不到位\n3. 操作参数未标准化，依赖操作员经验设置\n4. 缺乏针对不同物料的参数优化方案',

  // 对策
  shortTermMeasures: '1. 立即更换磨损的吸嘴\n2. 重新校准贴片机定位系统\n3. 调整设备气压参数\n4. 增加贴片后的巡检频次\n5. 临时降低设备运行速度',
  longTermMeasures: '1. 修订设备保养计划，明确吸嘴定期更换周期\n2. 建立各型号芯片的参数数据库，规范参数设置\n3. 引入AOI检测设备，提高在线检测能力\n4. 对操作人员进行专业培训\n5. 评估供应商芯片封装质量，优化物料设计',
  planCompletionDate: '',
  responsible: '',

  // 验证
  verificationMethod: '1. 通过SPC控制图监控贴片偏移量变化趋势\n2. 与标准工艺参数比对验证\n3. 不良率统计分析',
  verificationResult: 'pending',
  verificationDescription: ''
})

// 表单验证规则
const defectRules = reactive({
  createDate: [
    {required: true, message: '请选择填写日期', trigger: 'change'}
  ],
  analyst: [
    {required: true, message: '请输入分析人姓名', trigger: 'blur'}
  ],
  department: [
    {required: true, message: '请选择责任部门', trigger: 'change'}
  ],
  defectDescription: [
    {required: true, message: '请详细描述不良现象', trigger: 'blur'},
    {min: 10, message: '描述不能少于10个字符', trigger: 'blur'}
  ],
  defectCause: [
    {required: true, message: '请分析不良原因', trigger: 'blur'},
    {min: 10, message: '原因分析不能少于10个字符', trigger: 'blur'}
  ],
  problemCategory: [
    {required: true, message: '请选择问题分类', trigger: 'change'}
  ],
  rootCause: [
    {required: true, message: '请分析根本原因', trigger: 'blur'},
    {min: 10, message: '根本原因分析不能少于10个字符', trigger: 'blur'}
  ],
  shortTermMeasures: [
    {required: true, message: '请输入短期改进对策', trigger: 'blur'},
    {min: 10, message: '短期对策不能少于10个字符', trigger: 'blur'}
  ],
  longTermMeasures: [
    {required: true, message: '请输入长期改进对策', trigger: 'blur'},
    {min: 10, message: '长期对策不能少于10个字符', trigger: 'blur'}
  ],
  planCompletionDate: [
    {required: true, message: '请选择计划完成日期', trigger: 'change'},
    {
      validator: (rule, value, callback) => {
        if (value && new Date(value) <= new Date()) {
          callback(new Error('完成日期必须晚于今天'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  responsible: [
    {required: true, message: '请输入责任人', trigger: 'blur'}
  ],
  verificationMethod: [
    {required: true, message: '请描述验证方法', trigger: 'blur'}
  ]
})

// 新增提案相关状态
const pendingProposals = ref([]) // 待处理提案列表
const currentIndex = ref(0)      // 当前显示提案索引

// 获取待处理提案列表
const fetchPendingProposals = async () => {
  try {
    // 模拟API调用
    const mockData = [
      {
        id: 1,
        defectCode: 'DEF-202503-0042',
        status: 'pending',
        // 其他表单字段...
      },
      {
        id: 2,
        defectCode: 'DEF-202503-0043',
        status: 'pending',
        // 其他表单字段...
      }
    ]
    pendingProposals.value = mockData.filter(p => p.status === 'pending')
  } catch (error) {
    ElMessage.error('获取提案列表失败')
  }
}

// 切换提案
const switchProposal = (index) => {
  if (index >= 0 && index < pendingProposals.value.length) {
    currentIndex.value = index
    loadProposalData(pendingProposals.value[index].id)
  }
}

// 加载指定提案数据
const loadProposalData = async (proposalId) => {
  try {
    // 模拟API调用
    const mockData = {
      id: proposalId,
      defectCode: `DEF-202503-00${41 + proposalId}`,
      createDate: '2023-05-20',
      // 其他表单字段...
    }
    Object.assign(defectForm, mockData)
  } catch (error) {
    ElMessage.error('加载提案数据失败')
  }
}

// 初始化时获取提案列表
onMounted(() => {
  fetchPendingProposals()
  // 如果存在待处理提案，加载第一条
  if (pendingProposals.value.length > 0) {
    loadProposalData(pendingProposals.value[0].id)
  }
})
// 文件上传处理
const handleFileChange = (file) => {
  fileList.value.push(file)
}

const handleFileRemove = (file) => {
  const index = fileList.value.findIndex(item => item.uid === file.uid)
  if (index !== -1) {
    fileList.value.splice(index, 1)
  }
}

// 提交表单
const submitForm = async () => {
  if (!defectFormRef.value) return

  try {
    await defectFormRef.value.validate()

    loading.value = true

    // 模拟API调用延迟
    setTimeout(() => {
      ElMessage({
        type: 'success',
        message: '提交成功！'
      })
      loading.value = false
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('请完善表单必填项')
  }
}

// 组件挂载时执行
onMounted(() => {
  // 模拟初始化数据加载
  // 实际应用中这里可能需要从API获取数据
})
</script>

<style scoped>
.defect-analysis-container {
  padding: 20px;
}

.form-card {
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

.el-divider {
  margin-top: 24px;
  margin-bottom: 24px;
}

.el-form-item:last-child {
  margin-bottom: 0;
}
</style>