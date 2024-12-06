<template>
    <section class="zy-get">
        <a-form :model="state.form" style="background-color:#fff;" ref="formRef0" :label-col="labelCol"
                :wrapper-col="wrapperCol">
            <a-form-item label="清单名称"
                         name="name"
                         :rules="[{ required: true, message: '请输入名称!' }]"
            >
                <a-input v-model:value="state.form.name" allowClear placeholder="请输入名称"/>
            </a-form-item>
           
            <a-form-item label="question列表">
                <a-table :dataSource="state.form.items" :columns="columns" name="items">
                                <!-- 自定义渲染子问题 -->
                  <template v-slot:bodyCell="{ column, record }">
                    <!-- 检查 column 是否存在以及 dataIndex 是否为 'subquestion' -->
                    <span v-if="column && column.dataIndex === 'subquestion'">
                      <span v-for="prompt in record.subquestion" :key="prompt.id">
                        <div v-html="prompt.text.replace(/\n/g, '<br>')"></div>
                      </span>
                    </span>
                    <!-- 检查 column 是否存在以及 dataIndex 是否为 'operation' -->
                    <span v-else-if="column && column.dataIndex === 'operation'">
                      <a @click="handleEdit(record)">Edit</a>
                      <a-popconfirm
                        title="Sure to delete?"
                        @confirm="handleDelete(record)"
                      >
                        <a style="margin-left:10px">Delete</a>
                      </a-popconfirm>
                    </span>
                    <!-- 如果没有匹配，显示默认内容 -->
                    <span v-else>
                      {{ record[column.dataIndex] }}
                    </span>
                  </template>
                </a-table>
  
                
            </a-form-item>
            
  
            <!-- <a-form-item label="角色备注" name="remark">
                <a-textarea v-model:value="state.form.remark" allowClear placeholder="请输入角色备注"/>
            </a-form-item> -->
        </a-form>
        
    </section>
  </template>
  
  
  <script setup>
  import {ref, watch, reactive, toRaw,toRefs } from 'vue';
  
  import {ZyConfirm, ZyNotification} from "../../../libs/util.toast";
  import {promptsUpdate} from "../../../api/modules/api.prompts";
  import { Modal as AModal, Button as AButton, Input as AInput, Table as ATable } from 'ant-design-vue';
  import 'ant-design-vue/dist/antd.css';
  
  
  
  const labelCol = {
    style: {
      width: '100px',
    },
  }
  const wrapperCol = {
    span: 14,
  }
  
  const state = reactive({
    form: {}
  });
  const formRef0 = ref();
  const formRef = ref();
  const props = defineProps({
    viewData: {
      type: Object,
      default: () => {
      }
    }
  })
  const emit = defineEmits(['close'])
  
  state.form = props.viewData || {}
  const items = state.form.items
  
  
     
      const perms = ref(['sys:users']);
      const formState = reactive({
        name: '',
        region: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      });
      const rules = {
        title: [
          { required: true, message: 'Please input name', trigger: 'blur' },
          
        ],
      };
      const isModalVisible = ref(false);
      
      const newItemId = ref(-1);
      const newItem = ref({
        question: '',
        subquestion: [{ text: '' }]
      });
  
      const columns = [
        {
          title: '问题',
          dataIndex: 'question',
        },
        {
          title: '子问题',
          dataIndex: 'subquestion',
         
        },
        
      ];
      
     
      
  
      
  
      watch(perms, (newValue) => {
          console.log('Parent component - perms:', newValue);
      });
  
      
     
      
      
      
  </script>
  
  <style scoped>
  
  </style>
  