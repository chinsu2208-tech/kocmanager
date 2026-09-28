# KOC Manager — MVP

Web app quản lý KOC lên bài TikTok cho sản phẩm: thêm KOC, gán KOC vào chiến dịch cho từng sản phẩm, lưu link bài đăng, và **cập nhật hiệu quả nhiều lần theo thời gian** để theo dõi (follow) diễn biến của từng KOC — không chỉ xem một lần rồi thôi.

Xây bằng Next.js (React) + Supabase (cơ sở dữ liệu có sẵn, không cần tự dựng server). Đây là code thật, Sếp toàn quyền sở hữu, không phụ thuộc nền tảng no-code nào.

## Cách hoạt động

- **Trang KOC**: thêm/xem danh sách KOC đang hợp tác (tên, handle, khu vực, ngách, follower, giá booking).
- **Trang Chiến dịch**: gán 1 KOC cho 1 sản phẩm thành 1 chiến dịch, theo dõi trạng thái (Chờ xác nhận → Đã xác nhận → Đã lên bài → Hoàn thành).
- **Trang chi tiết chiến dịch**: dán link bài đăng TikTok, và **ghi nhận số liệu hiệu quả nhiều lần** (views, likes, bình luận, chia sẻ, CVR, doanh thu quy đổi) — mỗi lần ghi là một mốc thời gian, xem được cả lịch sử tăng/giảm.
- **Dashboard**: xếp hạng KOC nào đang hiệu quả nhất dựa trên toàn bộ lịch sử cập nhật.

## Bước 1 — Tạo cơ sở dữ liệu miễn phí trên Supabase (khoảng 5 phút)

1. Vào [supabase.com](https://supabase.com), đăng ký tài khoản miễn phí, bấm **New Project**.
2. Đặt tên project tuỳ ý, chọn mật khẩu database, chọn khu vực gần Sếp (vd Europe).
3. Đợi project khởi tạo xong (khoảng 1-2 phút), vào mục **SQL Editor** ở menu bên trái, bấm **New query**.
4. Mở file `supabase/schema.sql` trong thư mục này, copy toàn bộ nội dung, dán vào ô SQL Editor, bấm **Run**. Bước này tạo 4 bảng dữ liệu (KOC, sản phẩm, chiến dịch, lịch sử hiệu quả).
5. Vào mục **Project Settings → API**, copy 2 giá trị:
   - **Project URL** → đây là `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → đây là `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Bước 2 — Đẩy code lên GitHub

1. Vào [github.com](https://github.com), đăng nhập (hoặc tạo tài khoản miễn phí).
2. Bấm **New repository**, đặt tên (vd `koc-manager`), để **Private** nếu muốn, bấm **Create repository**.
3. GitHub sẽ hiện hướng dẫn "…or push an existing repository from the command line" — mở Terminal trong thư mục này (đã giải nén) và chạy đúng các dòng lệnh đó, dạng:

```bash
git init
git add .
git commit -m "Khởi tạo KOC Manager MVP"
git branch -M main
git remote add origin https://github.com/<ten-tai-khoan>/koc-manager.git
git push -u origin main
```

(Thay `<ten-tai-khoan>` bằng username GitHub thật của Sếp — GitHub hiện sẵn dòng lệnh đúng khi Sếp tạo repo xong, copy dán là được, không cần nhớ.)

## Bước 3 — Deploy lên Vercel (khoảng 2 phút)

1. Vào [vercel.com](https://vercel.com), đăng nhập bằng chính tài khoản GitHub vừa dùng.
2. Bấm **Add New → Project**, chọn repo `koc-manager` vừa đẩy lên, bấm **Import**.
3. Ở mục **Environment Variables**, thêm đúng 2 biến đã lấy ở Bước 1:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Bấm **Deploy**. Sau khoảng 1-2 phút, Vercel cho một đường link thật (vd `koc-manager.vercel.app`) — đây là app sống thật, ai có link cũng mở được.

Từ lần sau, mỗi khi code được cập nhật và đẩy lên GitHub (`git push`), Vercel tự động deploy lại bản mới — không cần làm lại các bước trên.

## Ghi chú kỹ thuật (đọc khi cần mở rộng)

- MVP hiện dùng chung 1 "khoá" truy cập dữ liệu (anon key) cho tất cả — phù hợp khi chỉ một mình Sếp dùng riêng. Khi có nhiều người dùng (nhân viên, đối tác), cần bật Supabase Auth (đăng nhập) và sửa lại policy trong `supabase/schema.sql` để mỗi người chỉ thấy dữ liệu của mình — phần này nên có technical advisor hỗ trợ.
- Số liệu hiệu quả hiện đang **nhập tay** — đúng theo lộ trình đã bàn: khi đăng ký được TikTok Shop Partner API, có thể thay bước nhập tay bằng đồng bộ tự động.
- Muốn đổi giao diện, thêm cột dữ liệu, thêm trang mới — sửa trực tiếp trong các file ở thư mục `app/`, hoặc nhờ AI coding tool (Claude Code, Cursor...) hỗ trợ chỉnh theo yêu cầu bằng lời.
