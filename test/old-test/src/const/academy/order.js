import course from './course'
export default {
    setOrderStatus: function (status, marks) {
        let marksList = []
        let statusStr = ''
        if (marks.length > 0) {
            marksList = marks.map(item => {
                return item['mark']
            })
        }
        switch (status) {
            case "unpaid":
                statusStr = status
                break;
            case "paid":
                if (marksList.includes('refund_apply')) {
                    statusStr = 'refund_applying'
                } else if (marksList.includes('all_sub_scheduled')) {
                    statusStr = 'scheduled'
                } else {
                    statusStr = status
                }

                break;
            case "scheduled":
                statusStr = status
                break;
            case "finished":
                statusStr = status
                break;
            case "closed":
                statusStr = status
                break;
            case "cancelled":
                statusStr = status
                break;
            case "refunded":
                statusStr = status
                break;
            case "refund_apply":
                statusStr = status
                break;
            case "refund_amount":
                statusStr = status
                break;
            case "refund_applyingAll":
                statusStr = status
                break;
        }
        return statusStr
    }

}
