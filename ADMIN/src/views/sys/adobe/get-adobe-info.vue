<template>
    <section class="zy-get">
        <a-form :model="state.form" style="background-color:#fff;" ref="formRef0" :label-col="labelCol"
                :wrapper-col="wrapperCol">
                <a-form-item label="Key"
                         name="client_id"
                         :rules="[{ required: true, message: '请输入Key!' }]"
            >
                <a-input v-model:value="state.form.client_id" allowClear placeholder="请输入Key"/>
            </a-form-item>
            <a-form-item label="Secret"
                         name="client_secret"
                         :rules="[{ required: true, message: '请输入Secret!' }]"
            >
                <a-input v-model:value="state.form.client_secret" allowClear placeholder="请输入Secret"/>
                
            </a-form-item>
            <a-form-item label="次数"
                         name="num"
                         :rules="[{ required: true, message: '请输入剩余次数!' }]"
            >
                <a-input v-model:value="state.form.num" allowClear placeholder="请输入剩余次数"/>
                
            </a-form-item>
            
  
  
  
 
            <!-- <a-form-item label="角色备注" name="remark">
                <a-textarea v-model:value="state.form.remark" allowClear placeholder="请输入角色备注"/>
            </a-form-item> -->
        </a-form>
        <ZyFormButton @save="onSubmit" @close="close"/>
    </section>
  </template>
  
  
  <script setup>
  import {ref, watch, reactive, toRaw,toRefs } from 'vue';
  import ZyPermTree from "comps/common/ZyPermTree.vue";
  import ZyFormButton from "comps/common/ZyFormButton.vue";
  import {ZyConfirm, ZyNotification} from "../../../libs/util.toast";
  import {adobeUpdate} from "../../../api/modules/api.adobe";
  import { Modal as AModal, Button as AButton, Input as AInput, Table as ATable } from 'ant-design-vue';
  import 'ant-design-vue/dist/antd.css';
  import {VueDraggableNext as draggable} from 'vue-draggable-next';
  
  
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
    updateData: {
      type: Object,
      default: () => {
      }
    }
  })
  const emit = defineEmits(['close'])
  
  state.form = props.updateData || {}
  const items = state.form.items

  
  const onSubmit = async () => {
    try {
      const values = await formRef0.value.validateFields();
      values.id = state.form.id
      values.items = state.form.items
      adobeUpdate(values).then(res => {
        if (res){
          ZyNotification.success('修改成功！')
          emit('close', true)
        }
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  
  };
  
  
   
      

      
      const close = () => {
          ZyConfirm('还没保存数据，确认退出?').then(ok => {
              if (!ok) return
              emit('close')
          })
      }
  </script>
  
  <style scoped>
  
  </style>
  