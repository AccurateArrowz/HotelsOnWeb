import { useState } from "react";
import { Loading, TryAgainButton } from "@shared/components";
import {
  useGetHotelRequestsQuery,
  useUpdateHotelRequestStatusMutation,
} from "@features/admin/adminHotelRequestsApi";

// ─── Types ───────────────────────────────────────────────────────────────────

type RequestStatus = "pending" | "approved" | "rejected";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface HotelRequest {
  id: number;
  hotelName: string;
  description: string;
  address: string;
  street: string;
  city: string;
  country: string;
  ownerId: number;
  ownerName: string;
  status: RequestStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; badgeClass: string }
> = {
  pending: {
    label: "Pending",
    badgeClass: "bg-yellow-100 text-yellow-855 border-yellow-250",
  },
  approved: {
    label: "Approved",
    badgeClass: "bg-green-100 text-green-855 border-green-250",
  },
  rejected: {
    label: "Rejected",
    badgeClass: "bg-red-100 text-red-855 border-red-250",
  },
};

function StatusBadge({ status }: { status: RequestStatus }) {
  const { label, badgeClass } = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-block text-sm md:text-base font-semibold px-4 py-1.5 rounded-full border shadow-xs ${badgeClass}`}
    >
      {label}
    </span>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

interface DetailModalProps {
  request: HotelRequest;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  isUpdating?: boolean;
}

function DetailModal({
  request,
  onClose,
  onApprove,
  onReject,
  isUpdating,
}: DetailModalProps) {
  const ownerEmail = request.user?.email ?? "N/A";

  const details: [string, string | number][] = [
    ["Owner", request.ownerName],
    ["Email", ownerEmail],
    ["Address", `${request.street}, ${request.city}, ${request.country}`],
    ["Submitted", new Date(request.createdAt).toLocaleDateString()],
    ["Last Updated", new Date(request.updatedAt).toLocaleDateString()],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-950 tracking-tight">
              {request.hotelName}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge status={request.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-light cursor-pointer leading-none"
          >
            ×
          </button>
        </div>

        {/* Detail grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {details.map(([label, value]) => (
            <div
              key={label}
              className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
            >
              <p className="text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
                {label}
              </p>
              <p className="text-base md:text-lg font-bold text-gray-800 break-all">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-100">
          <h3 className="text-base md:text-lg font-extrabold text-gray-800 mb-2">
            Description
          </h3>
          <p className="text-base text-gray-650 leading-relaxed font-medium">
            {request.description}
          </p>
        </div>

        {/* Admin notes (rejection or approval notes) */}
        {request.adminNotes && (
          <div className={`mb-6 border-l-4 px-5 py-4 rounded-r-xl text-base font-medium ${
            request.status === "rejected"
              ? "border-red-400 bg-red-50 text-red-800"
              : "border-blue-400 bg-blue-50 text-blue-800"
          }`}>
            <span className="font-bold">
              {request.status === "rejected" ? "Rejection note: " : "Admin note: "}
            </span>
            {request.adminNotes}
          </div>
        )}

        {/* Actions (pending only) */}
        {request.status === "pending" && (
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-5 border-t border-gray-100 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 text-base font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => { onClose(); onReject(request.id); }}
              disabled={isUpdating}
              className="px-6 py-3 text-base font-bold text-white bg-red-650 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md cursor-pointer"
            >
              Reject
            </button>
            <button
              onClick={() => { onApprove(request.id); onClose(); }}
              disabled={isUpdating}
              className="px-6 py-3 text-base font-bold text-white bg-green-650 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md cursor-pointer"
            >
              {isUpdating ? "Processing..." : "Approve"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Reject Modal ─────────────────────────────────────────────────────────────

interface RejectModalProps {
  request: HotelRequest;
  onClose: () => void;
  onConfirm: (id: number, note: string) => void;
  isUpdating?: boolean;
}

function RejectModal({ request, onClose, onConfirm, isUpdating }: RejectModalProps) {
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    if (!note.trim()) return;
    onConfirm(request.id, note.trim());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-gray-150 p-6 md:p-8 w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Reject request
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-light cursor-pointer leading-none"
          >
            ×
          </button>
        </div>

        <p className="text-base text-gray-600 mb-4 font-medium">
          Rejecting{" "}
          <span className="font-extrabold text-gray-800">
            {request.hotelName}
          </span>
          . Please provide a reason.
        </p>

        <textarea
          autoFocus
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Incomplete documentation..."
          className="w-full min-h-[120px] text-base px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 outline-none resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs mb-4"
        />

        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 text-base font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!note.trim() || isUpdating}
            className="px-6 py-3 text-base font-bold bg-red-650 hover:bg-red-700 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md cursor-pointer"
          >
            {isUpdating ? "Processing..." : "Confirm rejection"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Request Card ─────────────────────────────────────────────────────────────

interface RequestCardProps {
  request: HotelRequest;
  onViewDetail: (id: number) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

function RequestCard({
  request,
  onViewDetail,
  onApprove,
  onReject,
}: RequestCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 hover:shadow-xs transition-shadow duration-200">
      {/* Top row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
              {request.hotelName}
            </span>
            <StatusBadge status={request.status} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-base md:text-lg text-gray-700 font-medium">
              {request.street}, {request.city}, {request.country}
            </span>
          </div>
        </div>
        <span className="text-sm md:text-base text-gray-500 font-medium">
          {new Date(request.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Description */}
      <p className="text-base text-gray-600 leading-relaxed mb-4 font-medium line-clamp-2">
        {request.description}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm md:text-base text-gray-500 mb-4 font-medium">
        <span>By <span className="font-semibold text-gray-700">{request.ownerName}</span></span>
        <span>•</span>
        <span>{request.user?.email ?? "No email"}</span>
      </div>

      {/* Admin notes */}
      {request.status === "rejected" && request.adminNotes && (
        <div className="mb-4 border-l-4 border-red-400 bg-red-50/50 px-4 py-3 text-base text-red-800 rounded-r-xl font-medium">
          <span className="font-bold">Rejection note: </span>
          {request.adminNotes}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100 flex-wrap">
        <button
          onClick={() => onViewDetail(request.id)}
          className="text-base font-bold px-5 py-2.5 rounded-xl border border-gray-250 text-gray-700 hover:bg-gray-50 transition-all duration-200 cursor-pointer shadow-2xs"
        >
          View details
        </button>
        {request.status === "pending" && (
          <>
            <button
              onClick={() => onApprove(request.id)}
              className="text-base font-bold px-5 py-2.5 rounded-xl border border-green-600 text-green-700 hover:bg-green-50 transition-all duration-200 cursor-pointer shadow-2xs"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(request.id)}
              className="text-base font-bold px-5 py-2.5 rounded-xl border border-red-500 text-red-650 hover:bg-red-50 transition-all duration-200 cursor-pointer shadow-2xs"
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type FilterOption = "all" | RequestStatus;

export default function HotelRequestsPage() {
  const [filter, setFilter] = useState<FilterOption>("all");
  const [search, setSearch] = useState("");
  const [detailId, setDetailId] = useState<number | null>(null);
  const [rejectId, setRejectId] = useState<number | null>(null);

  const {
    data: requests = [],
    isLoading,
    isError,
    refetch,
  } = useGetHotelRequestsQuery(filter === "all" ? undefined : filter);

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateHotelRequestStatusMutation();

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const filtered = requests.filter((r) => {
    const matchesFilter = filter === "all" || r.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.hotelName.toLowerCase().includes(q) ||
      r.ownerName.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleApprove = async (id: number) => {
    try {
      await updateStatus({ id, status: "approved" }).unwrap();
    } catch (err) {
      console.error("Failed to approve request:", err);
    }
  };

  const handleReject = async (id: number, note: string) => {
    try {
      await updateStatus({ id, status: "rejected", adminNotes: note }).unwrap();
    } catch (err) {
      console.error("Failed to reject request:", err);
    }
  };

  const detailRequest = detailId !== null
    ? requests.find((r) => r.id === detailId) ?? null
    : null;

  const rejectRequest = rejectId !== null
    ? requests.find((r) => r.id === rejectId) ?? null
    : null;

  const FILTER_TABS: { key: FilterOption; label: string }[] = [
    { key: "all", label: `All (${counts.all})` },
    { key: "pending", label: `Pending (${counts.pending})` },
    { key: "approved", label: `Approved (${counts.approved})` },
    { key: "rejected", label: `Rejected (${counts.rejected})` },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FCF8F5]">
        <Loading size="large" message="Loading hotel requests..." />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="p-6 min-h-screen bg-[#FCF8F5] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md w-full shadow-sm text-center">
          <p className="text-red-800 text-lg font-semibold mb-4">
            Failed to load hotel requests.
          </p>
          <TryAgainButton onClick={refetch} variant="danger" size="md" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 bg-[#FCF8F5] min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight">
            Hotel requests
          </h1>
          <p className="text-base md:text-lg text-gray-600 mt-2">
            Review and manage hotel onboarding applications.
          </p>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {(
            [
              { label: "Total", value: counts.all, color: "text-gray-900" },
              { label: "Pending", value: counts.pending, color: "text-amber-700" },
              { label: "Approved", value: counts.approved, color: "text-green-700" },
              { label: "Rejected", value: counts.rejected, color: "text-red-700" },
            ] as const
          ).map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-2xs"
            >
              <p className="text-sm md:text-base font-semibold text-gray-500 mb-1">
                {label}
              </p>
              <p className={`text-3xl md:text-4xl font-extrabold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hotel or owner..."
            className="flex-1 text-base px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-2xs"
          />
          <div className="flex gap-2 flex-wrap items-center">
            {FILTER_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`text-sm md:text-base px-4.5 py-2.5 rounded-xl border transition-all duration-200 shadow-2xs cursor-pointer font-semibold ${
                  filter === key
                    ? "border-blue-500 bg-blue-600 text-white shadow-md"
                    : "border-gray-250 bg-white text-gray-600 hover:bg-gray-50 hover:shadow-2xs"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Request list */}
        <div className="flex flex-col gap-4">
          {filtered.length > 0 ? (
            filtered.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                onViewDetail={setDetailId}
                onApprove={handleApprove}
                onReject={setRejectId}
              />
            ))
          ) : (
            <p className="text-center text-lg text-gray-500 font-medium py-16 bg-white rounded-2xl border border-gray-200">
              No requests match your filters.
            </p>
          )}
        </div>
      </div>

      {/* Modals */}
      {detailRequest && (
        <DetailModal
          request={detailRequest}
          onClose={() => setDetailId(null)}
          onApprove={handleApprove}
          onReject={(id) => { setDetailId(null); setRejectId(id); }}
          isUpdating={isUpdating}
        />
      )}
      {rejectRequest && (
        <RejectModal
          request={rejectRequest}
          onClose={() => setRejectId(null)}
          onConfirm={handleReject}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
}
