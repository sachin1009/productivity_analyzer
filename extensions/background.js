chrome.tabs.onActivated.addListener(activeInfo => {
    fetch("http://127.0.0.1:5000/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "Switched tab" })
    })
    .catch(error => console.error("Error:", error));
});
