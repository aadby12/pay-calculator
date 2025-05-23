function calculatePay() {
    const hours = parseFloat(document.getElementById('hours').value);
    const rate = parseFloat(document.getElementById('rate').value);

    if (isNaN(hours) || isNaN(rate) || hours < 0 || rate < 0) {
        document.getElementById('result').innerText = "Please enter valid numbers.";
        return;
    }

    const regularHours = Math.min(40, hours);
    const overtimeHours = Math.max(0, hours - 40);
    const regularPay = regularHours * rate;
    const overtimePay = overtimeHours * rate * 1.5;
    const totalPay = regularPay + overtimePay;

    const entry = {
        date: new Date().toLocaleString(),
        hours,
        rate,
        regularPay,
        overtimePay,
        totalPay
    };
    saveToLocalStorage(entry);

    let result = `
        Regular Pay: $${regularPay.toFixed(2)}<br>
        Overtime Pay: $${overtimePay.toFixed(2)}<br>
        <strong>Total Weekly Pay: $${totalPay.toFixed(2)}</strong>
    `;

    if (document.getElementById('monthly').checked) {
        const monthlyPay = totalPay * 4;
        result += `<br><strong>Estimated Monthly Pay: $${monthlyPay.toFixed(2)}</strong>`;
    }

    document.getElementById('result').innerHTML = result;
}

function saveToLocalStorage(entry) {
    const history = JSON.parse(localStorage.getItem('payHistory')) || [];
    history.push(entry);
    localStorage.setItem('payHistory', JSON.stringify(history));
}

function downloadCSV() {
    const history = JSON.parse(localStorage.getItem('payHistory')) || [];
    if (history.length === 0) {
        alert("No history to export.");
        return;
    }

    let csv = "Date,Hours,Rate,Regular Pay,Overtime Pay,Total Pay\n";
    history.forEach(e => {
        csv += `${e.date},${e.hours},${e.rate},${e.regularPay},${e.overtimePay},${e.totalPay}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "pay_history.csv";
    link.click();
}

function clearHistory() {
    if (confirm("Are you sure you want to clear all saved pay history?")) {
        localStorage.removeItem('payHistory');
        alert("History cleared.");
    }
}
