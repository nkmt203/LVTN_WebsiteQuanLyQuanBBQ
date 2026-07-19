// Event bus - chưa có Socket, chỉ log
// Sau này thêm Socket.io chỉ cần sửa file này
const bus = {
  emit: (event, payload) => {
    console.log(`[BUS] ${event}`, JSON.stringify(payload));
    // TODO Socket: io.to('...').emit(event, payload);
  },
};

module.exports = bus;