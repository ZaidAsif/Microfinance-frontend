// components/applicationsData.ts
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { BASIC_URL } from "@/constant/constant";
import { Appointment } from "@/types/appointment";

export default function useApplications() {
  const [applications, setApplications] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [month, setMonth] = useState(dayjs());

  const fetchApplications = async (monthStart: string, monthEnd: string) => {
    setLoading(true);
    try {
      const {data} = await axios.get(`${BASIC_URL}admin/applications/month`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { start: monthStart, end: monthEnd },
      });
      setApplications(data.data);
      console.log('applications', data.data)
    } catch (error) {
      setError("Failed to load applications");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const start = month.startOf("month").toISOString();
    const end = month.endOf("month").toISOString();
    fetchApplications(start, end);
  }, [month]);

  const days = Array.from({ length: month.daysInMonth() }, (_, i) =>
    month.date(i + 1)
  );

  const eventsByDate: { [date: string]: any[] } = {};
  applications.forEach((app: Appointment) => {
    const date = dayjs(app.createdAt).format("YYYY-MM-DD");
    if (!eventsByDate[date]) eventsByDate[date] = [];
    eventsByDate[date].push(app);
  });

  const changeMonth = (delta: number) => {
    setMonth((prev) => prev.add(delta, "month"));
  };

  return {
    applications,
    loading,
    error,
    month,
    changeMonth,
    eventsByDate,
    days,
  };
}
