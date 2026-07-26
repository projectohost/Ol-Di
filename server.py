"""Minimal local server for the Sport Arena demo.

Run:
    pip install -r requirements.txt
    python server.py
Then open http://127.0.0.1:5000
"""
from pathlib import Path
from flask import Flask, jsonify, send_from_directory

BASE_DIR = Path(__file__).resolve().parent
app = Flask(__name__, static_folder=None)


@app.get("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.get("/health")
def health():
    return jsonify(status="ok", mode="virtual-credits-demo")


@app.get("/<path:filename>")
def assets(filename: str):
    """Serve only the public files used by the demo."""
    allowed = {"index.html", "cataloge.html", "main.css", "script.js"}
    if filename not in allowed:
        return jsonify(error="not found"), 404
    return send_from_directory(BASE_DIR, filename)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
