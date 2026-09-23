import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const COLORS = {
    primary: [0, 107, 104],
    secondary: [46, 155, 69],
    tertiary: [255, 138, 0],
    neutral: [23, 59, 58],
    gray: [100, 100, 100],
};

const fmt = (n) => n.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Generate Full Monthly Report PDF (Manager)
export const generateFullMonthlyReportPDF = (data, messName, month, year) => {
    console.log('PDF generation started - Full Monthly Report');
    try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long' });
        
        // Ensure all values are valid strings
        const safeMessName = String(messName || 'Mess');
        const safeYear = String(year || new Date().getFullYear());
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(...COLORS.primary);
    doc.text('MessHub Monthly Report', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.neutral);
    doc.text(safeMessName, pageWidth / 2, 28, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.gray);
    doc.text(`${monthName} ${safeYear}`, pageWidth / 2, 34, { align: 'center' });
    doc.text(`Generated on ${new Date().toLocaleDateString('en-GB')}`, pageWidth / 2, 40, { align: 'center' });
    
    let yPos = 50;

    // Monthly Overview
    doc.setFontSize(14);
    doc.setTextColor(...COLORS.primary);
    doc.text('Monthly Overview', 14, yPos);
    yPos += 8;

    const overviewData = [
        ['Total Meals', String(data.mealCalculation.totalMeals.toFixed(1))],
        ['Meal Rate', `৳${fmt(data.mealCalculation.mealRate)}`],
        ['Total Bazar', `৳${fmt(data.mealCalculation.totalBazarCost)}`],
        ['Total Rent', `৳${fmt(data.rentCalculation.totalRent)}`],
        ['Total Khalabill', `৳${fmt(data.khalabillCalculation.totalKhalabill)}`],
        ['Total Common Expense', `৳${fmt(data.commonExpenseCalculation.totalCommonExpense)}`],
        ['Total Cost', `৳${fmt(data.summary.totalCost)}`],
        ['Total Paid', `৳${fmt(data.summary.totalPaid)}`],
        ['Total Due', `৳${fmt(data.summary.totalDue)}`],
        ['Total Advance', `৳${fmt(data.summary.totalAdvance)}`],
        ['Active Members', String(data.memberSettlement.length)],
    ];

    doc.autoTable({
        startY: yPos,
        head: [],
        body: overviewData,
        theme: 'plain',
        styles: { fontSize: 9, cellPadding: 2 },
        columnStyles: {
            0: { fontStyle: 'bold', textColor: COLORS.neutral },
            1: { halign: 'right', textColor: COLORS.neutral },
        },
    });

    yPos = doc.lastAutoTable.finalY + 12;

    // Member Settlement Table
    if (yPos > 230) {
        doc.addPage();
        yPos = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(...COLORS.primary);
    doc.text('Member-wise Settlement', 14, yPos);
    yPos += 6;

    const memberRows = data.memberSettlement.map(m => [
        String(m.user?.name || 'Unknown'),
        `৳${fmt(m.foodCost || 0)}`,
        `৳${fmt(m.rent || 0)}`,
        `৳${fmt(m.khalabill || 0)}`,
        `৳${fmt(m.commonExpense || 0)}`,
        `৳${fmt(m.totalCost || 0)}`,
        `৳${fmt(m.paid || 0)}`,
        `৳${fmt(Math.abs(m.balance || 0))}`,
        String(m.status || 'Unknown'),
    ]);

    doc.autoTable({
        startY: yPos,
        head: [['Member', 'Food', 'Rent', 'Khala', 'Common', 'Total Cost', 'Paid', 'Balance', 'Status']],
        body: memberRows,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: COLORS.primary, textColor: [255, 255, 255] },
        columnStyles: {
            1: { halign: 'right' },
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'right' },
            5: { halign: 'right' },
            6: { halign: 'right' },
            7: { halign: 'right' },
        },
    });

    console.log('PDF save started - Full Monthly Report');
    doc.save(`${safeMessName}_Monthly_Report_${monthName}_${safeYear}.pdf`);
    console.log('PDF download completed - Full Monthly Report');
    } catch (error) {
        console.error('PDF download failed - Full Monthly Report:', error);
        throw error;
    }
};

// Generate Individual Member Report PDF
export const generateMemberReportPDF = (memberData, messName, month, year, memberName) => {
    console.log('PDF generation started - Member Report');
    try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long' });
        
        // Ensure all values are valid strings
        const safeMemberName = String(memberName || 'Member');
        const safeMessName = String(messName || 'Mess');
        const safeYear = String(year || new Date().getFullYear());
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(...COLORS.primary);
    doc.text('Member Monthly Report', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.neutral);
    doc.text(safeMemberName, pageWidth / 2, 28, { align: 'center' });
    doc.text(safeMessName, pageWidth / 2, 34, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.gray);
    doc.text(`${monthName} ${safeYear}`, pageWidth / 2, 40, { align: 'center' });
    doc.text(`Generated on ${new Date().toLocaleDateString('en-GB')}`, pageWidth / 2, 46, { align: 'center' });
    
    let yPos = 56;

    // Meal Summary
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.primary);
    doc.text('Meal Summary', 14, yPos);
    yPos += 6;

    const mealData = [
        ['Breakfast', String(memberData.meals?.breakfast || 0)],
        ['Lunch', String(memberData.meals?.lunch || 0)],
        ['Dinner', String(memberData.meals?.dinner || 0)],
        ['Guest Meals', String(memberData.meals?.guestMeal || 0)],
        ['Total Meals', String(memberData.meals?.total || 0)],
        ['Meal Rate', `৳${fmt(memberData.foodCost / (memberData.meals?.total || 1))}`],
        ['Food Cost', `৳${fmt(memberData.foodCost || 0)}`],
    ];

    doc.autoTable({
        startY: yPos,
        head: [],
        body: mealData,
        theme: 'plain',
        styles: { fontSize: 9, cellPadding: 2 },
        columnStyles: {
            0: { fontStyle: 'bold', textColor: COLORS.neutral },
            1: { halign: 'right', textColor: COLORS.neutral },
        },
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // Financial Breakdown
    const foodPaid = memberData.paymentsByCategory?.meal || 0;
    const foodBalance = (memberData.foodCost || 0) - foodPaid;
    const foodStatus = foodBalance > 0.01 ? 'Due' : foodBalance < -0.01 ? 'Advance' : 'Settled';

    const rentPaid = memberData.paymentsByCategory?.rent || 0;
    const rentBalance = (memberData.rent || 0) - rentPaid;
    const rentStatus = rentBalance > 0.01 ? 'Due' : rentBalance < -0.01 ? 'Advance' : 'Settled';

    const khalabillPaid = memberData.paymentsByCategory?.khalabill || 0;
    const khalabillBalance = (memberData.khalabill || 0) - khalabillPaid;
    const khalabillStatus = khalabillBalance > 0.01 ? 'Due' : khalabillBalance < -0.01 ? 'Advance' : 'Settled';

    const commonPaid = memberData.paymentsByCategory?.common_expense || 0;
    const commonBalance = (memberData.commonExpense || 0) - commonPaid;
    const commonStatus = commonBalance > 0.01 ? 'Due' : commonBalance < -0.01 ? 'Advance' : 'Settled';

    doc.setFontSize(12);
    doc.setTextColor(...COLORS.primary);
    doc.text('Financial Breakdown', 14, yPos);
    yPos += 6;

    const financialData = [
        ['Food Cost', `৳${fmt(memberData.foodCost || 0)}`],
        ['Food Paid', `৳${fmt(foodPaid)}`],
        ['Food Balance', `৳${fmt(Math.abs(foodBalance))} ${foodStatus}`],
        ['', ''],
        ['Rent', `৳${fmt(memberData.rent || 0)}`],
        ['Rent Paid', `৳${fmt(rentPaid)}`],
        ['Rent Balance', `৳${fmt(Math.abs(rentBalance))} ${rentStatus}`],
        ['', ''],
        ['Khalabill Share', `৳${fmt(memberData.khalabill || 0)}`],
        ['Khalabill Paid', `৳${fmt(khalabillPaid)}`],
        ['Khalabill Balance', `৳${fmt(Math.abs(khalabillBalance))} ${khalabillStatus}`],
        ['', ''],
        ['Common Expense Share', `৳${fmt(memberData.commonExpense || 0)}`],
        ['Common Expense Paid', `৳${fmt(commonPaid)}`],
        ['Common Expense Balance', `৳${fmt(Math.abs(commonBalance))} ${commonStatus}`],
    ];

    doc.autoTable({
        startY: yPos,
        head: [],
        body: financialData,
        theme: 'plain',
        styles: { fontSize: 9, cellPadding: 2 },
        columnStyles: {
            0: { fontStyle: 'bold', textColor: COLORS.neutral },
            1: { halign: 'right', textColor: COLORS.neutral },
        },
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // Final Settlement
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.primary);
    doc.text('Final Settlement', 14, yPos);
    yPos += 6;

    const settlementData = [
        ['Total Cost', `৳${fmt(memberData.totalCost || 0)}`],
        ['Total Paid', `৳${fmt(memberData.paid || 0)}`],
        ['Final Balance', `৳${fmt(Math.abs(memberData.balance || 0))} ${memberData.status || 'Unknown'}`],
    ];

    doc.autoTable({
        startY: yPos,
        head: [],
        body: settlementData,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 3, fontStyle: 'bold' },
        columnStyles: {
            0: { textColor: COLORS.neutral },
            1: { halign: 'right', textColor: COLORS.primary },
        },
    });

    const sanitizedName = safeMemberName.replace(/[^a-zA-Z0-9]/g, '_');
    console.log('PDF save started - Member Report');
    doc.save(`${sanitizedName}_Monthly_Report_${monthName}_${safeYear}.pdf`);
    console.log('PDF download completed - Member Report');
    } catch (error) {
        console.error('PDF download failed - Member Report:', error);
        throw error;
    }
};
