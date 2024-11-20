function generateExplanation({
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
}) {
    let explanation = `בואו נסביר איך זה עובד...<br>`;

    // Work Status Explanation
    if (workStatus === "both-working") {
        explanation += `מס על שכר הנטו שלך מחושב לפי הסטטוס התעסוקתי. עבורכם כשני בני זוג עובדים, המס מחושב על השכר הכולל בגובה <strong>7%</strong>.<br>`;
    } else if (workStatus === "one-working") {
        explanation += `מס על שכר הנטו שלך מחושב לפי הסטטוס התעסוקתי. עבור בן הזוג שעובד, המס מחושב בגובה <strong>7%</strong>. עבור בן הזוג שאינו עובד, המס הוא על סכום קבוע של ₪5,701 בגובה <strong>3.5%</strong>.<br>`;
    } else if (workStatus === "none-working") {
        explanation += `שני בני הזוג פנסיונרים שאינם עובדים. המס מחושב על סכום קבוע של ₪11,402 בגובה <strong>3.5%</strong>.<br>`;
    } else if (workStatus === "retired") {
        explanation += `השכר שלך כפנסיונר שאינו עובד הוא סכום קבוע של ₪5,701. המס על שכר זה מחושב בגובה <strong>3.5%</strong>.<br>`;
    } else if (workStatus === "regular") {
        explanation += `מס על שכר הנטו שלך מחושב לפי הסטטוס התעסוקתי. עבורך כעובד רגיל, המס מחושב בגובה <strong>7%</strong>.<br>`;
    }

    // Family Status Explanation
    if (familyStatus === "single") {
        explanation += `בנוסף, יש מס קבוע לפי הסטטוס המשפחתי שלך כיחיד בגובה <strong>₪${familyTax}</strong>.<br>`;
    } else if (familyStatus === "couple") {
        explanation += `בנוסף, יש מס קבוע לפי הסטטוס המשפחתי שלכם כזוג בגובה <strong>₪${familyTax}</strong>.<br>`;
    }

    // Capped Deduction Explanation
    if (cappedDeduction === maxTax) {
        explanation += `סכום ההורדה הגיע לתקרת המס של ₪${maxTax}, ולכן המס שנגבה הוא סכום זה.<br>`;
    } else {
        explanation += `סך ההורדה הכוללת לפי המסים שנגבו הוא <strong>₪${cappedDeduction}</strong>.<br>`;
    }

    // Help Deduction Explanation
    explanation += `ממה שנשאר יורד מס קטן לעזרה הדדית בגובה <strong>₪${helpDeduction}</strong>.<br>`;

    // Final Salary Explanation
    explanation += `השכר הסופי שלך, לאחר כל הניכויים, הוא <strong>₪${finalSalary}</strong>.`;

    return explanation;
}
