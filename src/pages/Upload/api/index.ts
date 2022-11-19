import request from "../../../utils/request";

// 校验
export function getUploadStatus(data: { md5: string }) {
  return request({
    url: "upload/status",
    method: "get",
    params: data,
  });
}

// 上传
export function sliceUpload(data: FormData) {
  return request({
    url: "upload/post",
    method: "post",
    data,
  });
}

// 合并
export function mergeUpload(data: {
  shardCount: number;
  fileName: string;
  md5: string;
  fileType: string;
}) {
  return request({
    url: "upload/merge",
    method: "post",
    params: data,
  });
}
