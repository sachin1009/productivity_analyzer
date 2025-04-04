from flask import Flask, request, jsonify
import json
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from the Chrome extension

LOG_FILE = "logs.json"

# Load logs from file
def load_logs():
    try:
        with open(LOG_FILE, "r") as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

# Save logs to file
def save_logs(logs):
    with open(LOG_FILE, "w") as file:
        json.dump(logs, file, indent=4)

# API to log activity
@app.route("/log", methods=["POST"])
def log_activity():
    data = request.json
    activity = data.get("activity", "").strip()

    if not activity:
        return jsonify({"error": "Activity cannot be empty"}), 400

    logs = load_logs()
    logs.append({"activity": activity, "timestamp": datetime.now().isoformat()})
    save_logs(logs)

    return jsonify({"message": "Activity logged successfully!"})

# API to generate activity report
@app.route("/report", methods=["GET"])
def get_report():
    logs = load_logs()

    activity_summary = {}
    for entry in logs:
        date = entry["timestamp"][:10]  # Extract YYYY-MM-DD
        activity = entry["activity"]
        
        if date not in activity_summary:
            activity_summary[date] = {}

        if activity in activity_summary[date]:
            activity_summary[date][activity] += 1
        else:
            activity_summary[date][activity] = 1

    report_data = []
    for date, activities in activity_summary.items():
        for activity, count in activities.items():
            report_data.append({"date": date, "activity": activity, "count": count})

    return jsonify(report_data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
