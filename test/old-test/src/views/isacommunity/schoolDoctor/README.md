# 校医管理模块

## 模块概述

校医管理模块用于学校医疗机构对学生健康进行全面管理，包含学生健康档案、就诊记录、体检报告、传染病防控等功能。

## 目录结构

```
schoolDoctor/
├── studentRecord/         # 学生档案
│   └── list.vue
├── visitRecord/           # 就诊记录
│   └── list.vue
├── healthReport/          # 体检报告
│   └── list.vue
├── infectiousDisease/     # 传染病管理
│   └── list.vue
├── medicineApply/         # 用药申请
│   └── list.vue
├── diseaseSetting/        # 疾病设置
│   └── list.vue
├── regulation/            # 规章制度
│   └── list.vue
└── infoUpload/            # 信息上传
    └── list.vue
```

## 功能说明

### 1. 学生档案 (studentRecord)
- 管理全校学生的健康档案
- 支持导入导出功能
- 包含学生基本信息、体检状态等
- 操作：新增、编辑、查看、体检记录

### 2. 就诊记录 (visitRecord)
- 记录学生在校就医情况
- 支持按日期范围查询
- 包含就诊时间、症状、诊断结果、处理方式等
- 操作：新增、编辑、查看详情

### 3. 体检报告 (healthReport)
- 管理学生年度体检报告
- 支持按学年筛选
- 支持批量导入体检数据
- 操作：新增、编辑、查看报告、打印

### 4. 传染病管理 (infectiousDisease)
- 记录和跟踪传染病病例
- 支持按疾病类型筛选
- 显示当前学期传染病统计预警
- 操作：新增、编辑、查看详情、复课登记

### 5. 用药申请 (medicineApply)
- 管理学生在校用药申请
- 支持审核流程
- 包含药品名称、服用剂量、审核状态等
- 操作：新增、查看详情、审核

### 6. 疾病设置 (diseaseSetting)
- 维护疾病类型字典
- 配置疾病分类、是否传染病、建议隔离天数等
- 操作：新增、编辑、删除

### 7. 规章制度 (regulation)
- 管理校医相关规章制度
- 包含制度类型、发布人、发布时间等
- 操作：新增、编辑、查看、删除

### 8. 信息上传 (infoUpload)
- 统一管理健康相关文件资料
- 支持多种文件类型：健康档案模板、体检表、传染病报表等
- 支持文件上传、下载、预览
- 操作：上传、下载、预览、删除

## 路由配置

| 路径 | 名称 | 说明 |
|------|------|------|
| /schoolDoctor/studentRecord | 学生档案 | 学生健康档案管理 |
| /schoolDoctor/visitRecord | 就诊记录 | 学生就诊记录管理 |
| /schoolDoctor/healthReport | 体检报告 | 学生体检报告管理 |
| /schoolDoctor/infectiousDisease | 传染病管理 | 传染病病例跟踪管理 |
| /schoolDoctor/medicineApply | 用药申请 | 学生在校用药申请审核 |
| /schoolDoctor/diseaseSetting | 疾病设置 | 疾病类型字典配置 |
| /schoolDoctor/regulation | 规章制度 | 校医相关规章制度管理 |
| /schoolDoctor/infoUpload | 信息上传 | 健康资料文件管理 |

## 后续扩展

每个模块目录下可继续添加以下页面：
- `edit.vue` - 新增/编辑页面
- `detail.vue` - 详情页面
- `components/` - 公共组件目录
