import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

from forecast import chay_du_bao

load_dotenv()

app = Flask(__name__)
CORS(app)  # cho phép gọi trực tiếp khi cần test độc lập; luồng chính thức đi qua backend Node


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/forecast")
def forecast():
    try:
        so_ngay = int(request.args.get("so_ngay", 7))
    except ValueError:
        return jsonify({"message": "so_ngay phải là số nguyên"}), 400

    if so_ngay <= 0 or so_ngay > 90:
        return jsonify({"message": "so_ngay phải trong khoảng 1-90"}), 400

    try:
        ket_qua = chay_du_bao(so_ngay)
        return jsonify({"so_ngay": so_ngay, "du_lieu": ket_qua})
    except Exception as err:
        app.logger.exception("Lỗi chạy dự báo")
        return jsonify({"message": f"Lỗi server khi dự báo: {err}"}), 500


if __name__ == "__main__":
    port = int(os.getenv("FORECAST_PORT", "5001"))
    app.run(host="0.0.0.0", port=port, debug=True)
