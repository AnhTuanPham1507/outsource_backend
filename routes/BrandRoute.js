const { Router } = require("express");
const router = Router({ mergeParams: true });

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

router
  .post('/', function (req, res, next) {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();
    let ipAddr = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let config = require('config');
    const moment = require('moment')

    let tmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');
    let vnpUrl = config.get('vnp_Url');
    let returnUrl = config.get('vnp_ReturnUrl');
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const orderId = moment(date).format('HHmmss');
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params = sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    console.log(vnp_Params)
    console.log(vnpUrl)
    res.json(vnpUrl)
  })

  .get('/vnpay_return', async function (req, res, next) {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let config = require('config');
    let tmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");


    if (secureHash === signed) {
      //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
      const nodemailer = require("nodemailer")
      const QRCode = require('qrcode')

      const qrCode = await QRCode.toDataURL('http://localhost:3000')
      const email = 'huynhquocduong789@gmail.com';

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'phamanhtuan9a531@gmail.com', // generated ethereal user
          pass: 'wepnhrqbyoostyod'
        },
      });
      // send mail with defined transport object
      await transporter.sendMail({
        from: 'Thông báo', // sender address
        to: email, // list of receivers
        subject: "Thanh toán thành công", // Subject line
        attachDataUrls: true,
        html: `
          <h1>Thanh toán thành công</h1>
          <p>bạn đã đăng ký thành công nhận bằng tốt nghiệp, bên dưới là thông tin của bạn.</p>
          <img src=${qrCode} />
        `  
      });
      res.status(200).json({message: 'thành công'})
    } else {
      res.render('success', { code: '97' })
    }
  });
module.exports = { router };
