from flask import Flask, request, jsonify
import json
from datetime import datetime

app = Flask(__name__)

LOG_FILE = "logs.json"

# Load existing logs
def load_logs():
    try:
        with open(LOG_FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

# Save logs
def save_logs(logs):
    with open(LOG_FILE, "w") as f:
        json.dump(logs, f, indent=4)

@app.route("/")
def home():
    return "Productivity Analyzer API Running!"

# Log user activity
@app.route("/log", methods=["POST"])
def log_activity():
    data = request.json
    logs = load_logs()
    data["timestamp"] = datetime.now().isoformat()
    logs.append(data)
    save_logs(logs)
    return jsonify({"message": "Activity logged", "data": data})

# Fetch logs
@app.route("/logs", methods=["GET"])
def get_logs():
    logs = load_logs()
    return jsonify(logs)

# Analyze Productivity
@app.route("/report", methods=["GET"])
def report():
    logs = load_logs()
    total_time = len(logs) * 5  # Assuming each log is 5 mins of activity
    return jsonify({"total_time_spent": f"{total_time} minutes"})

if __name__ == "__main__":
    app.run(debug=True)
