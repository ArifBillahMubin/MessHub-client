import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import {
    History,
    Download,
    Eye,
    Calendar,
    Users,
    TrendingUp,
    Lock,
} from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import useCurrentUser from "../../../../hooks/useCurrentUser";
import Loading from "../../../../components/Loading/Loading";
import { generateFullMonthlyReportPDF } from "../../../../utils/pdfGenerator";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const HistoricalReports = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { currentUser, isUserLoading } = useCurrentUser();

    const [loading, setLoading] = useState(true);
    const [mess, setMess] = useState(null);
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!user?.email || !currentUser?.hasMess) {
                setLoading(false);
                return;
            }

            try {
                const messRes = await axiosSecure.get(`/users/my-mess?email=${user.email}`);
                const messData = messRes.data.mess;
                if (!messData) {
                    setLoading(false);
                    return;
                }
                setMess(messData);

                const reportsRes = await axiosSecure.get(`/monthly-reports/${messData._id}?email=${user.email}`);
                setReports(reportsRes.data.reports || []);
            } catch (err) {
                console.error("Failed to load historical reports:", err);
                toast.error("Failed to load historical reports");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user?.email, currentUser?.hasMess, axiosSecure]);

    const parseMonth = (monthStr) => {
        const [year, month] = monthStr.split('-').map(Number);
        return { year, month: month - 1 };
    };

    const fmt = (n) =>
        n.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const handleViewReport = async (report) => {
        setSelectedReport(report);
        setShowReportModal(true);
    };

    const handleDownloadReport = async (report) => {
        Swal.fire({
            title: 'Generating PDF...',
            text: 'Please wait while we generate the report',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const { year, month } = parseMonth(report.month);

            // Transform report data to match calculation format
            const transformedData = {
                summary: report.summary,
                mealCalculation: {
                    totalMeals: report.summary.totalMeals,
                    mealRate: report.summary.mealRate,
                    totalBazarCost: report.summary.totalBazarCost,
                },
                rentCalculation: {
                    totalRent: report.summary.totalRent,
                    activeMembers: report.summary.activeMemberCount,
                },
                khalabillCalculation: {
                    totalKhalabill: report.summary.totalKhalabill,
                    activeMembers: report.summary.activeMemberCount,
                    perMember: report.summary.activeMemberCount > 0 
                        ? report.summary.totalKhalabill / report.summary.activeMemberCount 
                        : 0,
                },
                commonExpenseCalculation: {
                    totalCommonExpense: report.summary.totalCommonExpense,
                    activeMembers: report.summary.activeMemberCount,
                    perMember: report.summary.activeMemberCount > 0 
                        ? report.summary.totalCommonExpense / report.summary.activeMemberCount 
                        : 0,
                },
                memberSettlement: report.members.map(m => ({
                    userId: m.userId,
                    user: { name: m.name, email: m.email },
                    meals: m.meals,
                    foodCost: m.foodCost,
                    rent: m.rent,
                    khalabill: m.khalabill,
                    commonExpense: m.commonExpense,
                    totalCost: m.totalCost,
                    paid: m.totalPaid,
                    balance: m.balance,
                    status: m.status,
                })),
            };

            generateFullMonthlyReportPDF(transformedData, mess.messName, month, year);

            Swal.fire({
                title: 'PDF Downloaded',
                text: 'Historical report has been downloaded successfully.',
                icon: 'success',
                confirmButtonColor: '#006B68',
            });
        } catch (error) {
            console.error('PDF download error:', error);
            Swal.fire({
                title: 'PDF Download Failed',
                text: error.message || 'An error occurred while generating the PDF',
                icon: 'error',
                confirmButtonColor: '#006B68',
            });
        }
    };

    if (loading || isUserLoading) return <Loading />;

    if (!mess) {
        return (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
                <History size={48} className="text-neutral/40" />
                <p className="text-sm text-neutral/60">Unable to load mess information</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-neutral">Historical Reports</h1>
                    <p className="mt-1 text-sm text-neutral/60">
                        View and download past monthly reports
                    </p>
                </div>
            </div>

            {reports.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-primary/10 bg-white p-12 text-center shadow-sm">
                    <History size={48} className="text-neutral/40" />
                    <p className="text-lg font-bold text-neutral">No Historical Reports</p>
                    <p className="text-sm text-neutral/60">
                        Close your first month to start building historical records
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {reports.map((report) => {
                        const { year, month } = parseMonth(report.month);
                        return (
                            <ReportCard
                                key={report._id}
                                report={report}
                                month={month}
                                year={year}
                                onView={() => handleViewReport(report)}
                                onDownload={() => handleDownloadReport(report)}
                                fmt={fmt}
                            />
                        );
                    })}
                </div>
            )}

            {/* Report Detail Modal */}
            {showReportModal && selectedReport && (
                <ReportModal
                    report={selectedReport}
                    messName={mess.messName}
                    onClose={() => {
                        setShowReportModal(false);
                        setSelectedReport(null);
                    }}
                    onDownload={() => handleDownloadReport(selectedReport)}
                    fmt={fmt}
                />
            )}
        </div>
    );
};

// Helper Components

const ReportCard = ({ report, month, year, onView, onDownload, fmt }) => {
    return (
        <div className="group rounded-2xl border border-primary/10 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Calendar size={20} className="text-primary" />
                        <h3 className="text-lg font-extrabold text-neutral">
                            {MONTH_NAMES[month]} {year}
                        </h3>
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-xs text-neutral/60">
                        <Lock size={12} />
                        Closed {new Date(report.closedAt).toLocaleDateString('en-GB')}
                    </p>
                </div>
            </div>

            <div className="mb-4 space-y-2">
                <StatRow icon={<Users size={14} />} label="Members" value={report.summary.activeMemberCount} />
                <StatRow icon={<TrendingUp size={14} />} label="Total Cost" value={`৳${fmt(report.summary.totalCost)}`} />
                <StatRow icon={<TrendingUp size={14} />} label="Total Paid" value={`৳${fmt(report.summary.totalPayments)}`} />
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onView}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm font-bold text-primary transition hover:bg-primary/5"
                >
                    <Eye size={14} />
                    View
                </button>
                <button
                    onClick={onDownload}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-white transition hover:bg-primary/90"
                >
                    <Download size={14} />
                    PDF
                </button>
            </div>
        </div>
    );
};

const StatRow = ({ icon, label, value }) => (
    <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-neutral/60">
            {icon}
            {label}
        </span>
        <span className="font-bold text-neutral">{value}</span>
    </div>
);

const ReportModal = ({ report, messName, onClose, onDownload, fmt }) => {
    const { year, month } = parseMonth(report.month);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border border-primary/10 bg-white shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
                    <div>
                        <h2 className="text-xl font-extrabold text-neutral">
                            {MONTH_NAMES[month]} {year} Report
                        </h2>
                        <p className="text-sm text-neutral/60">{messName}</p>
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
                            <span className="text-xl">×</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6 p-6">
                    {/* Monthly Overview */}
                    <div className="rounded-xl border border-primary/10 bg-primary/5 p-5">
                        <h3 className="mb-4 text-lg font-extrabold text-neutral">Monthly Overview</h3>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            <OverviewCard label="Total Meals" value={report.summary.totalMeals.toFixed(1)} />
                            <OverviewCard label="Meal Rate" value={`৳${fmt(report.summary.mealRate)}`} />
                            <OverviewCard label="Total Bazar" value={`৳${fmt(report.summary.totalBazarCost)}`} />
                            <OverviewCard label="Total Rent" value={`৳${fmt(report.summary.totalRent)}`} />
                            <OverviewCard label="Khalabill" value={`৳${fmt(report.summary.totalKhalabill)}`} />
                            <OverviewCard label="Common Expense" value={`৳${fmt(report.summary.totalCommonExpense)}`} />
                            <OverviewCard label="Total Cost" value={`৳${fmt(report.summary.totalCost)}`} color="primary" />
                            <OverviewCard label="Total Paid" value={`৳${fmt(report.summary.totalPayments)}`} color="secondary" />
                            <OverviewCard label="Total Due" value={`৳${fmt(report.summary.totalDue)}`} color="tertiary" />
                            <OverviewCard label="Total Advance" value={`৳${fmt(report.summary.totalAdvance)}`} />
                            <OverviewCard label="Active Members" value={report.summary.activeMemberCount} />
                        </div>
                    </div>

                    {/* Member Settlement */}
                    <div className="rounded-xl border border-primary/10 bg-white">
                        <div className="border-b border-gray-100 px-5 py-4">
                            <h3 className="text-lg font-extrabold text-neutral">Member-wise Settlement</h3>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.members.map((member) => (
                                        <tr key={member.userId.toString()} className="border-b border-gray-50 hover:bg-background/30">
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-semibold text-neutral">
                                                    {member.name}
                                                </span>
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
                                                ৳{fmt(member.totalPaid)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono text-sm font-bold text-neutral">
                                                ৳{fmt(Math.abs(member.balance))}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <StatusBadge status={member.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OverviewCard = ({ label, value, color = "neutral" }) => {
    const colorClasses = {
        primary: "text-primary",
        secondary: "text-secondary",
        tertiary: "text-tertiary",
        neutral: "text-neutral",
    };

    return (
        <div className="rounded-lg border border-gray-100 bg-white p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">{label}</p>
            <p className={`mt-1 text-base font-extrabold ${colorClasses[color]}`}>{value}</p>
        </div>
    );
};

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

export default HistoricalReports;
