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
          <a-form-item label="system prompt"
                         name="systemPrompt">
                <a-textarea v-model:value="state.form.systemPrompt"  allow-clear />
                
            </a-form-item>
          <a-form-item label="Item列表">
              <a-table :dataSource="state.form.items" :columns="columns" name="items">


                  <template #prompts="{ text: prompts }">
                  <span v-for="prompt in prompts">
                          <div v-html="prompt.text.replace(/\n/g, '<br>')"></div>
                  </span>
                      
                  </template>


                  <template #operation="{ record }">
                      <a @click="handleEdit(record)">Edit</a>
                      <a-popconfirm
                          
                          title="Sure to delete?"
                          @confirm="handleDelete(record)"
                      >
                          <a style="margin-left:10px">Delete</a>
                      </a-popconfirm>

                  </template>

              </a-table>

              <a-button @click="showModal(true)">添加Item</a-button>
          </a-form-item>
          
<a-modal
  v-model:visible="isModalVisible"
  title="添加Item"
  @ok="handleOk"
  @cancel="handleCancel"
>
  <a-form :model="newItem" style="background-color:#fff;" ref="formRef" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="名称"
                       name="title"
                      
          >
              <a-input v-model:value="newItem.title" allowClear placeholder="请输入名称"/>
      </a-form-item>
     

     
  <!-- <div v-for="(prompt, index) in newItem.prompts" :key="index">
   
    <a-textarea v-model:value="prompt.text"  allow-clear />
    <a-button @click="removePrompt(index)">删除Prompt</a-button>
  </div> -->

      <a-form-item label="Prompts">
          <a-button @click="addPrompt">添加Prompt</a-button>
          <draggable v-model="newItem.prompts"  @start="drag=true" @end="drag=false">
              <div v-for="(prompt, index) in newItem.prompts" :key="index" style="margin-top: 10px;margin-bottom: 10px;border: 1px dashed green;padding: 5px;">
          
                  <a-textarea v-model:value="prompt.text"  allow-clear />
                  <a-button @click="removePrompt(index)" style="margin-top:5px">删除</a-button>
              </div>
          </draggable>
      </a-form-item>

  </a-form>


</a-modal>
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
import {promptsUpdate} from "../../../api/modules/api.prompts";
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
console.log(state.form);
console.log(items);

const onSubmit = async () => {
  try {
    const values = await formRef0.value.validateFields();
    values.id = state.form.id
    values.items = state.form.items
    promptsUpdate(values).then(res => {
      if (res){
        ZyNotification.success('修改成功！')
        emit('close', true)
      }
    })
  } catch (errorInfo) {
    console.log('Failed:', errorInfo);
  }

};


   
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
      title: '',
      prompts: [{ text: '' }]
    });

    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
      },
      {
        title: '提示',
        dataIndex: 'prompts',
        slots: { customRender: 'prompts' },
        // 自定义渲染prompts
        //customRender: ({ record }) => record.prompts.map(p =>p.text).join('')
      },
      {
        title: '操作',
        dataIndex: 'operation',
        slots: { customRender: 'operation' },
      },
    ];
    const handleEdit = (record) => {
        // 弹出一个表单让用户编辑项，这里简化为console输出
        console.log('Editing record', record);
        newItemId.value = items.indexOf(record);
        console.log(newItemId.value);
        console.log(record.value);
        newItem.value = toRefs(record);
        // 实现更新逻辑...
        showModal(true);
    };
    //删除item列表中的某一条数据
    const handleDelete = (record) => {
        console.log("delete",record.title);
        
        for (let i = 0; i < items.length; i++) {
          if (items[i].title === record.title) {
            items.splice(i, 1);
            i--; // 因为数组长度减少了，调整索引
          }
        }
    };
    const showModal = (visible) => {
      isModalVisible.value = visible;
    };

    const handleOk = () => {
        formRef.value
        .validate()
        .then(() => {
            console.log('values', formState, toRaw(formState));
            if(newItemId.value==-1){
                console.log(items);
                items.push({...newItem.value});
                newItem.value = { title: '', prompts: [{ text: '' }] }; // 重置
            }else{

            }
            showModal(false);
        })
        .catch(error => {
          console.log('error', error);
        });
        
    };

    const handleCancel = () => {
      showModal(false);
    };

    const addPrompt = () => {
      newItem.value.prompts.push({ text: '' });
    };

    const removePrompt = (index) => {
      newItem.value.prompts.splice(index, 1);
    };

   


    watch(perms, (newValue) => {
        console.log('Parent component - perms:', newValue);
    });

    
   
    
    
    const close = () => {
        ZyConfirm('还没保存数据，确认退出?').then(ok => {
            if (!ok) return
            emit('close')
        })
    }
</script>

<style scoped>

</style>
