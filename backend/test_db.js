const pool = require('./src/config/db');

async function test() {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) AS so_mon FROM MON_AN');
    console.log('✅ Kết nối OK. Số món trong DB:', rows[0].so_mon);
  } catch (err) {
    console.error('❌ Lỗi kết nối:', err.message);
  } finally {
    await pool.end(); 
  }
}

test();