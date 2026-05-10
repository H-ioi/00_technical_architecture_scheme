import request from "@/router/newaxios/axios";
const path = "/communityupload";
// 上传
export async function communityUpload (data) {
	try {
		const res = await request({
			url: `${path}/upload/`,
			method: "post",
			data,
		});
		return res.data;
	} catch (error) {
		throw error;
	}
}
