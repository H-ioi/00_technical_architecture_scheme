import request from "@/router/axios";
import requestouter from "@/router/axiosouter";
export function uploadFile(data) {
  return request({
    url: "/publik/file/upload",
    method: "post",
    data: data,
  });
}
export function getFileList(data) {
  return request({
    url: "/publik/file/info/outerId",
    method: "get",
    params: data,
  });
}
export function getFiles(data) {
  return request({
    url: "/publik/file/info/ids",
    method: "get",
    params: data,
  });
}
export function getFileInfo(id) {
  return request({
    url: "/publik/file/info/" + id,
    method: "get",
  });
}
export function downloadFile(id, data = {}) {
  return request({
    url: "/publik/file/download/" + id,
    method: "get",
    data,
    header: {
      headers: {
        "Content-Type": "application/x-download",
      },
    },
    responseType: "blob",
  });
}
export function deleteFiles(data) {
  return request({
    url: "/publik/file/delete/ids",
    method: "delete",
    data: data,
  });
}
// 对外接口
export function uploadOuterFile(data) {
  return requestouter({
    url: "/file/outer/file/upload",
    method: "post",
    data: data,
    headers: {
      token: "2675bfd7-6fe8-4f89-8d60-8143b9fa4226",
    },
  });
}
export function getOuterFileInfo(id) {
  return requestouter({
    url: "/file/file_info/get/" + id,
    method: "get",
    headers: {
      token: "2675bfd7-6fe8-4f89-8d60-8143b9fa4226",
    },
  });
}
export function getOuterFileInfoList(data) {
  return requestouter({
    url: "/file/outer/file/list",
    method: "post",
    data,
    headers: {
      token: "2675bfd7-6fe8-4f89-8d60-8143b9fa4226",
    },
  });
}
export function downloadOuterFile(id) {
  return requestouter({
    url: "/file/outer/file/download/" + id,
    method: "get",
    headers: {
      token: "2675bfd7-6fe8-4f89-8d60-8143b9fa4226",
      "Content-Type": "application/x-download",
    },
    responseType: "blob",
  });
}
export async function getOuterFile(id) {
  try {
    const res = await requestouter({
      url: "/file/outer/file/download/" + id,
      method: "get",
      headers: {
        token: "2675bfd7-6fe8-4f89-8d60-8143b9fa4226",
        "Content-Type": "application/x-download",
      },
      responseType: "blob",
    });
    console.log("getOuterFile", res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}
export async function getOuterFileName(data) {
  try {
    const res = await requestouter({
      url: "/file/outer/file/list",
      method: "post",
      data,
      headers: {
        token: "2675bfd7-6fe8-4f89-8d60-8143b9fa4226",
      },
    });
    console.log("getOuterFileName", res);

    return res.data.data[0].originalName;
  } catch (error) {
    throw error;
  }
}
export async function getOuterFileInfos(data) {
  try {
    const res = await requestouter({
      url: "/file/outer/file/list",
      method: "post",
      data,
      headers: {
        token: "2675bfd7-6fe8-4f89-8d60-8143b9fa4226",
      },
    });
    console.log("getOuterFileInfos", res);

    return res.data.data;
  } catch (error) {
    throw error;
  }
}
export async function upOuterFile(data) {
  try {
    const res = await requestouter({
      url: "/file/outer/file/upload",
      method: "post",
      data: data,
      headers: {
        token: "2675bfd7-6fe8-4f89-8d60-8143b9fa4226",
      },
    });
    console.log("upOuterFile", res);

    return res;
  } catch (error) {
    throw error;
  }
}
