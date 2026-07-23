// Event bus - forward sang Socket.io khi đã init(), trước đó chỉ log (fallback an toàn)
let io = null;

const bus = {
  init: (ioInstance) => {
    io = ioInstance;
  },
  emit: (event, payload) => {
    console.log(`[BUS] ${event}`, JSON.stringify(payload));
    if (io) io.emit(event, payload);
  },
};

module.exports = bus;
