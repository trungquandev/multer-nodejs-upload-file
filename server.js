/**
 * Created by trungquandev.com's author on 23/06/2019.
 * server.js
 */
 
let express = require("express");
let multer = require("multer");
let path = require("path");
let bodyParser = require("body-parser");
 
let app = express();
// Khai báo sử dụng body-parser để nhận data từ form
app.use(bodyParser.urlencoded({extended: true}));
 
// Route này trả về cái form upload cho client
app.get("/", (req, res) => {
  res.sendFile(path.join(`${__dirname}/views/master.html`));
});
 
// Khởi tạo biến cấu hình cho việc lưu trữ file upload
let diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Định nghĩa nơi file upload sẽ được lưu lại
    callback(null, "uploads");
  },
  filename: (req, file, callback) => {
    // ở đây các bạn có thể làm bất kỳ điều gì với cái file nhé.
    // Mình ví dụ chỉ cho phép tải lên các loại ảnh png & jpg
    let math = ["image/png", "image/jpeg"];
    if (math.indexOf(file.mimetype) === -1) {
      let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
      return callback(errorMess, null);
    }
 
    // Tên của file thì mình nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
    let filename = `${Date.now()}-trungquandev-${file.originalname}`;
    callback(null, filename);
  }
});
 
// Khởi tạo middleware uploadFile với cấu hình như ở trên,
// Bên trong hàm .single() truyền vào name của thẻ input, ở đây là "file"
let uploadFile = multer({storage: diskStorage}).single("file");
 
// Route này Xử lý khi client thực hiện hành động upload file
app.post("/upload", (req, res) => {
  // Thực hiện upload file, truyền vào 2 biến req và res
  uploadFile(req, res, (error) => {
    // Nếu có lỗi thì trả về lỗi cho client.
    // Ví dụ như upload một file không phải file ảnh theo như cấu hình của mình bên trên
    if (error) {
      return res.send(`Error when trying to upload: ${error}`);
    }

    console.log(`------Request body-----`);
    console.log(req.body);

    console.log(`------Request file-----`);
    console.log(req.file);

    console.log(`------Test Done-----`)

    // Không có lỗi thì lại render cái file ảnh về cho client.
    // Đồng thời file đã được lưu vào thư mục uploads
    // res.sendFile(path.join(`${__dirname}/uploads/${req.file.filename}`));
  });
});
 
app.listen(8017, "localhost", () => {
  console.log(`Hello trungquandev.com, I'm running at localhost:8017/`);
});