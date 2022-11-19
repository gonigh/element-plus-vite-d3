/*
 * @Description: 大文件上传、分片上传、断点续传、文件秒传
 */
import SparkMD5 from "spark-md5";
// const SparkMD5 = require('spark-md5')
import { getUploadStatus, sliceUpload, mergeUpload } from "./api/index";
// 切片大小(单位:B)
const CHUNK_SIZE = 500 * 1024;

/**
 * @description: 分块计算文件的md5值
 * @param {*} file 文件
 * @param {*} chunkSize 分片大小
 * @returns {*}
 */
export function calculateFileMd5(file: File, chunkSize: number) {
  return new Promise<string>((resolve, reject) => {
    const blobSlice = File.prototype.slice;
    const chunks: number = Math.ceil(file.size / chunkSize);
    let currentChunk: number = 0;
    const spark: SparkMD5.ArrayBuffer = new SparkMD5.ArrayBuffer();
    const fileReader: FileReader = new FileReader();

    function loadNext() {
      const start = currentChunk * chunkSize;
      let end = start + chunkSize;
      if (end > file.size) {
        end = file.size;
      }
      fileReader.readAsArrayBuffer(file.slice(start, end));
    }

    fileReader.onload = function (e) {
      if (e && e.target && e.target.result)
        spark.append(e.target.result as ArrayBuffer);
      currentChunk++;
      if (currentChunk < chunks) {
        loadNext();
      } else {
        const md5 = spark.end();
        resolve(<string>md5);
      }
    };

    fileReader.onerror = function (e) {
      reject(e);
    };

    loadNext();
  });
}

/**
 * @description: 文件切片
 * @param {*} file
 * @param {*} size 切片大小
 * @returns [{file}]
 */
export function createFileChunk(file: File, size = CHUNK_SIZE) {
  const chunks = [];
  let cur = 0;
  while (cur < file.size) {
    chunks.push({ file: file.slice(cur, cur + size) });
    cur += size;
  }
  return chunks;
}

/**
 * @description: 根据文件的md5值判断文件是否已经上传过了
 * @param {*} md5 文件的md5
 * @param {*} 准备上传的文件
 * @returns {Promise}
 */
export function checkMd5(md5: string, file: File) {
  return new Promise((resolve) => {
    getUploadStatus({ md5 })
      .then((res) => {
        if (res.data.code === 20000) {
          // 文件已经存在了，秒传（后端直接返回已上传的文件）
          resolve(res.data);
        } else if (res.data.code === 40004) {
          // 文件不存在需要上传
          resolve(res.data);
        } else {
          resolve(res.data);
        }
      })
      .catch(() => {
        resolve("error");
      });
  });
}

/**
 * @description: 执行分片上传
 * @param {*} file 上传的文件
 * @param {*} i 第几分片，从0开始
 * @param {*} md5 文件的md5值
 * @param {*} vm 虚拟 dom 指向组件 this
 * @returns {Promise}
 */
export function PostFile(file: File, i: number, md5: string) {
  const name = file.name; // 文件名
  const size = file.size; // 总大小
  const shardCount = Math.ceil(size / CHUNK_SIZE); // 总片数
  if (i >= shardCount) {
    return;
  }

  const start = i * CHUNK_SIZE;
  const end = start + CHUNK_SIZE;
  const packet = file.slice(start, end); // 将文件进行切片
  /*  构建form表单进行提交  */
  const form = new FormData();
  form.append("md5", md5); // 前端生成uuid作为标识符传个后台每个文件都是一个uuid防止文件串了
  form.append("file", packet); // slice方法用于切出文件的一部分
  form.append("name", name);
  form.append("totalSize", size.toString());
  form.append("total", shardCount.toString()); // 总片数
  form.append("index", (i + 1).toString()); // 当前是第几片
  return new Promise<string[]>((resolve, reject) => {
    sliceUpload(form)
      .then((res) => {
        console.log(res);
        if (res.data.code === 20001) {
          // 拿到已上传过的切片
          resolve(res.data.chunkList
              ? res.data.chunkList.map((item: number) => `${md5}-${item}`)
              : [],
          );
        } else if (res.data.code === 20002) {
          resolve( []);
        } else {
          resolve( []);
          // reject()
        }
      })
      .catch(() => {
        reject("error")
        // resolve();
      });
  });
}

/**
 * @description: 合并文件
 * @param {*} shardCount 分片数
 * @param {*} fileName 文件名
 * @param {*} md5 文件md值
 * @param {*} fileType 文件类型
 * @param {*} fileSize 文件大小
 * @returns {Promise}
 */
export function merge(
  shardCount: number,
  fileName: string,
  md5: string,
  fileType: string
) {
  return mergeUpload({ shardCount, fileName, md5, fileType });
}
