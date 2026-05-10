import { fetchList } from "@/api/common/index";
export function getselectlist(data) {
    data.map((item) => {
        if (item.setdata) return
        if (item.formitemtype == "select") {
            fetchList(item.prop).then((res) => {
                console.log("6666", res.data.data);
                let data = res.data.data
                if (data == null || data == undefined) return
                let arr = []
                data.map(item => {
                    if (!item.archived && item.status) {
                        arr.push(item);
                    }
                })
                item["selectArr"] = arr;

            });
        }
    });
    return data;
}
export function getfilterlist(data) {
    data.map((item, index) => {
        fetchList(item.type).then((res) => {
            let data = res.data.data
            if (data == null || data == undefined) return
            let arr = []
            data.map(item => {
                if (!item.archived && item.status) {
                    arr.push(item);
                }
            })
            item["selectArr"] = arr;
        });
    });
    return data;
}