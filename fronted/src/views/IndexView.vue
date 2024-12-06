<style scoped>
.demo-1-hero {
    display: grid;
    align-items: center;
    align-content: center;
    min-height: 0px;
    text-align: center;
}

.contactusblockpair-1 {
    display: block;
   
}

/*.accordion-button:not(.collapsed) {
    color: #484848;
    background-color: #e7f1ff00;
    box-shadow: inset 0 calc(-1 * var(--bs-accordion-border-width)) 0 var(--bs-accordion-border-color);
}*/

.accordion-button {
    padding: 5px 15px;
    font-size: 1rem;
    font-weight: 800;
    color: var(--bs-accordion-active-color);
}

.accordion-body {
    padding: 10px 15px;
    font-size: .9rem;
}

.accordion-body p {
    border-bottom: 1px #adb5bd dashed;
}

.accordion {
    --bs-accordion-bg: #ffffff4a;
}

.title_1 {
    color: #ce0c05
}

.res .nav .nav-link {
    color: var(--bs-gray-700);
}

.res .nav .active {
    color: var(--bs-link-color);
    background-color: #fff0;
    border-bottom-color: #eef0f4;
}
::v-deep .el-select__wrapper.is-filterable {
    height: 48px!important;
}
::v-deep .el-message--error{
    z-index: 9999!important;
}
</style>

<template>

   
<section class="demo-1-hero ">
    
    <div class="container">
        <div class="row vcenter">
            <div class="col-lg-12">
                <div class="hero-content">
                    <h2  data-delay="40" style="font-size: 32px">
                        ADVANCED (<span class="title_1">A</span>I-<span class="title_1">D</span>riven de<span class="title_1">V</span>elopment and <span class="title_1">A</span>ssessme<span class="title_1">N</span>t of
health<span class="title_1">C</span>are guid<span class="title_1">E</span>lines and stan<span class="title_1">D</span>ards)
                    </h2>
                    <p class="mt20"  data-delay="600" style="font-size: 16px;">
                        ADVANCED - 人工智能驱动的健康指南和标准的制订与评估

                    </p>                        
                       
                </div>
            </div>
        </div>
    </div>
</section> 

<section class="sec-pad position-relative" style="margin-bottom:70px">
    
    <div class="container index-up">
        <div class="row">
            <div class="col-lg-12">
                <div class="contactusblockpair-1 shadow roundimg">
                    <div class="formblockz">
                        <div class="form-block rundalform">
                            <h4 class="mb10">上传文件</h4>
                            <p class="mb30">目前支持 WORD和PDF</p>
                            <ul id="filelist"></ul>
                            <form action="#" id="contactform" method="post" data-gtm-form-interact-id="0">
                                <div class="input-group">
                                    <input type="text" v-model="fileName" class="form-control" disabled placeholder="点击右侧选择文件" style="margin: auto;height:48px;"  id="file_input">
                                    <!-- <input type="hidden" value="" id="file_path">
                                    <el-button type="primary">点击我</el-button>
                                    
                                    <button class="btn btn-primary" id="act_run" style=" border-left: 1px #d3d3d3 solid; border-top-right-radius: 6px;border-bottom-right-radius: 6px;" type="button">运行</button> -->
                                    <el-upload
                                        ref="upload"
                                        class="upload-demo"
                                        action="http://localhost:3001/api/web/upload"
                                        :limit="1"
                                        :on-preview	="handleSuccess"
                                        :on-change="handleChange"
                                        :on-exceed="handleExceed"
                                        
                                        :auto-upload="false"
                                        :show-file-list="false"
                                        
                                    >
                                        <template #trigger >
                                        <el-button type="primary" style="height:48px">请选择文件</el-button>
                                        </template>
                                        
                                    </el-upload>
                                    

                                </div>
                                


                            </form>
                            
                        </div>
                        <div class="" style="margin-top: 20px;text-align: left;">
                                   
                                   <el-select
                                       v-model="promptsValue"
                                       filterable
                                       placeholder="请选择清单"
                                       style="width: 240px"

                                   >
                                       <el-option
                                       v-for="item in promptsOptions"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value"
                                       />
                                   </el-select>
                                   <el-select
                                       v-model="llmValue"
                                       filterable
                                       placeholder="请选择模型"
                                       style="width: 240px;margin-left:20px"

                                   >
                                       <el-option
                                       v-for="item in llmOptions"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value"
                                       />

                                   </el-select>
                                   <el-button class="ml-3" type="success" @click="submitUpload" style="right:40px;height:48px;position:absolute;width:100px" >
                                        上传
                                    </el-button>
                               </div>
                    </div>
                
                </div>
            </div>
        </div>
    </div>
</section>

</template>
<script lang="ts">
  export default {
    name: 'IndexView',
  };
  
  </script>
  <script setup lang="ts">
  import { ref,toRaw,reactive, onMounted, watch } from 'vue';
  import { genFileId ,ElLoading,ElMessage} from 'element-plus';
  import type { UploadFile, UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
  import { promptsList} from "../api/modules/api.prompts";
 
  const promptsValue = ref('')
  const llmValue = ref('')
  const promptsOptions = ref([])
  const llmOptions = ref([
    {value:"o1-mini",label:'o1-mini'},
    {value:'gpt-4o',label:'gpt-4o'},
    {value:'gpt-4-0125-preview',label:'gpt-4-0125-preview'},
    {value:'gpt-4-1106-preview',label:'gpt-4-1106-preview'},
    {value:'gpt-3.5-turbo-0125',label:'gpt-3.5-turbo-0125'},
    {value:'gpt-3.5-turbo-1106',label:'gpt-3.5-turbo-1106'},
    {value:'deepseek-chat',label:'deepseek-chat'},
    {value:'claude-3-opus-20240229',label:'claude-3-opus-20240229'},
    {value:'claude-3-sonnet-20240229',label:'claude-3-sonnet-20240229'},
    {value:'claude-3-5-sonnet-20240620',label:'claude-3-5-sonnet-20240620'},
  ])



  
  const state = reactive({
      show: {
        add: false,
        edit: false,
        view: false
      },
      activeComponent: null,
      // 暂存更新数据
      updateData: {},
      // 暂存查看数据
      viewData: {},
      dataList: [],
      // 请求参数
      query: {
        params: {},
        pagination: {
          current: 1,
          pageSize: 50,
          total: 0,
          hideOnSinglePage: true,
        },
        sort: {
          columnKey: "createdAt",
          order: "ascend"
        }
      },
      // loading
      loading: {
        spinning: false,
        tip: '加载中'
      }
    })
  const fileName = ref('')
  const upload = ref<UploadInstance>()
  const fileUp = ref()
  const handleExceed: UploadProps['onExceed'] = (files) => {
    upload.value!.clearFiles()
    const file = files[0] as UploadRawFile
    
    file.uid = genFileId()
    upload.value!.handleStart(file)
    fileName.value = file.name
    
  }
 




  const handleSuccess = (uploadFile: UploadFile) => {
    
  }
  const handleChange = (uploadFile: UploadFile) => {
  // 设置input框的值为上传文件的名称
    fileName.value = uploadFile.name
    console.log("the file is")
    console.log(uploadFile)
    console.log(uploadFile.name)
    fileUp.value = uploadFile.raw
  }
  const submitUpload = () => {
    console.log("begin to upload");
    if(promptsValue.value==""){
        ElMessage.error('请选择清单');
        return;
    }
    if(llmValue.value==""){
        ElMessage.error('请选择模型');
        return;
    }
    //upload.value!.submit()
    var data = new FormData();
    data.append("file", fileUp.value, fileName.value);
    data.append("promptId", promptsValue.value);
    data.append("llm", llmValue.value);

    // create(data).then(res => {
    //    console.log(res);
    // }).catch(err => {
        
    //     console.log(err);
    // })
    var xhr = new XMLHttpRequest();
    xhr.timeout = 10*60*1000; // 设置超时时间为30秒

    xhr.withCredentials = true;
    xhr.responseType = 'blob';
   

    xhr.open("POST", "/api/web/upload");
    // WARNING: Cookies will be stripped away by the browser before sending the request.
   // xhr.setRequestHeader("Cookie", "session=s%3A5NNnyqkNekmg_FglJfGjxzPrwyeCZ_qp.Frjw4ppCqDi8yBmofK4EvuwDHFtde0MDr6wiRHazruM");
   xhr.onload = function() {
    if (this.status === 200) {
      const blob = new Blob([this.response], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      a.href = downloadUrl;
      // 如果服务器响应中包含文件名，使用该文件名；否则，自定义文件名
      const contentDisposition = xhr.getResponseHeader('Content-Disposition');
      let filename = 'ret_'+fileName.value;
      if (contentDisposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) { 
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      a.download = filename;
      
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a); // 清理DOM
      URL.revokeObjectURL(downloadUrl); // 释放blob URL
      loadingInstance.close();
    }else{
      ElMessage.error('调用出错：'+this.status);
      loadingInstance.close();
    }
  };

    xhr.send(data);
    const loadingInstance = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)',
    });
  }
  const getDataList = () => {
      state.loading.spinning = true
      // 将响应式query返回起原始对象
      let p = toRaw(state.query)
  
      promptsList(p).then(res => {
        state.loading.spinning = false
        let datas = res.data.result
        
        state.dataList = datas
        state.query.pagination.total = res.data.total
        state.query.pagination.current = res.data.current
        state.query.pagination.pageSize = res.data.pageSize
        let promptsList = []; 
        for(let item of res.data.result){
            promptsList.push({value:item.id,label:item.name});
        }
        promptsOptions.value = promptsList;
      }).catch(err => {
        state.loading.spinning = false
        console.log(err)
      })
  
    }
    getDataList();

    // 监听selectedValue的变化并更新localStorage
    watch(promptsValue, (newValue) => {
        localStorage.setItem('promptsValue', newValue);
    });
    watch(llmValue, (newValue) => {
        localStorage.setItem('llmValue', newValue);
    });
    // 当组件挂载时，尝试从localStorage读取保存的选择值
    onMounted(() => {
        const savedValue = localStorage.getItem('promptsValue');
        if (savedValue) {
            promptsValue.value = savedValue;
        }
        const savedTwoValue = localStorage.getItem('llmValue');
        if (savedTwoValue) {
            llmValue.value = savedTwoValue;
        }
        
    });

  </script>