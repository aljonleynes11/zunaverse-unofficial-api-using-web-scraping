function sleep() {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < 2000);
}

module.exports.sleep = sleep();