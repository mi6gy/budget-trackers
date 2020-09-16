let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore("pending", { autoInrement: true });
};

request.onsuccess = function (event) {
    db = event.target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function (event) {


    console.log("An error occured with " + event.target.errorCode);

};

function saveRecord(record) {

    const transacion = db.transaction(["pending"], "readwrite");

    const store = transacion.ObjectStore("pending");

    store.add(record);
};

function checkDatabase() {
    const transacion = db.transaction (["pending"], "readwrite");
    const store = transacion.ObjectStore("pending");
    const getAll = store.getAll();

    getall.onsuccess = function() {
        if(getAll.result.lengh > 0){
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll),
                headers: {
                    Accept: "application/json, text/plain */*",
                    "Content-Type": "application/json"
                }})
                .then(response => response.json())
                .then(() => {
                    const transacion = db.transacion(["pending"], "readweite");

                    const store = transacion.ObjectStore("pending");
                    store.clear

                })};
    }
}
// waiting for app to come online
window.addEventListener("online", checkDatabase);
