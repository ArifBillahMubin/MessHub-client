import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import {
    FileText,
    Download,
    UtensilsCrossed,
    Home,
    Receipt,
    Package,
    Wallet,
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

const MonthlyReport = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { currentUser, isUserLoading } = useCurrentUser();

    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const year = now.getFullYear();
    const month = now.getMonth();

    const [loading, setLoading] = useState(true);
    const [mess, setMess] = useState(null);
    const [myData, setMyData] = useState(null);

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

            const calculationsRes = await axiosSecure.get(`/calculations/${messData._id}?email=${user.email}`);
            const calculations = calculationsRes.data;
            
            // Find my data
            const memberData = calculations?.memberSettlement?.find(
                m => m.user?.email === user.email
            );
            setMyData(memberData || null);
        } catch (err) {
            console.error("Failed to load monthly report:", err);
            toast.error("Failed to load monthly report");
        } finally {
            setLoading(false);
        }
    }, [user?.email, currentUser?.hasMess, axiosSecure]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const fmt = (n) =>
        n.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const handleDownloadReport = async () => {
        console.log('PDF download clicked - Member Own Report');
        
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
            if (myData && mess && user) {
                generateMemberReportPDF(myData, mess.messName, month, year, myData.user?.name || 'Member');
                
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

    if (loading || isUserLoading) return <Loading />;

    if (!mess || !myData) {
        return (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
                <FileText size={48} className="text-neutral/40" />
                <p className="text-sm text-neutral/60">Unable to load monthly report</p>
            </div>
        );
    }

    const foodPaid = myData.paymentsByCategory?.meal || 0;
    const foodBalance = myData.foodCost - foodPaid;
    const foodStatus = foodBalance > 0.01 ? "Due" : foodBalance < -0.01 ? "Advance" : "Settled";

    const rentPaid = myData.paymentsByCategory?.rent || 0;
    const rentBalance = myData.rent - rentPaid;
    const rentStatus = rentBalance > 0.01 ? "Due" : rentBalance < -0.01 ? "Advance" : "Settled";

    const khalabillPaid = myData.paymentsByCategory?.khalabill || 0;
    const khalabillBalance = myData.khalabill - khalabillPaid;
    const khalabillStatus = khalabillBalance > 0.01 ? "Due" : khalabillBalance < -0.01 ? "Advance" : "Settled";

    const commonPaid = myData.paymentsByCategory?.common_expense || 0;
    const commonBalance = myData.commonExpense - commonPaid;
    const commonStatus = commonBalance > 0.01 ? "Due" : commonBalance < -0.01 ? "Advance" : "Settled";

    return (
        <div className="mx-auto max-w-4xl space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-neutral">My Monthly Report</h1>
                    <p className="mt-1 text-sm text-neutral/60">
                        {MONTH_NAMES[month]} {year} Report
                    </p>
                </div>
                <button
                    onClick={handleDownloadReport}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90"
                >
                    <Download size={16} />
                    Download Report PDF
                </button>
            </div>

            {/* My Monthly Summary */}
            <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-extrabold text-neutral">My Monthly Summary</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <SummaryCard label="Total Meals" value={myData.meals?.total?.toFixed(1) || '0.0'} />
                    <SummaryCard label="Meal Rate" value={`৳${fmt(myData.foodCost / (myData.meals?.total || 1))}`} />
                    <SummaryCard label="Food Cost" value={`৳${fmt(myData.foodCost)}`} />
                    <SummaryCard label="Rent" value={`৳${fmt(myData.rent)}`} />
                    <SummaryCard label="Khalabill" value={`৳${fmt(myData.khalabill)}`} />
                    <SummaryCard label="Common Expense" value={`৳${fmt(myData.commonExpense)}`} />
                    <SummaryCard label="Total Cost" value={`৳${fmt(myData.totalCost)}`} color="primary" />
                    <SummaryCard label="Total Paid" value={`৳${fmt(myData.paid)}`} color="secondary" />
                </div>
                <div className="mt-4 rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-neutral">Final Balance</span>
                        <div className="text-right">
                            <p className="font-mono text-2xl font-extrabold text-neutral">
                                ৳{fmt(Math.abs(myData.balance))}
                            </p>
                            <StatusBadge status={myData.status} large />
                        </div>
                    </div>
                </div>
            </div>

            {/* Meal Summary */}
            <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <UtensilsCrossed size={20} className="text-primary" />
                    <h2 className="text-lg font-extrabold text-neutral">Meal Summary</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                    <MealCard label="Breakfast" value={myData.meals?.breakfast || 0} />
                    <MealCard label="Lunch" value={myData.meals?.lunch || 0} />
                    <MealCard label="Dinner" value={myData.meals?.dinner || 0} />
                    <MealCard label="Guest Meals" value={myData.meals?.guestMeal || 0} />
                    <MealCard label="Total Meals" value={(myData.meals?.total || 0).toFixed(1)} highlight />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <InfoRow label="Meal Rate" value={`৳${fmt(myData.foodCost / (myData.meals?.total || 1))}`} />
                    <InfoRow label="Food Cost" value={`৳${fmt(myData.foodCost)}`} />
                </div>
            </div>

            {/* Food Payment */}
            <CategoryCard
                title="Food Payment"
                icon={<UtensilsCrossed size={16} />}
                cost={myData.foodCost}
                paid={foodPaid}
                balance={foodBalance}
                status={foodStatus}
            />

            {/* Rent */}
            <CategoryCard
                title="Rent / Basa Vara"
                icon={<Home size={16} />}
                cost={myData.rent}
                paid={rentPaid}
                balance={rentBalance}
                status={rentStatus}
            />

            {/* Khalabill */}
            <CategoryCard
                title="Khalabill"
                icon={<Receipt size={16} />}
                cost={myData.khalabill}
                paid={khalabillPaid}
                balance={khalabillBalance}
                status={khalabillStatus}
            />

            {/* Common Expense */}
            <CategoryCard
                title="Common Expense"
                icon={<Package size={16} />}
                cost={myData.commonExpense}
                paid={commonPaid}
                balance={commonBalance}
                status={commonStatus}
            />

            {/* Final Settlement */}
            <div className="rounded-2xl border-2 border-primary/20 bg-white p-6 shadow-md">
                <div className="mb-4 flex items-center gap-2">
                    <Wallet size={20} className="text-primary" />
                    <h2 className="text-lg font-extrabold text-neutral">Final Settlement</h2>
                </div>
                <div className="space-y-3">
                    <SettlementRow label="Food Cost" value={`৳${fmt(myData.foodCost)}`} />
                    <SettlementRow label="Rent" value={`৳${fmt(myData.rent)}`} />
                    <SettlementRow label="Khalabill" value={`৳${fmt(myData.khalabill)}`} />
                    <SettlementRow label="Common Expense" value={`৳${fmt(myData.commonExpense)}`} />
                    <div className="border-t border-gray-200 pt-3">
                        <SettlementRow label="Total Cost" value={`৳${fmt(myData.totalCost)}`} bold />
                        <SettlementRow label="Total Paid" value={`৳${fmt(myData.paid)}`} bold />
                    </div>
                    <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-neutral">Final Balance</span>
                            <div className="text-right">
                                <p className="font-mono text-2xl font-extrabold text-neutral">
                                    ৳{fmt(Math.abs(myData.balance))}
                                </p>
                                <StatusBadge status={myData.status} large />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Components

const SummaryCard = ({ label, value, color = "neutral" }) => {
    const colorClasses = {
        primary: "text-primary",
        secondary: "text-secondary",
        neutral: "text-neutral",
    };

    return (
        <div className="rounded-lg border border-gray-100 bg-background/50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">{label}</p>
            <p className={`mt-1 text-lg font-extrabold ${colorClasses[color]}`}>{value}</p>
        </div>
    );
};

const MealCard = ({ label, value, highlight }) => (
    <div className={`rounded-lg border p-3 ${highlight ? 'border-primary/30 bg-primary/5' : 'border-gray-100 bg-background/50'}`}>
        <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">{label}</p>
        <p className={`mt-1 text-xl font-extrabold ${highlight ? 'text-primary' : 'text-neutral'}`}>{value}</p>
    </div>
);

const InfoRow = ({ label, value }) => (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-background/50 p-3">
        <span className="text-sm font-semibold text-neutral/70">{label}</span>
        <span className="font-mono text-sm font-bold text-neutral">{value}</span>
    </div>
);

const CategoryCard = ({ title, icon, cost, paid, balance, status }) => {
    const fmt = (n) => n.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
                {icon}
                <h2 className="text-lg font-extrabold text-neutral">{title}</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">Cost</p>
                    <p className="mt-1 font-mono text-base font-semibold text-neutral">৳{fmt(cost)}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">Paid</p>
                    <p className="mt-1 font-mono text-base font-semibold text-neutral">৳{fmt(paid)}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-neutral/40">Balance</p>
                    <p className="mt-1 font-mono text-base font-bold text-neutral">৳{fmt(Math.abs(balance))}</p>
                    <StatusBadge status={status} />
                </div>
            </div>
        </div>
    );
};

const SettlementRow = ({ label, value, bold }) => (
    <div className="flex items-center justify-between">
        <span className={`text-sm ${bold ? 'font-bold' : 'font-medium'} text-neutral`}>{label}</span>
        <span className={`font-mono ${bold ? 'text-base font-bold' : 'text-sm font-semibold'} text-neutral`}>{value}</span>
    </div>
);

const StatusBadge = ({ status, large }) => {
    const configs = {
        Due: {
            className: "bg-red-50 text-red-600 border-red-200",
        },
        Advance: {
            className: "bg-secondary/10 text-secondary border-secondary/20",
        },
        Settled: {
            className: "bg-primary/10 text-primary border-primary/20",
        },
    };

    const config = configs[status] || configs.Settled;
    const sizeClass = large ? "text-sm px-3 py-1" : "text-[10px] px-2 py-0.5";

    return (
        <span className={`mt-1 inline-flex rounded-full border font-bold uppercase tracking-wide ${config.className} ${sizeClass}`}>
            {status}
        </span>
    );
};

export default MonthlyReport;
