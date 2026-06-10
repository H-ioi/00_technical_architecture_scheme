import type { AppRouteRecord } from '@/types/route'

/** 校医管理 */
export const schoolDoctorRoute: AppRouteRecord = {
  path: 'school-doctor',
  name: 'SchoolDoctor',
  redirect: '/school-doctor/student-record',
  meta: {
    title: '校医管理',
    titleKey: 'route.schoolDoctor',
    icon: 'FirstAidKit'
  },
  children: [
    {
      path: 'student-record',
      name: 'SchoolDoctorStudentRecord',
      component: () => import('@/views/school-doctor/student-record/list.vue'),
      meta: {
        title: '学生档案',
        titleKey: 'route.schoolDoctorStudentRecord'
      }
    },
    {
      path: 'medical-info',
      name: 'SchoolDoctorMedicalInfo',
      component: () => import('@/views/school-doctor/medical-info/list.vue'),
      meta: {
        title: '医疗信息',
        titleKey: 'route.schoolDoctorMedicalInfo'
      }
    },
    {
      path: 'regulation',
      name: 'SchoolDoctorRegulation',
      component: () => import('@/views/school-doctor/regulation/list.vue'),
      meta: {
        title: '规章制度',
        titleKey: 'route.schoolDoctorRegulation'
      }
    },
    {
      path: 'disease-setting',
      name: 'SchoolDoctorDiseaseSetting',
      component: () => import('@/views/school-doctor/disease-setting/list.vue'),
      meta: {
        title: '疾病设置',
        titleKey: 'route.schoolDoctorDiseaseSetting'
      }
    },
    {
      path: 'visit-record',
      name: 'SchoolDoctorVisitRecord',
      component: () => import('@/views/school-doctor/visit-record/tab.vue'),
      meta: {
        title: '就诊记录',
        titleKey: 'route.schoolDoctorVisitRecord'
      }
    },
    {
      path: 'medicine-apply',
      name: 'SchoolDoctorMedicineApply',
      component: () => import('@/views/school-doctor/medicine-apply/list.vue'),
      meta: {
        title: '用药申请',
        titleKey: 'route.schoolDoctorMedicineApply'
      }
    }
  ]
}
