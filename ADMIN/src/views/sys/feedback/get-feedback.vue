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
            <a-switch :checked="record.status==1" :disabled="!hasPerms('sys:role:update')" checked-children="未处理"
                      un-checked-children="已处理"
                      @change="statusChange(record)"/>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-button size="small" @click="handleView(column, record)">查看
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
   
    import {feedbackList, feedbackUpdate} from "api/modules/api.feedback";
    import {TimeUtils} from "libs/util.time";
  
    const columns = [
      {title: '是否报告', dataIndex: 'reported', key: 'reported', align: 'center'},
      {title: '内容', dataIndex: 'content', key: 'content', align: ''},
     
      {title: '状态', dataIndex: 'status', key: 'status', align: 'center'},
      {title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', align: 'center'},
      {title: '操作', width: 225, key: 'action', align: 'center', fixed: 'right'}
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
      goPage()
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
    const statusChange = (data) => {
        if(data.status==0){
            data.status = 1
        } else{
            data.status = 0
        }
        feedbackUpdate({id: data.id, status: data.status}).then(res => {
            //ZyNotification.success(!data.status ? '成功' : '停用成功')
            goPage()
        })
    }
  
    // 加载数据
    const getDataList = () => {
      state.loading.spinning = true
      // 将响应式query返回起原始对象
      let p = toRaw(state.query)
  
      feedbackList(p).then(res => {
        state.loading.spinning = false
        let datas = res.data.result
        for (const data of datas) {
          data.createdAt = TimeUtils.formatTime(data.createdAt)
          data.updatedAt = TimeUtils.formatTime(data.updatedAt)
        }
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
    const handleView = (column, record) => {
        console.log(column)
        console.log(record)
        window.open(`${window.location.protocol}//${window.location.hostname}:8080/detail/${record["uploadId"]}`, '_blank');

    };
  
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
        ok && deleteOne(row).then(res => {
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
  