

const checkinResult = (attendance, data) =>{

    
    let compettion_code = data.elements.find(
        (element) => element.id == attendance.USER_ID
      )?.COMPETTION_CODE;


    var convertedJSON = JSON.parse(JSON.stringify(attendance));


    convertedJSON.COMPETTION_CODE = compettion_code


    return convertedJSON
}
module.exports = { checkinResult };
