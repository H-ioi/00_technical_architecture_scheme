import axios from 'axios'
axios.defaults.withCredentials = false;
axios.defaults.timeout = 180 * 1000
const apikey = "jn8009%343$q1"
const uploadUrl = "https://upload.isagzth.com/upload/"
// const apikey = "jn8009%343$q1"
// const uploadUrl = "https://media2.isagzth.com"
class MyRequest {
	constructor() {
		this.uploadApi = axios.create({
			baseURL: uploadUrl,
			withCredentials: false,
			timeout: 300 * 1000,
			headers: {
				'apikey': apikey,
				'Content-Type': 'application/json;charset=UTF-8',
				'x-target-scene': "community-new"
			}
		});
	}
	async upload (data = {}) {
		return await this.uploadApi.post("", data);
	}
}
const myRequest = new MyRequest();
export default myRequest;
