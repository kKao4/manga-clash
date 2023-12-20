# Giới thiệu về website

Link website: [https://manga-kkao4.vercel.app](https://manga-kkao4.vercel.app)

Website được tạo nên bởi __kKao4__

Trang web được dùng cho cả admin và user. Với user, trang web sẽ có đầy đủ các tính năng mà 1 trang web đọc truyện có, với admin sẽ có thêm các tính năng quản lý truyện.

Tính năng cho user: Đăng ký, Đăng nhập, Lấy lại mật khẩu, Đọc truyện, Chế độ đọc truyện Full/Single, Chế độ điều hướng nhanh khi đọc truyện, Thanh tiến trình đọc truyện, Bình luận truyện, Đánh giá truyện, Theo dõi truyện, Lọc truyện, Tìm kiếm truyện nâng cao, Thay đổi chế độ sáng/tối, Cập nhật thông tin tài khoản như: sửa tên, đổi ảnh đại diện,..., Lưu lịch sử đọc chapter/truyện.

Tính năng bổ sung cho admin: Xem thống kê lượt đọc truyện, Tạo truyện mới, Chỉnh sửa thông tin truyện, Thêm chapter cho truyện, Xóa chapter truyện, Xóa truyện.

TK admin:

- gmail: admin\@gmail.com
- password: admin123

TK user:

- gmail: user\@gmail.com
- password: user123

Trang web sử dụng các thư viện chính sau:

1. NextJS 14.0.4 (Page router)
2. Tailwind CSS 3.3.3
3. NodeJS 20.5.8
4. Redux Toolkit 1.9.5
5. Mongodb 6.1.0
6. Typescript 5.2.2

Sau đây là danh sách chi tiết toàn bộ các thư viện được sử dụng:

```json
  "dependencies": {
  "@cloudinary/react": "^1.11.2",
  "@cloudinary/url-gen": "^1.12.0",
  "@popperjs/core": "^2.11.8",
  "@react-hook/mouse-position": "^4.1.3",
  "@types/node": "20.5.8",
  "@types/react": "18.2.21",
  "@types/react-dom": "18.2.7",
  "@uidotdev/usehooks": "^2.4.1",
  "@vercel/analytics": "^1.1.1",
  "autoprefixer": "10.4.15",
  "bootstrap-icons": "^1.11.2",
  "cloudinary": "^1.41.0",
  "cookie": "^0.5.0",
  "disqus-react": "^1.1.5",
  "eslint": "8.48.0",
  "eslint-config-next": "13.4.19",
  "framer-motion": "^10.16.9",
  "html-react-parser": "^4.2.2",
  "jose": "^4.14.6",
  "jsonwebtoken": "^9.0.2",
  "mongodb": "^6.1.0",
  "next": "13.4.19",
  "next-auth": "^4.24.5",
  "next-csrf": "^0.2.1",
  "nodemailer": "^6.9.5",
  "nprogress": "^0.2.0",
  "numeral": "^2.0.6",
  "postcss": "8.4.29",
  "react": "18.2.0",
  "react-device-detect": "^2.2.3",
  "react-dnd": "^16.0.1",
  "react-dnd-html5-backend": "^16.0.1",
  "react-dnd-touch-backend": "^16.0.1",
  "react-dom": "18.2.0",
  "react-popper": "^2.3.0",
  "react-ripples": "^2.2.1",
  "react-scroll": "^1.9.0",
  "react-slick": "^0.29.0",
  "react-spinners": "^0.13.8",
  "react-syntax-highlighter": "^15.5.0",
  "react-toastify": "^9.1.3",
  "react-transition-group": "^4.4.5",
  "sharp": "^0.32.6",
  "slick-carousel": "^1.8.1",
  "smooth-scrollbar": "^8.8.4",
  "tailwindcss": "3.3.3",
  "typescript": "5.2.2",
  "usehooks-ts": "^2.9.1"
},
"devDependencies": {
  "@reduxjs/toolkit": "^1.9.5",
  "@tailwindcss/typography": "^0.5.10",
  "@types/bcrypt": "^5.0.0",
  "@types/cookie": "^0.5.2",
  "@types/express-fileupload": "^1.4.2",
  "@types/formidable": "^3.4.3",
  "@types/multiparty": "^0.0.33",
  "@types/nodemailer": "^6.4.10",
  "@types/nprogress": "^0.2.1",
  "@types/numeral": "^2.0.3",
  "@types/react-highlight": "^0.12.8",
  "@types/react-scroll": "^1.8.9",
  "@types/react-slick": "^0.23.12",
  "@types/react-syntax-highlighter": "^15.5.11",
  "@types/react-transition-group": "^4.4.9",
  "axios": "^1.5.1",
  "bcrypt": "^5.1.1",
  "date-fns": "^2.30.0",
  "formidable": "^3.5.1",
  "moongose": "^1.0.0",
  "react-paginate": "^8.2.0",
  "react-redux": "^8.1.2"
}
```
