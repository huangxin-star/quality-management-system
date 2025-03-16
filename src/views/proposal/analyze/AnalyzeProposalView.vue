<!-- src/views/defect/DefectAnalysisForm.vue -->
<template>
  <div class="defect-analysis-container">
    <!-- 待处理提案提示及箭头导航 -->
    <div class="proposal-header">
      <div class="proposal-status">
        <el-tag type="warning">您当前有待处理提案 {{ pendingProposals.length }} 条</el-tag>
      </div>
      <div class="proposal-navigation">
        <div class="arrow-navigation">
          <div
              class="nav-arrow left-arrow"
              :class="{ disabled: currentIndex === 0 }"
              @click="currentIndex > 0 && switchProposal(currentIndex - 1)"
          >
            <el-icon><ArrowLeft /></el-icon>
          </div>
          <div class="proposal-index">
            当前第 {{ currentIndex + 1 }} 条 / 共 {{ pendingProposals.length }} 条
          </div>
          <div
              class="nav-arrow right-arrow"
              :class="{ disabled: currentIndex >= pendingProposals.length - 1 }"
              @click="currentIndex < pendingProposals.length - 1 && switchProposal(currentIndex + 1)"
          >
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span class="header-title">不良原因分析与对策表单</span>
          <el-button type="primary" @click="submitForm" :loading="loading">提交</el-button>
          <el-button @click="handleCancel">取消</el-button>

        </div>
      </template>

      <el-form
          ref="defectFormRef"
          :model="proposalForm"
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
              v-model="proposalForm.defectDescription"
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
import {ElMessage, ElMessageBox} from 'element-plus'
import {useRouter} from 'vue-router'
const router = useRouter()
// 初始化空表单
const initEmptyForm = () => {
  return {
    defectDescription:'',
    status: 'draft' // 新增状态字段，用于标识是否为草稿
  }
}
const proposalForm = reactive(initEmptyForm())
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
  isNpiMissed: 'no',
  isRepeated: 'no',
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

// 模拟提案数据
const mockProposalsData = [
  {
    id: 1,
    defectCode: 'DEF-202503-0042',
    status: 'pending',
    createDate: '2025-03-10',
    analyst: 'admin',
    department: 'production',
    defectDescription: '在SMT贴片过程中发现芯片偏移现象，偏移位置随机，偏移距离约0.2-0.5mm，影响产品焊接质量和电气性能。',
    defectCause: '经检查发现主要问题来自于设备吸嘴磨损和压力不稳定，导致芯片放置过程中发生轻微位移。同时发现贴片机微调参数未根据不同型号芯片进行针对性设置。',
    problemCategory: 'machine',
    isNpiMissed: 'no',
    isRepeated: 'no',
    rootCause: '1. 吸嘴长期使用导致磨损，吸力不均匀\n2. 设备定期保养制度执行不到位\n3. 操作参数未标准化，依赖操作员经验设置\n4. 缺乏针对不同物料的参数优化方案',
    shortTermMeasures: '1. 立即更换磨损的吸嘴\n2. 重新校准贴片机定位系统\n3. 调整设备气压参数\n4. 增加贴片后的巡检频次\n5. 临时降低设备运行速度',
    longTermMeasures: '1. 修订设备保养计划，明确吸嘴定期更换周期\n2. 建立各型号芯片的参数数据库，规范参数设置\n3. 引入AOI检测设备，提高在线检测能力\n4. 对操作人员进行专业培训\n5. 评估供应商芯片封装质量，优化物料设计',
    verificationMethod: '1. 通过SPC控制图监控贴片偏移量变化趋势\n2. 与标准工艺参数比对验证\n3. 不良率统计分析',
    verificationResult: 'pending'
  },
  {
    id: 2,
    defectCode: 'DEF-202503-0043',
    status: 'pending',
    createDate: '2025-03-12',
    analyst: 'admin',
    department: 'quality',
    defectDescription: 'PCBA测试中发现部分板卡电源模块输出电压不稳定，波动范围超过±5%，导致电路工作异常。',
    defectCause: '初步检测发现电源滤波电容接地不良，同时发现PCB板设计中电源走线过细导致压降过大。',
    problemCategory: 'material',
    isNpiMissed: 'yes',
    isRepeated: 'no',
    rootCause: '1. PCB设计时电源走线宽度不足\n2. 滤波电容封装选型不合适，易松动\n3. 未考虑大电流对电源模块的影响\n4. 设计评审流程不完善，未深入评估电源系统',
    shortTermMeasures: '1. 对现有PCB板增加电源走线压接铜箔\n2. 更换为更高规格的滤波电容\n3. 加强电容焊接工艺控制\n4. 增加电源监测点',
    longTermMeasures: '1. 修订PCB设计规范，增加电源走线宽度要求\n2. 建立电源系统设计评审专项检查表\n3. 优化元器件选型标准\n4. 建立电源系统测试标准流程',
    verificationMethod: '1. 电源波形测试对比\n2. 长时间稳定性测试\n3. 温度循环测试验证',
    verificationResult: 'pending'
  },
  {
    id: 3,
    defectCode: 'DEF-202503-0044',
    status: 'pending',
    createDate: '2025-03-15',
    analyst: 'admin',
    department: 'engineering',
    defectDescription: '产品最终测试中发现散热不良，长时间运行后CPU温度超过85°C，导致系统性能下降甚至关机。',
    defectCause: '散热片与CPU接触不良，导致热传导效率低；同时风扇转速控制逻辑存在缺陷，未能及时提高转速。',
    problemCategory: 'method',
    isNpiMissed: 'no',
    isRepeated: 'yes',
    rootCause: '1. 散热硅脂涂抹量不足且不均匀\n2. 散热片安装压力不足\n3. 风扇控制算法阈值设置过高\n4. 装配工艺文件未明确规定散热模组安装标准',
    shortTermMeasures: '1. 重新制定硅脂涂抹模板和量化标准\n2. 调整风扇控制参数，降低启动阈值\n3. 增加散热片固定螺丝扭力规格\n4. 增加热成像检测工序',
    longTermMeasures: '1. 评估更高效的散热设计方案\n2. 修订散热模组装配工艺文件\n3. 开发自适应风扇控制算法\n4. 建立热设计仿真验证流程',
    verificationMethod: '1. 热成像对比测试\n2. 长时间满载运行温度曲线记录\n3. 不同环境温度下的系统稳定性测试',
    verificationResult: 'pending'
  }
];

// 获取待处理提案列表
const fetchPendingProposals = async () => {
  try {
    // 使用模拟数据
    pendingProposals.value = mockProposalsData.filter(p => p.status === 'pending')
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
    // 从模拟数据中获取对应ID的提案数据
    const proposal = mockProposalsData.find(item => item.id === proposalId)
    if (proposal) {
      // 将找到的提案数据复制到表单中
      Object.keys(proposal).forEach(key => {
        if (key in defectForm) {
          defectForm[key] = proposal[key]
        }
      })
    }
  } catch (error) {
    ElMessage.error('加载提案数据失败')
  }
}

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

      // 提交成功后，从待处理列表中移除当前提案
      pendingProposals.value.splice(currentIndex.value, 1)

      // 如果还有待处理提案，加载下一条；否则重置表单
      if (pendingProposals.value.length > 0) {
        // 如果当前索引超出了新的数组范围，则调整为最后一条
        if (currentIndex.value >= pendingProposals.value.length) {
          currentIndex.value = pendingProposals.value.length - 1
        }
        loadProposalData(pendingProposals.value[currentIndex.value].id)
      } else {
        // 重置表单
        defectFormRef.value.resetFields()
        ElMessage.info('所有提案已处理完成')
      }
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('请完善表单必填项')
  }
}
// 处理取消操作
const handleCancel = () => {
  // 检查表单是否有内容填写
  const isFormEmpty = Object.values(proposalForm).every(value =>
      value === '' || value === 'medium' || value === 'no' ||
      (Array.isArray(value) && value.length === 0)
  )

  if (!isFormEmpty) {
    ElMessageBox.confirm(
        '是否保存当前内容为草稿？',
        '提示',
        {
          confirmButtonText: '保存草稿',
          cancelButtonText: '不保存',
          type: 'warning',
          distinguishCancelAndClose: true
        }
    ).then(() => {
      // 点击"保存草稿"按钮
      saveDraft()
      // 导航回列表页
      router.push('/proposal/analyze')
    }).catch(action => {
      if (action === 'cancel') {
        // 点击"不保存"按钮
        resetForm()
        // 导航回列表页
        router.push('/proposal/analyze')
      }
      // 如果是点击关闭按钮，则不做任何操作
    })
  } else {
    // 如果表单为空，直接导航回列表页
    router.push('/proposal/history')
  }
}
// 草稿操作
const saveDraft = () => {
  // 克隆当前表单数据以避免引用问题
  const draftData = JSON.parse(JSON.stringify(proposalForm))

  // 标记为草稿
  draftData.status = 'draft'
  draftData.savedAt = new Date().toISOString()

  // 保存到本地存储
  localStorage.setItem('proposalAnalysisDraft', JSON.stringify(draftData))

  ElMessage({
    type: 'success',
    message: '已保存为草稿'
  })
}

// 加载草稿
const loadDraft = () => {
  const draftData = localStorage.getItem('proposalAnalysisDraft')
  if (draftData) {
    try {
      const draft = JSON.parse(draftData)
      // 将草稿数据合并到表单
      Object.assign(proposalForm, draft)
      return true
    } catch (error) {
      console.error('加载草稿失败:', error)
      return false
    }
  }
  return false
}

// 清除草稿
const clearDraft = () => {
  localStorage.removeItem('proposalAnalysisDraft')
}

// 重置表单
const resetForm = () => {
  // 重置为空表单
  Object.assign(proposalForm, initEmptyForm())
  // 重置文件列表
  fileList.value = []
  // 如果表单引用存在，则使用Element Plus的重置方法
  if (defectFormRef.value) {
    defectFormRef.value.resetFields()
  }
  // 清除本地存储的草稿
  clearDraft()
}
// 组件挂载时执行
onMounted(() => {
  // 尝试加载草稿数据
  const hasDraft = loadDraft()

  if (hasDraft) {
    ElMessage({
      type: 'info',
      message: '已加载上次保存的草稿'
    })
  }
  // 获取待处理提案列表
  fetchPendingProposals()

  // 如果存在待处理提案，加载第一条
  if (pendingProposals.value.length > 0) {
    loadProposalData(pendingProposals.value[0].id)
  }

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

/* 提案导航样式 */
.proposal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.proposal-navigation {
  display: flex;
  align-items: center;
}

.arrow-navigation {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #409EFF;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-arrow:hover {
  background-color: #66b1ff;
  transform: scale(1.1);
}

.nav-arrow.disabled {
  background-color: #c0c4cc;
  cursor: not-allowed;
}

.nav-arrow.disabled:hover {
  transform: none;
}

.proposal-index {
  font-size: 14px;
  color: #606266;
}
</style>