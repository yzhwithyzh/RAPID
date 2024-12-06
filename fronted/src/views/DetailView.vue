<template>
    <section>
      <div style="display: flex; margin-top: 85px; height: calc(100vh - 140px); background-color: #f2f4f8;">
        <div style="flex-grow: 1; color: rgba(0, 0, 0, 0.88);margin-left:20px;width:60%">
          <el-row justify="end" align="middle" class="control-bar" style="border-right: 1px solid #dcdcdc;">
            <el-col :span="6">
              <div style="display: flex;    align-items: center;">
                <el-input placeholder="Search" v-model="searchQuery"  clearable />
                <span style="margin-left: 5px;width:90px">{{ currentMatchIndex + 1 }}/{{ matches.length }}</span>
                <el-icon :size="24" @click="prevMatch" style="vertical-align: middle;cursor: pointer;"><ArrowUp /></el-icon>
                <el-icon :size="24" @click="nextMatch" style="vertical-align: middle;margin-left: 5px;cursor: pointer;"><ArrowDown /></el-icon>
              </div>
              
            </el-col>
            <el-col :span="6">
              <el-icon :size="30" @click="zoomIn" style="vertical-align: middle;cursor: pointer;"><ZoomIn /></el-icon>
              <el-icon :size="30" @click="zoomOut" style="margin-left:5px; vertical-align: middle;cursor: pointer;"><ZoomOut /></el-icon>
            </el-col>
          </el-row>
          <!-- <el-row justify="start" align="middle" class="control-bar">
            <el-col :span="6">
                
              <el-button @click="prevMatch">上一匹配</el-button>
              <el-button @click="nextMatch" style="margin-left: 10px;">下一匹配</el-button>
              <span style="margin-left: 10px;">匹配: {{ currentMatchIndex + 1 }} / {{ matches.length }}</span>
            </el-col>
          </el-row> -->
          <div id="container" style="overflow: auto;height: calc(100% - 60px);">
            <div :style="{ transform: `scale(${scale})`, transformOrigin: origin }" style="width:auto" class="zoomable-div">
                <!-- <pre>
                <div style="text-align: left;padding:10px" v-html="highlightedText"></div>
                </pre> -->
                <pre style="text-align: left;padding:10px;white-space: pre-wrap;" v-html="highlightedText"></pre>
            </div>
          </div>
        </div>
        <div style="height: 100%; max-width: 40%; min-width: 40%; box-sizing: border-box; flex-shrink: 0;">
            <el-row justify="space-between" align="middle" class="control-bar">
              <el-col :span="6">
                <div style="text-align: left;padding-left: 10px;">checklist</div>
                
              </el-col>
              <el-col :span="6">
                <el-button  @click="downloadWord">Download</el-button>
              </el-col>
            </el-row>
            <el-scrollbar class="text-viewer" always style="background-color: white;">
              <div class="zoomable-div">

                  <div v-for="(question, index) in questionList"  :key="index" :style="{ backgroundColor: answers[index]?.double_check_answer_output?.Judgment==='No' ?'#f2086724':'#24e81438'}" style="border-bottom: 1px solid #dcdcdc;text-align: left;padding-left:10px;padding-right:10px">
                    <div style="font-weight: bold;font-size: 22px;padding-bottom: 10px;padding-top:10px">{{ question.serial? question.serial:index+1 }}.{{ question.question }}?</div>
                    <div v-if="answers.length>index">
                      <!-- <div v-if="answers[index].double_check_answer_output">{{answers[index].double_check_answer_output.Judgment}}.{{ answers[index].double_check_answer_output.Response}}</div> -->
                      <div> {{answers[index].final_answer_output.Judgment}}.{{ answers[index].final_answer_output.Response}}</div>
                    </div>
                    <div v-if="index in commentHash" style="color:red;font-size:14px;position:relative">
                      <el-popconfirm
                        confirm-button-text="Yes"
                        cancel-button-text="No"
                        title="Are you sure to delete this?"
                        @confirm="confirmDeleteComment(index)"    
                        width="250px"
                      >
                        <template #reference>
                          <el-icon style="margin-left: auto;position: absolute;right: 5px;bottom: 5px;cursor: pointer;"><Delete /></el-icon>
                        </template>
                      </el-popconfirm>     
                      <div  style="border:1px dashed red;padding:5px">
                        {{ commentHash[index].reported }}.{{ commentHash[index].content}}
                      </div>
                    </div>
                    
                    
                    <!-- <div style="display: flex; align-items: center;height: 40px;"><el-icon style="margin-right:5px;cursor: pointer;" color="Red"><Notebook /></el-icon> <span :class="['num-tag', { active: isActive}]">2</span> <span class="num-tag">7</span> <span class="num-tag">9</span></div> -->
                    
                    <div style="display: flex; align-items: center;height: 40px;font-size: 13px;">
                      
                      <el-icon style="margin-right:5px;cursor: pointer;" ><Notebook /></el-icon> 
                      <span v-for="(identifier, identifierIndex) in answers[index]?.question_selected_paragraphs.slice(0, 3).sort((a, b) => a - b)" class="num-tag" @click="toggleClick(index,-1,identifier)" :key="identifierIndex" :class="['num-tag', { active: selectIdentifier== index + '_' + -1 + '_' + identifier}]">
                      {{identifier}}
                      </span>
                      <el-icon style="cursor: pointer;margin-left: auto;margin-right: 20px;" @click="editComment(index)"><Edit /></el-icon>
                    </div>
                    <el-collapse accordion>
                      <el-collapse-item name="1">
                        
                        <template #title>
                          Subquestion<el-icon class="header-icon">
                            <info-filled />
                          </el-icon>
                        </template>
                        <div v-if="answers.length>0">
                          <div v-for="(subquestion, subindex) in subquestion_list[index]" :style="{ backgroundColor: answers[index]?.history_score_output[subindex]?.Judgment=='Yes' ? '#24e81438' : '#f2086724' }" style="padding:10px" :key="subindex">
                            <div><h4>{{subindex+1}}.{{subquestion}}</h4></div>
                            <div>{{answers[index]?.history_score_output[subindex]?.Judgment=="Yes"?'Reported':'No reported'}}<br>{{answers[index]?.history_score_output[subindex]?.Response}}</div>
                            <div style="display: flex; align-items: center;height: 40px;">
                              <el-icon style="margin-right:5px;cursor: pointer;" ><Notebook /></el-icon> 
                              <span v-for="(identifier, identifierIndex) in answers[index]?.history_instruction_selected_paragraphs[subindex]?.Selected_paragraph_identifiers" class="num-tag" @click="toggleClick(index,subindex,identifier)" :key="identifierIndex" :class="['num-tag', { active: selectIdentifier== index + '_' + subindex + '_' + identifier}]">
                              {{identifier}}
                              </span>
                             
                            </div>
                          </div>
                        </div>
                      </el-collapse-item>
                    </el-collapse>
                  
                  </div>
              </div>
            </el-scrollbar>
        </div>
      </div>
      <el-dialog v-model="dialogFormVisible" title="FeedBack" width="500">
        <el-form :model="editform">
          <el-form-item label="Reported" label-width="80px">
            <el-select v-model="editform.reported" placeholder="Please select">
              <el-option label="Yes" value="Yes" />
              <el-option label="No" value="No" />
            </el-select>
          </el-form-item>
          <el-form-item label="Content" label-width="80px">
            <el-input v-model="editform.content" autocomplete="off" type="textarea" :rows="5"/>
          </el-form-item>
          
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">Cancel</el-button>
            <el-button type="primary" @click="confirmComment">
              Confirm
            </el-button>
          </div>
        </template>
      </el-dialog>
    </section>
  </template>
  
  <script lang="ts" >
  import { defineComponent, ref, watch,onMounted } from 'vue';
  import { ZoomIn, ZoomOut,InfoFilled} from '@element-plus/icons-vue';
  import { ElContainer, ElScrollbar, valueEquals, ElLoading } from 'element-plus';
  import { useRoute } from 'vue-router';
  import { logicalPropertiesLinter, message } from 'ant-design-vue';
  import { dataType } from 'element-plus/es/components/table-v2/src/common';
  import { NODE_CONTEXTMENU } from 'element-plus/es/components/tree-v2/src/virtual-tree';
  import {getUploadById} from "../api/modules/api.upload";
  import {checklistFindOne} from "../api/modules/api.checklist";
  import {feedbackList,feedbackCreate,feedbackUpdate,feedbackDelete,getFeedbackListByUploadId} from "../api/modules/api.feedback";
  import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType,ISectionOptions,ShadingType  } from 'docx';
  import { saveAs } from 'file-saver';
  import useItems from 'ant-design-vue/es/menu/src/hooks/useItems';
  import {getBottomDivs,getHtmlText, findMostSimilarSubstring,getMatchArray} from "../libs/util.common";
import { element } from '@vueform/vueform';
  export default defineComponent({
    name: 'DetailView',
    setup() {
      const scale = ref(1);
      const origin = ref("top");
      var textContent = `` // 示例文本内容
      var htmlContent = ''
      var htmlDivs = [];
      var textDivs = [];
      const searchQuery = ref('');
      const highlightedText = ref(textContent);
      const matches = ref([]);
      const currentMatchIndex = ref(-1);
      const scrollbarRef = ref()
      const isActive = ref(true)
      const subquestion_list = ref([]);
      const answers = ref([]);
      const selectIdentifier = ref();
      const splitsData = ref();
      const questionList = ref();
      const dialogFormVisible = ref(false);
      const commentHash = ref({})
      const editform = ref({
        id: '',
        uploadId: '',
        questionId:'',
        reported: '',
        content: ''
      });
      const route = useRoute();
      const id = route.params.id;  // 获取路由参数
      console.log(id);
      const updateHighlightedText = () => {
        const query = searchQuery.value;
        if(htmlContent){
          if (query) {
            matches.value = getMatchArray(textDivs, query)

            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            for (let num of matches.value) {
              let element = htmlDivs[num]
              let className = element.className
              
              const childrenHtml = element.innerHTML;
              doc.getElementsByClassName(className)[0].innerHTML = "<mark>"+childrenHtml+"</mark>"
            }
            
            highlightedText.value = doc.documentElement.outerHTML;



            // 记录所有匹配的位置
            //matches.value = [...highlightedText.value.matchAll(regex)];
            currentMatchIndex.value = 0;
            scrollToCurrentMatch();
          } else {
            highlightedText.value = htmlContent;
            currentMatchIndex.value = -1;
            matches.value = [];
          }
        }else{
          if (query) {
            const regex = new RegExp(`(${query})`, 'gi');
            highlightedText.value = textContent.replace(regex, '<mark>$1</mark>');
            // 记录所有匹配的位置
            matches.value = [...highlightedText.value.matchAll(regex)];
            currentMatchIndex.value = 0;
            scrollToCurrentMatch();
          } else {
            highlightedText.value = textContent;
            currentMatchIndex.value = -1;
            matches.value = [];
          }
        }
      };
  
      const scrollToCurrentMatch = () => {
        if (matches.value.length > 0) {
          const match = matches.value[currentMatchIndex.value];
          const container = document.querySelector('#container');
          const markElements = container?.querySelectorAll('mark');
          console.log(markElements);
          console.log(match)
          console.log(match.index)
          if (markElements  && markElements.length > currentMatchIndex.value) {
            const markElement = markElements[currentMatchIndex.value];
           
            let dis = getOffsetTopToParent(markElement, container) 
            container.scrollTop = dis- container.clientHeight / 2 + markElement.clientHeight / 2
            //container.scrollTop = markElement.offsetTop - container.clientHeight / 2 + markElement.clientHeight / 2
          }
        }
      };
      function getOffsetTopToParent(element, parent) {
          let offsetTop = 0;

          // 递归地累加 offsetTop，直到找到指定的父元素或根元素
          while (element && element !== parent) {
              offsetTop += element.offsetTop;
              element = element.offsetParent;
          }

          return offsetTop;
      }

      const scrollToCurrentMatchByIdentifier = () => {
       
      
        const container = document.querySelector('#container');
        const markElements = container?.querySelectorAll('mark');
        console.log(markElements)
        if (markElements && markElements.length > 0) {
          const markElement = markElements[Math.floor(markElements.length/2)];
          console.log(markElement)
          let dis = getOffsetTopToParent(markElement, container) 
          console.log(dis,container.clientHeight,markElement.clientHeight)
          container.scrollTop = (dis- container.clientHeight / 2 + markElement.clientHeight / 2)*scale.value
          //container.scrollTop = (markElement.offsetTop - container.clientHeight / 2 + markElement.clientHeight / 2)
        
        }
        
      };
      const prevMatch = () => {
        if (matches.value.length > 0) {
          currentMatchIndex.value = (currentMatchIndex.value - 1 + matches.value.length) % matches.value.length;
          scrollToCurrentMatch();
        }
      };
  
      const nextMatch = () => {
        if (matches.value.length > 0) {
          currentMatchIndex.value = (currentMatchIndex.value + 1) % matches.value.length;
          scrollToCurrentMatch();
        }
      };
  
      watch(searchQuery, updateHighlightedText);
  
      const zoomIn = () => {
        scale.value += 0.1;
        if (scale.value > 1) {
          origin.value = "left top";
        }
      };
  
      const zoomOut = () => {
        if (scale.value > 0.1) {
          scale.value -= 0.1;
        }
        if (scale.value < 1) {
          origin.value = "left top";
        }
      };
      
      const renderText = (data)=>{
        let allText = "";
        let sections = data[0].splits.sections;
        let section_paragraphs = data[0].splits.section_paragraphs;
        
        for(let name of sections){
         
          allText += "<h2>"+name+"</h2>"
          for(let graph of section_paragraphs[name]){
            allText += graph+" "
          }
        }
        highlightedText.value = allText;
        textContent = allText;
        
        if(htmlContent){
          highlightedText.value = htmlContent
          const container = document.querySelector('#container');
          
          let times = 100
          let i = 0
          const checkExist = setInterval(() => {
              i++
              const firstPage = document.querySelector('#pf1');
              if (firstPage) {
                  
                  // 当元素显示后，清除定时器
                  clearInterval(checkExist);
                  
                  let cWidth = container.clientWidth;
                  let cFirst = firstPage.clientWidth;
                 
                  let initScale = cWidth/cFirst;
                  
                  scale.value = initScale
                  origin.value = "left top";
              }
              if (i>times){
                clearInterval(checkExist);
              }
          }, 100); //
        }

      };
      const renderTextByIdentifier = (identifier)=>{
        let allText = "";
        let sections = splitsData.value.sections;
        let section_paragraphs = splitsData.value.section_paragraphs;
        let i = 0;
        let targetGraph = ""
        for(let name of sections){
         
          allText += "<h2>"+name+"</h2>"
          for(let graph of section_paragraphs[name]){
            i++;
            if(i==identifier){
              allText += "<mark>"+graph+"</mark>"
              targetGraph = graph
            }else{
              allText += graph+" "
            }
          }
        }
        if(htmlContent){
          console.log(targetGraph)
          var res = findMostSimilarSubstring(textDivs, targetGraph)
          console.log(res)
          let beginIndex = res.beginIndex
          let endIndex = res.endIndex
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlContent, 'text/html');
          for(let i = beginIndex;i<=endIndex;i++){
           
            let element = htmlDivs[i]
            let className = element.className
            
            const childrenHtml = element.innerHTML;
            doc.getElementsByClassName(className)[0].innerHTML = "<mark>"+childrenHtml+"</mark>"
            
          }
          highlightedText.value = doc.documentElement.outerHTML;
        }else{
          highlightedText.value = allText;
        }
      };
      const toggleClick = (index,subindex,identifierIndex)=>{
        if(selectIdentifier.value== index + '_' + subindex + '_' + identifierIndex){
          selectIdentifier.value= null
          renderTextByIdentifier(-1)
          return
        }
        selectIdentifier.value = index + '_' + subindex + '_' + identifierIndex
        renderTextByIdentifier(identifierIndex)
        //scrollToCurrentMatchByIdentifier()
        setTimeout(scrollToCurrentMatchByIdentifier, 200);  // 2000毫秒后执行，即2秒
      };


      onMounted(async () => {
       
        
        let p = {
            "id":id,
            
        }
        const loading = ElLoading.service({
          lock: true,
          text: 'Loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        getUploadById(p).then(res => {
           console.log(res);
           if(res["message"]=="Success."){
              if(res.data.status!="2"){
                return;
              }
              const retData = JSON.parse(res.data.parsed_content);
              htmlContent = res.data.html_content;
              if(htmlContent){
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, 'text/html');

                // 提取生成的 HTML 元素
                const htmlElement = doc;
                htmlDivs = getBottomDivs(htmlElement.getElementById("page-container"))
                
                textDivs = getHtmlText(htmlDivs)
              }


             
              //console.log(textDivs)
              checklistFindOne({"id":res.data.promptId}).then(res2 => {
                if(res2["message"]=="Success."){
                  questionList.value= res2["data"]["items"];
                  let subquestionList=[];
                  for(const one of res2["data"]["items"]){
                    subquestionList.push(one["subquestion"].map(item2 => item2.text))
                  }
                  subquestion_list.value = subquestionList
                }                
              })
              getFeedbackListByUploadId({"uploadId":id}).then(res3 => {
                if(res3["status"]==1){
                  for(const one of res3["data"]){
                    commentHash.value[one["questionId"]] = one
                  }
                  
                  console.log(commentHash.value)
                }
              })

              
              console.log(retData);
              answers.value = retData[0].answers.sort((a, b) => a.id - b.id);;
              
              splitsData.value = retData[0].splits
              renderText(retData);
              loading.close()
           } 
         
           
        }).catch(err => {
           
            console.log(err)
            loading.close()
        })
    

    

      });

      const editComment = (questionId)=>{
        dialogFormVisible.value = true;
        console.log(commentHash.value)
        if(questionId in commentHash.value){
            console.log(questionId)
            editform.value = {
              id: commentHash.value[questionId]["id"],
              uploadId: '',
              questionId:questionId,
              reported: commentHash.value[questionId]["reported"],
              content: commentHash.value[questionId]["content"]
            }
            console.log(editform.value)
        }else{
          editform.value = {
            id: '',
            uploadId: '',
            questionId:questionId,
            reported: '',
            content: ''
          }
         
        }
      };
      const confirmComment = ()=>{
        dialogFormVisible.value = false;
        
        if(editform.value.id){
          //更新内容
          let data = {
            id:editform.value.id,
            uploadId: id,
            questionId:editform.value.questionId,
            reported: editform.value.reported,
            content: editform.value.content
          }
          feedbackUpdate(data).then(res=>{
            if(res["status"]==1){
              commentHash.value[editform.value.questionId] = data
            }
          })
        }else{
          let data = {
            uploadId: id,
            questionId:editform.value.questionId,
            reported: editform.value.reported,
            content: editform.value.content
          }
          //添加内容
          feedbackCreate(data).then(res=>{
            if(res["status"]==1){
              data["id"] = res["message"];
              commentHash.value[editform.value.questionId] = data
            }
          }).catch(err => {
           
           console.log(err)
           //ElMessage.error(err.message);
          })
        }
      };
      const confirmDeleteComment = (questionId)=>{
        let commentId = commentHash.value[questionId]["id"]
        let data = {id:commentId}
        feedbackDelete(data).then(res=>{
          if(res["status"]==1)
            delete commentHash.value[questionId]
        })
      };
      const downloadWord = async () => {
          let tableData = [];
          console.log(questionList.value)
          for(const [index, question] of questionList.value.entries()){
            let reported = answers?.value[index]?.final_answer_output?.Judgment;
            let content = answers?.value[index]?.final_answer_output?.Response;
            if(index in commentHash.value){
              reported = commentHash.value[index]?.reported;
              content = commentHash.value[index]?.content;
            }
           

             let tmp = {
              sectionAndTopic:question?.section?question?.section:""+" "+question?.topic?question?.topic:"",
              serial:question?.serial,
              checklistItem: question?.question, 
              reported: reported, 
              contents: content
            }
          
            tableData.push(tmp);

          }
          console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
          console.log(tableData);
          const section: ISectionOptions = {
          properties: {},
          children: [
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph('Section/Topic')],
                      shading: { type: ShadingType.SOLID, color: '0000FF', fill: '0000FF' }, 
                      width: { size: 20, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                      children: [new Paragraph('No. of Item')],
                      shading: { type: ShadingType.SOLID, color: '0000FF', fill: '0000FF' }, 
                      width: { size: 10, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                      children: [new Paragraph('Checklist Item')],
                      shading: { type: ShadingType.SOLID, color: '0000FF', fill: '0000FF' }, 
                      width: { size: 30, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                      children: [new Paragraph('Reported/Not Reported')],
                      shading: { type: ShadingType.SOLID, color: '0000FF', fill: '0000FF' }, 
                      width: { size: 10, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                      children: [new Paragraph('Contents')],
                      shading: { type: ShadingType.SOLID, color: '0000FF', fill: '0000FF' }, 
                      width: { size: 30, type: WidthType.PERCENTAGE }
                    })
                  ]
                }),
                ...tableData.map(row =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph(row.sectionAndTopic?row.sectionAndTopic:"")],
                        width: { size: 20, type: WidthType.PERCENTAGE }
                      }),
                      new TableCell({
                        children: [new Paragraph(row.serial?row.serial:"")],
                        width: { size: 10, type: WidthType.PERCENTAGE }
                      }),
                      new TableCell({
                        children: [new Paragraph(row.checklistItem)],
                        width: { size: 30, type: WidthType.PERCENTAGE }
                      }),
                      new TableCell({
                        children: [new Paragraph(row.reported)],
                        width: { size: 10, type: WidthType.PERCENTAGE }
                      }),
                      new TableCell({
                        children: [new Paragraph(row.contents)],
                        width: { size: 30, type: WidthType.PERCENTAGE }
                      })
                    ]
                  })
                )
              ]
            })
          ]
        };

        const doc = new Document({
          sections: [section]
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, 'Table.docx');
      };


      return {
        scale,
        origin,
        searchQuery,
        highlightedText,
        matches,
        currentMatchIndex,
        zoomIn,
        zoomOut,
        prevMatch,
        nextMatch,
        scrollbarRef,
        isActive,
        questionList,
        answers,
        subquestion_list,
        toggleClick,
        selectIdentifier,
        downloadWord,
        dialogFormVisible,
        editform,
        editComment,
        commentHash,
        confirmDeleteComment,
        confirmComment
      };
    }
  });
  </script>
  <style>
    #page-container{
      overflow: visible!important;
      background-color: transparent!important;
      background-image:none!important;
    }
    #sidebar{
      display: none!important;
    }
    .focus-on{
      background-color: ;
    }
  </style>
  <style scoped>
  .control-bar {
    background-color: white;
    height: 50px;
    margin-top: 10px;
  }
  
  .text-viewer {
    border: 1px solid #dcdcdc;
    /* padding: 10px; */
    height: calc(100% - 80px);
    /* overflow: auto; */
    position: relative;
  }
  
  .zoomable-div {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    transition: transform 0.3s ease;
    background-color: transparent;
  }
  .num-tag {
    margin-left: 5px;
    margin-right: 5px;
    border-bottom: 1px solid #adb5bd;
    cursor: pointer;
    
  }
  .num-tag:hover{
    border-bottom: 1px solid #6186fe;
    color: #6186fe;
  }
  .num-tag.active {
    border-bottom: 1px solid #6186fe;
    color: #6186fe;
  }
  .el-collapse{
    border-top: none;
  }
  ::v-deep .el-collapse-item__content{
    padding-left: 20px;
  }
  
  </style>
  