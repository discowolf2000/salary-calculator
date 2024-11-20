document.addEventListener("DOMContentLoaded", function () {
    const familyStatusDropdown = document.getElementById("family-status");
    const workStatusDropdown = document.getElementById("work-status");
    const netSalaryInput = document.getElementById("net-salary");
    const netSalarySection = document.getElementById("net-salary-section");
    const additionalMessage = document.getElementById("additional-message");

    // Update work status options based on family status
    familyStatusDropdown.addEventListener("change", function () {
        const familyStatus = this.value;
        if (familyStatus === "couple") {
            workStatusDropdown.innerHTML = `
                <option value="both-working">שני בני הזוג עובדים</option>
                <option value="one-working">בן זוג אחד עובד ואחד פנסיונר שלא עובד</option>
                <option value="none-working">שני בני הזוג פנסיונרים שלא עובדים</option>
            `;
        } else if (familyStatus === "single") {
            workStatusDropdown.innerHTML = `
                <option value="regular">עובד רגיל</option>
                <option value="retired">פנסיונר שאינו עובד</option>
            `;
        }
        additionalMessage.classList.add("hidden");
        netSalarySection.classList.remove("hidden");
    });

    // Update visibility and messages based on work status
    workStatusDropdown.addEventListener("change", function () {
        const workStatus = this.value;
        if (workStatus === "none-working") {
            additionalMessage.innerHTML = `השכר שלכם כזוג פנסיונרים שאינו עובד הוא <strong>11,402 ₪</strong>`;
            additionalMessage.classList.remove("hidden");
            netSalarySection.classList.add("hidden");
            netSalaryInput.value = ""; // Clear input when hidden
        } else if (workStatus === "retired") {
            additionalMessage.innerHTML = `השכר שלך הוא שכר קבוע לפנסיונר שאינו עובד <strong>5,701 ₪</strong>`;
            additionalMessage.classList.remove("hidden");
            netSalarySection.classList.add("hidden");
            netSalaryInput.value = ""; // Clear input when hidden
        } else if (workStatus === "one-working") {
            additionalMessage.innerHTML = `השכר לבן הזוג הפנסיונר שאינו עובד הוא <strong>5,701 ₪</strong>`;
            additionalMessage.classList.remove("hidden");
            netSalarySection.classList.remove("hidden");
        } else {
            additionalMessage.classList.add("hidden");
            netSalarySection.classList.remove("hidden");
        }
    });

    // Helper function to format numbers
    function formatNumber(number) {
        return number.toLocaleString('en-US');
    }

    // Calculate final salary on button click
    document.getElementById("calculate-button").addEventListener("click", function () {
        const netSalaryInputValue = parseFloat(netSalaryInput.value) || 0;
        const workStatus = workStatusDropdown.value;
        const familyStatus = familyStatusDropdown.value;

        let netSalary = Math.round(netSalaryInputValue);
        let fixedSalary = 0;
        let familyTax = 0;
        let workStatusDeduction = 0;
        let helpDeduction = 0;
        let cappedDeduction = 0;
        let maxTax = 0;

        // Validate input if salary is required
        if (workStatus !== "none-working" && workStatus !== "retired" && netSalaryInputValue <= 0) {
            alert("אנא הזן שכר נטו תקין.");
            return;
        }

        // Tax limits
        if (familyStatus === "single") {
            familyTax = 475;
            maxTax = 2500;
        } else if (familyStatus === "couple") {
            familyTax = 950;
            maxTax = 5000;
        }

        // Work status deductions
        if (workStatus === "both-working") {
            workStatusDeduction = Math.round(netSalary * 0.07);
        } else if (workStatus === "one-working") {
            workStatusDeduction = Math.round(netSalary * 0.07);
            fixedSalary = 5701;
        } else if (workStatus === "none-working") {
            fixedSalary = 5701 * 2;
            workStatusDeduction = Math.round(fixedSalary * 0.035);
            netSalary = 0; // Ensure salary is zero
        } else if (workStatus === "retired") {
            fixedSalary = 5701;
            workStatusDeduction = Math.round(fixedSalary * 0.035);
            netSalary = 0; // Ensure salary is zero
        } else if (workStatus === "regular") {
            workStatusDeduction = Math.round(netSalary * 0.07); // Correct deduction for regular single worker
        }

        // Total tax and capping
        const totalTax = familyTax + workStatusDeduction;
        cappedDeduction = Math.min(totalTax, maxTax);

        // Add a note if capped at the limit
        const workDeductionNote = totalTax > maxTax
            ? `סכום ההורדה הגיע לתקרת המס ולכן ההורדה תהיה <span style="color: red;">₪${formatNumber(cappedDeduction)}</span>`
            : "";

        // Help deduction
        helpDeduction = Math.round((netSalary + fixedSalary - cappedDeduction) * 0.005);
        const totalDeductions = cappedDeduction + helpDeduction;

        // Final salary
        const finalSalary = Math.round(netSalary + fixedSalary - totalDeductions);

        // Update results
        document.getElementById("family-deduction").textContent = `-₪${formatNumber(familyTax)}`;
        document.getElementById("work-deduction").innerHTML = `-₪${formatNumber(workStatusDeduction)}<br><small>${workDeductionNote}</small>`;
        document.getElementById("help-deduction").textContent = `-₪${formatNumber(helpDeduction)}`;
        document.getElementById("total-deductions").textContent = `-₪${formatNumber(totalDeductions)}`;
        document.getElementById("final-salary").textContent = `₪${formatNumber(finalSalary)}`;

        // Generate explanation and update
        const explanation = generateExplanation({
            familyStatus,
            workStatus,
            netSalary,
            familyTax,
            workStatusDeduction,
            helpDeduction,
            totalDeductions,
            cappedDeduction,
            maxTax,
            finalSalary,
            fixedSalary,
        });
        document.getElementById("explanation").innerHTML = explanation;

        // Show results
        document.getElementById("result").style.display = "block";
    });
});
