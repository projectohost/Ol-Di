from flask import Flask, request, jsonify
from supabase import create_client
from dotenv import load_dotenv
import os

# ====== INIT ======
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)

# ====== TEST ======
@app.route("/")
def home():
    return "🎮 Game server is running"

# ====== CREATE PLAYER ======
@app.route("/create_player", methods=["POST"])
def create_player():
    data = request.json
    username = data["username"]

    res = supabase.table("players").insert({
        "username": username
    }).execute()

    return jsonify(res.data)

# ====== GET PLAYER ======
@app.route("/player/<username>")
def get_player(username):

    res = supabase.table("players") \
        .select("*") \
        .eq("username", username) \
        .single() \
        .execute()

    return jsonify(res.data)

# ====== GAME LOGIC ======
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    username = data["username"]
    bet = data["bet"]
    win = data["win"]

    player = supabase.table("players") \
        .select("*") \
        .eq("username", username) \
        .single() \
        .execute().data

    balance = player["balance"]
    xp = player["xp"]
    wins = player["wins"]
    losses = player["losses"]
    level = player["level"]

    # ====== WIN / LOSS ======
    if win:
        balance += bet * 2
        xp += 25
        wins += 1
    else:
        balance -= bet
        losses += 1

    # ====== LEVEL SYSTEM ======
    if xp >= level * 100:
        level += 1
        xp = 0

    # ====== UPDATE DB ======
    supabase.table("players").update({
        "balance": balance,
        "xp": xp,
        "level": level,
        "wins": wins,
        "losses": losses
    }).eq("username", username).execute()

    return jsonify({
        "balance": balance,
        "xp": xp,
        "level": level,
        "wins": wins,
        "losses": losses
    })

# ====== RUN SERVER ======
if __name__ == "__main__":
    app.run(debug=True)