<template>
    <section>
      
      
      <a-table
              bordered
              :resizable="true"
              :loading="state.loading"
              :columns="columns"
              :row-key="record => record._id"
              :pagination="state.query.pagination"
              @change="handleTableChange"
              :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
              :data-source="state.dataList">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <span v-if="record.status === '1'">待处理</span>
            <span v-else-if="record.status === '2'">处理完成</span>
            <span v-else-if="record.status === '3'">处理错误</span>
            <span v-else>未知状态</span>
           
          </template>
          <template v-else-if="column.key === 'action'">
            
            <a-button size="small" @click="handleDown(column, record)">下载
            </a-button>
          </template>
        </template>
       
      </a-table>
  
     
    </section>
  
  </template>
  
  <script setup>
    import {reactive, toRaw, onMounted} from 'vue'
    import ZYSearchForm from "comps/common/ZySearchForm.vue";
    import ZyModal from "comps/common/ZyModal.vue";
    import ZyToolButton from "comps/common/ZyToolButton.vue";
    import {ZyConfirm, ZyMessage, ZyNotification} from "libs/util.toast";
    import {hasPerms, isEmptyObject} from "libs/util.common";
    import ZyFittleRow from "comps/common/ZyFittleRow.vue";
   
    import {getList} from "api/modules/api.upload";
    import {TimeUtils} from "libs/util.time";
  
    const columns = [
      {title: '名称', dataIndex: 'filename', key: 'filename', align: 'center'},
      {title: '状态', dataIndex: 'status', key: 'status', align: 'center'},
      {title: '备注', dataIndex: 'remark', key: 'remark', align: 'center'},
      {title: '创建人', dataIndex: ['creator', 'username'], key: 'creator', align: 'center'},
      {title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', align: 'center'},
      {title: '操作', width: 125, key: 'action', align: 'center', fixed: 'right'}
    ];
  
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
          pageSize: 10,
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
  
    // 查询
    const goPage = (num = 1) => {
      state.query.pagination.current = num;
      getDataList()
    }
    // 重置查询条件
    const handleReset = () => {
        getDataList()
    }
    // 分页
    const pageChange = ({current, pageSize}) => {
      // 更新当前页码和每页条数
      state.query.pagination = reactive({
        current: current,
        pageSize: pageSize,
      });
  
      getDataList()
    }
    // 排序
    const sorterChange = ({columnKey, order}) => {
      // 更新当前排序
      state.query.sort = reactive({
        current: current,
        order: order,
      });
      getDataList()
    }
   
    // 加载数据
    const getDataList = () => {
      state.loading.spinning = true
      // 将响应式query返回起原始对象
      let p = toRaw(state.query)
  
      getList(p).then(res => {
        state.loading.spinning = false
        let datas = res.data.result
        
        state.dataList = datas
        state.query.pagination.total = res.data.total
        state.query.pagination.current = res.data.current
        state.query.pagination.pageSize = res.data.pageSize
      }).catch(err => {
        state.loading.spinning = false
        console.log(err)
      })
  
    }
  
    // 处理表格变化事件
    const handleTableChange = (paginationValue, filters, sorter) => {
      if (!isEmptyObject(paginationValue)) {
        pageChange(paginationValue)
      }
      if (!isEmptyObject(sorter)) {
        sorterChange(sorter)
      }
    };
  
    const handleDown = (item,item2)=>{
        //console.log(item, item2);
    }  
  
    const goView = (row) => {
      state.show.view = true
      state.viewData = row
    }
  
    const goAdd = () => {
      state.show.add = true
    }
  
    const goEdit = (row) => {
      state.show.edit = true
      state.updateData = row
    }
  
    const goDelete = (row) => {
      ZyConfirm('确认删除该条数据?').then(ok => {
        ok && promptsDelete(row).then(res => {
          ZyNotification.success('删除成功')
          goPage()
        })
      })
    }
    const close = (isSave) => {
      state.show.add = false
      state.show.view = false
      state.show.edit = false
      isSave && goPage()
    }
  
    goPage()
  </script>
  
  <style scoped>
  
  </style>
  