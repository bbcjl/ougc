function calculateCredits() {
    var totalCredits = 0;
    var worstYear3Credits = 0;
    var worstYear3Module = "";
    var year3BorderlineTallies = {1: 0, 2: 0, 3: 0};

    document.querySelectorAll("tr:has(.grade)").forEach(function(row) {
        var final = row.querySelector(".level").classList.contains("final");
        var level = final ? 3 : Number(row.querySelector(".level").textContent);
        var grade = Number(row.querySelector(".grade select").value);
        var module = row.querySelector(".module input").value;
        var credits = (level - 1) * 30 * grade;

        if (level == 3) {
            for (var i = grade; i <= 3; i++) {
                year3BorderlineTallies[i]++;
            }
        }

        if (!final && level == 3 && worstYear3Credits < credits) {
            worstYear3Credits = credits;
            worstYear3Module = module;
        }

        row.querySelector(".credits").innerHTML = `${level - 1} × (30 × ${grade}) = <strong>${credits}</strong>`;
        console.log(level, grade);

        totalCredits += credits;
    });

    document.querySelector(".subtotal").textContent = totalCredits;
    document.querySelector(".drop").textContent = -worstYear3Credits;
    document.querySelector(".dropModule").textContent = worstYear3Module;

    var totalExcludingWorst = totalCredits - worstYear3Credits;
    var borderline = 0;
    var borderlineReason = "";

    if (totalExcludingWorst >= 631 && totalExcludingWorst <= 690 && year3BorderlineTallies[1] >= 2) {borderline = -60; borderlineReason = "(scored 2 distinctions at L3)";}
    if (totalExcludingWorst >= 901 && totalExcludingWorst <= 960 && year3BorderlineTallies[2] >= 2) {borderline = -60; borderlineReason = "(scored 2 grade 2 passes at L3)";}
    if (totalExcludingWorst >= 1171 && totalExcludingWorst <= 1230 && year3BorderlineTallies[3] >= 2) {borderline = -60; borderlineReason = "(scored 2 grade 3 passes at L3)";}
    
    var finalTotal = totalExcludingWorst + borderline;
    
    document.querySelector(".borderline").textContent = borderline;
    document.querySelector(".borderlineReason").textContent = borderlineReason;
    document.querySelector(".total").textContent = finalTotal;

    var classOfHonours = "Unknown";
    var moveUp = 0;

    if (finalTotal >= 360 && finalTotal <= 630) {classOfHonours = "First Class";}
    if (finalTotal >= 631 && finalTotal <= 900) {classOfHonours = "Upper Second Class (2:1)"; moveUp = finalTotal - 630;}
    if (finalTotal >= 901 && finalTotal <= 1170) {classOfHonours = "Lower Second Class (2:2)"; moveUp = finalTotal - 900;}
    if (finalTotal >= 1171 && finalTotal <= 1440) {classOfHonours = "Third Class"; moveUp = finalTotal - 1170;}

    document.querySelector(".classOfHonours").textContent = classOfHonours;
    document.querySelector(".moveUp").textContent = moveUp;

    document.querySelector(".moveUpRow").style.display = moveUp > 0 ? "table-row" : "none";
}

window.addEventListener("load", function() {
    document.querySelectorAll(".grade select").forEach(function(select) {
        select.innerHTML = `
            <option value="1">Distinction (85-100)</option>
            <option value="2">Grade 2 pass (70-84)</option>
            <option value="3">Grade 3 pass (55-69)</option>
            <option value="4">Grade 4 pass (40-54)</option>
        `;

        select.addEventListener("change", function() {
            calculateCredits();
        });
    });

    document.querySelector("#specialism").addEventListener("change", function(event) {
        var specialism = event.target.value;
        var special1 = "TMXY3xx";
        var special2 = "TMXY3xx";

        if (specialism == "se") {special1 = "TMXY352"; special2 = "TMXY354";}
        if (specialism == "cs") {special1 = "TMXY352"; special2 = "TMXY311";}

        document.querySelector(".special1 input").value = special1;
        document.querySelector(".special2 input").value = special2;
    });

    calculateCredits();
});