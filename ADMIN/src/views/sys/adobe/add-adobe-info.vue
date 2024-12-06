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
   
    import ZyFormButton from "comps/common/ZyFormButton.vue";
    import {ZyConfirm, ZyNotification} from "../../../libs/util.toast";
    import {adobeCreate} from "../../../api/modules/api.adobe";
    import { Modal as AModal, Button as AButton, Input as AInput, Table as ATable } from 'ant-design-vue';
    import 'ant-design-vue/dist/antd.css';

   
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
    const items = ref([]);
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
        newItemId.value = items.value.indexOf(record);
        console.log(newItemId.value);
        console.log(record.value);
        newItem.value = toRefs(record);
        // 实现更新逻辑...
        showModal(true);
    };
    //删除item列表中的某一条数据
    const handleDelete = (record) => {
        console.log("delete",record.title);
        items.value = items.value.filter(item => item.title !== record.title);
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
                items.value.push({...newItem.value});
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

    const labelCol = {
        style: {
            width: '100px',
        },
    }
    const wrapperCol = {
        span: 14,
    }


    const props = defineProps({})
    const emit = defineEmits(['close'])
    const formRef0 = ref();
    const formRef = ref();

    const state = reactive({
        form: {}
    });
    const onSubmit = async () => {
        try {
            const values = await formRef0.value.validateFields();
            values.items = items.value;
            console.log(values);
            
            adobeCreate(values).then(res => {
                ZyNotification.success('添加成功！')
                emit('close',true)
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
