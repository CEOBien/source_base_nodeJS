const axios = require("axios");
const dataGetAllUser = async () => {
  const { data } = await axios.get(
    `${process.env.USER_DATA_BASE_URL}/api/v1/wro2023User/getAll`
  );

  return { data };
};

module.exports = { dataGetAllUser };
