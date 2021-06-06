const tokenGenerator = () => {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let length = 8;
  let output = "";
  for (var i = 0; i < length; i++) {
    var num = Math.floor(Math.random() * chars.length);
    output += chars.substring(num, num + 1);
  }
  return output;
};

export default tokenGenerator;
