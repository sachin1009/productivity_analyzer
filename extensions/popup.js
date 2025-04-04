document.addEventListener("DOMContentLoaded", function () {
    // Set a random background image
    const bgImages = [
        "https://source.unsplash.com/350x300/?nature,abstract",
        "https://source.unsplash.com/350x300/?tech,workspace",
        "https://source.unsplash.com/350x300/?minimal,art"
    ];
    document.body.style.backgroundImage = `url(${bgImages[Math.floor(Math.random() * bgImages.length)]})`;

    let logBtn = document.getElementById("logBtn");
    let reportBtn = document.getElementById("reportBtn");

    if (logBtn) {
        logBtn.addEventListener("click", () => {
            let activity = document.getElementById("activity").value;

            fetch("https://productivity-analyzer.onrender.com/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ activity })
            })
            .then(response => response.json())
            .then(data => alert("Activity Logged: " + data.message))
            .catch(error => console.error("Error:", error));
        });
    }

    if (reportBtn) {
        reportBtn.addEventListener("click", () => {
            fetch("https://productivity-analyzer.onrender.com/report")
            .then(response => response.json())
            .then(data => {
                if (!data.length) {
                    document.getElementById("reportOutput").innerText = "No data available.";
                    return;
                }

                let activityCounts = {};
                let dates = new Set();

                data.forEach(entry => {
                    let date = entry.date;
                    let activity = entry.activity;
                    let count = entry.count;

                    dates.add(date);
                    if (!activityCounts[activity]) activityCounts[activity] = {};
                    activityCounts[activity][date] = count;
                });

                let sortedDates = Array.from(dates).sort();
                let datasets = Object.keys(activityCounts).map(activity => ({
                    label: activity,
                    data: sortedDates.map(date => activityCounts[activity][date] || 0),
                    backgroundColor: getRandomColor()
                }));

                let ctx = document.getElementById("activityChart").getContext("2d");
                new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: sortedDates,
                        datasets: datasets
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: { title: { display: true, text: "Date" } },
                            y: { title: { display: true, text: "Activity Count" } }
                        }
                    }
                });
            })
            .catch(error => console.error("Error:", error));
        });
    }

    function getRandomColor() {
        return `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`;
    }
});
