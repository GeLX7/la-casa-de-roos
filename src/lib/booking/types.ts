export type BookingProvider = "airbnb" | "website" | "manual";

/* "pending_payment" and PaymentStatus mirror dormant database columns kept
   for schema compatibility. The site processes no online payments: payments
   happen on Airbnb and direct reservations are confirmed by WhatsApp, so
   website requests only ever use "requested"/"confirmed"/"cancelled" and
   payment_status stays "none". */
export type ReservationStatus =
  | "requested"
  | "pending_payment"
  | "confirmed"
  | "cancelled"
  | "expired";

export type PaymentStatus = "none" | "pending" | "paid" | "failed" | "refunded";

export type DateBlock = {
  roomSlug: string;
  startDate: string;
  endDate: string;
  source: BookingProvider;
  uid: string;
  summary: string;
};

export type AvailabilityStatus =
  | "configuration_needed"
  | "available"
  | "unavailable";

export type AvailabilityResult = {
  room: string;
  startDate: string;
  endDate: string;
  live: boolean;
  status: AvailabilityStatus;
  unavailableRanges: DateBlock[];
  unavailableDates: string[];
  checkedAt: string;
  message: string;
};

export type ReservationRequestInput = {
  roomSlug: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  startDate: string;
  endDate: string;
  guests: number;
  message?: string;
};

export type RepositoryResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "configuration_needed" | "upstream_error"; message: string };
