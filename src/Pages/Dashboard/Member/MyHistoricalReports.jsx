import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import {
    History,
    Download,
    Calendar,
    UtensilsCrossed,
    Lock,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useCurrentUser from "../../../hooks/useCurrentUser";
import Loading from "../../../components/Loading/Loading";
import { generateMemberReportPDF } from "../../../utils/pdfGenerator";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const MyHistoricalReports = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { currentUser, isUserLoading } = useCurrentUser();

    const [loading, setLoading] = useState(true);
    const [mess, setMess] = useState(null);
    const [reports, setReports] = useState([]);

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

    const handleDownloadReport = async (report) => {
        Swal.fire({
            title: 'Generating PDF...',
            text: 'Please wait while we generate your report',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const { year, month } = parseMonth(report.month);
            const memberData = report.memberData;

            // Transform to match member report format
            const transformedData = {
                userId: memberData.userId,
                user: { name: currentUser?.name, email: user?.email },
                meals: memberData.meals,
                foodCost: memberData.foodCost,
                rent: memberData.rent,
                khalabill: memberData.khalabill,
                commonExpense: memberData.commonExpense,
                totalCost: memberData.totalCost,
                paid: memberData.totalPaid,
                balance: memberData.balance,
                status: memberData.status,
                paymentsByCategory: {
                    meal: 0,
                    rent: 0,
                    khalabill: 0,
                    common_expense: 0,
                    other: 0
                }
            };

            generateMemberReportPDF(transformedData, mess.messName, month, year, currentUser?.name || 'Member');

            Swal.fire({
                title: 'PDF Downloaded',
                text: 'Your historical report has been downloaded successfully.',
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
                    <h1 className="text-2xl font-extrabold text-neutral">My Historical Reports</h1>
                    <p className="mt-1 text-sm text-neutral/60">
                        View and download your past monthly reports
                    </p>
                </div>
            </div>

            {reports.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-primary/10 bg-white p-12 text-center shadow-sm">
                    <History size={48} className="text-neutral/40" />
                    <p className="text-lg font-bold text-neutral">No Historical Reports</p>
                    <p className="text-sm text-neutral/60">
                        Your historical reports will appear here after each month is closed
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {reports.map((report) => {
                        const { year, month } = parseMonth(report.month);
                        return (
                            <MemberReportCard
                                key={report._id}
                                report={report}
                                month={month}
                                year={year}
                                onDownload={() => handleDownloadReport(report)}
                                fmt={fmt}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// Helper Components

const MemberReportCard = ({ report, month, year, onDownload, fmt }) => {
    const memberData = report.memberData;

    return (
        <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm transition hover:shadow-md">
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

            {/* Meal Summary */}
            <div className="mb-4 rounded-lg border border-primary/10 bg-primary/5 p-3">
                <div className="mb-2 flex items-center gap-2">
                    <UtensilsCrossed size={14} className="text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wide text-neutral/60">Meals</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <span className="text-neutral/60">Breakfast:</span>
                        <span className="ml-1 font-bold text-neutral">{memberData.meals?.breakfast || 0}</span>
                    </div>
                    <div>
                        <span className="text-neutral/60">Lunch:</span>
                        <span className="ml-1 font-bold text-neutral">{memberData.meals?.lunch || 0}</span>
                    </div>
                    <div>
                        <span className="text-neutral/60">Dinner:</span>
                        <span className="ml-1 font-bold text-neutral">{memberData.meals?.dinner || 0}</span>
                    </div>
                    <div>
                        <span className="text-neutral/60">Total:</span>
                        <span className="ml-1 font-bold text-primary">{memberData.meals?.total || 0}</span>
                    </div>
                </div>
            </div>

            {/* Financial Summary */}
            <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral/60">Total Cost</span>
                    <span className="font-bold text-neutral">৳{fmt(memberData.totalCost)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral/60">Total Paid</span>
                    <span className="font-bold text-neutral">৳{fmt(memberData.totalPaid)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-sm">
                    <span className="font-bold text-neutral">Balance</span>
                    <div className="text-right">
                        <div className="font-bold text-neutral">৳{fmt(Math.abs(memberData.balance))}</div>
                        <StatusBadge status={memberData.status} />
                    </div>
                </div>
            </div>

            <button
                onClick={onDownload}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90"
            >
                <Download size={16} />
                Download PDF
            </button>
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
        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${config.className}`}>
            {status}
        </span>
    );
};

export default MyHistoricalReports;
