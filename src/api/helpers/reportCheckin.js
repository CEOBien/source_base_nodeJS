
const reportCheckin =  (attendance, dataUser) =>{
    try {
        const result = []
        for (let i = 0; i < dataUser.length; i++ ){
        let resultObj = {}
        
            if(dataUser[i]?.COMPETTION_CODE !== dataUser[i-1]?.COMPETTION_CODE){
                let filter = dataUser.filter((ele)=>
                    ele?.COMPETTION_CODE === dataUser[i]?.COMPETTION_CODE
                )
                resultObj.TEAM_NAME = filter[0]?.TEAM_NAME
                resultObj.COMPETTION_CODE = filter[0]?.COMPETTION_CODE
                resultObj.REGISTED_TOTAL = filter.length

                let checked = 0
                for(let i = 0; i < filter.length; i++){
                    const countUserCheckin = attendance?.rows.filter((item)=>item?.USER_ID === filter[i]?.id && item?.CHECK_IN_DATE_TIME !== null).length
                    const countUserCheckout= attendance?.rows.filter((item)=>item?.USER_ID === filter[i]?.id && item?.CHECK_OUT_DATE_TIME !== null).length
                    if(countUserCheckin -countUserCheckout !== 0 ){
                        checked = checked + 1
                    }
                }
                resultObj.CHECKEDIN_TOTAL = checked
                resultObj.STATUS = filter.length - checked === 0 ?1:0
                result.push(resultObj)
            }

        }

        return result
    } catch (error) {
        console.log(error);
    }
}
module.exports =  reportCheckin