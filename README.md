# BÁO CÁO BÀI TẬP GIỮA KỲ - HỆ THỐNG KHẢO THÍ TOEIC READING

> **Môn học:** Phát triển ứng dụng Web / Đồ án chuyên ngành  
> **Giao diện thiết kế:** Google Stitch AI Design (Project ID: `4788327547434450586`)  
> **Kiến trúc:** Frontend (HTML5, TailwindCSS, JavaScript ES6) + Backend (OpenXML Parser, C# ASP.NET Core Models & Python Services)

---

## 📌 1. Danh sách 5 chức năng đã hoàn thành

1. **Chức năng 1: Upload file & Tạo đề thi từ file Word (.docx)**
   - Nhận diện file `.docx` chứa định dạng thẻ TOEIC (`<QUESTION>`, `<PART>`, `<PASSAGE_GROUP>`).
   - Tự động bóc tách cấu trúc đề thi thành các phần Part 5 (30 câu), Part 6 (16 câu), Part 7 (54 câu).
2. **Chức năng 2: Cập nhật & Chỉnh sửa nội dung đề thi**
   - Bảng biên tập trực tiếp câu hỏi, sửa nội dung, lựa chọn đáp án đúng A/B/C/D.
   - Cơ chế thẩm định tính toàn vẹn (Validation) trước khi lưu vào hệ thống cơ sở dữ liệu.
3. **Chức năng 3: Hiển thị danh sách đề thi để User lựa chọn**
   - Giao diện thẻ danh sách đề thi cho học viên duyệt qua các đề thi sẵn có, tìm kiếm và chọn bài thi.
4. **Chức năng 4: Phòng thi trực tuyến (Taking Exam)**
   - Chia đôi màn hình đọc đoạn văn (Part 6, Part 7) và trả lời câu hỏi.
   - Đồng hồ đếm ngược 75 phút, ma trận 100 câu hỏi, tính năng đánh dấu câu phân vân và tự động nộp khi hết giờ.
5. **Chức năng 5: Hiển thị kết quả thi & Bảng giải thích chi tiết**
   - Quy đổi điểm số sang thang điểm chuẩn TOEIC Reading (tối đa 495 điểm).
   - Biểu đồ tỷ lệ chính xác %, phân tích theo từng Part 5, 6, 7.
   - Bảng phân tích chi tiết từng câu: đáp án học viên chọn, đáp án đúng và lời giải thích.

---

## 📁 2. Cấu trúc thư mục dự án

```text
├── frontend/                  # Giao diện ứng dụng Client (HTML5, TailwindCSS, JS)
│   ├── index.html             # Trang điều hướng tổng thể các chức năng
│   ├── admin_dashboard.html   # Quản lý đề thi & Thống kê
│   ├── admin_import_preview.html # Upload file Word & Sửa đề thi
│   ├── student_exam_list.html # Danh sách đề thi cho học viên chọn
│   ├── student_take_exam.html # Phòng thi làm bài trực tiếp
│   ├── student_exam_result.html # Xem kết quả & giải thích chi tiết
│   └── js/                    # Các controller xử lý logic từng trang
├── backend/                   # Dữ liệu & dịch vụ xử lý đề thi
│   ├── services/              # Bộ parser OpenXML bóc tách dữ liệu Word sang JSON
│   └── data/                  # File Word mẫu & dữ liệu JSON chuẩn
├── videos/                    # 🎥 Thư mục chứa video demo full screen từng chức năng
│   └── README.md
└── 10.2.0/                    # Dự án doanh nghiệp (ASP.NET Core & Angular)
```

---

## 🎥 3. Thư mục Video Demo (`videos/`)

Các video quay màn hình full screen demo từng chức năng được lưu tại thư mục `videos/`:
- `videos/01_upload_tao_de_tu_word.mp4`
- `videos/02_chinh_sua_noi_dung_de_thi.mp4`
- `videos/03_danh_sach_de_thi.mp4`
- `videos/04_lam_bai_thi_truc_tuyen.mp4`
- `videos/05_ket_qua_thi_va_giai_thich.mp4`

---

## 🚀 4. Hướng dẫn chạy thử nghiệm

Mở trực tiếp file `frontend/index.html` trên trình duyệt hoặc chạy bằng Python Server:
```bash
cd frontend
python -m http.server 3000
```
Truy cập: `http://localhost:3000`
