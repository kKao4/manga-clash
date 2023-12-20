import { useEffect, useMemo, useRef } from "react"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Scrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { selectGuide, toggleGuide } from "@/features/GlobalSlice";
import { useOnClickOutside, useLockedBody } from "usehooks-ts";
import { useKeyPressEscape } from "@/hooks/useKeyPressEscape";
import CloseButton from "../global/signIn_signUp_resetPassword/close-button";

export default function Guide() {
  const dispatch = useDispatch()
  const showGuide = useSelector(selectGuide)
  const [locked, setLocked] = useLockedBody(false, "root")
  const myRef = useRef<HTMLDivElement>(null)
  // Khóa scroll khi mở modal guide
  useEffect(() => {
    setLocked(showGuide)
  }, [setLocked, showGuide])
  // Cấu hình smooth scrollbar
  useEffect(() => {
    if (showGuide) {
      Scrollbar.use(OverscrollPlugin)
      Scrollbar.initAll({
        plugins: {
          overscroll: "bounce"
        },
        alwaysShowTracks: true,
        renderByPixels: false,
      })
    }
  }, [showGuide])
  // Thoát modal khi nhấn escape
  useKeyPressEscape(() => dispatch(toggleGuide(false)))
  // Thoát modal khi nhấn bên ngoài
  useOnClickOutside(myRef, () => dispatch(toggleGuide(false)))
  const codeString = useMemo(() => {
    return `"dependencies": {
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
  "cloudinary": "^1.41.0",
  "cookie": "^0.5.0",
  "disqus-react": "^1.1.5",
  "eslint": "8.48.0",
  "eslint-config-next": "^14.0.4",
  "framer-motion": "^10.16.9",
  "html-react-parser": "^4.2.2",
  "jose": "^4.14.6",
  "jsonwebtoken": "^9.0.2",
  "mongodb": "^6.1.0",
  "next": "^14.0.4",
  "next-auth": "^4.24.5",
  "next-csrf": "^0.2.1",
  "nodemailer": "^6.9.5",
  "nprogress": "^0.2.0",
  "numeral": "^2.0.6",
  "postcss": "8.4.29",
  "react": "^18.2.0",
  "react-device-detect": "^2.2.3",
  "react-dnd": "^16.0.1",
  "react-dnd-html5-backend": "^16.0.1",
  "react-dnd-touch-backend": "^16.0.1",
  "react-dom": "^18.2.0",
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
`
  }, [])
  const revealVariants: Variants = useMemo(() => {
    return {
      hidden: { opacity: 0, y: 18 },
      show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    }
  }, [])
  return (
    <AnimatePresence>
      {showGuide && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="ease-out w-full fixed bg-[rgba(0,0,0,0.6)] grid md:py-14 justify-items-center items-start md:place-items-center z-50 top-0"
          style={{ height: "100dvh" }}
        >
          <motion.div initial={{ display: "grid" }} animate={{ display: "none" }} transition={{ delay: 0.6 }} className="max-h-[640px] max-w-[1000px] overflow-hidden grid place-content-center">
            <motion.div
              initial={{ clipPath: "circle(2% at 50% 35%)" }}
              animate={{ clipPath: "circle(100% at 50% 35%)" }}
              transition={{ duration: 1, delay: 0.12 }}
              className="bg-white dark:bg-neutral-800 z-20 h-[1200px] w-[1200px] text-center rounded-full grid place-content-center" />
          </motion.div>
          <motion.div initial={{ display: "none" }} animate={{ display: "block" }} transition={{ delay: 0.6 }} ref={myRef} data-scrollbar className="bg-white overflow-y-auto overflow-x-hidden max-h-[640px] max-w-[1000px] dark:bg-neutral-800 shadow-lg rounded-md">
            <CloseButton handleOnClick={() => dispatch(toggleGuide(false))} />
            <div className="px-4 py-3 md:px-8 md:py-6 md:pr-9">
              <motion.div
                initial="hidden"
                whileInView="show"
                variants={revealVariants}
                viewport={{ margin: "-120px", once: true }}
                className="prose max-w-full dark:prose-invert prose-a:no-underline prose-a:font-bold prose-a:text-third-green prose-p:my-4 prose-h2:mb-5 overflow-auto prose-neutral"
              >
                <h2>Giới thiệu về website</h2>
                <strong className="inline-block">Github: <a href="https://github.com/kKao4/manga-clash" target="_blank">https://github.com/kKao4/manga-clash</a></strong>
                <div>
                  <p>Trang web được dùng cho cả admin và user. Với user, trang web sẽ có đầy đủ các tính năng mà 1 trang web đọc truyện có, với admin sẽ có thêm các tính năng quản lý truyện.</p>
                  <p><b>Tính năng cho user:</b> Đăng ký, Đăng nhập, Lấy lại mật khẩu, Đọc truyện, Chế độ đọc truyện Full/Single, Chế độ điều hướng nhanh khi đọc truyện, Thanh tiến trình đọc truyện, Bình luận truyện, Đánh giá truyện, Theo dõi truyện, Lọc truyện, Tìm kiếm truyện nâng cao, Thay đổi chế độ sáng/tối, Cập nhật thông tin tài khoản như: sửa tên, đổi ảnh đại diện,..., Lưu lịch sử đọc chapter/truyện.</p>
                  <p><b>Tính năng bổ sung cho admin:</b> Xem thống kê lượt đọc truyện, Tạo truyện mới, Chỉnh sửa thông tin truyện, Thêm chapter cho truyện, Xóa chapter truyện, Xóa truyện.</p>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="basis-1/2">
                    <p className="my-3">TK admin:</p>
                    <ul className="whitespace-pre">
                      <li>gmail:  admin@gmail.com</li>
                      <li>password:  admin1234</li>
                    </ul>
                  </div>
                  <div className="basis-1/2">
                    <p className="my-3">TK user:</p>
                    <ul className="whitespace-pre">
                      <li>gmail:  user@gmail.com</li>
                      <li>password:  user1234</li>
                    </ul>
                  </div>
                </div>
                <b>Trang web sử dụng các thư viện chính sau:</b>
                <ol>
                  <li>NextJS 14.0.4 (Page router)</li>
                  <li>Tailwind CSS 3.3.3</li>
                  <li>NodeJS 20.5.8</li>
                  <li>Redux Toolkit 1.9.5</li>
                  <li>Mongodb 6.1.0</li>
                  <li>Typescript 5.2.2</li>
                </ol>
                <b>Sau đây là danh sách chi tiết toàn bộ các thư viện được sử dụng:</b>
                <SyntaxHighlighter
                  language="json"
                  style={atomOneDark}
                  customStyle={{
                    padding: "12px 18px",
                    marginBottom: "24px",
                    overflow: "auto"
                  }}
                  wrapLongLines
                >
                  {codeString}
                </SyntaxHighlighter>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}