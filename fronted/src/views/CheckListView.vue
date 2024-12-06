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
                        <!-- ADVANCED Reviser(<span class="title_1">A</span>I-<span class="title_1">D</span>riven de<span class="title_1">V</span>elopment and <span class="title_1">A</span>ssessme<span class="title_1">N</span>t of
health<span class="title_1">C</span>are guid<span class="title_1">E</span>lines and stan<span class="title_1">D</span>ards) -->
                       
                        <span style="font-size: 50px;">RAPID</span> -- <span class="title_1">R</span>eliable, efficient, and <span class="title_1">A</span>ccurate automatic generation of submission re<span class="title_1">P</span>ort<span class="title_1">I</span>ng checklists based on large language mo<span class="title_1">D</span>els
                    </h2>
                    <!-- <p class="mt20"  data-delay="600" style="font-size: 32px;">
                        神笔良医 -- 人工智能驱动的报告清单生成工具

                    </p>                         -->
                       
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
                            <h4 class="mb10">Upload files</h4>
                            <p class="mb30">support WORD and PDF</p>
                            <ul id="filelist"></ul>
                            <form action="#" id="contactform" method="post" data-gtm-form-interact-id="0">
                                <div class="input-group">
                                    <input type="text" v-model="fileName" class="form-control" disabled placeholder="Click on the right to select the file" style="margin: auto;height:48px;"  id="file_input">
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
                                        <el-button type="primary" style="height:48px;width: 100px;">Select file</el-button>
                                        </template>
                                    </el-upload>
                                </div>
                            </form>
                        </div>
                        <div class="" style="margin-top: 20px;text-align: left;">
                                   
                                   <el-select
                                       v-model="promptsValue"
                                       filterable
                                       placeholder="Please select checklist"
                                       style="width: 240px"

                                   >
                                       <el-option
                                       v-for="item in promptsOptions"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value"
                                       />
                                   </el-select>
                                   <!-- <el-select
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

                                   </el-select> -->
                                   <el-button class="ml-3" type="success" @click="submitUpload" style="right:40px;height:48px;position:absolute;width:100px" >
                                        Run
                                    </el-button>
                               </div>
                    </div>
                    <div class="infoblockz sw-bg-3-wave" style="padding-bottom: 50px;">
                        <div class="contactinfodivv">
                            <div class="con-block-sw-div" style="min-height: 100px;">
                                <div>
                                    <el-table :data="tableData" style="width: 100%">
                                        <el-table-column prop="filename" label="File Name" ></el-table-column>
                                        
                                        <el-table-column label="Upload time" >
                                            <template #default="scope">
                                                <div style="display: flex; ">
                                            
                                                    <span>{{ new Date(scope.row.createdAt).toLocaleString() }}</span>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Status" >
                                            <template #default="scope">
                                                <div style="display: flex; ">
                                                    
                                                    <span v-if="scope.row.status === '1'"> Pending processing </span>
                                                    <span v-else-if="scope.row.status === '2'"> Completed</span>
                                                    <span v-else>Error</span>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="Operation">
                                            <template #default="scope">
                                                <!-- <el-button size="small" @click="handleDown(scope.$index, scope.row)">
                                                下载
                                                </el-button> -->
                                                <el-button size="small" :disabled="scope.row.status !== '2'" @click="gotoDetail(scope.$index, scope.row)">
                                                Detail
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <el-pagination
                                    background
                                    layout="prev, pager, next"
                                    :total="total"
                                    :page-size="pageSize"
                                    :current-page="currentPage"
                                    @current-change="handleCurrentChange"
                                    style="margin-top: 10px;float: right;"
                                    ></el-pagination>
                                </div>
                            </div>
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
    name: 'CheckListView',
  };
  
  </script>
  <script setup lang="ts">
  import { ref,toRaw,reactive, onMounted, watch, onBeforeUnmount} from 'vue';
  import { useRouter } from 'vue-router';
  import { genFileId ,ElMessage,ElLoading} from 'element-plus';
  import type { UploadFile, UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
  import { checkListGetall, getProgress} from "../api/modules/api.checklist";
  import {listAll,createOne,downloadExcel,getSysList} from "../api/modules/api.upload";
  const promptsValue = ref('')
  const llmValue = ref('')
  const promptsOptions = ref([])
  const llmOptions = ref([{value:'gpt-4o',label:'gpt-4o'},{value:'gpt-4-0125-preview',label:'gpt-4-0125-preview'},{value:'gpt-4-1106-preview',label:'gpt-4-1106-preview'},{value:'gpt-3.5-turbo-0125',label:'gpt-3.5-turbo-0125'},
  {value:'gpt-3.5-turbo-1106',label:'gpt-3.5-turbo-1106'},{value:'claude-3-opus-20240229',label:'claude-3-opus-20240229'},
  {value:'claude-3-sonnet-20240229',label:'claude-3-sonnet-20240229'}
  ])

    const tableData = ref([]);
    const total = ref(0);
    const pageSize = ref(10);
    const currentPage = ref(1);
    const router = useRouter();
    const fetchData = async (page = 1) => {
        try {
            let p = {
                pagination:{"current":page,
                            "pageSize":pageSize.value
                }
            }
            listAll(p).then(res => {
                state.loading.spinning = false
                let datas = res.data.result
                
                tableData.value = datas
                total.value = res.data.total
                state.query.pagination.current = res.data.current
                state.query.pagination.pageSize = res.data.pageSize
            }).catch(err => {
                state.loading.spinning = false
                console.log(err)
            })
        
       
        } catch (error) {
        ElMessage.error('获取数据失败');
        }
    };
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
    let timer
    let timer2
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
    const handleCurrentChange = (page) => {
      currentPage.value = page;
      fetchData(page);
    };

  const handleDown = (item,item2)=>{
    try {
        let p = {
            "id":item2.id,
            
        }
        downloadExcel(p).then(res => {
                 
        }).catch(err => {
           
            console.log(err)
            ElMessage.error('下载失败'+err.message);
        })
    
    
    } catch (error) {
        ElMessage.error('下载失败'+error.message);
    }

  }  
  const gotoDetail = (item, items)=>{
    //router.push({ name: 'Detail', params: { id: items.id } });
    const url = `/detail/${items.id}`;
    window.open(url, '_blank');
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
  const getDataList = () => {
      state.loading.spinning = true
      // 将响应式query返回起原始对象
      let p = toRaw(state.query)
  
      checkListGetall(p).then(res => {
        state.loading.spinning = false
       
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
  const submitUpload = () => {
    console.log("begin to upload");
    
    if(promptsValue.value==""){
        ElMessage.error('Please select checklist');
        return;
    }
    console.log(fileUp.value)
    console.log(fileName.value)
    if(!fileUp.value){
        ElMessage.error('please select file');
        return;
    }
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        
    })
    // if(llmValue.value==""){
    //     ElMessage.error('请选择模型');
    //     return;
    // }
    //upload.value!.submit()
    var data = new FormData();
    data.append("file", fileUp.value, fileName.value);
    data.append("promptId", promptsValue.value);
    data.append("llm", llmValue.value);
    fileUp.value="";
    fileName.value="";
    createOne(data).then(res => {
       console.log(res);
       fetchData();
        loading.close()
 
    }).catch(err => {
        loading.close()
        console.log(err);
    })
  }
    const startRefreshing = () => {
        getDataList(); // 初始化时先获取一次数据
        timer = setInterval(() => {
            fetchData(currentPage.value);
        }, 1000*60); // 每 60 秒刷新一次
        timer2 = setInterval(() => {
            getProgress();
        }, 1000*10); // 每 10 秒刷新一次
    };

    const stopRefreshing = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        if(timer2){
            clearInterval(timer2);
            timer2 = null;
        }
    };
    //getDataList();

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
        fetchData();
        startRefreshing();
    });
    onBeforeUnmount(() => {
      stopRefreshing();
    });

  </script>