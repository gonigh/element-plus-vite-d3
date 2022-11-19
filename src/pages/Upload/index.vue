<script lang="ts" setup>
import { UploadFilled } from '@element-plus/icons-vue'
import { reactive } from 'vue';
import { calculateFileMd5, createFileChunk, checkMd5, PostFile, merge } from './index'

const state = reactive({
    percent: 0,
    code: 0
})

// 500KB
const CHUNK_SIZE = 500 * 1024;

const getFileType = function (fileName: string) {
    return fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase();
}

/**
 * @description: 上传文件
 * @param {*} file 文件
 * @returns {Object} 包含成功的文件地址、名称等
 */
const chunksUpload = async function (file: File) {

    // step1 获取文件 md5 值
    const md5: string = await calculateFileMd5(file, CHUNK_SIZE);
    // step2 获取文件的上传状态
    
    const checkCode = await checkMd5(md5 as string, file);
    if (checkCode == 100) {
        // step3 如果已经上传成功
        state.percent = 100;
        return;
    }
    // step4 获取文件切片
    const initChunks = createFileChunk(file);

    // step5 获取所有已经上传过的切片
    const uploadedList: string[] = <string[]>await PostFile(file, 0, md5);

    // 使用Promise.all 统一发送请求
    const requestList = initChunks.map(async (chunk, index) => {
        // 过滤掉已上传的切片
        if (uploadedList.indexOf(md5 + '-' + (index + 1)) < 0) {
            console.log(index);
            return PostFile(file, index, md5)
        }
    })

    return Promise.all(requestList)
        .then(async () => {
            const res = await merge(initChunks.length, file.name, md5, getFileType(file.name))
            if (res.data.code === 200) {
                
                return res.data.msg
            }
        })
        .catch(() => {
            return console.log('出错了，请稍后重试！')
        })
}


const onFileChange = function (file: { raw: File }) {
    console.log(file);
    chunksUpload(file.raw)
}
</script>
<template>
    <div class="upload-container">
        <el-upload class="upload-demo" ref="upload" action drag :limit="1" :auto-upload="false"
            :show-file-list="false" :on-change="onFileChange">

            <el-icon class="el-icon--upload">
                <upload-filled />
            </el-icon>
            <div class="el-upload__text">
                Drop file here or <em>click to upload</em>
            </div>

        </el-upload>
    </div>
</template>

<style scoped>
.upload-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    ;
}

.el-icon--upload {
    font-size: 67px;
    color: var(--ep-text-color-placeholder);
    margin-bottom: 16px;
    line-height: 50px;
}

.el.upload__text {
    color: var(--ep-text-color-regular);
    font-size: 14px;
    text-align: center;
}
</style>