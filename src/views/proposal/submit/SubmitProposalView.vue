<!-- src/views/proposal/submit/SubmitDefectProposalView.vue -->
<template>
  <div class="submit-proposal-container">
    <el-card class="submit-card">
      <template #header>
        <div class="card-header">
          <span class="header-title">新建提案</span>
          <div class="header-actions">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="submitForm" :loading="loading">提交</el-button>
            <el-button type="primary" @click="exportToExcel">导出 Excel</el-button>

          </div>
        </div>
      </template>

      <el-form
          ref="proposalFormRef"
          :model="proposalForm"
          :rules="proposalRules"
          label-width="120px"
          label-position="right"
          class="form-grid"
      >
        <!-- 基本信息 -->
        <el-divider content-position="left">基本信息</el-divider>
        <el-form-item label="异常概述" prop="overView">
          <el-input v-model="proposalForm.overView" placeholder="请输入异常概述"/>
        </el-form-item>
        <el-form-item label="制程段别" prop="process">
          <el-select v-model="proposalForm.process" placeholder="请输入制程段别" style="width: 100%">
            <el-option v-for="item in processOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="不良位置" prop="defectLocation">
          <el-select v-model="proposalForm.defectLocation" placeholder="请选择不良位置" style="width: 100%">
            <el-option v-for="item in defectLocations" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="不良现象" prop="defectCategory">
          <el-select v-model="proposalForm.defectCategory" placeholder="请选择不良现象" style="width: 100%">
            <el-option v-for="item in defectCategories" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="首次发生时间" prop="firstOccurrenceTime">
          <el-date-picker
              v-model="proposalForm.firstOccurrenceTime"
              type="datetime"
              placeholder="请选择时间"
              format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-radio-group v-model="proposalForm.priority">
            <el-radio label="high">高</el-radio>
            <el-radio label="medium">中</el-radio>
            <el-radio label="low">低</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 生产信息 -->
        <el-divider content-position="left">生产信息</el-divider>

        <el-form-item label="线别" prop="line">
          <el-select v-model="proposalForm.line" placeholder="请选择线别" style="width: 100%">
            <el-option v-for="item in lineOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="站别" prop="station">
          <el-select v-model="proposalForm.station" placeholder="请选择站别" style="width: 100%">
            <el-option v-for="item in stationOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="发生工单" prop="orderNumber">
          <el-input v-model="proposalForm.orderNumber" placeholder="请输入发生工单"/>
        </el-form-item>

        <el-form-item label="工单批量" prop="batchSize">
          <el-input v-model="proposalForm.batchSize" placeholder="请输入工单批量"/>
        </el-form-item>

        <!-- 统计数据 -->
        <el-divider content-position="left">统计数据</el-divider>

        <el-form-item label="过站数" prop="passCount">
          <el-input v-model="proposalForm.passCount" placeholder="请输入过站数"/>
        </el-form-item>

        <el-form-item label="不良数" prop="defectCount">
          <el-input v-model="proposalForm.defectCount" placeholder="请输入不良数"/>
        </el-form-item>

        <el-form-item label="不良率" prop="defectRate">
          <el-input v-model="proposalForm.defectRate" placeholder="请输入不良率"/>
        </el-form-item>

        <el-form-item label="客户" prop="customer">
          <el-input v-model="proposalForm.customer" placeholder="请输入客户"/>
        </el-form-item>


        <!-- 责任人信息 -->
        <el-divider content-position="left">责任人信息</el-divider>

        <el-form-item label="分析单位" prop="analysisUnit">
          <el-input v-model="proposalForm.analysisUnit" placeholder="请输入分析单位"/>
        </el-form-item>

        <el-form-item label="分析人" prop="analyst">
          <el-input v-model="proposalForm.analyst" placeholder="请输入分析人"/>
        </el-form-item>

        <el-form-item label="QE负责人" prop="qeLeader">
          <el-input v-model="proposalForm.qeLeader" placeholder="请输入QE负责人"/>
        </el-form-item>

        <el-form-item label="提案人" prop="proposer">
          <el-input v-model="proposalForm.proposer" placeholder="请输入提案人"/>
        </el-form-item>

        <el-form-item label="CFT名称" prop="cftName">
          <el-input v-model="proposalForm.cftName" placeholder="请输入CFT名称"/>
        </el-form-item>

        <!-- 详细说明 -->
        <el-divider content-position="left">详细说明</el-divider>

        <el-form-item label="备注" prop="remarks" class="full-width">
          <el-input
              v-model="proposalForm.remarks"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
          />
        </el-form-item>

        <!-- 附件上传 -->
        <el-divider content-position="left">附件资料</el-divider>

        <el-form-item label="不良图片" class="full-width">
          <el-upload
              action="#"
              :auto-upload="true"
              :file-list="fileList"
              :on-change="handleFileChange"
              :on-remove="handleFileRemove"
              :on-success="handleSuccess"
              :on-error="handleError"
              multiple
              drag
          >
            <el-icon class="el-icon--upload">
              <upload-filled/>
            </el-icon>
            <div class="el-upload__text">
              点击或者拖动文件到该区域来上传
            </div>
            <template #tip>
              <div class="el-upload__tip">
                请不要上传敏感数据
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useRouter} from 'vue-router'
import {UploadFilled} from '@element-plus/icons-vue'
import {useProposalStore} from '@/store/proposal'
import {formatDate} from '@/utils/formatters'
import * as XLSX from "xlsx";
import {saveAs} from "file-saver";

const router = useRouter()
const proposalStore = useProposalStore()

const proposalFormRef = ref(null)
const loading = ref(false)
const fileList = ref([])

// 制程段别选项
const processOptions = [
  {value: 'process1', label: '前制程'},
  {value: 'process2', label: '中制程'},
  {value: 'process3', label: '后制程'},
  {value: 'process4', label: '包装'}
]

// 不良位置选项
const defectLocations = [
  {value: 'location1', label: '表面'},
  {value: 'location2', label: '内部'},
  {value: 'location3', label: '边缘'},
  {value: 'location4', label: '连接处'}
]

// 不良现象选项
const defectCategories = [
  {value: 'category1', label: '划伤'},
  {value: 'category2', label: '气泡'},
  {value: 'category3', label: '异物'},
  {value: 'category4', label: '变形'}
]

// 线别选项
const lineOptions = [
  {value: 'line1', label: 'A线'},
  {value: 'line2', label: 'B线'},
  {value: 'line3', label: 'C线'},
  {value: 'line4', label: 'D线'}
]

// 站别选项
const stationOptions = [
  {value: 'station1', label: '站点1'},
  {value: 'station2', label: '站点2'},
  {value: 'station3', label: '站点3'},
  {value: 'station4', label: '站点4'}
]

// 初始化空表单
const initEmptyForm = () => {
  return {
    overView: '',
    process: '',
    defectLocation: '',
    defectCategory: '',
    firstOccurrenceTime: '',
    line: '',
    station: '',
    orderNumber: '',
    batchSize: '',
    passCount: '',
    defectCount: '',
    defectRate: '',
    customer: '',
    analysisUnit: '',
    analyst: '',
    qeLeader: '',
    proposer: '',
    cftName: '',
    remarks: '',
    priority: 'medium',
    isNpiMissed: 'no',
    isRepeated: 'no',
    defectImages: [],
    status: 'draft' // 新增状态字段，用于标识是否为草稿
  }
}


// 导出 Excel 方法
// 需要填充的数据
const tableData = ref([
  {name: "张三", department: "质量管理部", employeeId: "123456"},
  {name: "李四", department: "生产部", employeeId: "654321"},
]);

const exportToExcel = async () => {
  // 1️⃣ 读取 Excel 模板
  const response = await fetch("/test.xlsx");
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, {type: "array"});

  // 2️⃣ 选择第一个工作表
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // 3️⃣ 填充数据到 Excel（确保不覆盖原有数据）
  const dataArray = tableData.value.map(item => [item.name, item.department, item.employeeId]);

  // ✅ 使用 `XLSX.utils.sheet_add_aoa` 批量填充，防止遗漏单元格
  XLSX.utils.sheet_add_aoa(worksheet, dataArray, {origin: "A2"}); // 从 A2 开始写入数据

  // 4️⃣ 生成新的 Excel 并下载
  const excelBuffer = XLSX.write(workbook, {bookType: "xlsx", type: "array"});
  saveAs(new Blob([excelBuffer]), "导出的Excel.xlsx");
};
const proposalForm = reactive(initEmptyForm())

// 草稿操作
const saveDraft = () => {
  console.log('----')
  // 克隆当前表单数据以避免引用问题
  const draftData = JSON.parse(JSON.stringify(proposalForm))
  console.log(draftData)
  // 标记为草稿
  draftData.status = 'draft'
  draftData.savedAt = new Date().toISOString()
  console.log(draftData)
  // 保存到本地存储
  localStorage.setItem('proposalDraft', JSON.stringify(draftData))

  ElMessage({
    type: 'success',
    message: '已保存为草稿'
  })
}

// 加载草稿
const loadDraft = () => {
  const draftData = localStorage.getItem('proposalDraft')
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
  localStorage.removeItem('proposalDraft')
}

// 重置表单
const resetForm = () => {
  // 重置为空表单
  Object.assign(proposalForm, initEmptyForm())
  // 重置文件列表
  fileList.value = []
  // 如果表单引用存在，则使用Element Plus的重置方法
  if (proposalFormRef.value) {
    proposalFormRef.value.resetFields()
  }
  // 清除本地存储的草稿
  clearDraft()
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
      router.push('/proposal/submit')
    }).catch(action => {
      if (action === 'cancel') {
        // 点击"不保存"按钮
        resetForm()
        // 导航回列表页
        router.push('/proposal/submit')
      }
      // 如果是点击关闭按钮，则不做任何操作
    })
  } else {
    // 如果表单为空，直接导航回列表页
    router.push('/proposal/history')
  }
}

// 表单验证规则
const proposalRules = reactive({
  overView: [
    {required: true, message: '请输入异常概述', trigger: 'blur'}
  ],
  process: [
    {required: true, message: '请选择制程段别', trigger: 'change'}
  ],
  defectLocation: [
    {required: true, message: '请选择不良位置', trigger: 'change'}
  ],
  defectCategory: [
    {required: true, message: '请选择不良现象', trigger: 'change'}
  ],
  firstOccurrenceTime: [
    {required: true, message: '请选择首次发生时间', trigger: 'change'}
  ],
  line: [
    {required: true, message: '请选择线别', trigger: 'change'}
  ],
  priority: [
    {required: true, message: '请选择优先级', trigger: 'change'}
  ],
  station: [
    {required: true, message: '请选择站别', trigger: 'change'}
  ],
  orderNumber: [
    {required: true, message: '请输入发生工单', trigger: 'blur'}
  ],
  batchSize: [
    {required: true, message: '请输入工单批量', trigger: 'blur'},
    {pattern: /^\d+$/, message: '工单批量必须为数字', trigger: 'blur'}
  ],
  passCount: [
    {required: true, message: '请输入过站数', trigger: 'blur'},
    {pattern: /^\d+$/, message: '过站数必须为数字', trigger: 'blur'}
  ],
  defectCount: [
    {required: true, message: '请输入不良数', trigger: 'blur'},
    {pattern: /^\d+$/, message: '不良数必须为数字', trigger: 'blur'}
  ],
  defectRate: [
    {required: true, message: '请输入不良率', trigger: 'blur'},
    {pattern: /^\d+(\.\d+)?%?$/, message: '不良率格式不正确', trigger: 'blur'}
  ],
  analyst: [
    {required: true, message: '请输入分析人', trigger: 'blur'}
  ],
  qeLeader: [
    {required: true, message: '请输入QE负责人', trigger: 'blur'}
  ],
  proposer: [
    {required: true, message: '请输入提案人', trigger: 'blur'}
  ],
  isNpiMissed: [
    {required: true, message: '请选择是否NPI漏失', trigger: 'change'}
  ],
  isRepeated: [
    {required: true, message: '请选择是否重复发生', trigger: 'change'}
  ]
})

// 获取初始数据
onMounted(async () => {
  // 尝试加载草稿数据
  const hasDraft = loadDraft()

  if (hasDraft) {
    ElMessage({
      type: 'info',
      message: '已加载上次保存的草稿'
    })
  }

  // 实际应用中，这里应该从API获取各种选项列表
  // try {
  //   const [processResponse, locationsResponse, categoriesResponse] = await Promise.all([
  //     getProcessOptions(),
  //     getDefectLocations(),
  //     getDefectCategories()
  //   ])
  //   processOptions.value = processResponse.data
  //   defectLocations.value = locationsResponse.data
  //   defectCategories.value = categoriesResponse.data
  // } catch (error) {
  //   ElMessage.error('获取基础数据失败')
  // }
})

// 文件上传处理
// 文件选择时的处理函数
const handleFileChange = (file, fileListFromComponent) => {
  const isJPGorPNG = file.type === "image/jpeg" || file.type === "image/png";
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPGorPNG) {
    ElMessage.error("只能上传 JPG/PNG 格式的图片");
    return;
  }
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过 2MB");
    return;
  }
  // 校验通过后再手动更新 fileList
  fileList.value.push(file);
};


const handleFileRemove = (file) => {
  const index = fileList.value.findIndex(item => item.uid === file.uid)
  if (index !== -1) {
    fileList.value.splice(index, 1)
  }
}


// 上传成功回调
const handleSuccess = (response, file) => {
  ElMessage.success(`文件 ${file.name} 上传成功！`);
}

// 上传失败回调
const handleError = () => {
  ElMessage.error("上传失败，请重试！");
}

// 提交表单
const submitForm = async () => {
  if (!proposalFormRef.value) return

  try {
    await proposalFormRef.value.validate()

    loading.value = true

    // 处理文件上传
    // 实际应用中，应该先上传附件，然后获取文件ID
    const attachmentIds = []

    // 处理提案数据
    const proposalData = {
      ...proposalForm,
      status: 'submitted', // 将状态更改为已提交
      attachments: attachmentIds,
      firstOccurrenceTime: formatDate(proposalForm.firstOccurrenceTime, 'YYYY-MM-DD HH:mm:ss')
    }

    // 提交提案
    await proposalStore.submitProposal(proposalData)

    // 清除草稿
    clearDraft()

    ElMessage({
      type: 'success',
      message: '提案提交成功！'
    })

    // 提交成功后询问是否继续添加
    ElMessageBox.confirm('提案已成功提交，是否继续添加新提案？', '提示', {
      confirmButtonText: '继续添加',
      cancelButtonText: '查看提案列表',
      type: 'info'
    }).then(() => {
      // 重置表单
      resetForm()
    }).catch(() => {
      // 跳转到提案列表
      router.push('/proposal/submit')
    })
  } catch (error) {
    console.error('Submit error:', error)
    ElMessage.error(error.message || '提交失败，请检查表单')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.submit-proposal-container {
  padding: 20px;
}

.submit-card {
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

.header-actions {
  display: flex;
  gap: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

/* 让某些字段占据整行 */
.form-grid .el-form-item.full-width,
.form-grid .el-divider {
  grid-column: span 2;
}

/* 让分割线上下有更多空间 */
.el-divider {
  margin-top: 12px;
  margin-bottom: 12px;
}

/* 分割线标题样式 */
.el-divider__text {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-grid .el-form-item,
  .form-grid .el-divider {
    grid-column: span 1;
  }
}

.el-upload__text {
  margin: 10px 0;
  font-size: 14px;
  color: #606266;
}

.el-upload__tip {
  font-size: 12px;
  color: #909399;
  margin-top: 7px;
}
</style>