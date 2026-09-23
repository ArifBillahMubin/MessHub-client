import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import {
    FileText,
    Download,
    Eye,
    Calculator,
    UtensilsCrossed,
    Wallet,
    Users,
    X,
    Lock,
} from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import useCurrentUser from "../../../../hooks/useCurrentUser";
import Loading from "../../../../components/Loading/Loading";
import { generateFullMonthlyReportPDF, generateMemberReportPDF } from "../../../../utils/pdfGenerator";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const MonthlyReports = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { currentUser, isUserLoading } = useCurrentUser();

    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const year = now.getFullYear();
    const month = now.getMonth();

    const [loading, setLoading] = useState(true);
    const [mess, setMess] = useState(null);
    const [calculations, setCalculations] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [isMonthClosed, setIsMonthClosed] = useState(false);
    const [closingMonth, setClosingMonth] = useState(false);

    const loadData = useCallback(async () => {
        if (!user?.email || !currentUser?.hasMess) {
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const messRes = await axiosSecure.get(`/users/my-mess?email=${user.email}`);
            const messData = messRes.data.mess;
            if (!messData) {
                setLoading(false);
                return;
            }
            setMess(messData);

            // Check if current calendar month is closed
            const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
            const statusRes = await axiosSecure.get(`/month-status/${messData._id}/${monthStr}`);
            setIsMonthClosed(statusRes.data.isClosed);

            // If current month is closed, show historical report instead of calculations
            if (statusRes.data.isClosed) {
                // Load historical report for closed month
                try {
                    const reportRes = await axiosSecure.get(`/monthly-reports/${messData._id}/${monthStr}?email=${user.email}`);
                    const report = reportRes.data.report;
                    
                    // Transform historical report to match calculations format
                    const transformedData = {
                        summary: {
                            totalCost: report.summary.totalCost ?? 0,
                            totalPaid: report.summary.totalPayments ?? 0, // Historical uses totalPayments
                            totalDue: report.summary.totalDue ?? 0,
                            totalAdvance: report.summary.totalAdvance ?? 0,
                        },
                        mealCalculation: {
                            totalMeals: report.summary.totalMeals ?? 0,
                            mealRate: report.summary.mealRate ?? 0,
                            totalBazarCost: report.summary.totalBazarCost ?? 0,
                        },
                        rentCalculation: {
                            totalRent: report.summary.totalRent ?? 0,
                            activeMembers: report.summary.activeMemberCount ?? 0,
                        },
                        khalabillCalculation: {
                            totalKhalabill: report.summary.totalKhalabill ?? 0,
                            activeMembers: report.summary.activeMemberCount ?? 0,
                            perMember: report.summary.activeMemberCount > 0 
                                ? report.summary.totalKhalabill / report.summary.activeMemberCount 
                                : 0,
                        },
                        commonExpenseCalculation: {
                            totalCommonExpense: report.summary.totalCommonExpense ?? 0,
                            activeMembers: report.summary.activeMemberCount ?? 0,
                            perMember: report.summary.activeMemberCount > 0 
                                ? report.summary.totalCommonExpense / report.summary.activeMemberCount 
                                : 0,
                        },
                        memberSettlement: report.members.map(m => ({
                            userId: m.userId,
                            user: { name: m.name ?? 'Unknown', email: m.email ?? '' },
                            meals: m.meals ?? { breakfast: 0, lunch: 0, dinner: 0, guestMeal: 0, total: 0 },
                            foodCost: m.foodCost ?? 0,
                            rent: m.rent ?? 0,
                            khalabill: m.khalabill ?? 0,
                            commonExpense: m.commonExpense ?? 0,
                            totalCost: m.totalCost ?? 0,
                            paid: m.totalPaid ?? 0, // Historical uses totalPaid
                            balance: m.balance ?? 0,
                            status: m.status ?? 'Settled',
                        })),
                    };
                    setCalculations(transformedData);
                } catch (err) {
                    console.error("Failed to load historical report:", err);
                    // If historical report fails, still try to load calculations
                    const calculationsRes = await axiosSecure.get(`/calculations/${messData._id}?email=${user.email}`);
                    setCalculations(calculationsRes.data);
                }
            } else {
                // Load current calculations for open month
                const calculationsRes = await axiosSecure.get(`/calculations/${messData._id}?email=${user.email}`);
                setCalculations(calculationsRes.data);
            }
        } catch (err) {
            console.error("Failed to load monthly reports:", err);
            toast.error("Failed to load monthly reports");
        } finally {
            setLoading(false);
        }
    }, [user?.email, currentUser?.hasMess, axiosSecure, year, month]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const fmt = (value) => 
        Number(value ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const handleDownloadFullReport = async () => {
        console.log('PDF download clicked - Full Monthly Report');
        
        // Show loading alert
        Swal.fire({
            title: 'Generating PDF...',
            text: 'Please wait while we generate your monthly report',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            if (calculations && mess) {
                generateFullMonthlyReportPDF(calculations, mess.messName, month, year);
                
                // Close loading and show success
                Swal.fire({
                    title: 'PDF Downloaded',
                    text: 'Your monthly report PDF has been downloaded successfully.',
                    icon: 'success',
                    confirmButtonColor: '#006B68',
                });
            }
        } catch (error) {
            console.error('PDF download error:', error);
            
            // Close loading and show error
            Swal.fire({
                title: 'PDF Download Failed',
                text: error.message || 'An error occurred while generating the PDF',
                icon: 'error',
                confirmButtonColor: '#006B68',
            });
        }
    };

    const handleViewMemberReport = (member) => {
        setSelectedMember(member);
        setShowMemberModal(true);
    };

    const handleDownloadMemberReport = async (member) => {
        console.log('PDF download clicked - Individual Member Report');
        
        // Show loading alert
        Swal.fire({
            title: 'Generating PDF...',
            text: 'Please wait while we generate the member report',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            if (member && mess) {
                generateMemberReportPDF(member, mess.messName, month, year, member.user?.name || 'Member');
                
                // Close loading and show success
                Swal.fire({
                    title: 'PDF Downloaded',
                    text: `Report for ${member.user?.name || 'member'} has been downloaded successfully.`,
                    icon: 'success',
                    confirmButtonColor: '#006B68',
                });
            }
        } catch (error) {
            console.error('PDF download error:', error);
            
            // Close loading and show error
            Swal.fire({
                title: 'PDF Download Failed',
                text: error.message || 'An error occurred while generating the PDF',
                icon: 'error',
                confirmButtonColor: '#006B68',
            });
        }
    };

    const handleCloseMonth = async () => {
        if (closingMonth || isMonthClosed) return;

        // Step 1: Monthly Report Download
        const step1Result = await Swal.fire({
            title: `Close ${MONTH_NAMES[month]} ${year}?`,
            html: `
                <p style="margin-bottom: 16px;">Before closing this month, download the monthly report and review the active members.</p>
                <p style="font-size: 14px; color: #666;">Closing this month will finalize all calculations and lock the month from further edits.</p>
            `,
            icon: 'warning',
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: 'Download Report',
            denyButtonText: 'Continue without Download',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#006B68',
            denyButtonColor: '#2E9B45',
            cancelButtonColor: '#6B7280',
        });

        if (step1Result.isDismissed) return;

        // Download report if user chose to
        if (step1Result.isConfirmed) {
            try {
                await handleDownloadFullReport();
            } catch (error) {
                console.error('PDF download failed:', error);
            }
        }

        // Step 2: Member Review and Selection
        if (!calculations || !calculations.memberSettlement) {
            toast.error('Unable to load member data');
            return;
        }

        const activeMembers = calculations.memberSettlement;
        const currentUserId = currentUser?._id;

        // Build member selection HTML
        const memberListHtml = activeMembers.map((member, index) => {
            const isCurrentUser = member.userId === currentUserId;
            const balance = member.balance;
            const statusColor = member.status === 'Due' ? '#DC2626' : member.status === 'Advance' ? '#2E9B45' : '#006B68';

            return `
                <div style="display: flex; align-items: center; padding: 12px; border: 1px solid #E5E7EB; border-radius: 8px; margin-bottom: 8px; background: ${isCurrentUser ? '#F3F4F6' : '#fff'};">
                    <input 
                        type="checkbox" 
                        id="member-${index}" 
                        value="${member.userId}"
                        ${isCurrentUser ? 'disabled' : ''}
                        style="margin-right: 12px; width: 16px; height: 16px; cursor: ${isCurrentUser ? 'not-allowed' : 'pointer'};"
                    />
                    <label for="member-${index}" style="flex: 1; text-align: left; cursor: ${isCurrentUser ? 'not-allowed' : 'pointer'}; opacity: ${isCurrentUser ? '0.6' : '1'};">
                        <div style="font-weight: 600; color: #173B3A;">${member.user?.name || 'Unknown'}${isCurrentUser ? ' (You)' : ''}</div>
                        <div style="font-size: 12px; color: #6B7280;">
                            Cost: ৳${fmt(member.totalCost)} | Paid: ৳${fmt(member.paid)} | 
                            <span style="color: ${statusColor}; font-weight: 600;">${member.status}: ৳${fmt(Math.abs(balance))}</span>
                        </div>
                    </label>
                </div>
            `;
        }).join('');

        const step2Result = await Swal.fire({
            title: 'Review Active Members',
            html: `
                <div style="text-align: left; max-height: 400px; overflow-y: auto;">
                    <p style="margin-bottom: 16px; color: #6B7280;">Select members to remove from the mess (optional). Their finalized monthly report will be preserved.</p>
                    ${memberListHtml}
                    ${activeMembers.some(m => m.userId === currentUserId) ? '<p style="margin-top: 12px; font-size: 12px; color: #9CA3AF;">Note: You cannot remove yourself.</p>' : ''}
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Continue',
            cancelButtonText: 'Back',
            confirmButtonColor: '#006B68',
            cancelButtonColor: '#6B7280',
            width: '600px',
            preConfirm: () => {
                const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked:not([disabled])');
                return Array.from(checkboxes).map(cb => cb.value);
            }
        });

        if (step2Result.isDismissed) {
            // User clicked back, restart the process
            return handleCloseMonth();
        }

        const selectedMemberIds = step2Result.value || [];

        // Step 3: Final Confirmation
        const hasRemovals = selectedMemberIds.length > 0;
        const removalNames = hasRemovals
            ? activeMembers
                  .filter(m => selectedMemberIds.includes(m.userId))
                  .map(m => m.user?.name || 'Unknown')
                  .join(', ')
            : '';

        const confirmResult = await Swal.fire({
            title: hasRemovals ? `Close ${MONTH_NAMES[month]} ${year} with Member Changes?` : `Close ${MONTH_NAMES[month]} ${year}?`,
            html: hasRemovals
                ? `
                    <p style="margin-bottom: 8px;">The following members will be removed from the active mess:</p>
                    <p style="font-weight: 600; color: #DC2626; margin-bottom: 12px;">${removalNames}</p>
                    <p style="color: #6B7280;">Their finalized monthly financial history will be preserved. The month will then be closed.</p>
                `
                : `
                    <p style="color: #6B7280;">The monthly report has been prepared. Closing this month will finalize the current calculations and lock this month from further edits.</p>
                `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm & Close Month',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#DC2626',
            cancelButtonColor: '#6B7280',
        });

        if (!confirmResult.isConfirmed) return;

        // Execute month closing
        setClosingMonth(true);
        Swal.fire({
            title: 'Closing Month...',
            text: 'Please wait while we finalize the monthly report',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
            await axiosSecure.post(`/close-month/${mess._id}`, {
                email: user.email,
                month: monthStr,
                selectedMemberIds: selectedMemberIds
            });

            Swal.fire({
                title: 'Month Closed Successfully!',
                text: hasRemovals 
                    ? `${MONTH_NAMES[month]} ${year} has been closed and ${selectedMemberIds.length} member(s) removed.`
                    : `${MONTH_NAMES[month]} ${year} has been closed successfully.`,
                icon: 'success',
                confirmButtonColor: '#006B68',
            });

            // Reload data to reflect closed status
            loadData();
        } catch (error) {
            console.error('Failed to close month:', error);
            Swal.fire({
                title: 'Failed to Close Month',
                text: error.response?.data?.message || 'An error occurred while closing the month',
                icon: 'error',
                confirmButtonColor: '#006B68',
            });
        } finally {
            setClosingMonth(false);
        }
    };

    if (loading || isUserLoading) return <Loading />;

    if (!mess || !calculations) {
        return (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
                <FileText size={48} className="text-neutral/40" />
                <p className="text-sm text-neutral/60">Unable to load monthly reports</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-neutral">Monthly Reports</h1>
                    <p className="mt-1 text-sm text-neutral/60">
                        {isMonthClosed ? 'Historical report for' : 'Complete report for'} {MONTH_NAMES[month]} {year}
                        {isMonthClosed && (
                            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                                <Lock size={12} />
                                Closed
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex gap-2">
                    {!isMonthClosed && (
                        <button
                            onClick={() => navigate("/dashboard/monthly/calculations")}
                            className="flex items-center gap-2 rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-primary/5"
                        >
                            <Calculator size={16} />
                            View Calculations
                        </button>
                    )}
                    {isMonthClosed && (
                        <button
                            onClick={() => navigate("/dashboard/monthly/historical-reports")}
                            className="flex items-center gap-2 rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-primary/5"
                        >
                            <Eye size={16} />
                            View All Reports
                        </button>
                    )}
                    <button
                        onClick={handleDownloadFullReport}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90"
                    >
                        <Download size={16} />
                        Download PDF
                    </button>
                    {!isMonthClosed && (
                        <button
                            onClick={handleCloseMonth}
                            disabled={closingMonth}
                            className="flex items-center gap-2 rounded-lg bg-tertiary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-tertiary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Lock size={16} />
                            {closingMonth ? 'Closing...' : 'Close Month'}
                        </button>
                    )}
                </div>
            </div>

            {/* Monthly Overview */}
            <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-extrabold text-neutral">Monthly Overview</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
                    <StatCard label="Total Meals" value={calculations.mealCalculation.totalMeals.toFixed(1)} />
                    <StatCard label="Meal Rate" value={`৳${fmt(calculations.mealCalculation.mealRate)}`} />
                    <StatCard label="Total Bazar" value={`৳${fmt(calculations.mealCalculation.totalBazarCost)}`} />
                    <StatCard label="Total Rent" value={`৳${fmt(calculations.rentCalculation.totalRent)}`} />
                    <StatCard label="Total Khalabill" value={`৳${fmt(calculations.khalabillCalculation.totalKhalabill)}`} />
                    <StatCard label="Common Expense" value={`৳${fmt(calculations.commonExpenseCalculation.totalCommonExpense)}`} />
                    <StatCard label="Total Cost" value={`৳${fmt(calculations.summary.totalCost)}`} color="primary" />
                    <StatCard label="Total Paid" value={`৳${fmt(calculations.summary.totalPaid)}`} color="secondary" />
                    <StatCard label="Total Due" value={`৳${fmt(calculations.summary.totalDue)}`} color="tertiary" />
                    <StatCard label="Active Members" value={calculations.memberSettlement.length} />
                </div>
            </div>

            {/* Meal Report */}
            <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <UtensilsCrossed size={20} className="text-primary" />
                    <h2 className="text-lg font-extrabold text-neutral">Meal Report</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <InfoCard label="Total Meals" value={calculations.mealCalculation.totalMeals.toFixed(1)} />
                    <InfoCard label="Meal Rate" value={`৳${fmt(calculations.mealCalculation.mealRate)}`} />
                    <InfoCard label="Total Bazar" value={`৳${fmt(calculations.mealCalculation.totalBazarCost)}`} />
                    <InfoCard label="Active Members" value={calculations.rentCalculation.activeMembers} />
                </div>
            </div>

            {/* Expense Report */}
            <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <Wallet size={20} className="text-tertiary" />
                    <h2 className="text-lg font-extrabold text-neutral">Expense Report</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <InfoCard label="Total Rent" value={`৳${fmt(calculations.rentCalculation.totalRent)}`} />
                    <InfoCard label="Total Khalabill" value={`৳${fmt(calculations.khalabillCalculation.totalKhalabill)}`} />
                    <InfoCard label="Per Member Khalabill" value={`৳${fmt(calculations.khalabillCalculation.perMember)}`} />
                    <InfoCard label="Common Expense" value={`৳${fmt(calculations.commonExpenseCalculation.totalCommonExpense)}`} />
                </div>
            </div>

            {/* Member-wise Monthly Reports */}
            <div className="rounded-2xl border border-primary/10 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                    <h2 className="flex items-center gap-2 text-lg font-extrabold text-neutral">
                        <Users size={20} className="text-primary" />
                        Member-wise Monthly Reports
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-background/40">
                                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                    Member
                                </th>
                                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                    Food Cost
                                </th>
                                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                    Rent
                                </th>
                                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                    Khalabill
                                </th>
                                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                    Common
                                </th>
                                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                    Total Cost
                                </th>
                                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                    Paid
                                </th>
                                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                    Balance
                                </th>
                                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-neutral/40">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {calculations.memberSettlement.map((member) => (
                                <tr key={member.userId} className="border-b border-gray-50 hover:bg-background/30">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {member.user?.photoURL ? (
                                                <img
                                                    src={member.user.photoURL}
                                                    alt={member.user.name}
                                                    referrerPolicy="no-referrer"
                                                    className="h-8 w-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                    {member.user?.name?.charAt(0).toUpperCase() || "?"}
                                                </span>
                                            )}
                                            <span className="text-sm font-semibold text-neutral">
                                                {member.user?.name || "Unknown"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-sm text-neutral">
                                        ৳{fmt(member.foodCost)}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-sm text-neutral">
                                        ৳{fmt(member.rent)}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-sm text-neutral">
                                        ৳{fmt(member.khalabill)}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-sm text-neutral">
                                        ৳{fmt(member.commonExpense)}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-neutral">
                                        ৳{fmt(member.totalCost)}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-sm text-neutral">
                                        ৳{fmt(member.paid)}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-sm font-bold text-neutral">
                                        ৳{fmt(Math.abs(member.balance))}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <StatusBadge status={member.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleViewMemberReport(member)}
                                            className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 text-primary transition hover:bg-primary/5"
                                            title="View Report"
                                        >
                                            <Eye size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Member Report Modal */}
            {showMemberModal && selectedMember && (
                <MemberReportModal
                    member={selectedMember}
                    messName={mess.messName}
                    month={month}
                    year={year}
                    onClose={() => {
                        setShowMemberModal(false);
                        setSelectedMember(null);
                    }}
                    onDownload={() => handleDownloadMemberReport(selectedMember)}
                />
            )}
        </div>
    );
};

// Helper Components

const StatCard = ({ label, value, color = "neutral" }) => {
    const colorClasses = {
        primary: "text-primary",
        secondary: "text-secondary",
        tertiary: "text-tertiary",
        neutral: "text-neutral",
    };

    return (
        <div className="rounded-lg border border-gray-100 bg-background/50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">{label}</p>
            <p className={`mt-1 text-lg font-extrabold ${colorClasses[color]}`}>{value}</p>
        </div>
    );
};

const InfoCard = ({ label, value }) => (
    <div className="rounded-lg border border-gray-100 bg-background/50 p-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">{label}</p>
        <p className="mt-1 text-base font-bold text-neutral">{value}</p>
    </div>
);

const StatusBadge = ({ status }) => {
    const configs = {
        Due: { className: "bg-red-50 text-red-600 border-red-200" },
        Advance: { className: "bg-secondary/10 text-secondary border-secondary/20" },
        Settled: { className: "bg-primary/10 text-primary border-primary/20" },
    };

    const config = configs[status] || configs.Settled;

    return (
        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${config.className}`}>
            {status}
        </span>
    );
};

const MemberReportModal = ({ member, messName, month, year, onClose, onDownload }) => {
    const fmt = (value) => Number(value ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const monthName = MONTH_NAMES[month];

    const foodPaid = member.paymentsByCategory?.meal || 0;
    const foodBalance = member.foodCost - foodPaid;
    const foodStatus = foodBalance > 0.01 ? "Due" : foodBalance < -0.01 ? "Advance" : "Settled";

    const rentPaid = member.paymentsByCategory?.rent || 0;
    const rentBalance = member.rent - rentPaid;
    const rentStatus = rentBalance > 0.01 ? "Due" : rentBalance < -0.01 ? "Advance" : "Settled";

    const khalabillPaid = member.paymentsByCategory?.khalabill || 0;
    const khalabillBalance = member.khalabill - khalabillPaid;
    const khalabillStatus = khalabillBalance > 0.01 ? "Due" : khalabillBalance < -0.01 ? "Advance" : "Settled";

    const commonPaid = member.paymentsByCategory?.common_expense || 0;
    const commonBalance = member.commonExpense - commonPaid;
    const commonStatus = commonBalance > 0.01 ? "Due" : commonBalance < -0.01 ? "Advance" : "Settled";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-primary/10 bg-white shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
                    <div>
                        <h2 className="text-xl font-extrabold text-neutral">{member.user?.name || "Member"}</h2>
                        <p className="text-sm text-neutral/60">{monthName} {year} Report</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onDownload}
                            className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-white transition hover:bg-primary/90"
                        >
                            <Download size={14} />
                            Download PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral/60 transition hover:bg-background hover:text-neutral"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6 p-6">
                    {/* Meal Summary */}
                    <ReportSection title="Meal Summary" icon={<UtensilsCrossed size={16} />}>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <MiniCard label="Breakfast" value={member.meals?.breakfast || 0} />
                            <MiniCard label="Lunch" value={member.meals?.lunch || 0} />
                            <MiniCard label="Dinner" value={member.meals?.dinner || 0} />
                            <MiniCard label="Guest Meals" value={member.meals?.guestMeal || 0} />
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-3">
                            <MiniCard label="Total Meals" value={(member.meals?.total || 0).toFixed(1)} />
                            <MiniCard label="Meal Rate" value={`৳${fmt(member.foodCost / (member.meals?.total || 1))}`} />
                            <MiniCard label="Food Cost" value={`৳${fmt(member.foodCost)}`} color="primary" />
                        </div>
                    </ReportSection>

                    {/* Food Payment */}
                    <CategorySection
                        title="Food Payment"
                        cost={member.foodCost}
                        paid={foodPaid}
                        balance={foodBalance}
                        status={foodStatus}
                    />

                    {/* Rent */}
                    <CategorySection
                        title="Rent"
                        cost={member.rent}
                        paid={rentPaid}
                        balance={rentBalance}
                        status={rentStatus}
                    />

                    {/* Khalabill */}
                    <CategorySection
                        title="Khalabill"
                        cost={member.khalabill}
                        paid={khalabillPaid}
                        balance={khalabillBalance}
                        status={khalabillStatus}
                    />

                    {/* Common Expense */}
                    <CategorySection
                        title="Common Expense"
                        cost={member.commonExpense}
                        paid={commonPaid}
                        balance={commonBalance}
                        status={commonStatus}
                    />

                    {/* Final Settlement */}
                    <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5">
                        <h3 className="mb-4 text-lg font-extrabold text-neutral">Final Settlement</h3>
                        <div className="space-y-2">
                            <BalanceRow label="Total Cost" value={`৳${fmt(member.totalCost)}`} />
                            <BalanceRow label="Total Paid" value={`৳${fmt(member.paid)}`} />
                            <div className="border-t border-primary/20 pt-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-neutral">Final Balance</span>
                                    <div className="text-right">
                                        <p className="font-mono text-xl font-extrabold text-neutral">
                                            ৳{fmt(Math.abs(member.balance))}
                                        </p>
                                        <StatusBadge status={member.status} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReportSection = ({ title, icon, children }) => (
    <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-neutral">
            {icon}
            {title}
        </h3>
        {children}
    </div>
);

const MiniCard = ({ label, value, color = "neutral" }) => {
    const colorClasses = {
        primary: "text-primary",
        neutral: "text-neutral",
    };

    return (
        <div className="rounded-lg border border-gray-100 bg-background/50 p-2">
            <p className="text-[9px] font-bold uppercase tracking-wide text-neutral/40">{label}</p>
            <p className={`mt-0.5 text-sm font-bold ${colorClasses[color]}`}>{value}</p>
        </div>
    );
};

const CategorySection = ({ title, cost, paid, balance, status }) => {
    const fmt = (value) => Number(value ?? 0).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="rounded-lg border border-gray-100 bg-background/30 p-4">
            <h3 className="mb-3 text-sm font-bold text-neutral">{title}</h3>
            <div className="grid grid-cols-3 gap-3">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">Cost</p>
                    <p className="mt-1 font-mono text-sm font-semibold text-neutral">৳{fmt(cost)}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">Paid</p>
                    <p className="mt-1 font-mono text-sm font-semibold text-neutral">৳{fmt(paid)}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">Balance</p>
                    <p className="mt-1 font-mono text-sm font-bold text-neutral">৳{fmt(Math.abs(balance))}</p>
                    <StatusBadge status={status} />
                </div>
            </div>
        </div>
    );
};

const BalanceRow = ({ label, value }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral">{label}</span>
        <span className="font-mono text-sm font-semibold text-neutral">{value}</span>
    </div>
);

export default MonthlyReports;
