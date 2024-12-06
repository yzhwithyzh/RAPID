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
  
                <a-button @click="addQuestion">添加question</a-button>
            </a-form-item>
            
  <a-modal
    v-model:visible="isModalVisible"
    title="添加question"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :model="newItem" style="background-color:#fff;" ref="formRef" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="section"
                        name="section">
              <a-input v-model:value="newItem.section" allowClear placeholder="请输入section"/>
      </a-form-item>
      <a-form-item label="topic"
                        name="topic">
              <a-input v-model:value="newItem.topic" allowClear placeholder="请输入topic"/>
      </a-form-item>
      <a-form-item label="序号"
                        name="serial">
              <a-input v-model:value="newItem.serial" allowClear placeholder="请输入序号"/>
      </a-form-item>
      <a-form-item label="问题"
                         name="question">
                <a-input v-model:value="newItem.question" allowClear placeholder="请输入名称"/>
        </a-form-item>
        <a-form-item label="描述"
                         name="description">
                <!-- <a-input v-model:value="newItem.description" allowClear placeholder="请输入描述"/> -->
                <a-textarea v-model:value="newItem.description"  allow-clear />
        </a-form-item>
  
        
    <!-- <div v-for="(prompt, index) in newItem.prompts" :key="index">
     
      <a-textarea v-model:value="prompt.text"  allow-clear />
      <a-button @click="removePrompt(index)">删除Prompt</a-button>
    </div> -->
    
        <a-form-item label="子问题">
          <a-spin :spinning="spinning">
            <a-button @click="geSubquestion(index)">生成子问题</a-button>
            <a-button @click="addSubquestion" style="margin-left:20px">添加子问题</a-button>
            <draggable v-model="newItem.subquestion"  @start="drag=true" @end="drag=false">
                <div v-for="(one, index) in newItem.subquestion" :key="index" style="margin-top: 10px;margin-bottom: 10px;border: 1px dashed green;padding: 5px;">
            
                    <a-textarea v-model:value="one.text"  allow-clear />
                    <a-button @click="removeOne(index)" style="margin-top:5px">删除</a-button>
                </div>
            </draggable>
          </a-spin>
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
  import {updateOne,createOne,generateSubquestion} from "../../../api/modules/api.checklist";
  import { Modal as AModal, Button as AButton, Input as AInput, Table as ATable } from 'ant-design-vue';
  import 'ant-design-vue/dist/antd.css';
  import {VueDraggableNext as draggable} from 'vue-draggable-next';
  
  
  const labelCol = {
    style: {
      width: '100px',
    },
  }
  const wrapperCol = {
    span: 20,
  }
  
  const state = reactive({
    form: {},
    
  });
  const spinning = ref(false);
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
  
  state.form = props.updateData || {items:[]}
  const items = state.form.items
  console.log(state.form);
  console.log(items);
  
  const onSubmit = async () => {
    try {
      const values = await formRef0.value.validateFields();
      if(state.form.id){
        values.id = state.form.id
        values.items = state.form.items
       
        values.items.sort((a, b) => {
          
          // 正则表达式匹配数字和字母部分
          const regex = /(\d+)([a-z]*)/;

          const matchA = a.serial ? a.serial.match(regex) : null;
          const matchB = b.serial ? b.serial.match(regex) : null;

          // 如果没有匹配到，返回 0，避免抛出错误
          if (!matchA || !matchB) return 0;

          const [_, numA, letterA] = matchA;
          const [__, numB, letterB] = matchB;


          // 比较数字部分
          const numComparison = parseInt(numA) - parseInt(numB);
          if (numComparison !== 0) {
            return numComparison;
          }

          // 如果数字相同，比较字母部分
          return letterA.localeCompare(letterB);
        });

       
        updateOne(values).then(res => {
          if (res){
            ZyNotification.success('修改成功！')
            emit('close', true)
          }
        })
      }else{
        values.items = state.form.items
        
        values.items.sort((a, b) => {
          
          // 正则表达式匹配数字和字母部分
          const regex = /(\d+)([a-z]*)/;

          const matchA = a.serial ? a.serial.match(regex) : null;
          const matchB = b.serial ? b.serial.match(regex) : null;

          // 如果没有匹配到，返回 0，避免抛出错误
          if (!matchA || !matchB) return 0;

          const [_, numA, letterA] = matchA;
          const [__, numB, letterB] = matchB;


          // 比较数字部分
          const numComparison = parseInt(numA) - parseInt(numB);
          if (numComparison !== 0) {
            return numComparison;
          }

          // 如果数字相同，比较字母部分
          return letterA.localeCompare(letterB);
        });

        createOne(values).then(res => {
          if(res){
            ZyNotification.success('添加成功！')
            emit('close', true)
          }

        })
      }
      
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  
  };
  
  
     
   
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
        question: [
          { required: true, message: '请输入问题', trigger: 'blur' },
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' },
        ],
        // subquesiton: [
        //   { required: true, message: '请生成子问题', trigger: 'blur' },
        // ],
      };
      const isModalVisible = ref(false);
      
      const newItemId = ref(-1);
      const newItem = ref({
        
        subquestion: []
      });
      // 定义columns类型
    const columns = ref([
      {
        title: '序号',
        dataIndex: 'serial',
        key: 'serial',
      },
      {
        title: '问题',
        dataIndex: 'question',
        key: 'question',
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '子问题',
        dataIndex: 'subquestion',
        key: 'subquestion',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
      },
    ]);

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
          console.log("delete",record.question);
          
          for (let i = 0; i < items.length; i++) {
            if (items[i].question === record.question) {
              items.splice(i, 1);
              i--; // 因为数组长度减少了，调整索引
            }
          }
      };
      const showModal = (visible) => {
        isModalVisible.value = visible;
      };
      const addQuestion = ()=>{
        
        newItemId.value = -1;
        newItem.value = { question: '', subquestion: [{ text: '' }] };
        showModal(true)
      };
      const handleOk = () => {
          formRef.value
          .validate()
          .then(() => {
              console.log('values', newItemId.value);
              if(newItemId.value==-1){
                  console.log(items);
                  items.push({...newItem.value});
                  newItem.value = { question: '', subquestion: [{ text: '' }] }; // 重置
              }else{
                  console.log(newItem.value)
                  items[newItemId.value] = newItem.value
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
  
      const addSubquestion = () => {
        newItem.value.subquestion.push({ text: '' });
      };
  
      const removeOne = (index) => {
        newItem.value.subquestion.splice(index, 1);
      };

      const geSubquestion = (index)=>{
        let data = {
          "question":newItem.value.question,
          "description":newItem.value.description
        }
        console.log(data);
        if(!newItem.value.question || !newItem.value.description){
          ZyNotification.error('请输入问题和描述')
          return;
        }
        spinning.value = true
        generateSubquestion(data).then(res => {
            if (res){
              //newItem.value.subquestion = []
              res.data.forEach(item => {
                  newItem.value.subquestion.push({ text: item });
              });
            }
            spinning.value = false
          })
          

      }
     
  
      
     
      
      
      const close = () => {
          ZyConfirm('还没保存数据，确认退出?').then(ok => {
              if (!ok) return
              emit('close')
          })
      }
  </script>
  
  <style scoped>
  
  </style>
  