const sdk = require('verimor-node-sdk');
const sendSms = (phone, msg) => {
  try {
    const client = sdk.createClient({
      username: '908502420114',
      password: '@Ru(ZVfZTL3j=y(2S',
    });
    const payload = {
      source_addr: '',
      messages: [
        {
          msg: msg,
          dest: phone,
        },
      ],
    };
    client.send(payload);
    return true;
  } catch (error) {
    return false;
  }
};
module.exports = sendSms;
