2.3.1 Các quy trình, nghiệp vụ
2.3.1.1 Quy trình quản lí Tài khoản
Mô tả nghiệp vụ:
Hệ thống quản lý ba lớp đối tượng: Vai trò xác định quyền hạn (Admin, Phục vụ, Bếp, Thu ngân); Tài khoản là thông tin đăng nhập gắn với một vai trò — riêng ba vai trò Phục vụ, Bếp, Thu ngân dùng chung một tài khoản cho cả nhóm; Hồ sơ nhân viên là thông tin định danh thực tế của từng người, được gán vào tài khoản tương ứng ngay khi tạo.
Mỗi thiết bị tại khu vực được đăng nhập một lần vào đầu ngày bằng tài khoản đúng vai trò, phiên này duy trì cả ngày. Trong ngày, từng nhân viên chỉ cần chạm chọn hồ sơ của mình trên thiết bị đã đăng nhập (không cần xác thực thêm) để hệ thống biết ai đang thao tác; mã hồ sơ này tự động đính kèm vào mọi hành vi nghiệp vụ cho đến khi có lượt chọn khác, phục vụ truy vết trách nhiệm. Tài khoản Admin được gắn cố định với một hồ sơ nhân viên duy nhất, tự động xác định ngay sau khi đăng nhập mà không qua bước chọn hồ sơ, dùng để ghi nhận trong các thao tác quản trị
Trạng thái tài khoản và hồ sơ gồm Hoạt động / Ngừng hoạt động; ở trạng thái Ngừng hoạt động sẽ không được đăng nhập hoặc không xuất hiện trong danh sách chọn liên quan.
a. Quy trình đăng nhập thiết bị đầu ngày
Bước 1: Đầu ngày làm việc, Admin truy cập giao diện đăng nhập trên thiết bị đặt tại khu vực, nhập tên đăng nhập và mật khẩu của tài khoản vai trò tương ứng với khu vực đó.
Bước 2: Hệ thống thực hiện kiểm tra tính hợp lệ về mặt hình thức của thông tin đầu vào:

- Nếu các trường thông tin bắt buộc bị bỏ trống hoặc điền thiếu: Hệ thống hiển thị thông báo nhắc nhở dữ liệu không đầy đủ và quay lại Bước 1.
- Nếu thông tin đã được điền đầy đủ: Hệ thống phê duyệt và chuyển sang Bước 3.
  Bước 3: Hệ thống thực hiện đối chiếu thông tin tài khoản vừa nhập với dữ liệu lưu trữ trong cơ sở dữ liệu:
- Nếu tài khoản không tồn tại trên hệ thống, nhập sai mật khẩu, hoặc tài khoản này đang ở trạng thái Ngừng hoạt động: Hệ thống hiển thị thông báo "Đăng nhập thất bại" và chuyển hướng quay lại Bước 1.
- Nếu thông tin tài khoản hoàn toàn chính xác và hợp lệ: Hệ thống phê duyệt quyền truy cập, khởi tạo phiên làm việc cho thiết bị và chuyển sang Bước 4.
  Bước 4: Hệ thống hiển thị màn hình chờ chọn hồ sơ nhân viên, sẵn sàng để nhân viên sử dụng trong suốt ngày làm việc.
  Bước 5: Kết thúc quy trình.

Hình 2. Sơ đồ quy trình đăng nhập thiết bị

b. Quy trình chọn hồ sơ nhân viên (vào ca)
Bước 1: Nhân viên vào ca, trên thiết bị đang ở trạng thái đã đăng nhập, chạm vào chức năng "Chọn nhân viên".
Bước 2: Hệ thống truy vấn và hiển thị danh sách hồ sơ nhân viên đang ở trạng thái Hoạt động, thuộc đúng vai trò của tài khoản đang đăng nhập trên thiết bị.
Bước 3: Nhân viên tìm kiếm và chạm chọn đúng họ tên của mình trong danh sách hiển thị.
Bước 4: Hệ thống ghi nhận mã hồ sơ nhân viên vừa chọn là người thao tác hiện hành trên thiết bị, áp dụng cho mọi hành vi nghiệp vụ tiếp theo cho đến khi có lượt chọn khác hoặc thiết bị bị đưa về trạng thái chờ chọn.
Bước 5: Hệ thống chuyển hướng đến giao diện chức năng nghiệp vụ tương ứng với vai trò.
Bước 6: Kết thúc quy trình.

Hình 2. Sơ đồ quy trình chọn hồ sơ nhân viên

c. Quy trình hết ca / đổi người
Bước 1: Nhân viên chuẩn bị rời vị trí làm việc (hết ca, nghỉ giải lao, bàn giao cho người khác), chạm chức năng "Hết ca" trên thanh công cụ điều hướng của thiết bị.
Bước 2: Hệ thống tiếp nhận yêu cầu, xóa mã hồ sơ nhân viên đang active khỏi phiên làm việc hiện hành của thiết bị.
Bước 3: Hệ thống đưa thiết bị về trạng thái chờ chọn hồ sơ đồng thời tạm khóa các chức năng nghiệp vụ có yêu cầu định danh nhân viên (gọi món, xác nhận, thanh toán...).
Bước 4: Hệ thống hiển thị màn hình chờ chọn hồ sơ nhân viên, sẵn sàng cho nhân viên kế tiếp thực hiện quy trình b.
Bước 5: Kết thúc quy trình.
Hình 2. Sơ đồ quy trình hết ca / đổi người

Hình 2. Sơ đồ quy trình đổi ca

d. Quy trình đóng ngày (đăng xuất thiết bị)
Bước 1: Cuối ngày hoạt động, quản lý ca chọn chức năng "Đóng ca" trên thiết bị.
Bước 2: Hệ thống tiếp nhận yêu cầu chấm dứt phiên làm việc của thiết bị.
Bước 3: Hệ thống thực hiện xóa bỏ toàn bộ thông tin xác thực của tài khoản và mã hồ sơ nhân viên đang được chọn (nếu có) khỏi phiên làm việc hiện hành, để bảo mật dữ liệu và tránh việc người sau sử dụng nhầm danh tính.
Bước 4: Hệ thống tự động chuyển hướng màn hình hiển thị quay trở lại giao diện đăng nhập thiết bị ban đầu.
Bước 5: Kết thúc quy trình.
Hình 2. Sơ đồ quy trình đóng ngày

Hình 2. Sơ đồ quy trình đóng ngày (đăng xuất thiết bị)

e. Quy trình quản lý tài khoản (Admin)
Mô tả: Admin quản lý thông tin đăng nhập của từng tài khoản vai trò: tạo mới, đổi mật khẩu, khóa/mở tài khoản. Mỗi thao tác trên một tài khoản sẽ tác động đến toàn bộ nhân viên đang gắn với tài khoản đó.
e1. Quy trình thêm tài khoản
Bước 1: Admin truy cập vào chức năng "Quản lý tài khoản" trên giao diện điều hành.
Bước 2: Admin lựa chọn nút chức năng "Thêm mới tài khoản".
Bước 3: Admin tiến hành nhập các thông tin cho tài khoản mới, bao gồm:

- Tên đăng nhập
- Mật khẩu khởi tạo
- Vai trò công việc áp dụng (Phục vụ / Bếp / Thu ngân)
- Trạng thái hoạt động (mặc định thiết lập là "Hoạt động")
  Bước 4: Admin kiểm tra lại thông tin và nhấn nút xác nhận "Lưu dữ liệu".
  Bước 5: Hệ thống thực hiện kiểm tra tính hợp lệ và toàn vẹn của dữ liệu:
- Nếu tên đăng nhập đã tồn tại trong cơ sở dữ liệu hoặc các trường thông tin bắt buộc bị bỏ trống: Hệ thống hiển thị thông báo lỗi chi tiết và quay lại Bước 3.
- Nếu dữ liệu hoàn toàn hợp lệ và duy nhất: Hệ thống phê duyệt dữ liệu, khởi tạo tài khoản mới trong cơ sở dữ liệu và chuyển sang Bước 6.
  Bước 6: Hệ thống trả về thông báo "Thêm mới tài khoản thành công" trên màn hình, đồng thời cập nhật lại danh sách hiển thị.
  Bước 7: Kết thúc quy trình.
  Hình 2. Sơ đồ quy trình thêm tài khoản

Hình 2. Sơ đồ quy trình Thêm tài khoản

e2. Quy trình đổi mật khẩu / khóa-mở tài khoản
Bước 1: Admin truy cập vào chức năng "Quản lý tài khoản" trên giao diện hệ thống.
Bước 2: Hệ thống truy vấn và hiển thị danh sách toàn bộ các tài khoản hiện có.
Bước 3: Admin lựa chọn tài khoản cụ thể cần điều chỉnh từ danh sách hiển thị.
Bước 4: Admin thực hiện một trong hai thao tác:

- Đổi mật khẩu mới cho tài khoản.
- Chuyển đổi trạng thái hoạt động (từ Hoạt động sang Ngừng hoạt động hoặc ngược lại).
  Bước 5: Admin nhấn nút xác nhận "Lưu dữ liệu".
  Bước 6: Hệ thống thực hiện kiểm tra tính hợp lệ và cập nhật dữ liệu:
- Nếu dữ liệu không hợp lệ hoặc các trường bắt buộc bị bỏ trống: Hệ thống hiển thị thông báo lỗi và quay lại Bước 4.
- Nếu dữ liệu hợp lệ: Hệ thống ghi nhận thay đổi vào cơ sở dữ liệu và áp dụng cơ chế kiểm soát tự động:
  • Nếu tài khoản chuyển sang trạng thái "Ngừng hoạt động": Hệ thống lập tức thu hồi quyền truy cập của tài khoản này; toàn bộ hồ sơ nhân viên đang gắn với tài khoản không thể đăng nhập thiết bị, bất kể trạng thái riêng của từng hồ sơ.
  • Nếu tài khoản chuyển sang trạng thái "Hoạt động": Hệ thống mở khóa quyền truy cập, cho phép tài khoản đăng nhập thiết bị bình thường trở lại.
  Bước 7: Hệ thống trả về thông báo "Cập nhật tài khoản thành công" trên màn hình và làm mới lại giao diện danh sách.
  Bước 8: Kết thúc quy trình.
  Hình 2. Sơ đồ quy trình đổi mật khẩu / khóa-mở tài khoản

Hình 2. Sơ đồ quy trình Đổi mật khẩu tài khoản

f. Quy trình quản lý hồ sơ nhân viên (Admin)
Mô tả: Admin quản lý thông tin định danh thực tế của từng nhân viên và gán họ vào tài khoản vai trò tương ứng ngay khi tạo hồ sơ. Thao tác khóa một hồ sơ chỉ ảnh hưởng đến cá nhân đó, không ảnh hưởng đến những nhân viên khác đang dùng chung tài khoản.
f1. Quy trình thêm hồ sơ nhân viên
Bước 1: Admin truy cập vào chức năng "Quản lý nhân viên" trên giao diện điều hành.
Bước 2: Admin lựa chọn nút chức năng "Thêm mới nhân viên".
Bước 3: Admin tiến hành nhập các thông tin cho hồ sơ mới, bao gồm:

- Họ và tên
- Số điện thoại liên hệ
- Tài khoản (vai trò) để gán hồ sơ vào ngay lúc tạo — vai trò công việc của nhân viên được hệ thống tự động xác định theo tài khoản được chọn, không yêu cầu nhập riêng.
  Bước 4: Admin kiểm tra lại thông tin và nhấn nút xác nhận "Lưu dữ liệu".
  Bước 5: Hệ thống thực hiện kiểm tra tính hợp lệ:
- Nếu các trường thông tin bắt buộc bị bỏ trống hoặc tài khoản được chọn không tồn tại/đang Ngừng hoạt động: Hệ thống hiển thị thông báo lỗi và quay lại Bước 3.
- Nếu dữ liệu hợp lệ: Hệ thống khởi tạo hồ sơ nhân viên mới, liên kết ngay với tài khoản đã chọn và chuyển sang Bước 6.
  Bước 6: Hệ thống trả về thông báo "Thêm mới nhân viên thành công" trên màn hình, đồng thời cập nhật lại danh sách hiển thị.
  Bước 7: Kết thúc quy trình.

Hình 2. Sơ đồ quy trình thêm hồ sơ nhân viên

f2. Quy trình cập nhật / khóa-mở hồ sơ nhân viên
Bước 1: Admin truy cập vào chức năng "Quản lý nhân viên" trên giao diện hệ thống.
Bước 2: Hệ thống truy vấn và hiển thị danh sách toàn bộ hồ sơ nhân viên hiện có.
Bước 3: Admin lựa chọn hồ sơ nhân viên cụ thể cần điều chỉnh từ danh sách hiển thị.
Bước 4: Admin thực hiện một trong hai thao tác:

- Cập nhật thông tin liên hệ (họ tên, số điện thoại).
- Chuyển đổi trạng thái hoạt động (từ Hoạt động sang Ngừng hoạt động hoặc ngược lại).
  Bước 5: Admin nhấn nút xác nhận "Lưu dữ liệu".
  Bước 6: Hệ thống thực hiện kiểm tra tính hợp lệ và cập nhật dữ liệu:
- Nếu dữ liệu không hợp lệ hoặc các trường bắt buộc bị bỏ trống: Hệ thống hiển thị thông báo lỗi và quay lại Bước 4.
- Nếu dữ liệu hợp lệ: Hệ thống ghi nhận thay đổi vào cơ sở dữ liệu. Nếu hồ sơ chuyển sang trạng thái "Ngừng hoạt động": hồ sơ này sẽ không xuất hiện trong danh sách chọn hồ sơ ở Bước 2 của quy trình b, nhưng tài khoản và các hồ sơ khác cùng tài khoản vẫn hoạt động bình thường.
  Bước 7: Hệ thống trả về thông báo "Cập nhật hồ sơ nhân viên thành công" trên màn hình và làm mới lại giao diện danh sách.
  Bước 8: Kết thúc quy trình.
  Hình 2. Sơ đồ quy trình cập nhật / khóa-mở hồ sơ nhân viên

Hình 2. Sơ đồ quy trình Cập nhật hồ sơ nhân viên

2.3.1.2 Quy trình quản lí Danh mục thực đơn
a. Quy trình thêm danh mục thực đơn
Bước 1: Người quản lý truy cập vào chức năng "Quản lý danh mục thực đơn" trên giao diện điều hành.
Bước 2: Hệ thống hiển thị danh sách toàn bộ các danh mục món ăn hiện đang tồn tại trên nhà hàng.
Bước 3: Người quản lý lựa chọn nút chức năng "Thêm mới danh mục".
Bước 4: Hệ thống hiển thị biểu mẫu nhập dữ liệu danh mục mới. Các trường thông tin cần hoàn thiện bao gồm:

- Mã danh mục (Mã tự tăng).
- Tên danh mục (Ví dụ: Nhóm thịt nướng, Nhóm nước giải khát...).
- Mô tả chi tiết về danh mục.
- Trạng thái hoạt động.
  Bước 5: Người quản lý tiến hành điền đầy đủ thông tin vào biểu mẫu và nhấn nút xác nhận "Lưu dữ liệu".
  Bước 6: Hệ thống thực hiện kiểm tra tính hợp lệ và toàn vẹn của dữ liệu vừa nhập:
- Nếu các trường thông tin bắt buộc bị bỏ trống hoặc tên danh mục bị trùng lặp với danh mục đã có: Hệ thống hiển thị cảnh báo lỗi chi tiết và yêu cầu người dùng thực hiện nhập lại tại Bước 5.
- Nếu thông tin hoàn toàn hợp lệ: Hệ thống phê duyệt dữ liệu và chuyển sang Bước 7.
  Bước 7: Hệ thống tiến hành ghi nhận và lưu trữ thông tin danh mục thực đơn mới vào hệ thống dữ liệu chung.
  Bước 8: Hệ thống tự động cập nhật lại danh sách hiển thị trên màn hình quản lý, đồng thời trả về thông báo "Thêm mới danh mục thành công".
  Bước 9: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình thêm mới danh mục

b. Quy trình cập nhật danh mục thực đơn
Bước 1: Người quản lý truy cập vào chức năng "Quản lý danh mục thực đơn" trên giao diện hệ thống.
Bước 2: Hệ thống hiển thị danh sách toàn bộ các danh mục thực đơn hiện có.
Bước 3: Người quản lý nhấn chọn vào danh mục cụ thể cần thay đổi hoặc chỉnh sửa thông tin.
Bước 4: Hệ thống hiển thị biểu mẫu thông tin chi tiết hiện tại của danh mục được chọn.
Bước 5: Người quản lý thực hiện thay đổi các thông tin cần thiết (như sửa tên, thay đổi nội dung mô tả) và nhấn nút xác nhận "Lưu dữ liệu".
Bước 6: Hệ thống thực hiện kiểm tra tính hợp lệ của thông tin sau khi điều chỉnh:

- Nếu dữ liệu chỉnh sửa không hợp lệ hoặc để trống thông tin bắt buộc: Hệ thống hiển thị thông báo lỗi và yêu cầu người dùng thực hiện lại từ Bước 5.
- Nếu dữ liệu hoàn toàn hợp lệ: Hệ thống phê duyệt thay đổi và chuyển sang Bước 7.
  Bước 7: Hệ thống cập nhật các dữ liệu mới của danh mục thực đơn vào hệ thống lưu trữ.
  Bước 8: Hệ thống hiển thị thông báo "Cập nhật danh mục thành công", đồng thời làm mới lại danh sách hiển thị để ghi nhận thông tin mới.
  Bước 9: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình cập nhật danh mục

c. Quy trình thay đổi trạng thái danh mục thực đơn
Bước 1: Người quản lý lựa chọn danh mục thực đơn cụ thể cần thay đổi trạng thái hoạt động trên màn hình quản lý.
Bước 2: Hệ thống hiển thị biểu mẫu thông tin hiện hành của danh mục đó.
Bước 3: Người quản lý tiến hành lựa chọn trạng thái hoạt động mới cho danh mục. Các trạng thái áp dụng bao gồm:

- Đang sử dụng: Danh mục và các món ăn thuộc danh mục này được phép hiển thị trên thực đơn để khách gọi món.
- Ngừng sử dụng: Tạm ẩn danh mục và các món ăn thuộc danh mục này khỏi thực đơn gọi món của khách và nhân viên.
  Bước 4: Hệ thống thực hiện kiểm tra và xác thực dữ liệu:
- Nếu danh mục cần đổi trạng thái đột ngột không còn tồn tại trên hệ thống (do tài khoản khác xóa): Hệ thống hiển thị thông báo lỗi và kết thúc quy trình tại Bước 7.
- Nếu danh mục tồn tại hợp lệ: Hệ thống phê duyệt yêu cầu chuyển đổi trạng thái và chuyển sang Bước 5.
  Bước 5: Hệ thống tiến hành ghi nhận và cập nhật trạng thái hoạt động mới của danh mục vào cơ sở dữ liệu.
  Bước 6: Hệ thống trả về thông báo "Thay đổi trạng thái danh mục thành công" và đồng bộ trạng thái ẩn/hiển thị trên thực đơn điện tử.
  Bước 7: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình thay đổi trạng thái danh mục
d. Quy trình xóa danh mục
Bước 1: Quản trị viên truy cập chức năng quản lý danh mục thực đơn.
Bước 2: Hệ thống hiển thị danh sách các danh mục hiện có.
Bước 3: Quản trị viên lựa chọn danh mục cần xóa.
Bước 4: Quản trị viên xác nhận thao tác xóa.
Bước 5: Hệ thống kiểm tra dữ liệu.

- Nếu danh mục đang chứa một hoặc nhiều món ăn, hệ thống hiển thị thông báo không thể xóa và yêu cầu chuyển trạng thái sang Ngừng hoạt động.
- Nếu danh mục chưa có món ăn nào, hệ thống tiếp tục xử lý.
  Bước 6: Hệ thống xóa thông tin danh mục khỏi cơ sở dữ liệu.
  Bước 7: Hệ thống cập nhật danh sách danh mục và thông báo xóa thành công.
  Bước 8: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình xóa danh mục

e. Quy trình xem và tìm kiếm danh mục thực đơn
Bước 1: Người quản lý truy cập vào chức năng "Quản lý danh mục thực đơn" trên giao diện hệ thống.
Bước 2: Hệ thống hiển thị danh sách tổng quan các danh mục món ăn.
Bước 3: Người quản lý xem danh sách hoặc nhập từ khóa hoặc lựa chọn các điều kiện tìm kiếm trên thanh công cụ. Các tiêu chí hỗ trợ tra cứu bao gồm:

- Mã danh mục
- Tên danh mục
- Trạng thái hoạt động (Đang sử dụng / Ngừng sử dụng)
  Bước 4: Hệ thống thực hiện truy vấn dữ liệu và trả về kết quả tương ứng:
- Nếu không tìm thấy bất kỳ danh mục nào trùng khớp với tiêu chí lọc: Hệ thống hiển thị thông báo cảnh báo "Không tìm thấy kết quả phù hợp" và hiển thị bảng trống để người dùng tìm kiếm lại tại Bước 3.
- Nếu tìm thấy dữ liệu thỏa mãn điều kiện: Hệ thống trả về danh sách các danh mục món ăn tương ứng đầy đủ thông tin trên màn hình.
  Bước 5: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình tìm kiếm danh mục

2.3.1.3 Quy trình quản lí Món ăn
a. Quy trình thêm mới món ăn
Bước 1: Người quản lý truy cập vào chức năng "Quản lý món ăn" trên giao diện điều hành.
Bước 2: Hệ thống hiển thị danh sách toàn bộ các món ăn hiện đang được quản lý tại nhà hàng.
Bước 3: Người quản lý lựa chọn nút chức năng "Thêm mới món ăn".
Bước 4: Hệ thống hiển thị biểu mẫu nhập thông tin chi tiết cho món ăn mới. Các trường thông tin cần điền bao gồm:

- Mã món ăn (Mã tự tăng)
- Tên món ăn (Ví dụ: Dẻ sườn bò Mỹ sốt BBQ, Ba chỉ heo cuộn nấm...).
- Phân loại danh mục thực đơn (Lựa chọn từ các danh mục có sẵn như Món bò, Món heo, Đồ uống...).
- Giá bán niêm yết.
- Hình ảnh minh họa món ăn.
- Mô tả thành phần hoặc hương vị món ăn.
- Trạng thái kinh doanh (Hệ thống mặc định thiết lập ban đầu là "Đang kinh doanh").
  Bước 5: Người quản lý tiến hành điền đầy đủ thông tin vào biểu mẫu và nhấn nút xác nhận "Lưu dữ liệu".
  Bước 6: Hệ thống thực hiện kiểm tra tính hợp lệ và toàn vẹn của dữ liệu đầu vào:
- Nếu các thông tin bắt buộc bị bỏ trống hoặc tên món ăn bị trùng lặp với món ăn đã tồn tại trước đó: Hệ thống hiển thị thông báo lỗi chi tiết và yêu cầu người dùng nhập lại thông tin tại Bước 5.
- Nếu thông tin hoàn toàn hợp lệ: Hệ thống phê duyệt dữ liệu và chuyển sang Bước 7.
  Bước 7: Hệ thống tiến hành ghi nhận và lưu trữ thông tin món ăn mới vào hệ thống dữ liệu chung.
  Bước 8: Hệ thống tự động đồng bộ và cập nhật thông tin món ăn mới lên giao diện thực đơn điện tử công cộng.
  Bước 9: Hệ thống hiển thị thông báo "Thêm mới món ăn thành công" trên màn hình, đồng thời cập nhật lại danh sách quản lý chung.
  Bước 10: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình Thêm món ăn

b. Quy trình cập nhật thông tin món ăn
Bước 1: Người quản lý lựa chọn món ăn cụ thể cần chỉnh sửa hoặc thay đổi thông tin trên giao diện danh sách món ăn.
Bước 2: Hệ thống trích xuất và hiển thị biểu mẫu thông tin chi tiết hiện hành của món ăn được chọn.
Bước 3: Người quản lý thực hiện điều chỉnh các thông tin cần thiết. Các thông tin hỗ trợ chỉnh sửa bao gồm:

- Tên món ăn.
- Phân loại danh mục thực đơn.
- Giá bán niêm yết.
- Hình ảnh minh họa.
- Nội dung mô tả.
  Bước 4: Người quản lý kiểm tra lại các nội dung sau thay đổi và nhấn nút xác nhận "Lưu dữ liệu".
  Bước 5: Hệ thống thực hiện kiểm tra tính hợp lệ của dữ liệu sau khi sửa đổi:
- Nếu dữ liệu không hợp lệ hoặc để trống các trường bắt buộc: Hệ thống hiển thị thông báo lỗi và yêu cầu người dùng điều chỉnh lại tại Bước 3.
- Nếu dữ liệu hoàn toàn hợp lệ: Hệ thống phê duyệt thông tin và chuyển sang Bước 6.
  Bước 6: Hệ thống tiến hành cập nhật các dữ liệu thay đổi của món ăn vào hệ thống lưu trữ trung tâm.
  Bước 7: Hệ thống tự động đồng bộ thông tin mới của món ăn lên giao diện thực đơn điện tử của khách hàng cũng như các màn hình hỗ trợ gọi món của nhân viên phục vụ.
  Bước 8: Hệ thống hiển thị thông báo "Cập nhật thông tin món ăn thành công" và làm mới lại giao diện quản lý.
  Bước 9: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình Cập nhật món ăn

c. Quy trình xóa món ăn
Bước 1: Quản trị viên truy cập chức năng quản lý món ăn.
Bước 2: Hệ thống hiển thị danh sách các món ăn hiện có.
Bước 3: Quản trị viên lựa chọn món ăn cần xóa.
Bước 4: Quản trị viên xác nhận thao tác xóa.
Bước 5: Hệ thống kiểm tra dữ liệu.

- Nếu món ăn đang được sử dụng trong đơn gọi món chưa hoàn thành, hệ thống hiển thị thông báo "Không thể xóa món ăn đang được sử dụng." và yêu cầu thực hiện lại.
- Nếu món ăn không còn được sử dụng trong bất kỳ đơn gọi món nào, hệ thống tiếp tục xử lý.
  Bước 6: Hệ thống xóa thông tin món ăn và các dữ liệu liên quan khỏi cơ sở dữ liệu.
  Bước 7: Hệ thống cập nhật danh sách món ăn và thông báo xóa thành công.
  Bước 8: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình Xóa món ăn

d. Quy trình thay đổi trạng thái kinh doanh của món ăn
Bước 1: Người quản lý lựa chọn món ăn cụ thể cần thay đổi trạng thái hoạt động trên màn hình quản lý.
Bước 2: Người quản lý tiến hành chuyển đổi sang trạng thái hoạt động mới cho món ăn. Các trạng thái áp dụng bao gồm:

- Đang kinh doanh: Món ăn hiển thị bình thường trên thực đơn để khách hàng và nhân viên có thể chọn món.
- Tạm ngừng kinh doanh: Áp dụng khi nhà hàng hết nguyên liệu chế biến món đó hoặc ngừng phục vụ theo mùa vụ.
  Bước 3: Hệ thống thực hiện xác thực thông tin dữ liệu của món ăn:
- Nếu món ăn cần đổi trạng thái đột ngột không còn tồn tại trên hệ thống (do tài khoản khác đã xóa trước đó): Hệ thống hiển thị cảnh báo lỗi và kết thúc quy trình tại Bước 7.
- Nếu món ăn tồn tại hợp lệ: Hệ thống phê duyệt lệnh chuyển đổi và chuyển sang Bước 4.
  Bước 4: Hệ thống tiến hành ghi nhận và cập nhật trạng thái hoạt động mới của món ăn vào hệ thống lưu trữ.
  Bước 5: Hệ thống kích hoạt cơ chế đồng bộ và ẩn/hiển thị tự động:
- Các món ăn bị chuyển sang trạng thái "Tạm ngừng kinh doanh" sẽ lập tức bị hệ thống ẩn đi, không cho phép hiển thị trên thực đơn điện tử của khách hàng cũng như giao diện gọi món của nhân viên phục vụ, ngăn chặn việc gọi món sai lệch.
  Bước 6: Hệ thống trả về thông báo "Thay đổi trạng thái món ăn thành công" trên màn hình quản lý.
  Bước 7: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình thay đổi trạng thái món ăn

e. Quy trình xem và tìm kiếm món ăn
Bước 1: Người quản lý truy cập vào chức năng "Quản lý món ăn" trên giao diện hệ thống.
Bước 2: Hệ thống hiển thị danh sách tổng quan các món ăn hiện có.
Bước 3: Người quản lý xem danh sách hoặc nhập từ khóa hoặc chọn các tiêu chí lọc dữ liệu trên công cụ tìm kiếm. Các tiêu chí hỗ trợ tra cứu bao gồm:

- Mã món ăn
- Tên món ăn
- Danh mục
- Trạng thái kinh doanh (Đang kinh doanh / Tạm ngừng kinh doanh)
  Bước 4: Hệ thống thực hiện truy vấn dữ liệu và trả về kết quả tương ứng trên màn hình:
- Nếu không tìm thấy bất kỳ món ăn nào thỏa mãn các điều kiện lọc: Hệ thống hiển thị thông báo cảnh báo "Không tìm thấy kết quả phù hợp" và hiển thị bảng trống để người dùng thực hiện tra cứu lại tại Bước 3.
- Nếu tìm thấy dữ liệu trùng khớp: Hệ thống lập tức trả về danh sách các món ăn thỏa mãn kèm theo đầy đủ thông tin chi tiết.
  Bước 5: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình tìm kiếm món ăn

2.3.1.4 Quy trình quản lí Đơn vị tính
Quy trình này cho phép quản trị viên quản lý các đơn vị tính được sử dụng trong hệ thống như Kg, Gram, Lon, Chai, Hộp, Phần hoặc Bó. Thông tin các trạng thái gồm có: Hoạt động và Ngừng sử dụng.
a. Quy trình thêm đơn vị tính
Bước 1: Người quản lý truy cập vào chức năng "Quản lý đơn vị tính" trên giao diện điều hành.
Bước 2: Người quản lý lựa chọn nút chức năng "Thêm mới đơn vị tính".
Bước 3: Người quản lý tiến hành nhập đầy đủ thông tin định danh cho đơn vị tính mới trên biểu mẫu, bao gồm:

- Mã đơn vị tính (Mã tự tăng)
- Tên gọi đơn vị tính (Kg, gói, hộp, v.v.v)
  Bước 4: Người quản lý kiểm tra lại nội dung và nhấn nút xác nhận "Lưu dữ liệu".
  Bước 5: Hệ thống thực hiện rà soát và kiểm tra tính hợp lệ của dữ liệu đầu vào:
- Nếu mã đơn vị tính nhập vào đã tồn tại trong danh mục hệ thống hoặc thông tin bắt buộc bị bỏ trống: Hệ thống hiển thị cảnh báo lỗi chi tiết và yêu cầu người dùng thực hiện nhập lại thông tin tại Bước 3.
- Nếu thông tin hoàn toàn hợp lệ và không trùng lặp: Hệ thống phê duyệt dữ liệu và chuyển sang Bước 6.
  Bước 6: Hệ thống tiến hành ghi nhận và lưu trữ thông tin đơn vị tính mới vào hệ thống dữ liệu chung của nhà hàng.
  Bước 7: Hệ thống trả về thông báo "Thêm mới đơn vị tính thành công" trên màn hình, đồng thời làm mới lại bảng danh sách hiển thị.
  Bước 8: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình Thêm đơn vị tính

b. Quy trình cập nhật đơn vị tính
Bước 1: Người quản lý nhấn chọn vào đơn vị tính cụ thể cần chỉnh sửa thông tin trong danh sách đơn vị tính hiện có.
Bước 2: Hệ thống trích xuất thông tin và hiển thị dữ liệu hiện hành của đơn vị tính được chọn.
Bước 3: Người quản lý thực hiện thay đổi hoặc cập nhật lại thông tin (như chỉnh sửa tên gọi hiển thị hoặc chuyển đổi trạng thái hoạt động từ Hoạt động sang Ngừng sử dụng) và nhấn nút xác nhận "Lưu dữ liệu".
Bước 4: Hệ thống thực hiện kiểm tra tính toàn vẹn và hợp lệ của dữ liệu sau thay đổi:

- Nếu dữ liệu chỉnh sửa vi phạm quy định hệ thống hoặc để trống trường bắt buộc: Hệ thống hiển thị thông báo lỗi chi tiết và yêu cầu người dùng thực hiện điều chỉnh lại tại Bước 3.
- Nếu dữ liệu hoàn toàn hợp lệ: Hệ thống phê duyệt thông tin và chuyển sang Bước 5.
  Bước 5: Hệ thống tiến hành cập nhật các dữ liệu mới của đơn vị tính vào hệ thống lưu trữ trung tâm.
  Bước 6: Hệ thống hiển thị thông báo "Cập nhật đơn vị tính thành công" và đồng bộ trạng thái mới áp dụng cho các phân hệ quản lý định lượng liên quan.
  Bước 7: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình cập nhật Đơn vị tính

c. Quy trình xóa đơn vị tính
Bước 1: Quản trị viên truy cập chức năng quản lý đơn vị tính.
Bước 2: Hệ thống hiển thị danh sách các đơn vị tính hiện có.
Bước 3: Quản trị viên lựa chọn đơn vị tính cần xóa.
Bước 4: Quản trị viên xác nhận thao tác xóa.
Bước 5: Hệ thống kiểm tra dữ liệu.

- Nếu đơn vị tính đang được sử dụng bởi một hoặc nhiều nguyên liệu, hệ thống hiển thị thông báo "Không thể xóa đơn vị tính đang được sử dụng." và yêu cầu thực hiện lại.
- Nếu đơn vị tính chưa được sử dụng, hệ thống tiếp tục xử lý.
  Bước 6: Hệ thống xóa thông tin đơn vị tính khỏi cơ sở dữ liệu.
  Bước 7: Hệ thống cập nhật danh sách đơn vị tính và thông báo xóa thành công.
  Bước 8: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình Xóa Đơn vị tính

d. Quy trình xem và tìm kiếm đơn vị tính
Bước 1: Quản trị viên truy cập chức năng quản lý đơn vị tính.
Bước 2: Hệ thống hiển thị danh sách các đơn vị tính hiện có.
Bước 3: Quản trị viên xem danh sách hoặc nhập từ khóa tìm kiếm theo các tiêu chí:

- Mã đơn vị tính.
- Tên đơn vị tính.
- Trạng thái.
  Bước 4: Hệ thống thực hiện tìm kiếm.
- Nếu không tìm thấy dữ liệu phù hợp, hệ thống hiển thị thông báo "Không tìm thấy dữ liệu."
- Nếu tìm thấy dữ liệu, hệ thống hiển thị danh sách các đơn vị tính phù hợp.
  Bước 5: Quản trị viên xem thông tin chi tiết của đơn vị tính (nếu cần).
  Bước 6: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình Xem và Tìm kiếm Đơn vị tính

2.3.1.5 Quy trình quản lí Nguyên liệu
Quy trình này cho phép quản lý danh mục các nguyên liệu được sử dụng trong hệ thống.
Thông tin của nguyên liệu bao gồm:

- Mã nguyên liệu.
- Tên nguyên liệu.
- Đơn vị tính.
- Trạng thái sử dụng (Hoạt động / Ngừng sử dụng).
  a. Quy trình thêm nguyên liệu
  Bước 1: Quản lý truy cập vào chức năng "Quản lý nguyên liệu" trên giao diện hệ thống.
  Bước 2: Quản lý lựa chọn nút chức năng "Thêm mới nguyên liệu".
  Bước 3: Hệ thống hiển thị biểu mẫu (Form) thêm mới nguyên liệu. Quản lý tiến hành nhập và lựa chọn các thông tin bắt buộc bao gồm:
- Mã nguyên liệu được hệ thống tự động thiết thuộc tính
- Tên nguyên liệu
- Đơn vị tính cơ bản
- Trạng thái mặc định là "Hoạt động"
  Bước 4: Quản lý kiểm tra thông tin và nhấn xác nhận "Lưu dữ liệu".
  Bước 5: Hệ thống thực hiện kiểm tra tính hợp lệ và toàn vẹn của dữ liệu:
- Nếu các trường thông tin bắt buộc bị bỏ trống: Hệ thống hiển thị thông báo yêu cầu nhập đầy đủ thông tin và quay lại Bước 3.
- Nếu Tên nguyên liệu đã tồn tại trong cơ sở dữ liệu: Hệ thống hiển thị cảnh báo "Nguyên liệu đã tồn tại" và quay lại Bước 3.
- Nếu dữ liệu hoàn toàn hợp lệ: Hệ thống phê duyệt dữ liệu và chuyển sang Bước 6.
  Bước 6: Hệ thống tiến hành ghi nhận, mã hóa và lưu trữ thông tin nguyên liệu mới vào cơ sở dữ liệu.
  Bước 7: Hệ thống trả về thông báo "Thêm mới nguyên liệu thành công" trên màn hình, đồng thời cập nhật lại danh sách hiển thị.
  Bước 8: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình Thêm mới nguyên liệu

b. Quy trình cập nhật nguyên liệu
Bước 1: Quản lý lựa chọn nguyên liệu cần chỉnh sửa từ danh sách danh mục nguyên liệu.
Bước 2: Hệ thống hiển thị biểu mẫu (Form) chứa thông tin hiện tại của nguyên liệu được chọn bao gồm:

- Mã nguyên liệu (không cho phép chỉnh sửa)
- Tên nguyên liệu
- Đơn vị tính cơ bản
  Bước 3: Quản lý thực hiện chỉnh sửa các thông tin cần thay đổi và nhấn xác nhận "Lưu dữ liệu".
  Bước 4: Hệ thống thực hiện kiểm tra tính hợp lệ và toàn vẹn của dữ liệu:
- Nếu các trường thông tin bắt buộc bị bỏ trống: Hệ thống hiển thị thông báo yêu cầu nhập đầy đủ thông tin và quay lại Bước 3.
- Nếu Tên nguyên liệu sau khi sửa bị trùng với một nguyên liệu khác đã có trong hệ thống: Hệ thống hiển thị cảnh báo "Nguyên liệu đã tồn tại" và quay lại Bước 3.
- Nếu dữ liệu hoàn toàn hợp lệ: Hệ thống phê duyệt dữ liệu và chuyển sang Bước 5.
  Bước 5: Hệ thống tiến hành ghi nhận và cập nhật thông tin thay đổi của nguyên liệu vào cơ sở dữ liệu.
  Bước 6: Hệ thống trả về thông báo "Cập nhật nguyên liệu thành công" trên màn hình, đồng thời làm mới lại danh sách hiển thị.
  Bước 7: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình cập nhật nguyên liệu

c. Quy trình thay đổi trạng thái nguyên liệu
Bước 1: Quản lý lựa chọn nguyên liệu cần thay đổi trạng thái từ danh sách nguyên liệu.
Bước 2: Quản lý thực hiện chuyển đổi trạng thái sử dụng của nguyên liệu (từ Hoạt động sang Ngừng sử dụng hoặc ngược lại) và nhấn xác nhận.
Bước 3: Hệ thống thực hiện kiểm tra các điều kiện ràng buộc dữ liệu:
• Nếu nguyên liệu đang được sử dụng trong các định lượng món ăn: Hệ thống hiển thị cảnh báo "Nguyên liệu đang được dùng, không thể thay đổi trạng thái" và quay lại Bước 2.
• Nếu dữ liệu hoàn toàn hợp lệ: Hệ thống phê duyệt yêu cầu và chuyển sang Bước 4.
Bước 4: Hệ thống tiến hành ghi nhận và cập nhật trạng thái mới của nguyên liệu vào cơ sở dữ liệu.
Bước 5: Hệ thống trả về thông báo "Thay đổi trạng thái thành công" trên màn hình, đồng thời làm mới lại danh sách hiển thị.
Bước 6: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình thay đổi trạng thái nguyên liệu

d. Quy trình xem và tìm kiếm nguyên liệu
Bước 1: Quản lý truy cập vào chức năng "Quản lý danh mục nguyên liệu" trên giao diện hệ thống.
Bước 2: Quản lý nhập từ khóa tìm kiếm hoặc lựa chọn các tiêu chí lọc trên thanh công cụ.
Bước 3: Hệ thống thực hiện truy vấn và lọc dữ liệu trong cơ sở dữ liệu theo các tiêu chí:

- Mã nguyên liệu
- Tên nguyên liệu
- Loại nguyên liệu
- Trạng thái sử dụng
  Bước 4: Hệ thống trả về và hiển thị kết quả tìm kiếm trên màn hình:
- Nếu tìm thấy nguyên liệu trùng khớp: Hệ thống hiển thị danh sách các nguyên liệu thỏa mãn điều kiện.
- Nếu không tìm thấy kết quả phù hợp: Hệ thống hiển thị thông báo "Không tìm thấy nguyên liệu nào phù hợp với từ khóa" và hiển thị danh sách trống.
  Bước 5: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình xem và tìm kiếm nguyên liệu

2.3.1.6 Quy trình quản lí Kho
Hệ thống sử dụng một kho tập trung duy nhất, theo dõi tổng số lượng tồn kho của từng nguyên liệu. Quản trị viên thực hiện nhập kho khi mua hàng về và xuất kho khi cần điều chỉnh hoặc loại bỏ nguyên liệu hư hỏng. Việc trừ kho do chế biến món ăn được thực hiện tự động dựa trên định mức nguyên liệu khi nhân viên bếp xác nhận hoàn thành món. Hệ thống cảnh báo tự động khi tồn kho của một nguyên liệu xuống dưới mức tối thiểu đã thiết lập.
Thông tin quản lý kho bao gồm: Nguyên liệu, Số lượng tồn kho hiện tại, Mức tồn tối thiểu.
a. Quy trình nhập kho nguyên liệu
Bước 1: Quản lý truy cập vào chức năng "Quản lý nhập kho" và lựa chọn các nguyên liệu cần nhập từ danh mục hệ thống.
Bước 2: Quản lý tiến hành nhập và lựa chọn các thông tin trên phiếu nhập kho bao gồm:

- Nhà cung cấp
- Ngày nhập (mặc định là ngày hiện tại)
- Số lượng nhập
- Đơn giá nhập
- Ghi chú (nếu có)
  Bước 3: Quản lý kiểm tra lại thông tin và nhấn xác nhận "Lưu phiếu nhập".
  Bước 4: Hệ thống thực hiện kiểm tra tính hợp lệ và toàn vẹn của dữ liệu:
- Nếu danh sách nguyên liệu rỗng, thông tin Nhà cung cấp bị bỏ trống, Số lượng nhập <= 0 hoặc Đơn giá nhập không hợp lệ: Hệ thống hiển thị thông báo lỗi chi tiết và quay lại Bước 2.
- Nếu dữ liệu hoàn toàn hợp lệ: Hệ thống phê duyệt dữ liệu và chuyển sang Bước 5.
  Bước 5: Hệ thống tiến hành ghi nhận, tạo phiếu nhập kho mới, đồng thời tự động cộng số lượng nhập vào số lượng tồn kho hiện tại của từng nguyên liệu trong cơ sở dữ liệu.
  Bước 6: Hệ thống thực hiện kiểm tra lại định mức lưu kho và cập nhật/tắt trạng thái cảnh báo tồn kho (nếu số lượng sau nhập đã vượt qua ngưỡng tối thiểu).
  Bước 7: Hệ thống trả về thông báo "Nhập kho thành công" trên màn hình, đồng thời hiển thị chi tiết phiếu nhập vừa tạo.
  Bước 8: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình nhập kho nguyên liệu

b. Quy trình xuất kho nguyên liệu
Xuất kho áp dụng trong các trường hợp: nguyên liệu hư hỏng, hao hụt hoặc cần điều chỉnh tồn kho. Trạng thái phiếu xuất gồm: Đã hoàn thành, Đã hủy.
Bước 1: Quản lý truy cập vào chức năng "Quản lý xuất kho" và lựa chọn các nguyên liệu cần xuất khỏi kho.
Bước 2: Quản lý tiến hành nhập và lựa chọn các thông tin trên phiếu xuất kho bao gồm:

- Ngày xuất
- Lý do xuất kho
- Số lượng cần xuất
- Ghi chú
  Bước 3: Quản lý kiểm tra thông tin và nhấn xác nhận thao tác "Lưu phiếu xuất".
  Bước 4: Hệ thống thực hiện kiểm tra tính hợp lệ và toàn vẹn của dữ liệu:
- Nếu số lượng xuất lớn hơn số lượng tồn kho hiện tại: Hệ thống hiển thị thông báo lỗi "Số lượng tồn kho không đủ" và quay lại Bước 2.
- Nếu số lượng xuất nhỏ hơn hoặc bằng 0 hoặc chưa chọn lý do xuất: Hệ thống hiển thị thông báo lỗi "Dữ liệu không hợp lệ" và quay lại Bước 2.
- Nếu dữ liệu hoàn toàn hợp lệ: Hệ thống phê duyệt dữ liệu (gán trạng thái "Đã hoàn thành") và chuyển sang Bước 5.
  Bước 5: Hệ thống tiến hành ghi nhận, tạo phiếu xuất kho mới, đồng thời tự động trừ số lượng tương ứng khỏi tồn kho hiện tại của từng nguyên liệu trong cơ sở dữ liệu.
  Bước 6: Hệ thống thực hiện kiểm tra lại định mức lưu kho và bật trạng thái cảnh báo tồn kho (nếu số lượng sau khi xuất xuống thấp hơn ngưỡng tối thiểu).
  Bước 7: Hệ thống trả về thông báo "Xuất kho thành công" trên màn hình, đồng thời hiển thị chi tiết phiếu xuất vừa tạo.
  Bước 8: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình xuất kho nguyên liệu

c. Quy trình tự động trừ kho khi hoàn thành món
Khi nhân viên bếp xác nhận một món ăn hoàn thành, hệ thống tự động trừ nguyên liệu từ kho tổng dựa trên định mức đã thiết lập. Quy trình này không yêu cầu thao tác thủ công từ quản trị viên.
Bước 1: Nhân viên bếp nhấn xác nhận món ăn hoàn thành trên giao diện màn hình nhà bếp.
Bước 2: Hệ thống truy vấn cơ sở dữ liệu để xác định bảng định mức nguyên liệu tương ứng của món ăn đó.
Bước 3: Hệ thống tính toán tổng lượng nguyên liệu cần tiêu hao và thực hiện kiểm tra số lượng tồn kho hiện tại:

- Nếu số lượng tồn kho hiện tại không đủ đáp ứng: Hệ thống vẫn phê duyệt cho phép xác nhận hoàn thành món ăn để không gián đoạn phục vụ, đồng thời ghi nhận số lượng chênh lệch âm vào nhật ký hao hụt hệ thống, bật cảnh báo thiếu hụt nguyên liệu cho Quản lý và chuyển sang Bước 4 (trừ phần kho đang có).
- Nếu số lượng tồn kho hiện tại đủ đáp ứng: Hệ thống phê duyệt dữ liệu hợp lệ và chuyển sang Bước 4.
  Bước 4: Hệ thống thực hiện lệnh tự động trừ số lượng nguyên liệu tiêu hao tương ứng khỏi số lượng tồn kho hiện tại trong cơ sở dữ liệu.
  Bước 5: Hệ thống thực hiện kiểm tra lại định mức lưu kho và bật trạng thái cảnh báo tồn kho (nếu số lượng sau khi trừ xuống thấp hơn ngưỡng tối thiểu).
  Bước 6: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình tự động trừ kho khi chế biến

d. Quy trình tra cứu tồn kho
Bước 1: Quản lý truy cập vào chức năng "Quản lý tồn kho" trên giao diện hệ thống.
Bước 2: Quản lý nhập từ khóa tìm kiếm hoặc lựa chọn các tiêu chí lọc trên thanh công cụ.
Bước 3: Hệ thống thực hiện truy vấn và lọc dữ liệu trong cơ sở dữ liệu theo các tiêu chí:

- Mã nguyên liệu
- Tên nguyên liệu
- Trạng thái tồn kho (Còn hàng / Sắp hết / Hết hàng)
  Bước 4: Hệ thống trả về và hiển thị kết quả trên màn hình:
- Nếu tìm thấy dữ liệu trùng khớp: Hệ thống hiển thị danh sách thông tin tồn kho của từng nguyên liệu bao gồm:
  • Tên nguyên liệu
  • Đơn vị tính
  • Số lượng tồn kho hiện tại
  • Mức tồn tối thiểu
  • Trạng thái tồn kho
- Nếu không tìm thấy kết quả phù hợp: Hệ thống hiển thị thông báo "Không tìm thấy dữ liệu tồn kho phù hợp" và hiển thị danh sách trống.
  Bước 5: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình tra cứu tồn kho

2.3.1.7 Quy trình quản lí Nhà cung cấp
Hệ thống quản lý danh mục nhà cung cấp tập trung thay vì nhập tên tự do trong phiếu nhập kho, nhằm đảm bảo tính nhất quán dữ liệu và hỗ trợ thống kê chi phí theo từng nhà cung cấp.
Thông tin của nhà cung cấp bao gồm:

- Mã nhà cung cấp
- Tên nhà cung cấp
- Số điện thoại
- Địa chỉ
- Ghi chú (Nếu có)
- Trạng thái: Hoạt động / Ngừng hợp tác
  a. Quy trình thêm mới nhà cung cấp
  Bước 1: Quản lý truy cập vào chức năng "Quản lý nhà cung cấp" trên giao diện hệ thống.
  Bước 2: Quản lý lựa chọn nút chức năng "Thêm mới nhà cung cấp".
  Bước 3: Hệ thống hiển thị biểu mẫu (Form) thêm mới. Quản lý tiến hành nhập và lựa chọn các thông tin bắt buộc bao gồm:
- Mã nhà cung cấp ( Mã tự động)
- Tên nhà cung cấp
- Số điện thoại
- Địa chỉ
- Ghi chú
- Trạng thái mặc định là "Hoạt động"
  Bước 4: Quản lý kiểm tra thông tin và nhấn xác nhận "Lưu dữ liệu".
  Bước 5: Hệ thống thực hiện kiểm tra tính hợp lệ và toàn vẹn của dữ liệu:
- Nếu các trường thông tin bắt buộc bị bỏ trống hoặc Số điện thoại không đúng định dạng: Hệ thống hiển thị thông báo lỗi và quay lại Bước 3.
- Nếu Tên nhà cung cấp hoặc Số điện thoại đã tồn tại trong cơ sở dữ liệu: Hệ thống hiển thị cảnh báo trùng lặp và quay lại Bước 3.
- Nếu dữ liệu hoàn toàn hợp lệ: Hệ thống phê duyệt dữ liệu và chuyển sang Bước 6.
  Bước 6: Hệ thống tiến hành ghi nhận và lưu trữ thông tin nhà cung cấp mới vào cơ sở dữ liệu.
  Bước 7: Hệ thống trả về thông báo "Thêm mới nhà cung cấp thành công" trên màn hình, đồng thời cập nhật lại danh sách hiển thị.
  Bước 8: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình thêm nhà cung cấp

b. Quy trình cập nhật thông tin nhà cung cấp
Bước 1: Quản lý lựa chọn nhà cung cấp cần chỉnh sửa từ danh sách hiển thị.
Bước 2: Hệ thống hiển thị biểu mẫu (Form) chứa thông tin hiện tại của nhà cung cấp được chọn (Mã nhà cung cấp không cho phép chỉnh sửa).
Bước 3: Quản lý thực hiện chỉnh sửa các thông tin cần thay đổi (Tên, Số điện thoại, Địa chỉ, Ghi chú) và nhấn xác nhận "Lưu dữ liệu".
Bước 4: Hệ thống thực hiện kiểm tra tính hợp lệ và toàn vẹn của dữ liệu:

- Nếu các trường thông tin bắt buộc bị bỏ trống hoặc dữ liệu sai định dạng: Hệ thống hiển thị thông báo yêu cầu kiểm tra lại và quay lại Bước 3.
- Nếu Tên nhà cung cấp hoặc Số điện thoại sau khi sửa bị trùng với một nhà cung cấp khác đã có trên hệ thống: Hệ thống hiển thị cảnh báo trùng dữ liệu và quay lại Bước 3.
- Nếu dữ liệu hoàn toàn hợp lệ: Hệ thống phê duyệt dữ liệu và chuyển sang Bước 5.
  Bước 5: Hệ thống tiến hành ghi nhận và cập nhật thông tin thay đổi của nhà cung cấp vào cơ sở dữ liệu.
  Bước 6: Hệ thống trả về thông báo "Cập nhật thông tin thành công" trên màn hình và làm mới lại danh sách.
  Bước 7: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình cập nhật nhà cung cấp

c. Quy trình thay đổi trạng thái nhà cung cấp
Bước 1: Quản lý lựa chọn nhà cung cấp cần thay đổi trạng thái từ danh sách.
Bước 2: Quản lý thực hiện chuyển đổi trạng thái (từ Hoạt động sang Ngừng hợp tác hoặc ngược lại) và nhấn xác nhận.
Bước 3: Hệ thống thực hiện kiểm tra các điều kiện ràng buộc dữ liệu:

- Nếu chuyển sang trạng thái "Ngừng hợp tác": Hệ thống phê duyệt, tiến hành ẩn nhà cung cấp này khỏi danh sách lựa chọn khi lập phiếu nhập kho mới, nhưng vẫn giữ nguyên dữ liệu trong cơ sở dữ liệu để tra cứu lịch sử nhập hàng và Chuyển sang Bước 4.
- Nếu chuyển sang trạng thái "Hoạt động": Hệ thống phê duyệt, cho phép nhà cung cấp xuất hiện lại trong danh sách chọn của phiếu nhập kho mới và Chuyển sang Bước 4.
  Bước 4: Hệ thống cập nhật trạng thái mới của nhà cung cấp vào cơ sở dữ liệu.
  Bước 5: Hệ thống trả về thông báo "Thay đổi trạng thái nhà cung cấp thành công" trên màn hình và cập nhật lại giao diện.
  Bước 6: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình thay đổi nhà cung cấp

2.3.1.8 Quy trình quản lí Định mức nguyên liệu
Mô tả nghiệp vụ:
Quản lý định mức nguyên liệu là nghiệp vụ dùng để thiết lập mối liên hệ giữa món ăn và các nguyên liệu cần thiết để chế biến món đó. Đối với mỗi món ăn trong thực đơn, quản trị viên khai báo danh sách các nguyên liệu cấu thành cùng với số lượng sử dụng tương ứng theo một khẩu phần tiêu chuẩn.
Thông tin định mức được sử dụng làm cơ sở để hệ thống tự động trừ kho khi nhân viên bếp xác nhận hoàn thành món ăn. Đơn vị tính trong định mức được lấy tự động theo đơn vị tính của nguyên liệu đã khai báo trong hệ thống, không cho phép thay đổi - Admin chỉ cần nhập số lượng theo đúng đơn vị này.
Đơn vị tính: được lấy tự động theo đơn vị tính của nguyên liệu đã khai báo trong hệ thống, không cho phép thay đổi. Admin nhập số lượng theo đúng đơn vị này
Thông tin quản lý định mức nguyên liệu bao gồm:

- Món ăn.
- Nguyên liệu.
- Số lượng sử dụng.
- Đơn vị tính.
- Ghi chú.
- Trạng thái định mức.
  Trạng thái định mức gồm:
- Hoạt động.
- Ngừng sử dụng.
  a. Quy trình thiết lập định mức nguyên liệu
  Bước 1: Quản lý truy cập vào chức năng "Quản lý định mức nguyên liệu" trên giao diện hệ thống.
  Bước 2: Quản lý lựa chọn món ăn cần thiết lập định mức từ danh sách thực đơn.
  Bước 3: Hệ thống hiển thị danh sách các nguyên liệu hiện có và đang hoạt động trong hệ thống.
  Bước 4: Quản lý lựa chọn các nguyên liệu cần sử dụng cho món ăn và tiến hành nhập các thông tin bao gồm:
- Số lượng sử dụng
- Ghi chú
  Bước 5: Quản lý kiểm tra thông tin và nhấn xác nhận "Lưu thông tin".
  Bước 6: Hệ thống thực hiện kiểm tra tính hợp lệ và toàn vẹn của dữ liệu:
- Nếu món ăn không tồn tại trên hệ thống: Hệ thống hiển thị thông báo lỗi và quay lại Bước 2.
- Nếu nguyên liệu được chọn không tồn tại hoặc đã bị đổi sang trạng thái ngừng sử dụng: Hệ thống hiển thị thông báo lỗi và quay lại Bước 4.
- Nếu số lượng sử dụng nhỏ hơn hoặc bằng 0: Hệ thống hiển thị thông báo lỗi dữ liệu không hợp lệ và quay lại Bước 4.
- Nếu nguyên liệu được chọn đã tồn tại sẵn trong định mức của món ăn này từ trước: Hệ thống hiển thị cảnh báo trùng lặp, yêu cầu người dùng sử dụng chức năng cập nhật và quay lại Bước 4.
- Nếu dữ liệu hoàn toàn hợp lệ: Hệ thống phê duyệt dữ liệu và chuyển sang Bước 7.
  Bước 7: Hệ thống tiến hành ghi nhận và lưu thông tin định mức nguyên liệu mới của món ăn vào cơ sở dữ liệu.
  Bước 8: Hệ thống trả về thông báo "Thiết lập định mức thành công" trên màn hình, đồng thời làm mới giao diện hiển thị.
  Bước 9: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình thiết lập định mức nguyên liệu

b. Quy trình cập nhật định mức nguyên liệu
Bước 1: Quản lý truy cập vào chức năng "Quản lý định mức nguyên liệu" trên giao diện hệ thống.
Bước 2: Hệ thống hiển thị danh sách các món ăn đã được thiết lập định mức từ trước.
Bước 3: Quản lý lựa chọn món ăn cụ thể cần chỉnh sửa hoặc cập nhật lại định mức.
Bước 4: Hệ thống hiển thị danh sách chi tiết các nguyên liệu thành phần đang được áp dụng trong món ăn đó.
Bước 5: Quản lý thực hiện các thao tác điều chỉnh thông tin theo nhu cầu bao gồm:

- Thêm nguyên liệu mới vào định mức.
- Cập nhật số lượng sử dụng của nguyên liệu hiện tại.
- Xóa nguyên liệu khỏi định mức của món ăn.
- Thay đổi trạng thái định mức (Hoạt động / Ngừng sử dụng).
  Bước 6: Quản lý kiểm tra lại các thay đổi và nhấn xác nhận "Lưu dữ liệu".
  Bước 7: Hệ thống thực hiện kiểm tra tính hợp lệ và toàn vẹn của dữ liệu sau chỉnh sửa:
- Nếu số lượng sử dụng nhập vào nhỏ hơn hoặc bằng 0 hoặc không đúng định dạng số: Hệ thống hiển thị thông báo lỗi và yêu cầu thực hiện lại tại Bước 5.
- Nếu nguyên liệu mới thêm vào không tồn tại hoặc đã ngừng sử dụng trên hệ thống: Hệ thống hiển thị thông báo lỗi dữ liệu và quay lại Bước 5.
- Nếu dữ liệu hoàn toàn hợp lệ: Hệ thống phê duyệt dữ liệu thay đổi và chuyển sang Bước 8.
  Bước 8: Hệ thống tiến hành ghi nhận và cập nhật các dữ liệu thay đổi của định mức vào cơ sở dữ liệu.
  Bước 9: Hệ thống trả về thông báo "Cập nhật định mức thành công" trên màn hình và hiển thị lại danh sách định mức mới.
  Bước 10: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình cập nhật định mức nguyên liệu

c. Quy trình xem và tìm kiếm định mức nguyên liệu
Bước 1: Quản lý truy cập vào chức năng "Quản lý định mức nguyên liệu" trên giao diện hệ thống.
Bước 2: Quản lý xem danh sách hoặc nhập từ khóa tìm kiếm hoặc lựa chọn các tiêu chí lọc trên thanh công cụ.
Bước 3: Hệ thống thực hiện truy vấn và lọc dữ liệu trong cơ sở dữ liệu theo các tiêu chí:

- Mã món ăn
- Tên món ăn
- Tên nguyên liệu thành phần
- Trạng thái định mức
  Bước 4: Hệ thống trả về kết quả tra cứu và hiển thị danh sách các món ăn kèm thông tin định mức nguyên liệu tương ứng:
- Nếu tìm thấy dữ liệu trùng khớp: Hệ thống hiển thị danh sách thỏa mãn điều kiện và chuyển sang Bước 5.
- Nếu không tìm thấy kết quả phù hợp: Hệ thống hiển thị thông báo "Không tìm thấy định mức phù hợp" và kết thúc quy trình tại Bước 6.
  Bước 5: Quản lý có thể lựa chọn bấm xem chi tiết từng nguyên liệu thành phần của món ăn đó, hệ thống sẽ hiển thị các thông tin bao gồm:
- Tên nguyên liệu
- Số lượng sử dụng
- Đơn vị tính
- Ghi chú
- Trạng thái định mức
  Bước 6: Kết thúc quy trình.

Hình 2. Sơ đồ quy trình tìm kiếm định mức nguyên liệu

2.3.1.9 Quy trình quản lí Bếp (Chế biến)
Mô tả nghiệp vụ:
Bộ phận bếp tiếp nhận đơn chế biến theo thời gian thực, cập nhật trạng thái từng món ăn và xử lý các tình huống phát sinh trong quá trình chế biến. Trạng thái món ăn gồm: Đang chế biến, Đã hoàn thành, Đã hủy. Việc trừ kho nguyên liệu được thực hiện tự động từ kho tổng khi nhân viên bếp xác nhận hoàn thành món, không qua kho trung gian.
a. Quy trình tiếp nhận đơn chế biến
Bước 1: Khi nhân viên phục vụ xác nhận đơn gọi món tại bàn của khách hàng, hệ thống tự động gửi thông tin yêu cầu chế biến đến màn hình hiển thị của bộ phận bếp theo thời gian thực thông qua giao thức Socket.io.
Bước 2: Hệ thống tiếp nhận và hiển thị danh sách các đơn chế biến được sắp xếp theo từng bàn, bao gồm các thông tin:

- Số bàn
- Danh sách các món ăn
- Số lượng từng món
- Thời gian gọi món
- Ghi chú khách hàng (Ví dụ: ít cay, không hành, sốt để riêng...)
  Bước 3: Hệ thống tự động cập nhật trạng thái của các món ăn mới tiếp nhận sang trạng thái "Đang chế biến"
  Bước 4: Nhân viên bếp dựa trên thông tin hiển thị để thực hiện chế biến món ăn và chuẩn bị ra đồ theo thứ tự.
  Bước 5: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình tiếp nhận đơn chế biến

b. Quy trình cập nhật trạng thái hoàn thành món
Bước 1: Nhân viên bếp lựa chọn món ăn cụ thể đã chế biến xong cần cập nhật trạng thái trên màn hình hiển thị tại bếp.
Bước 2: Nhân viên bếp nhấn nút xác nhận "Hoàn thành" món ăn.
Bước 3: Hệ thống thực hiện kiểm tra trạng thái hiện tại của món ăn đó trong cơ sở dữ liệu:

- Nếu món ăn đã ở trạng thái "Đã hoàn thành" hoặc "Đã hủy" từ trước (do thao tác nhầm hoặc cập nhật trùng lặp): Hệ thống hiển thị thông báo từ chối lệnh, không cho phép cập nhật lại và quay lại Bước 1.
- Nếu trạng thái hiện tại hợp lệ ("Đang chế biến"): Hệ thống phê duyệt dữ liệu và chuyển sang Bước 4.
  Bước 4: Hệ thống thực hiện cập nhật trạng thái món ăn sang "Đã hoàn thành", đồng thời phát tín hiệu thông báo thời gian thực đến thiết bị của nhân viên phục vụ để tiến hành lên món cho khách.
  Bước 5: Hệ thống tự động kích hoạt lệnh trừ kho nguyên liệu tổng dựa trên cấu hình định mức tương ứng của món ăn đó (Tuân theo logic đã thiết lập tại Mục 2.3.1.3.3.c Quy trình tự động trừ kho khi hoàn thành món).
  Bước 6: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình cập nhật trạng thái món ăn chế biến

c. Quy trình hủy món
Đây là quy trình hủy món duy nhất trong hệ thống. Khi món đã ở trạng thái Đã hoàn thành, nguyên liệu đã tiêu hao hoàn toàn trong quá trình chế biến và không thể hoàn trả về kho tổng của nhà hàng BBQ.
Bước 1: Nhân viên phục vụ hoặc Quản lý gửi yêu cầu hủy món ăn đến hệ thống, tiến hành nhập lý do hủy và tên người chịu trách nhiệm trực tiếp.
Bước 2: Hệ thống thực hiện kiểm tra trạng thái hiện tại của món ăn trong cơ sở dữ liệu:

- Nếu món ăn đã bị hủy trước đó: Hệ thống hiển thị thông báo lỗi trùng lặp và kết thúc quy trình tại Bước 7.
- Nếu món ăn đang ở trạng thái "Đang chế biến": Hệ thống phê duyệt cho phép hủy trực tiếp và chuyển thẳng sang Bước 3.
- Nếu món ăn đã ở trạng thái "Đã hoàn thành": Hệ thống yêu cầu phải sự phê duyệt xác thực từ Quản lý trước khi tiếp tục hệ thống, nếu phê duyệt hệ thống chuyển sang Bước 3.
  Bước 3: Hệ thống gửi thông báo lệnh hủy món theo thời gian thực đến màn hình hiển thị của bộ phận bếp.
  Bước 4: Nhân viên bếp xác nhận lệnh hủy món trên hệ thống để ngừng chế biến (Món ăn vật lý đã hoàn thành hoặc đang chế biến dở dang vẫn được lưu giữ tại khu vực bếp).
  Bước 5: Hệ thống tự động cập nhật trạng thái món ăn sang "Đã hủy", khởi tạo phiếu hủy kèm lý do, loại bỏ món ăn này khỏi hóa đơn của bàn gốc, đồng thời giữ nguyên số lượng tồn kho tổng (Kho không thay đổi).
  Bước 6: Hệ thống tiến hành kiểm tra danh sách các đơn hàng hiện tại của nhà hàng và xử lý theo hai trường hợp:
  • Trường hợp 1 — Hệ thống ghi nhận có bàn khác đang chờ đúng món ăn này: Nhân viên bếp thực hiện chuyển món ăn vật lý sang cho bàn mới và nhấn nút "Đã hoàn thành" của bàn đang chờ đó để phục vụ khách hàng nhanh hơn. Lúc này mới thực hiện trừ kho
  • Trường hợp 2 — Hệ thống ghi nhận không có bàn nào đang chờ món ăn này: Món ăn vật lý được lưu lại tại bếp để chờ các lượt gọi món tiếp theo. Nếu hết ca làm việc mà không có bàn nào gọi và món ăn không còn giá trị sử dụng, hệ thống tự động ghi nhận lượng hao hụt này vào nhật ký hao hụt kèm tên người làm sai và người phê duyệt để hiển thị trong báo cáo cuối ngày của Admin.
  Bước 7: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình hủy món

2.3.1.10 Quy trình quản lí Bàn
Mô tả nghiệp vụ:
Chức năng quản lý bàn cho phép quản trị viên thiết lập và duy trì thông tin các bàn trong quán. Nhân viên phục vụ sử dụng sơ đồ bàn để theo dõi trạng thái và thực hiện thao tác mở bàn, đóng bàn trong quá trình phục vụ. Hệ thống hỗ trợ thêm nghiệp vụ đặt bàn trước từ hai luồng: khách tự đặt trên website và nhân viên nhập hộ khi khách liên hệ trực tiếp.
Mỗi bàn trong nhà hàng BBQ được cấp một mã QR nhận diện vật lý cố định. Nhằm ngăn chặn việc gọi món sai lệch từ các lượt khách trước hoặc khách gọi món từ xa khi bàn đã đóng, mã QR này chỉ đóng vai trò định danh vị trí bàn. Khi nhân viên xác nhận mở bàn cho một lượt khách mới, hệ thống sẽ tự động cấp một mã liên kết bảo mật duy nhất cho lượt phục vụ đó. Khách hàng quét mã QR sẽ được hệ thống đối chiếu mã liên kết này, nếu trùng khớp mới được phép truy cập thực đơn và gửi yêu cầu gọi món.

- Mã bàn
- Tên bàn: (Ví dụ: Bàn 01, Bàn 02...).
- Khu vực: Vị trí của bàn trong nhà hàng (Ví dụ: Lầu 1, Lầu 2, ...).
- Số ghế: Số lượng chỗ ngồi tiêu chuẩn tại bàn.
- Trạng thái: Tình trạng hiện tại của bàn (Trống / Đang sử dụng / Đã đặt trước).
- Ghi chú: Các thông tin đặc biệt lưu ý cho bàn.

a. Quy trình quản lý Thêm thông tin bàn (Admin)
Bước 1: Quản lý truy cập vào chức năng "Quản lý bàn". Hệ thống hiển thị danh sách toàn bộ các bàn hiện có kèm theo trạng thái hoạt động thực tế.
Bước 2: Quản lý chọn chức năng "Thêm mới" và tiến hành nhập các thông tin dữ liệu bao gồm:

- Mã bàn (Được tạo tự động)
- Tên bàn
- Khu vực
- Số ghế
- Ghi chú
  Bước 3: Quản lý kiểm tra thông tin và nhấn xác nhận "Lưu dữ liệu".
  Bước 4: Hệ thống thực hiện kiểm tra tính hợp lệ và toàn vẹn của dữ liệu:
- Nếu mã bàn nhập vào đã tồn tại trên hệ thống hoặc các trường thông tin bắt buộc bị bỏ trống: Hệ thống hiển thị thông báo lỗi chi tiết và quay lại Bước 2.
- Nếu dữ liệu hoàn toàn hợp lệ: Hệ thống tiến hành ghi nhận, lưu thông tin bàn mới vào cơ sở dữ liệu và tự động cập nhật lên sơ đồ bàn chung và chuyển sang Bước 6.
  Bước 5: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình Thêm bàn mới (Admin)

b. Quy trình Cập nhật thông tin bàn (Admin)
Bước 1: Quản trị viên truy cập chức năng quản lý bàn.
Bước 2: Hệ thống hiển thị danh sách các bàn hiện có.
Bước 3: Quản trị viên lựa chọn bàn cần cập nhật.
Bước 4: Hệ thống hiển thị thông tin chi tiết của bàn.
Các thông tin có thể cập nhật bao gồm:

- Tên bàn.
- Khu vực.
- Sức chứa.
- Ghi chú.
- Trạng thái.
  Bước 5: Quản trị viên chỉnh sửa thông tin và xác nhận lưu dữ liệu.
  Bước 6: Hệ thống kiểm tra tính hợp lệ của dữ liệu.
- Nếu tên bàn bị trùng, hệ thống hiển thị thông báo lỗi và yêu cầu thực hiện lại từ Bước 5.
- Nếu sức chứa nhỏ hơn hoặc bằng 0, hệ thống hiển thị thông báo lỗi và yêu cầu thực hiện lại từ Bước 5.
- Nếu dữ liệu hợp lệ, hệ thống tiếp tục xử lý.
  Bước 7: Hệ thống cập nhật thông tin bàn vào cơ sở dữ liệu.
  Bước 8: Hệ thống thông báo cập nhật thành công và làm mới danh sách bàn.
  Bước 9: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình Cập nhật bàn (Admin)

c. Quy trình xóa bàn (Admin)
Bước 1: Quản trị viên truy cập chức năng quản lý bàn.
Bước 2: Hệ thống hiển thị danh sách các bàn hiện có.
Bước 3: Quản trị viên lựa chọn bàn cần xóa.
Bước 4: Quản trị viên xác nhận thao tác xóa.
Bước 5: Hệ thống kiểm tra dữ liệu.

- Nếu bàn đang được sử dụng hoặc đang tồn tại đơn gọi món, hóa đơn chưa hoàn thành, hệ thống hiển thị thông báo "Không thể xóa bàn đang được sử dụng." và yêu cầu thực hiện lại.
- Nếu bàn không còn được sử dụng trong bất kỳ phiên phục vụ nào, hệ thống tiếp tục xử lý.
  Bước 6: Hệ thống xóa thông tin bàn khỏi cơ sở dữ liệu.
  Bước 7: Hệ thống cập nhật danh sách bàn và thông báo xóa thành công.
  Bước 8: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình Xóa bàn (Admin)

d. Quy trình xem và tìm kiếm bàn (Admin)
Bước 1: Quản trị viên truy cập chức năng quản lý bàn.
Bước 2: Hệ thống hiển thị danh sách các bàn hiện có.
Bước 3: Quản trị viên xem danh sách hoặc nhập từ khóa tìm kiếm theo các tiêu chí:

- Mã bàn.
- Tên bàn.
- Khu vực.
- Sức chứa.
- Trạng thái sử dụng.
  Bước 4: Hệ thống thực hiện tìm kiếm.
- Nếu không tìm thấy dữ liệu phù hợp, hệ thống hiển thị thông báo "Không tìm thấy dữ liệu."
- Nếu tìm thấy dữ liệu, hệ thống hiển thị danh sách các bàn phù hợp.
  Bước 5: Quản trị viên có thể xem thông tin chi tiết của bàn, bao gồm:
- Mã bàn.
- Tên bàn.
- Khu vực.
- Sức chứa.
- Trạng thái sử dụng.
- Mã QR của bàn.
  Bước 6: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình Xem và Tìm kiếm bàn (Admin)

e. Quy trình mở bàn và phục vụ (Nhân viên phục vụ)
Bước 1: Nhân viên phục vụ truy cập vào giao diện "Sơ đồ bàn". Hệ thống hiển thị toàn bộ sơ đồ bàn trực quan theo từng khu vực dựa trên mã màu trạng thái.
Bước 2: Nhân viên lựa chọn bàn cụ thể cần mở trên sơ đồ để chuẩn bị đón khách vào ngồi.
Bước 3: Hệ thống thực hiện kiểm tra trạng thái hiện hành của bàn được chọn trong cơ sở dữ liệu:

- Khi nhân viên chọn bàn và bắt đầu thao tác mở, hệ thống tạm thời khóa bàn đó và hiện thông báo “Bàn đang được được thao tác”. Tránh tình trạng hai nhân viên cùng mở một bàn.
- Nếu bàn đang ở trạng thái "Đang sử dụng": Hệ thống hiển thị thông báo "Bàn đã có khách", từ chối lệnh mở thêm và quay lại Bước 1.
- Nếu bàn đang ở trạng thái "Trống": Hệ thống phê duyệt cho phép mở bàn trực tiếp và chuyển thẳng sang Bước 4.
- Nếu bàn đang ở trạng thái "Đã đặt trước": Hệ thống hiển thị thông tin chi tiết của đơn đặt bàn (Tên khách hàng, Số điện thoại, Số lượng người, Giờ đến). Nhân viên thực hiện đối chiếu thông tin xác nhận chính xác khách đã đến, hệ thống tự động liên kết đơn đặt bàn này với lượt phục vụ mới, chuyển trạng thái đơn đặt bàn sang "Đang sử dụng" và chuyển sang Bước 4.
  Bước 4: Nhân viên nhấn nút xác nhận mở bàn. Hệ thống đồng thời thực hiện các thao tác xử lý tự động sau:
- Cập nhật trạng thái của bàn sang "Đang sử dụng".
- Khởi tạo một hóa đơn gọi món mới liên kết trực tiếp với mã bàn và ghi nhận mốc thời gian mở bàn.
- Tạo một mã liên kết phiên phục vụ mới bảo mật gắn liền với hóa đơn vừa tạo. Nếu bàn này còn mã liên kết cũ từ lượt khách trước, hệ thống thực hiện hủy bỏ hiệu lực của mã cũ ngay lập tức.
  Bước 5: Hệ thống kích hoạt cơ chế đồng bộ: kể từ thời điểm này, khách hàng tại bàn có thể quét mã QR để truy cập thực đơn trực tuyến và gửi yêu cầu gọi món hợp lệ vào hóa đơn.
  Bước 6: Nhân viên phục vụ tiến hành hỗ trợ khách hàng ghi nhận thông tin gọi món tại bàn hoặc tiếp nhận, xác nhận các lệnh gọi món tự động được gửi về từ thiết bị di động của khách hàng.
  Bước 7: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình Mở bàn phục vụ

f. Quy trình hủy bàn
Quy trình này áp dụng khi nhân viên đã mở bàn cho khách, nhưng khách chưa gọi bất kỳ món ăn nào và rời đi mà không sử dụng dịch vụ của nhà hàng. Quy trình cho phép đóng bàn mà không cần thực hiện thanh toán, giải phóng bàn cho lượt khách tiếp theo.
Bước 1: Nhân viên phục vụ truy cập vào giao diện "Sơ đồ bàn". Hệ thống hiển thị toàn bộ sơ đồ bàn trực quan theo từng khu vực dựa trên mã màu trạng thái.
Bước 2: Nhân viên lựa chọn bàn đang ở trạng thái "Đang sử dụng" cần hủy mở do khách rời đi không dùng dịch vụ.
Bước 3: Nhân viên nhấn chọn chức năng "Hủy mở bàn" (hoặc "Đóng bàn không thanh toán") trên giao diện chi tiết bàn.
Bước 4: Hệ thống thực hiện kiểm tra điều kiện hợp lệ:

- Nếu hóa đơn của bàn đã có ít nhất một món ăn được gọi : Hệ thống hiển thị thông báo lỗi "Bàn đã có món được gọi. Vui lòng thực hiện thanh toán qua thu ngân để đóng bàn." và từ chối thao tác, quay lại Bước 1.
- Nếu hóa đơn của bàn hoàn toàn trống (không có món ăn nào được gọi): Hệ thống cho phép tiếp tục và chuyển sang Bước 5.
  Bước 5: Hệ thống hiển thị form yêu cầu nhân viên nhập thông tin bắt buộc:
- Ghi chú bổ sung (tùy chọn)
  Bước 6: Nhân viên xác nhận thao tác hủy mở bàn.
  Bước 7: Hệ thống thực hiện đồng thời các thao tác xử lý tự động sau:
- Cập nhật trạng thái bàn từ "Đang sử dụng" sang "Trống".
- Vô hiệu hóa phiên làm việc hiện hành của bàn ngay lập tức.
  Bước 8: Hệ thống hiển thị thông báo xác nhận "Hủy mở bàn thành công. Bàn đã sẵn sàng cho lượt khách tiếp theo." lên giao diện nhân viên.
  Bước 9: Bàn trở về trạng thái "Trống" hoàn toàn. Sơ đồ bàn được cập nhật tự động. Khách hàng tại bàn (nếu có quét mã QR) sẽ không thể truy cập thực đơn hoặc gửi yêu cầu gọi món vì phiên làm việc đã bị vô hiệu hóa.
  Bước 10: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình Hủy mở bàn

g. Quy trình đóng bàn sau thanh toán
Bước 1: Sau khi bộ phận thu ngân xác nhận hóa đơn của bàn đã được thanh toán thành công, hệ thống tự động thực hiện đồng thời các thao tác xử lý sau:

- Chuyển đổi trạng thái hoạt động của bàn sang trạng thái "Trống".
- Hủy bỏ và vô hiệu hóa hoàn toàn mã liên kết phiên phục vụ hiện hành của bàn đó. Mọi yêu cầu truy cập thực đơn hoặc gửi lệnh gọi món sử dụng mã liên kết cũ này sau thời điểm đóng bàn đều bị hệ thống từ chối.
- Thực hiện khóa, đóng hóa đơn gọi món và lưu trữ thông tin vào lịch sử giao dịch.
  Bước 2: Giao diện sơ đồ bàn lập tức cập nhật bàn về trạng thái "Trống" để sẵn sàng tiếp đón lượt khách tiếp theo. Mã liên kết phiên phục vụ mới sẽ không được tạo ra cho đến khi nhân viên thực hiện thao tác mở bàn ở lượt phục vụ kế tiếp.
  Bước 3: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình đóng bàn sau khi thanh toán

h. Quy trình đặt bàn trước - khách đặt trên website
Trạng thái đơn đặt bàn trên hệ thống bao gồm: Chờ xác nhận, Đã xác nhận, Từ chối, Đã sử dụng, Đã hủy, Không đến.
Bước 1: Khách hàng truy cập vào chuyên mục đặt bàn trên trang web của nhà hàng và tiến hành nhập các thông tin đăng ký bao gồm:

- Họ và tên
- Số điện thoại liên hệ
- Ngày và giờ đến nhà hàng
- Số lượng khách dự kiến
- Ghi chú hoặc yêu cầu đặc biệt (nếu có)
  Bước 2: Hệ thống thực hiện kiểm tra tính hợp lệ của các thông tin đầu vào:
- Nếu thông tin bắt buộc bị bỏ trống hoặc thời gian đặt bàn không hợp lệ (thời gian trong quá khứ hoặc nằm ngoài khung giờ hoạt động của nhà hàng): Hệ thống hiển thị thông báo lỗi chi tiết để khách hàng chỉnh sửa và quay lại Bước 1.
- Nếu thông tin hoàn toàn hợp lệ: Hệ thống tiến hành khởi tạo một đơn đặt bàn mới với trạng thái "Chờ xác nhận". Tại bước này, hệ thống sẽ chưa chỉ định vị trí bàn cụ thể nhằm tránh tình trạng trùng lặp vị trí giữa nhiều khách hàng đăng ký cùng một thời điểm.
  Bước 3: Hệ thống tự động thông báo về sự xuất hiện của đơn đặt bàn mới đến màn hình quản lý của Người quản lý hoặc thu ngân.
  Bước 4: Người quản lý hoặc nhân viên phục vụ tiến hành xem xét đơn đặt bàn, kiểm tra sơ đồ vị trí các bàn còn trống theo đúng khung giờ khách yêu cầu để lựa chọn và sắp xếp bàn phù hợp (Thao tác gán vị trí bàn được thực hiện thủ công bởi Người quản lý hoặc nhân viên phục vụ để đảm bảo tính chính xác và tối ưu không gian nhà hàng):
- Nếu không còn bàn nào trống hoặc không có vị trí phù hợp với số lượng khách: Người quản lý hoặc nhân viên phục từ chối đơn, hệ thống chuyển trạng thái đơn sang "Từ chối" và gửi thông báo phản hồi đến khách hàng thông qua số điện thoại hoặc email đăng ký và Chuyển sang Bước 7.
- Nếu tìm được vị trí bàn phù hợp: Người quản lý hoặc nhân viên phục vụ xác nhận và chỉ định vị trí bàn cho đơn hàng. Hệ thống tự động cập nhật trạng thái đơn đặt bàn sang "Đã xác nhận", đồng thời chuyển trạng thái bàn trên sơ đồ sang "Đã đặt trước" theo khung giờ tương ứng.
  Bước 4.1: Sau khi nhân viên gán bàn cho đơn đặt trước, hệ thống khóa bàn đó hoàn toàn (không cho mở bàn) trong khung giờ khách hẹn (từ 30 phút trước giờ hẹn đến 1 giờ sau).
- Khi nhân viên thử mở bàn đó, hệ thống hiển thị cảnh báo: "Bàn đã được đặt trước cho khách [Tên] vào lúc [Giờ]. Vui lòng kiểm tra trước khi mở."
- Nếu khách đặt trước không đến sau 30 phút quá giờ, hệ thống tự động mở khóa bàn
- Nếu khách hàng có yêu cầu hủy sau khi đã đặt. Nhân viên có thể lựa chọn hủy bàn tại giao diện
  Bước 5: Hệ thống tự động gửi thông báo xác nhận đặt bàn thành công kèm thông tin vị trí bàn đến khách hàng thông qua số điện thoại hoặc email đã cung cấp.
  Bước 6: [Xử lý trường hợp khách không đến]: Nếu thời gian thực tế đã quá 30 phút so với giờ hẹn trên phiếu đặt bàn nhưng nhân viên phục vụ vẫn chưa thực hiện thao tác mở bàn, hệ thống sẽ nhắc nhở đến Người quản lý hoặc nhân viên. Người quản lý hoặc nhân viên phục vụ tiến hành kiểm tra và có thể chuyển trạng thái đơn đặt bàn sang "Không đến", đồng thời lệnh cho hệ thống tự động giải phóng vị trí, trả bàn về trạng thái "Trống" để đón khách khác.
  Bước 7: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình đặt bàn qua Website

i. Quy trình hủy đặt bàn
Bước 1: Khách hàng (yêu cầu từ xa) hoặc nhân viên phục vụ (tiếp nhận yêu cầu trực tiếp) đưa ra đề nghị hủy đơn đặt bàn đã hẹn trước.
Bước 2: Hệ thống thực hiện kiểm tra trạng thái hiện tại của đơn đặt bàn trong cơ sở dữ liệu:

- Nếu đơn đặt bàn đã ở trạng thái "Đã hủy" từ trước đó: Hệ thống hiển thị thông báo lỗi và kết thúc quy trình tại Bước 5.
- Nếu đơn đặt bàn đang ở trạng thái hợp lệ ("Chờ xác nhận" hoặc "Đã xác nhận"): Hệ thống phê duyệt yêu cầu hủy và chuyển sang Bước 3.
  Bước 3: Hệ thống tiến hành cập nhật trạng thái của đơn đặt bàn sang trạng thái "Đã hủy". Đồng thời, hệ thống tự động giải phóng vị trí bàn đã gán cho đơn này trên hệ thống, trả bàn về trạng thái "Trống" trên sơ đồ nhà hàng.
  Bước 4: Hệ thống tự động gửi thông báo xác nhận hủy đặt bàn thành công đến khách hàng (thông qua tin nhắn điện thoại hoặc email) và hiển thị phản hồi thành công cho nhân viên trên màn hình quản lý.
  Bước 5: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình hủy đặt bàn

j. Quy trình chuyển bàn
Quy trình này áp dụng khi khách hàng có nhu cầu đổi sang một vị trí bàn khác trong khi đang dùng bữa tại nhà hàng BBQ, hoặc khi nhà hàng cần chủ động sắp xếp lại chỗ ngồi cho hợp lý. Toàn bộ lịch sử gọi món của khách được giữ nguyên vẹn, không bị mất dữ liệu.
Bước 1: Nhân viên phục vụ truy cập vào chức năng "Chuyển bàn" trên giao diện hệ thống, tiến hành chọn bàn nguồn (vị trí bàn hiện tại khách đang ngồi) và chọn bàn đích (vị trí bàn mới khách muốn chuyển đến).
Bước 2: Hệ thống thực hiện kiểm tra các điều kiện ràng buộc dữ liệu thực tế trên sơ đồ bàn:

- Nếu bàn nguồn không ở trạng thái "Đang sử dụng": Hệ thống hiển thị thông báo lỗi "Bàn không có khách" và quay lại Bước 1.
- Nếu bàn đích không ở trạng thái "Trống": Hệ thống hiển thị thông báo cảnh báo "Bàn đích hiện tại không trống" và yêu cầu nhân viên lựa chọn lại vị trí bàn khác tại Bước 1.
- Nếu cả hai điều kiện trên đều hoàn toàn hợp lệ: Hệ thống phê duyệt yêu cầu chuyển bàn và chuyển sang Bước 3.
  Bước 3: Nhân viên phục vụ kiểm tra lại thông tin hai vị trí bàn một lần nữa và nhấn nút xác nhận thao tác chuyển bàn.
  Bước 4: Hệ thống lập tức thực hiện đồng thời các thao tác xử lý tự động sau:
- Chuyển toàn bộ danh sách các món ăn (bao gồm món đã lên, món đang làm) từ hóa đơn của bàn cũ sang hóa đơn mới được khởi tạo cho bàn mới; giữ nguyên trạng thái từng món, giá gốc và thông tin nhân viên ghi nhận.
- Tạo một mã liên kết phiên phục vụ mới bảo mật dành riêng cho bàn mới, đồng thời hủy bỏ và vô hiệu hóa hoàn toàn mã liên kết phiên phục vụ cũ của bàn trước đó.
- Cập nhật thay đổi trạng thái trên sơ đồ: Trả bàn cũ về trạng thái "Trống" và chuyển bàn mới sang trạng thái "Đang sử dụng".
  Bước 4.1: Chuyển thông tin bàn chuyển tới bếp
- Hệ thống tự động gửi thông báo chuyển bàn theo thời gian thực đến màn hình hiển thị của bộ phận bếp qua kèm nội dung ví dụ "BÀN CHUYỂN: A5 → A7"
- Đối với các món ăn đang ở trạng thái "Đang chế biến" hệ thống tự động cập nhật số bàn mới trên màn hình bếp để nhân viên bếp không đưa nhầm món sang bàn cũ.
- Thông báo này hiển thị ở vị trí nổi bật trên màn hình bếp và kèm âm thanh cảnh báo nhẹ để bếp chú ý.
  Bước 5: Hệ thống trả về thông báo "Chuyển bàn thành công" trên màn hình của nhân viên phục vụ. Đồng thời, màn hình hiển thị tại bộ phận bếp sẽ tự động cập nhật số bàn mới cho các món ăn đang trong quá trình chế biến của lượt khách này để tránh đưa nhầm bàn.
  Bước 6: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình chuyển bàn

2.3.1.11 Quy trình quản lí Gọi món
Mô tả nghiệp vụ:
Quy trình gọi món bao gồm hai luồng: khách hàng tự gọi qua mã QR và nhân viên phục vụ hỗ trợ gọi món. Nhân viên phục vụ đóng vai trò xác nhận cuối cùng trước khi đơn chế biến được gửi đến bếp. Thông tin nhân viên xác nhận được ghi nhận tại cấp độ từng dòng món trong đơn hàng.
a. Quy trình khách hàng gọi món qua mã QR
Bước 1: Khách hàng tiến hành quét mã QR nhận diện vật lý được dán cố định tại bàn. Hệ thống thực hiện nhận diện vị trí bàn và kiểm tra mã liên kết phiên phục vụ hiện hành của bàn đó trong cơ sở dữ liệu:

- Nếu bàn chưa được nhân viên làm thủ tục mở trên sơ đồ (không có mã liên kết phiên phục vụ hợp lệ): Hệ thống hiển thị thông báo "Bàn chưa sẵn sàng, vui lòng liên hệ nhân viên" và từ chối, không cho phép truy cập danh mục món ăn và Kết thúc quy trình.
- Nếu mã liên kết phiên phục vụ hoàn toàn hợp lệ: Hệ thống phê duyệt dữ liệu và hiển thị giao diện thực đơn điện tử gồm danh sách các món ăn đang được kinh doanh tại nhà hàng.
  Bước 2: Khách hàng tiến hành lựa chọn món ăn, nhập số lượng, thêm các ghi chú yêu cầu đặc biệt (nếu có) và nhấn nút xác nhận gửi yêu cầu gọi món.
- Ngay sau khi khách hàng bấm xác nhận, hệ thống sẽ tự động vô hiệu hóa tạm thời nút gửi trên giao diện nhằm ngăn chặn tình trạng gửi trùng lặp đơn do khách hàng nhấn nút nhiều lần.
  Bước 2.1: Cho phép khách tự hủy khi chưa có nhân viên xác nhận
- Ngay sau khi gửi yêu cầu thành công, màn hình khách hàng hiển thị trạng thái "Chờ nhân viên xác nhận" kèm nút "Hủy yêu cầu này" (màu đỏ).
- Điều kiện: Khách hàng có toàn quyền nhấn hủy trong khoảng thời gian chưa có nhân viên bấm xác nhận (áp dụng cho cả trường hợp gọi nhầm, thiếu món).
- Nếu khách nhấn hủy: Hệ thống xóa bỏ yêu cầu gọi món, gửi thông báo "Đã hủy" và Quay lại Bước 2 để khách gọi lại.
- Nếu khách không hủy và nhân viên chưa xác nhận trong vòng 2 phút, hệ thống tự động gửi tin nhắn nhắc nhở đến thiết bị nhân viên khu vực (chống trường hợp nhân viên bỏ lỡ)(Nếu có)
  Bước 3: Hệ thống thực hiện kiểm tra lại tính hợp lệ của mã liên kết phiên phục vụ tại đúng thời điểm nhận được yêu cầu để đảm bảo bàn ăn vẫn đang trong trạng thái mở. Nếu mã liên kết không còn hợp lệ (do bàn ăn đã bị đóng, đã thanh toán hoặc đã được mở lại cho một lượt khách mới): Hệ thống hiển thị thông báo từ chối yêu cầu và kết thúc quy trình.
  Bước 4: Hệ thống thực hiện rà soát dữ liệu xem tại vị trí bàn này có yêu cầu gọi món nào trước đó đang ở trạng thái "Chờ xác nhận" hay không:
- Nếu ghi nhận đang có đơn cũ chờ duyệt: Hệ thống hiển thị thông báo "Yêu cầu trước chưa được xác nhận, vui lòng đợi trong giây lát" và từ chối khởi tạo yêu cầu mới Quay lại Bước 2.
- Nếu không có đơn nào đang tồn đọng: Hệ thống phê duyệt dữ liệu và chuyển sang Bước 5.
  Bước 5: Hệ thống tiến hành khởi tạo một yêu cầu gọi món mới với trạng thái ban đầu là "Chờ xác nhận", đồng thời tự động phát tín hiệu thông báo theo thời gian thực đến thiết bị của nhân viên phục vụ đang phụ trách khu vực đó.
  Bước 6: Nhân viên phục vụ tiến hành xem xét danh sách các món khách vừa chọn trên thiết bị quản lý để thực hiện xác nhận hoặc từ chối:
- Nếu nhân viên nhấn nút từ chối: Hệ thống thực hiện hủy yêu cầu gọi món này, đồng thời gửi thông báo phản hồi trực tiếp đến màn hình điện thoại của khách hàng và quay lại Bước 2.
- Nếu nhân viên nhấn nút xác nhận hệ thống kích hoạt bộ đếm 15 giây trong 15 giây này có thể:
  • Khách hàng có thể tự hủy từng món hoặc toàn bộ đơn trên giao diện QR (nút "Hủy món này" vẫn sáng).
  • Nhân viên có thể hủy hộ trên thiết bị quản lý.
- Nếu không có gì thay đổi, hệ thống tự động ghi nhận thông tin định danh của nhân viên xác nhận vào từng dòng món ăn cụ thể, cập nhật trạng thái yêu cầu sang "Đang chờ chế biến" và chuyển sang Bước 7.
  Bước 7: Hệ thống tự động chuyển tiếp đơn yêu cầu chế biến này đến màn hình hiển thị của bộ phận bếp theo thời gian thực để tiến hành làm món.
  Bước 8: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình gọi món qua mã QR

b. Quy trình nhân viên phục vụ hỗ trợ gọi món
Bước 1: Nhân viên phục vụ truy cập vào giao diện "Sơ đồ bàn" trên hệ thống quản lý và lựa chọn vị trí bàn cụ thể đang cần hỗ trợ gọi món.

- Nếu bàn không có phiên mở hợp lệ (trạng thái không phải "Đang sử dụng"): Hệ thống hiển thị thông báo "Bàn hiện không hoạt động. Vui lòng mở bàn trước khi gọi món." và kết thúc quy trình.
- Nếu bàn hợp lệ: Chuyển sang Bước 2.
  Bước 2: Hệ thống thực hiện truy vấn kèm giao diện danh mục thực đơn của nhà hàng. Hệ thống kiểm tra xem tại bàn này có tồn tại yêu cầu gọi món nào đang ở trạng thái "Chờ xác nhận" hay không:
- Nếu có: Hệ thống hiển thị thông báo "Bàn đang có yêu cầu gọi món chờ xác nhận. Vui lòng xác nhận hoặc từ chối trước khi thêm món mới." và tạm khóa chức năng gọi món đến khi xử lý xong.
- Nếu không có: Cho phép nhân viên tiếp tục gọi món.
  Bước 3: Nhân viên phục vụ tiến hành lựa chọn các món ăn theo yêu cầu trực tiếp của khách, nhập số lượng, bổ sung ghi chú chế biến và nhấn nút xác nhận.
  Bước 4: Hệ thống tiến hành ghi nhận tự động thông tin định danh của nhân viên phục vụ vào từng dòng món ăn vừa thêm theo hồ sơ nhân viên đang được chọn trên thiết bị, cập nhật trạng thái món ăn và thực hiện chuyển lệnh chế biến trực tiếp xuống bộ phận bếp.
  Bước 5: Kết thúc quy trình.
  Lưu ý: Trường hợp giao ca, đơn hàng của bàn vẫn được giữ nguyên. Các dòng món được thêm sau khi giao ca sẽ mang thông tin nhân viên ca mới tự động theo hồ sơ nhân viên đang được chọn trên thiết bị và hệ thống tự động thông báo đến nhân viên ca mới về các đơn đang chờ xác nhận, và nhân viên ca mới có thể xác nhận hoặc từ chối. Nếu sau 2 phút không ai xác nhận, hệ thống tự động từ chối và thông báo lại cho khách qua giao diện QR.

Hình 2- Sơ đồ quy trình

c. Quy trình cập nhật món ăn trong gọi món
Mô tả nghiệp vụ:
Quy trình này cho phép nhân viên phục vụ hoặc khách hàng (qua QR) thực hiện các thay đổi đối với món ăn đã gọi trong hóa đơn hiện tại của bàn, bao gồm: thêm món mới, thay đổi số lượng, sửa ghi chú hoặc thay thế món. Quy trình chỉ áp dụng cho các món ăn đang ở trạng thái "Đang chờ chế biến" hoặc "Đang chế biến". Đối với món đã ở trạng thái "Đã hoàn thành", việc thay đổi phải thực hiện theo quy trình hủy món (2.3.1.7c) và gọi món mới.
C1. Trường hợp 1: Khách gọi thêm món (luồng QR)
Bước 1: Khách hàng quét mã QR tại bàn, truy cập vào giao diện thực đơn điện tử.
Bước 2: Hệ thống kiểm tra trạng thái bàn và mã liên kết phiên phục vụ:

- Nếu bàn không ở trạng thái "Đang sử dụng" hoặc mã liên kết không hợp lệ: Hệ thống hiển thị thông báo và kết thúc quy trình.
- Nếu hợp lệ: Hệ thống hiển thị giao diện thực đơn, đồng thời hiển thị giỏ hàng hiện tại (đang được xác nhận hoặc đang chế biến).
  Bước 3: Khách hàng lựa chọn món ăn, nhập số lượng, thêm ghi chú và nhấn nút "Thêm vào hóa đơn".
  Bước 4: Hệ thống ghi nhận các món mới và thêm vào hóa đơn hiện tại của bàn, với trạng thái "Chờ xác nhận" (nếu là món mới) và tự động gửi thông báo đến nhân viên phục vụ khu vực để xác nhận.
  Bước 5: Nhân viên phục vụ xác nhận các món mới này. Nhân viên phục vụ tiến hành xem xét danh sách các món khách vừa chọn trên thiết bị quản lý để thực hiện xác nhận hoặc từ chối:
- Nếu nhân viên nhấn nút từ chối: Hệ thống thực hiện hủy yêu cầu gọi món này, đồng thời gửi thông báo phản hồi trực tiếp đến màn hình điện thoại của khách hàng và quay lại Bước 2.
- Nếu nhân viên nhấn nút xác nhận hệ thống kích hoạt bộ đếm 15 giây trong 15 giây này có thể:
  • Khách hàng có thể tự hủy từng món hoặc toàn bộ đơn trên giao diện QR (nút "Hủy món này" vẫn sáng).
  • Nhân viên có thể hủy hộ trên thiết bị quản lý.
- Nếu không có gì thay đổi, hệ thống tự động ghi nhận thông tin định danh của nhân viên xác nhận vào từng dòng món ăn cụ thể, cập nhật trạng thái yêu cầu sang "Đang chờ chế biến" và chuyển sang Bước 7.
  Bước 7: Thông báo gửi đến bếp phải bao gồm đầy đủ thông tin:
- "Đã cập nhật số lượng: [Tên món] - Bàn [Số bàn] - SL cũ: [X] → SL mới: [Y]". Ví dụ: "Đã cập nhật số lượng: Bò nướng - Bàn 05 - SL cũ: 5 → SL mới: 3"
- Điều này giúp bếp biết chính xác cần điều chỉnh thế nào (ví dụ: nếu đang làm 5, giảm xuống còn 3).
  Bước 8: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình cập nhật gọi món bằng mã QR

C2. Trường hợp 2: Khách gọi thêm món tại bàn (Nhân viên: thêm, sửa số lượng, ghi chú)
Bước 1: Nhân viên phục vụ truy cập vào giao diện "Sơ đồ bàn" trên hệ thống quản lý và lựa chọn bàn đang cần điều chỉnh số lượng món ăn.
Bước 2: Hệ thống hiển thị danh sách các món ăn đã gọi trong hóa đơn hiện tại của bàn đó. Thông tin hiển thị cho từng món bao gồm: tên món ăn, giá bán, số lượng hiện tại và trạng thái của món.
Bước 3: Nhân viên xác định món ăn cần thay đổi và thực hiện một trong hai thao tác sau trên dòng món đó:

- Thêm (+1): Nhấn nút Thêm, hệ thống sẽ tăng số lượng món đó lên một đơn vị.
- Bớt (-1): Nhấn nút Bớt, hệ thống sẽ giảm số lượng món đó xuống một đơn vị.
- Ghi chú (Nếu có).
  Bước 4: Khi nhân viên thực hiện thao tác Thêm hoặc Bớt, hệ thống sẽ kiểm tra trạng thái hiện tại của món ăn để quyết định cách xử lý tương ứng:
  Trường hợp 1: Món ăn đang ở trạng thái "Chờ xác nhận"
- Hệ thống cho phép cập nhật số lượng trên dòng món hiện tại.
- Khi nhân viên nhấn Thêm (+1) : Hệ thống tăng số lượng lên một đơn vị và hiển thị kết quả ngay lập tức.
- Khi nhân viên nhấn Bớt (-1) : Hệ thống kiểm tra số lượng hiện tại. Nếu số lượng lớn hơn 1, hệ thống giảm số lượng xuống một đơn vị. Nếu số lượng bằng 1, hệ thống từ chối thao tác, giữ nguyên số lượng và hiển thị thông báo hướng dẫn nhân viên sử dụng chức năng Hủy món nếu muốn xóa món.
- Lưu ý: Ở trạng thái này, bộ phận bếp chưa nhìn thấy món ăn, do đó việc thay đổi số lượng không ảnh hưởng đến tiến độ chế biến.
  Trường hợp 2: Món ăn đã được xác nhận và đang ở trạng thái "Đang chế biến"
- Hệ thống hiển thị cảnh báo xác nhận cho nhân viên: "Bạn muốn thay đổi số lượng?"
- Nếu nhân viên xác nhận thay đổi: Hệ thống thực hiện cập nhật số lượng. Đồng thời, hệ thống tự động gửi thông báo đến màn hình bếp để bộ phận bếp biết về sự thay đổi số lượng và điều chỉnh kịp thời.
- Nếu nhân viên hủy bỏ: Hệ thống giữ nguyên số lượng cũ và kết thúc quy trình tại đây.
  Trường hợp 3: Món ăn đã ở trạng thái "Đã hoàn thành"
- Khi nhân viên bấm Thêm (+1) trên món đã hoàn thành, hệ thống kiểm tra xem đã có dòng món nào cùng tên đang ở trạng thái "Chờ xác nhận" hoặc "Đang chờ chế biến" chưa.
- Nếu chưa có: Tạo dòng món mới với số lượng = 1.
- Nếu đã có: Cập nhật số lượng trên dòng món hiện tại (tăng thêm 1) thay vì tạo dòng mới.
- Ví dụ: Món bò đã hoàn thành (2 phần). Nhân viên bấm Thêm (+1) lần 1 → Tạo dòng mới: bò x1. Nhân viên bấm Thêm (+1) lần 2 → Không tạo mới, chỉ cập nhật bò x1 thành bò x2. Kết quả: hóa đơn chỉ có 1 dòng bò "Đang chờ chế biến" với số lượng 2, bếp nhận đơn gọn gàng.
  Bước 5: Hệ thống ghi nhận đầy đủ các thông tin thay đổi vào nhật ký hệ thống, bao gồm: thời điểm cập nhật, nhân viên thực hiện thao tác, loại thay đổi (Thêm hoặc Bớt), số lượng cũ và số lượng mới. Trong trường hợp món đã hoàn thành, hệ thống cũng ghi nhận mã dòng món mới được tạo ra để phục vụ công tác đối soát và truy vết sau này.
  Bước 6: Hệ thống tự động đồng bộ thông tin số lượng mới lên các giao diện liên quan: hóa đơn hiển thị cho nhân viên phục vụ, màn hình hiển thị của bộ phận bếp (đối với các món đang chế biến hoặc các dòng món mới được tạo) và giao diện khách hàng đang quét mã QR để theo dõi đơn hàng.
  Bước 7: Hệ thống hiển thị thông báo xác nhận "Cập nhật số lượng món ăn thành công" trên màn hình của nhân viên.
  Bước 8: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình cập nhật gọi món tại bàn

d. Quy trình hủy món
Đây là quy trình hủy món duy nhất và đồng nhất trong toàn bộ hệ thống. Khi một món ăn đã chuyển sang trạng thái "Đã hoàn thành", lượng nguyên liệu thành phần đã tiêu hao hoàn toàn trong quá trình chế biến và không thể hoàn trả dữ liệu về kho tổng. Hệ thống sẽ không can thiệp vào các hoạt động xử lý vật lý bên ngoài - việc nhân viên phục vụ chủ động mang món ăn vật lý đó sang phục vụ cho một bàn ăn khác hoàn toàn là thao tác nghiệp vụ thực tế ngoài hệ thống, bộ phận bếp chỉ cần thực hiện cập nhật đúng trạng thái dữ liệu trên màn hình quản lý.
Bước 1: Nhân viên phục vụ hoặc Người quản lý gửi yêu cầu lệnh hủy món ăn lên hệ thống, tiến hành nhập lý do hủy cụ thể và tên người chịu trách nhiệm trực tiếp cho thao tác này.
Bước 2: Hệ thống thực hiện kiểm tra trạng thái dữ liệu hiện tại của món ăn trong cơ sở dữ liệu để rẽ nhánh xử lý:

- Nếu món ăn đã bị hủy trước đó: Hệ thống hiển thị thông báo lỗi trùng lặp và kết thúc quy trình tại Bước 7.
- Nếu món ăn đang ở trạng thái "Đang chờ chế biến" hoặc "Đang chế biến": Hệ thống phê duyệt lệnh cho phép hủy trực tiếp món ăn và chuyển thẳng sang Bước 3.
- Nếu món ăn đã chuyển sang trạng thái "Đã hoàn thành": Hệ thống đưa ra cảnh báo bắt buộc phải có sự xác thực phê duyệt từ tài khoản của Người quản lý trước khi tiếp tục hệ thống; nếu Quản lý phê duyệt thành công, hệ thống chuyển sang Bước 3.
- Từ QR: Nếu món ăn đang ở trạng thái "Chờ xác nhận" : Hệ thống cho phép hủy trực tiếp (không cần bếp xác nhận) vì bếp chưa nhìn thấy món. Nhân viên hoặc khách hàng (qua QR) có thể hủy ngay. Hệ thống xóa dòng món và kết thúc quy trình.
  Bước 3: Hệ thống tự động gửi thông báo lệnh hủy món theo thời gian thực đến màn hình hiển thị của bộ phận bếp.
  Bước 4: Nhân viên bếp thực hiện nhấn nút xác nhận lệnh hủy món trên màn hình quản lý để ngừng các hoạt động nấu nướng (Món ăn vật lý đã chế biến xong hoặc đang dở dang vẫn được tạm lưu giữ tại khu vực bếp).
  Bước 5: Hệ thống thực hiện cập nhật trạng thái của món ăn sang trạng thái "Đã hủy", khởi tạo phiếu hủy kèm lý do tương ứng, loại bỏ món ăn này khỏi hóa đơn của bàn gốc, đồng thời giữ nguyên số lượng dữ liệu tồn kho tổng (Kho bếp không thay đổi).
  Bước 6: Hệ thống tiến hành rà soát danh sách các đơn hàng hiện có của toàn bộ nhà hàng và xử lý tự động theo hai trường hợp cụ thể:
- Trường hợp 1: Hệ thống ghi nhận đang có bàn ăn khác trong nhà hàng chờ đúng món ăn này: Nhân viên bếp thực hiện chuyển món ăn vật lý sang cho lượt phục vụ mới và nhấn nút xác nhận "Đã hoàn thành" cho lượt gọi món tương ứng của bàn đang chờ đó như bình thường. Hệ thống cập nhật trạng thái đơn, đồng thời thực hiện trừ kho tổng theo định mức quy định (nếu lượt gọi món của bàn mới chưa được trừ kho). Khách hàng bàn mới được phục vụ nhanh hơn và không phát sinh thao tác đặc biệt nào khác trên hệ thống.
- Trường hợp 2: Hệ thống ghi nhận không có bất kỳ bàn nào đang chờ món ăn này: Món ăn vật lý được giữ lại tại khu vực bếp để chờ các lượt gọi món tiếp theo. Nếu kết thúc ca làm việc mà không có bàn nào gọi và món ăn không còn giá trị sử dụng, hệ thống sẽ tự động ghi nhận lượng hao hụt này vào nhật ký hao hụt của nhà hàng bao gồm các thông tin: tên món, lượng nguyên liệu đã tiêu hao theo định mức, lý do hao hụt, tên người làm sai và người phê duyệt để Người quản lý kiểm tra trong báo cáo cuối ngày.
  Bước 7: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình hủy món

2.3.1.12 Quy trình Thanh toán và Hóa đơn
Mô tả nghiệp vụ:
Bộ phận thu ngân tiếp nhận yêu cầu thanh toán từ nhân viên phục vụ, tiến hành lập hóa đơn và xử lý các thủ tục thanh toán cho khách hàng. Hóa đơn thanh toán sẽ tổng hợp toàn bộ danh sách các món ăn đã được bộ phận bếp xác nhận hoàn thành của bàn đó, đồng thời tự động loại trừ các món ăn đã áp dụng lệnh hủy.
a. Quy trình Nhận yêu cầu thanh toán
Bước 1: Nhân viên phục vụ gửi yêu cầu thanh toán của bàn ăn lên hệ thống. Hệ thống lập tức phát tín hiệu thông báo đến màn hình quản lý của bộ phận thu ngân.
Bước 2: Thu ngân truy cập vào chức năng lập hóa đơn của bàn tương ứng. Hệ thống thực hiện truy vấn dữ liệu và hiển thị danh sách các món ăn đã hoàn thành, đơn giá (áp dụng chính xác tại thời điểm khách gọi món) và tổng giá trị đơn hàng tạm tính.
Bước 3: Hệ thống thực hiện rà soát và kiểm tra trạng thái của các món ăn trong đơn:

- Nếu ghi nhận vẫn còn món ăn đang ở trạng thái "Đang chế biến": Hệ thống hiển thị cảnh báo "Còn món chưa hoàn thành" và đưa ra yêu cầu xác nhận. Nếu thu ngân phối hợp với phục vụ và khách hàng quyết định hủy món đó hoặc vẫn tiếp tục tính tiền các món đã lên, hệ thống mới cho phép chuyển sang Bước 4.
- Nếu không còn món nào đang chế biến dở dang: Hệ thống phê duyệt dữ liệu hợp lệ và chuyển thẳng sang Bước 4.
- Thu ngân chỉ được thanh toán khi tất cả các món hủy đã được bếp xác nhận (chuyển sang "Đã hủy") hoặc tất cả món đều đã hoàn thành.
  Bước 4: Thu ngân tiến hành đối chiếu, kiểm tra lại toàn bộ thông tin trên hóa đơn và thực hiện các điều chỉnh nghiệp vụ nếu cần thiết (như áp dụng mã giảm giá, chương trình khuyến mãi hoặc phụ thu) (nếu có)
  Bước 5: Thu ngân lựa chọn hình thức thanh toán theo yêu cầu của khách hàng (Tiền mặt hoặc Chuyển khoản) và nhấn nút xác nhận hoàn tất thanh toán.
  Bước 6: Hệ thống ghi nhận giao dịch thành công và đồng thời thực hiện các thao tác xử lý tự động sau:
- Cập nhật trạng thái của hóa đơn sang "Đã thanh toán" và lưu trữ vào lịch sử doanh thu. Ghi nhận mã hồ sơ nhân viên thu ngân đang được chọn trên thiết bị vào hóa đơn
- Hủy bỏ và vô hiệu hóa hoàn toàn mã liên kết phiên phục vụ hiện hành của bàn ăn này để ngăn chặn các yêu cầu gọi món phát sinh sau đó.
- Cập nhật thay đổi trạng thái trên sơ đồ nhà hàng, trả bàn ăn về trạng thái "Trống" để sẵn sàng tiếp đón lượt khách tiếp theo.
  Bước 7: Hệ thống thực hiện lệnh in hóa đơn giấy tại quầy để thu ngân bàn giao cho khách hàng, hoặc xuất file hóa đơn điện tử theo yêu cầu.
  Bước 8: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình tiếp nhận yêu cầu thanh toán

b. Quy trình tra cứu hóa đơn
Nghiệp vụ này cho phép bộ phận thu ngân và Người quản lý có thể chủ động tra cứu, kiểm tra lại thông tin các giao dịch tài chính đã phát sinh tại nhà hàng BBQ.
Bước 1: Thu ngân hoặc Người quản lý truy cập vào chức năng "Quản lý hóa đơn" trên giao diện hệ thống.
Bước 2: Người dùng tiến hành nhập từ khóa tìm kiếm hoặc lựa chọn các tiêu chí lọc dữ liệu trên thanh công cụ bao gồm:

- Mã số hóa đơn
- Số bàn phục vụ
- Khoảng thời gian phát sinh giao dịch (Từ ngày... đến ngày...)
- Trạng thái hóa đơn (Đã thanh toán / Chưa thanh toán / Đã hủy)
  Bước 3: Hệ thống thực hiện truy vấn cơ sở dữ liệu và trả về kết quả hiển thị trên màn hình:
- Nếu tìm thấy dữ liệu trùng khớp: Hệ thống hiển thị danh sách các hóa đơn thỏa mãn điều kiện. Người dùng có thể bấm xem chi tiết từng hóa đơn để xem các thông tin cụ thể bao gồm: danh sách món ăn, số lượng, đơn giá, tổng tiền, số tiền giảm giá và phương thức thanh toán đã sử dụng.
- Nếu không tìm thấy kết quả phù hợp: Hệ thống hiển thị thông báo "Không tìm thấy hóa đơn phù hợp với tiêu chí tra cứu" và hiển thị danh sách trống.
  Bước 4: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình tra cứu hóa đơn

c. Quy trình lập báo cáo doanh thu theo ngày
Bộ phận thu ngân có thể xem tổng kết doanh thu theo ngày nhằm phục vụ công tác đối soát quỹ và tiền mặt cuối ngày. Báo cáo được hệ thống tự động tổng hợp dữ liệu từ các hóa đơn đã thanh toán trong ngày, đảm bảo tính chính xác và không yêu cầu các thao tác nhập liệu thủ công.
Bước 1: Thu ngân truy cập vào chức năng "Báo cáo doanh thu theo ngày" trên giao diện hệ thống.
Bước 2: Hệ thống mặc định truy vấn và hiển thị dữ liệu tổng hợp của ngày hiện tại. Thu ngân có thể chủ động lựa chọn một mốc ngày khác trên bộ lịch của hệ thống nếu có nhu cầu xem lại lịch sử doanh thu.
Bước 3: Hệ thống thực hiện quét toàn bộ cơ sở dữ liệu, tổng hợp từ các hóa đơn đã hoàn tất thanh toán trong ngày được chọn và trả về các thông tin hiển thị trên màn hình bao gồm:

- Tổng số lượng hóa đơn đã phục vụ và thanh toán thành công trong ngày.
- Tổng doanh thu thực tế ghi nhận trong ngày.
- Cơ cấu doanh thu được phân tách cụ thể theo từng hình thức thanh toán (Tổng số tiền mặt nhận được, tổng số tiền nhận qua chuyển khoản hoặc quẹt thẻ ngân hàng).
- Danh sách chi tiết các hóa đơn của từng bàn ăn được sắp xếp theo trình tự thời gian, kèm theo mốc giờ thanh toán thực tế và tổng số tiền của từng hóa đơn.
  Bước 4: Thu ngân tiến hành đối soát số liệu thực tế tại quầy với báo cáo trên hệ thống, sau đó có thể chọn chức năng in báo cáo ra giấy hoặc xuất tệp dữ liệu (file) báo cáo để phục vụ công tác lưu trữ và bàn giao ca.
  Bước 5: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình

2.3.1.13 Quy trình Báo cáo và Thống kê
Mô tả nghiệp vụ:
Chức năng báo cáo và thống kê cung cấp cho Người quản lý cái nhìn tổng thể về tình hình hoạt động kinh doanh của nhà hàng BBQ theo nhiều chiều thời gian khác nhau. Dữ liệu được hệ thống tự động xử lý, tổng hợp từ danh sách các hóa đơn đã thanh toán và lịch sử xuất - nhập kho thực tế, hỗ trợ Người quản lý đưa ra các quyết định vận hành chính xác.
a. Quy trình xem báo cáo doanh thu
Báo cáo doanh thu hỗ trợ Người quản lý linh hoạt lựa chọn và lọc dữ liệu theo các mốc thời gian: Ngày, Tuần, Tháng hoặc một khoảng thời gian tùy chọn.
Bước 1: Người quản lý truy cập vào chức năng "Báo cáo doanh thu tổng quan" trên giao diện hệ thống.
Bước 2: Người quản lý tiến hành lựa chọn khoảng thời gian cần thống kê và loại hình biểu diễn báo cáo (Dạng bảng số liệu hoặc biểu đồ).
Bước 3: Hệ thống thực hiện truy vấn cơ sở dữ liệu, tự động tính toán và trả về kết quả hiển thị trên màn hình bao gồm các thông tin:

- Tổng doanh thu thực tế đạt được trong khoảng thời gian được chọn.
- Biểu đồ diễn biến doanh thu theo từng ngày trong khoảng thời gian đó.
- Cơ cấu doanh thu phân tách theo hình thức thanh toán (Tổng tiền mặt và tổng số tiền nhận qua chuyển khoản).
- Danh sách 10 món ăn bán chạy nhất được sắp xếp theo số lượng tiêu thụ và tổng giá trị doanh thu mang lại.
- Doanh thu được phân chia chi tiết theo từng danh mục thực đơn (Ví dụ: Nhóm món nướng, nhóm món lẩu, nhóm đồ uống...).
  Bước 4: Người quản lý có thể chọn in trực tiếp hoặc xuất tệp dữ liệu báo cáo để phục vụ lưu trữ.
  Bước 5: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình xem báo cáo doanh thu

b. Quy trình xem thống kê theo hiệu suất nhân viên
Do hệ thống áp dụng cơ chế ghi nhận định danh nhân viên phục vụ tại cấp độ từng món ăn cụ thể, Người quản lý có thể thống kê chính xác khối lượng công việc mà từng nhân viên đã thực hiện trong một khoảng thời gian bất kỳ. Chức năng này hỗ trợ đánh giá hiệu suất làm việc thực tế của từng nhân sự một cách trực quan mà không cần phụ thuộc vào việc quản lý ca làm việc cố định.
Bước 1: Người quản lý truy cập vào chức năng "Thống kê hiệu suất nhân viên" trên giao diện hệ thống.
Bước 2: Người quản lý lựa chọn khoảng thời gian cần kiểm tra và chọn tên nhân viên cụ thể cần xem (hoặc chọn hiển thị tất cả nhân viên).
Bước 3: Hệ thống thực hiện truy vấn và tổng hợp toàn bộ các dòng món ăn có thông tin nhân viên xác nhận trùng khớp với điều kiện lọc, sau đó trả về kết quả hiển thị:

- Tổng số lượng các món ăn mà nhân viên đó đã kiểm tra và bấm xác nhận phục vụ cho khách.
- Tổng giá trị quy đổi thành tiền của các món ăn mà nhân viên đó đã xác nhận.
- Danh sách bảng biểu chi tiết liên kết theo từng mã số hóa đơn mà nhân viên đó có tham gia phục vụ.
  Bước 4: Người quản lý có thể chọn chức năng xuất dữ liệu báo cáo ra tệp tin để làm căn cứ đánh giá khen thưởng hoặc lưu trữ nội bộ.
  Bước 5: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình báo cáo thống kế theo nhân viên

c. Quy trình xem thống kê tồn kho và tiêu thụ nguyên liệu
Người quản lý có thể xem tổng quan tình trạng tồn kho hiện tại và lịch sử tiêu thụ nguyên liệu theo thời gian thực, làm cơ sở đối chiếu với các kết quả dự báo lượng hàng cần chuẩn bị của hệ thống cho các ngày tiếp theo.
Bước 1: Người quản lý truy cập vào chức năng "Thống kê kho và tiêu thụ nguyên liệu" trên giao diện hệ thống.
Bước 2: Người quản lý lựa chọn các tiêu chí lọc theo chủng loại nguyên liệu hoặc theo khoảng thời gian cần xem lịch sử tiêu thụ.
Bước 3: Hệ thống thực hiện kết xuất dữ liệu và hiển thị trực quan các nội dung bao gồm:

- Danh sách toàn bộ các nguyên liệu được phân loại tự động theo các màu trạng thái lưu kho: Còn hàng (An toàn), Sắp hết (Dưới mức tối thiểu), Hết hàng.
- Bảng lịch sử chi tiết các lượt nhập kho và các lượt xuất kho điều chỉnh của từng loại nguyên liệu (Rõ ngày giờ, số lượng và lý do).
- Số lượng tiêu thụ thực tế của từng loại nguyên liệu theo từng ngày (Dữ liệu này được hệ thống tự động cộng dồn từ nhật ký trừ kho tự động mỗi khi nhà bếp bấm hoàn thành món ăn).
  Bước 4: Người quản lý dựa trên các thông số tiêu thụ thực tế để đưa ra kế hoạch mua hàng hoặc điều chỉnh định mức lưu kho cho giai đoạn tiếp theo.
  Bước 5: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình xem thống kê tồn kho và tiêu nguyên liệu

2.3.1.14 Quy trình AI tư vấn món ăn
Mô tả nghiệp vụ:
Chức năng tư vấn bằng Trí tuệ nhân tạo (AI) hỗ trợ khách hàng nhanh chóng lựa chọn được các món ăn phù hợp với nhu cầu riêng dựa trên các thông tin cung cấp như sở thích cá nhân, khẩu vị (cay, không cay, ít ngọt...) hoặc số lượng người cùng tham gia dùng bữa tại nhà hàng BBQ. Để đảm bảo an toàn thông tin và bảo mật hệ thống, các yêu cầu tư vấn từ khách hàng sẽ được xử lý tập trung thông qua máy chủ trung gian của hệ thống trước khi gửi đến AI, tuyệt đối không gửi dữ liệu trực tiếp từ thiết bị của người dùng.
Bước 1: Khách hàng truy cập vào giao diện "Trợ lý ảo tư vấn món ăn" trên thiết bị di động cá nhân và tiến hành nhập nội dung yêu cầu (Giới hạn tối đa 500 ký tự để tối ưu hóa tốc độ xử lý).
Bước 2: Hệ thống thực hiện kiểm tra, lọc bỏ các ký tự lạ và làm sạch dữ liệu văn bản đầu vào:

- Nếu nội dung bị bỏ trống hoặc chứa các từ ngữ không hợp lệ: Hệ thống hiển thị thông báo nhắc nhở và yêu cầu khách hàng nhập lại nội dung tại Bước 1.
- Nếu nội dung hoàn toàn hợp lệ: Hệ thống phê duyệt và chuyển sang Bước 3.
  Bước 3: Hệ thống tự động biên dịch, kết hợp nội dung yêu cầu của khách hàng cùng với danh sách dữ liệu các món ăn hiện đang kinh doanh tại nhà hàng thành một bộ khung câu hỏi tiêu chuẩn, sau đó gửi đến bộ não xử lý AI trực tuyến. Thời gian chờ phản hồi tối đa của hệ thống được thiết lập là 10 giây để tránh việc khách hàng phải đợi quá lâu.
  Bước 4: Hệ thống tiếp nhận phản hồi từ bộ não xử lý AI và thực hiện kiểm tra kết quả trả về để rẽ nhánh xử lý:
- Nếu AI phản hồi dữ liệu thành công và trả về danh sách gợi ý hợp lệ: Hệ thống phê duyệt dữ liệu và chuyển sang Bước 5.
- Nếu quá thời gian chờ (quá 10 giây), gặp sự cố ngắt kết nối mạng hoặc AI trả về thông báo lỗi: Hệ thống tự động chuyển hướng, hiển thị thông báo lỗi "Chức năng tư vấn tạm thời không khả dụng, vui lòng thử lại sau" và đề xuất khách hàng trực tiếp xem danh mục thực đơn truyền thống. Quy trình kết thúc tại Bước 6.
  Bước 5: Hệ thống tiếp nhận nội dung và hiển thị kết quả gợi ý món ăn trực quan lên màn hình thiết bị của khách hàng. Khách hàng có thể lựa chọn nhanh các món ăn yêu thích trực tiếp ngay trên danh sách gợi ý của Trợ lý AI để thêm vào hóa đơn gọi món.
  Bước 6: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình AI tư vấn món ăn

2.3.1.15 Quy trình AI dự báo nhu cầu nguyên liệu
Mô tả nghiệp vụ:
Chức năng dự báo nhu cầu tiêu thụ sử dụng mô hình thuật toán phân tích dữ liệu chuyên sâu, được triển khai dưới dạng một phân hệ xử lý dữ liệu độc lập. Hệ thống quản lý cốt lõi của nhà hàng sẽ liên kết và gửi tín hiệu đến phân hệ dự báo này để lấy kết quả phân tích xu hướng, sau đó hiển thị trực quan cho Người quản lý tham khảo.
Bước 1: Người quản lý truy cập vào chức năng "Dự báo nhu cầu nguyên liệu" trên giao diện quản trị và tiến hành lựa chọn khoảng thời gian cần dự báo trong tương lai (Ví dụ: Dự báo cho 7 ngày tới, cho tuần tới hoặc tháng tới).
Bước 2: Hệ thống quản lý tự động trích xuất toàn bộ dữ liệu lịch sử bán hàng, lịch sử tiêu thụ các món ăn trong quá khứ và gửi yêu cầu phân tích sang phân hệ dự báo độc lập.
Bước 3: Phân hệ dự báo áp dụng mô hình toán học thuật toán để tiến hành phân tích chuỗi dữ liệu theo dòng thời gian (Xem xét các yếu tố chu kỳ như ngày cuối tuần, ngày lễ, mùa vụ), từ đó tính toán chính xác nhu cầu tiêu thụ dự kiến của từng loại nguyên liệu cấu thành trong khoảng thời gian Người quản lý yêu cầu.
Bước 4: Phân hệ dự báo hoàn tất tính toán và trả về kết quả cấu trúc dữ liệu dự báo cho hệ thống quản lý cốt lõi.
Bước 5: Hệ thống dữ liệu tiếp nhận kết quả và thực hiện biên dịch để hiển thị trực quan cho Người quản lý dưới dạng các bảng số liệu chi tiết và biểu đồ xu hướng tăng giảm. Người quản lý dựa trên các thông số dự báo này để chủ động đưa ra quyết định đặt hàng và điều chỉnh số lượng nguyên liệu nhập kho một cách tối ưu, tránh tình trạng thừa hoặc thiếu hụt hàng hóa.
Bước 6: Kết thúc quy trình.

Hình 2- Sơ đồ quy trình AI dự báo nhu cầu nguyên liệu
