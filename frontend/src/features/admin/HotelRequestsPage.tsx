import { useState } from "react";
import { Loading } from "@shared/components";
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

// ─── Mock data (commented out for reference) ──────────────────────────────────
/*
const MOCK_REQUESTS: HotelRequest[] = [
  {
    id: 1,
    hotelName: "The Grand Summit",
    ownerName: "Arjun Sharma",
    description: "A luxury hotel in the heart of Thamel...",
    address: "Thamel",
    city: "Kathmandu",
    country: "Nepal",
    ownerId: 1,
    status: "pending",
    createdAt: "2026-04-22",
    updatedAt: "2026-04-22",
  },
  // ... more mock data
];
*/

// ─── Sub-components ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; badgeClass: string }
> = {
  pending: {
    label: "Pending",
    badgeClass: "bg-amber-100 text-amber-800",
  },
  approved: {
    label: "Approved",
    badgeClass: "bg-green-100 text-green-800",
  },
  rejected: {
    label: "Rejected",
    badgeClass: "bg-red-100 text-red-800",
  },
};

function StatusBadge({ status }: { status: RequestStatus }) {
  const { label, badgeClass } = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${badgeClass}`}
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {request.hotelName}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <StatusBadge status={request.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Detail grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {details.map(([label, value]) => (
            <div
              key={label}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                {label}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 break-all">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Description
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {request.description}
          </p>
        </div>

        {/* Admin notes (rejection or approval notes) */}
        {request.adminNotes && (
          <div className={`mb-4 border-l-2 px-3 py-2 text-sm ${
            request.status === "rejected"
              ? "border-red-400 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
              : "border-blue-400 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
          }`}>
            <span className="font-medium">
              {request.status === "rejected" ? "Rejection note: " : "Admin note: "}
            </span>
            {request.adminNotes}
          </div>
        )}

        {/* Actions (pending only) */}
        {request.status === "pending" && (
          <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => { onApprove(request.id); onClose(); }}
              disabled={isUpdating}
              className="flex-1 py-2 rounded-lg border border-green-600 text-green-700 dark:text-green-400 dark:border-green-700 text-sm font-medium hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? "Processing..." : "Approve"}
            </button>
            <button
              onClick={() => { onClose(); onReject(request.id); }}
              disabled={isUpdating}
              className="flex-1 py-2 rounded-lg border border-red-500 text-red-600 dark:text-red-400 dark:border-red-700 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reject
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
            Reject request
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Rejecting{" "}
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {request.hotelName}
          </span>
          . Please provide a reason.
        </p>

        <textarea
          autoFocus
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Incomplete documentation..."
          className="w-full min-h-[88px] text-sm px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none resize-y focus:border-gray-400"
        />

        <div className="flex gap-2 mt-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!note.trim() || isUpdating}
            className="flex-1 py-2 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {request.hotelName}
            </span>
            <StatusBadge status={request.status} />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {request.street}, {request.city}, {request.country}
            </span>
          </div>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap pt-0.5">
          {new Date(request.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
        {request.description}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span>{request.ownerName}</span>
        <span>{request.user?.email ?? "No email"}</span>
      </div>

      {/* Admin notes */}
      {request.status === "rejected" && request.adminNotes && (
        <div className="mb-3 border-l-2 border-red-400 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 text-xs text-red-700 dark:text-red-400">
          <span className="font-medium">Rejection note: </span>
          {request.adminNotes}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={() => onViewDetail(request.id)}
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          View details
        </button>
        {request.status === "pending" && (
          <>
            <button
              onClick={() => onApprove(request.id)}
              className="text-xs px-3 py-1.5 rounded-lg border border-green-600 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 font-medium transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(request.id)}
              className="text-xs px-3 py-1.5 rounded-lg border border-red-500 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium transition-colors"
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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Loading size="large" message="Loading hotel requests..." />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-800 dark:text-red-400">
            Failed to load hotel requests. Please try again.
          </p>
          <button
            onClick={refetch}
            className="mt-3 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/50 rounded-lg hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-900 dark:text-gray-100">
          Hotel requests
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Review and manage hotel onboarding applications.
        </p>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {(
          [
            { label: "Total", value: counts.all, color: "text-gray-900 dark:text-gray-100" },
            { label: "Pending", value: counts.pending, color: "text-amber-600 dark:text-amber-400" },
            { label: "Approved", value: counts.approved, color: "text-green-700 dark:text-green-400" },
            { label: "Rejected", value: counts.rejected, color: "text-red-600 dark:text-red-400" },
          ] as const
        ).map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2.5"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {label}
            </p>
            <p className={`text-2xl font-medium ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search hotel or owner..."
          className="flex-1 text-sm px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none focus:border-gray-400"
        />
        <div className="flex gap-2 flex-wrap">
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                filter === key
                  ? "border-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium"
                  : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Request list */}
      <div className="flex flex-col gap-3">
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
          <p className="text-center text-sm text-gray-400 py-12">
            No requests match your filters.
          </p>
        )}
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
