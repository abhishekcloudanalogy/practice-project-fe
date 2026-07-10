"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { connectSocket, disconnectSocket } from "@/store/services/socket/socketClient";
import { schedulerApi } from "@/store/services/scheduler/apiSlice";

/**
 * Mount once near the app root (e.g. in the authenticated layout). Connects
 * to Socket.IO with the current access token, listens for meeting mutation
 * events broadcast by the backend, and invalidates the relevant RTK Query
 * cache tags so lists/detail views refetch automatically — no polling needed.
 */
export function useSchedulerSocket(token: string | null | undefined) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token);

    const invalidateAll = () => {
      dispatch(schedulerApi.util.invalidateTags(["Meeting"]));
    };

    const handleCreated = () => invalidateAll();

    const handleUpdated = (meeting: { id: string }) => {
      dispatch(
        schedulerApi.util.invalidateTags([
          "Meeting",
          { type: "Meeting", id: meeting.id },
        ]),
      );
    };

    const handleRemoved = (payload: { id: string }) => {
      dispatch(
        schedulerApi.util.invalidateTags([
          "Meeting",
          { type: "Meeting", id: payload.id },
        ]),
      );
    };

    const handleDeleted = (payload: { id: string }) => {
      dispatch(
        schedulerApi.util.invalidateTags([
          "Meeting",
          { type: "Meeting", id: payload.id },
        ]),
      );
    };

    socket.on("meeting:created", handleCreated);
    socket.on("meeting:updated", handleUpdated);
    socket.on("meeting:removed", handleRemoved);
    socket.on("meeting:deleted", handleDeleted);

    return () => {
      socket.off("meeting:created", handleCreated);
      socket.off("meeting:updated", handleUpdated);
      socket.off("meeting:removed", handleRemoved);
      socket.off("meeting:deleted", handleDeleted);
      disconnectSocket();
    };
  }, [token, dispatch]);
}