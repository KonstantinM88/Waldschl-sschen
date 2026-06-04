import {
  BookingLifecycleActorType,
  BookingLifecycleEventType,
  BookingStatus,
  Prisma,
} from "@prisma/client";

interface BuildBookingLifecycleEventDataInput {
  actorName?: string | null;
  actorType: BookingLifecycleActorType;
  automatic?: boolean;
  bookingId: string;
  createdAt?: Date;
  details?: Prisma.InputJsonValue;
  eventType?: BookingLifecycleEventType;
  fromStatus?: BookingStatus | null;
  toStatus?: BookingStatus | null;
}

export function getBookingLifecycleEventType(
  toStatus?: BookingStatus | null,
  automatic = false
) {
  if (automatic) {
    return BookingLifecycleEventType.AUTO_STATUS_CHANGED;
  }

  if (toStatus === BookingStatus.CANCELLED) {
    return BookingLifecycleEventType.CANCELLED;
  }

  return BookingLifecycleEventType.STATUS_CHANGED;
}

export function buildBookingLifecycleEventData({
  actorName,
  actorType,
  automatic = false,
  bookingId,
  createdAt,
  details,
  eventType,
  fromStatus = null,
  toStatus = null,
}: BuildBookingLifecycleEventDataInput): Prisma.BookingLifecycleEventUncheckedCreateInput {
  return {
    bookingId,
    eventType:
      eventType ?? getBookingLifecycleEventType(toStatus, automatic),
    fromStatus,
    toStatus,
    actorType,
    actorName: actorName?.trim() || null,
    details,
    createdAt,
  };
}
