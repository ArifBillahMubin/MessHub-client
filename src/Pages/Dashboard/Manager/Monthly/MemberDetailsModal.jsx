import { useEffect } from 'react';
import { X } from 'lucide-react';

const MemberDetailsModal = ({ isOpen, onClose, member }) => {
  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !member) return null;

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Due':
        return 'bg-red-100 text-red-800';
      case 'Advance':
        return 'bg-green-100 text-green-800';
      case 'Settled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format payment category name
  const formatCategory = (category) => {
    const categoryMap = {
      meal: 'Meal Payment',
      rent: 'Rent Payment',
      khalabill: 'Khalabill Payment',
      common_expense: 'Common Expense Payment',
      other: 'Other Payment',
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              Member Settlement Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Member Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {member.name}
                </h4>
                <p className="text-sm text-gray-600">{member.email}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  member.status
                )}`}
              >
                {member.status}
              </span>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Cost Breakdown
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">Food Cost</span>
                <span className="font-semibold text-[#006B68]">
                  ৳{member.foodCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">Rent</span>
                <span className="font-semibold text-[#FF8A00]">
                  ৳{member.rent.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">Khalabill</span>
                <span className="font-semibold text-[#2E9B45]">
                  ৳{member.khalabill.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">Common Expense</span>
                <span className="font-semibold text-[#173B3A]">
                  ৳{member.commonExpense.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 bg-gray-100 rounded-lg px-4 mt-2">
                <span className="text-gray-900 font-semibold">
                  Total Cost
                </span>
                <span className="font-bold text-lg text-gray-900">
                  ৳{member.totalCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Breakdown
            </h4>
            {member.payments && member.payments.length > 0 ? (
              <div className="space-y-2">
                {member.payments.map((payment, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 px-4 bg-green-50 rounded-lg"
                  >
                    <div>
                      <span className="text-gray-900 font-medium">
                        {formatCategory(payment.category)}
                      </span>
                      {payment.note && (
                        <p className="text-sm text-gray-600 mt-1">
                          {payment.note}
                        </p>
                      )}
                    </div>
                    <span className="font-semibold text-[#2E9B45]">
                      ৳{payment.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-3 bg-gray-100 rounded-lg px-4 mt-2">
                  <span className="text-gray-900 font-semibold">
                    Total Paid
                  </span>
                  <span className="font-bold text-lg text-[#2E9B45]">
                    ৳{member.totalPaid.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No payments recorded
              </div>
            )}
          </div>

          {/* Final Balance */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-gray-900">
                {member.balance > 0
                  ? 'Amount Due'
                  : member.balance < 0
                  ? 'Advance Amount'
                  : 'Balance'}
              </span>
              <span
                className={`text-2xl font-bold ${
                  member.balance > 0
                    ? 'text-red-600'
                    : member.balance < 0
                    ? 'text-green-600'
                    : 'text-gray-900'
                }`}
              >
                ৳{Math.abs(member.balance).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailsModal;
