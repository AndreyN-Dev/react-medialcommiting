import axios from "axios";
import * as constant from "../components/constants";

export default class WatchLogHelper {

    static sendMyClinicLogs = (caseID, playCounts) => {
        console.log(caseID)
        console.log(playCounts)
        const clinic_1 = {itemType: 'clinic_1', itemId: caseID, durationMins: playCounts.clinic_1}
        const clinic_2 = {itemType: 'clinic_2', itemId: caseID, durationMins: playCounts.clinic_2}
        const requestBody = [clinic_1, clinic_2]
        this.sendBulkLogs(requestBody)
    }

    static sendSessionsLogs = (playCounts) => {
        //call function to save you state in API or save in localStore
        const requestBody = Object.keys(playCounts).map((sessionId, index) => {
            return {itemType: 'session', itemId: sessionId, durationMins: playCounts[sessionId]};
        })
        this.sendBulkLogs(requestBody)
    }

    static sendBulkLogs = async (requestBody) => {
        const jwt = localStorage.getItem('jwt')
        axios.post(constant.baseURL + "watch-logs-bulk", requestBody, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        }).then(res => {})
    }
}