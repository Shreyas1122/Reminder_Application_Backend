const ImageKit = require("imagekit");


//configuration of the imagekit
const imagekit = new ImageKit({
  publicKey: "public_Xs+f3gUYATgDBgpiN+3DnPLJia8=",
  privateKey: "private_GM0Fd1ulQG8bAsNCWrAG64a4FSw=",
  urlEndpoint: "https://ik.imagekit.io/cxf1trzwj"
});

module.exports=imagekit;