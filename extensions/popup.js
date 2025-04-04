document.getElementById("logActivity").addEventListener("click", () => {
    fetch("http://127.0.0.1:5000/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "Visited a website" })
    })
    .then(response => response.json())
    .then(data => alert("Activity Logged!"))
    .catch(error => console.error("Error:", error));
});

document.getElementById("showReport").addEventListener("click", () => {
    fetch("http://127.0.0.1:5000/report")
    .then(response => response.json())
    .then(data => document.getElementById("report").innerText = `Total Time: ${data.total_time_spent}`)
    .catch(error => console.error("Error:", error));
});
