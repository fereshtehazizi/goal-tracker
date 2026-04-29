import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import faLocale from "@fullcalendar/core/locales/fa";
import arLocale from "@fullcalendar/core/locales/ar";
import { useTranslation } from "react-i18next";

import {
  Box,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

const STORAGE_KEY = "calendarEvents";

const Calendar = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  const isRTL = ["fa", "ar"].includes(i18n.language);

  const localeMap = {
    en: "en",
    fa: faLocale,
    ar: arLocale,
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [form, setForm] = useState({
    title: "",
    color: "#3b82f6",
  });

  const [toast, setToast] = useState({
    open: false,
    msg: "",
    severity: "success",
  });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      setEvents(saved);
    } catch {
      setEvents([]);
    }
  }, []);

  const saveEvents = (updatedEvents) => {
    setEvents(updatedEvents);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
  };

  const handleDateClick = (selected) => {
    setSelectedSlot(selected);
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.title) return;

    const newEvent = {
      id: Date.now().toString(),
      title: form.title,
      start: selectedSlot.startStr,
      end: selectedSlot.endStr,
      allDay: selectedSlot.allDay,
      color: form.color,
    };

    const updated = [...events, newEvent];

    saveEvents(updated);

    setToast({
      open: true,
      msg: t("eventCreated"),
      severity: "success",
    });

    setOpen(false);
    setForm({ title: "", color: "#3b82f6" });
  };

  const handleEventClick = (selected) => {
    const updated = events.filter((e) => e.id !== selected.event.id);

    saveEvents(updated);

    setToast({
      open: true,
      msg: t("eventDeleted"),
      severity: "error",
    });
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        {t("calendar")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <Box
          sx={{
            flex: { xs: "1 1 100%", md: "25%" },
            order: { xs: 2, md: 1 },
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
            backgroundColor: "background.paper",
            maxHeight: { md: "75vh" },
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" mb={2} textAlign="center">
            {t("events")}
          </Typography>

          {events.map((event) => (
            <Box
              key={event.id}
              sx={{
                backgroundColor: event.color,
                color: "#fff",
                mb: 1,
                p: 1.2,
                borderRadius: 1,
                fontSize: { xs: "12px", md: "14px" },
              }}
            >
              {event.title}
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            flex: { xs: "1 1 100%", md: "75%" },
            order: { xs: 1, md: 2 },

            "& .fc": {
              fontFamily: "inherit",
              fontSize: { xs: "12px", md: "14px" },
              color: "text.primary",
            },

            "& .fc-theme-standard td, & .fc-theme-standard th": {
              borderColor: "divider",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : "#fff",
            },

            "& .fc-scrollgrid": {
              border: "1px solid",
              borderColor: "divider",
            },

            "& .fc-daygrid-day": {
              border: "1px solid",
              borderColor: "divider",
            },

            "& .fc-daygrid-day-frame": {
              minHeight: { xs: 60, md: 90 },
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : "#fff",
            },

            "& .fc-toolbar": {
              borderRadius: 1,
              padding: "8px",
            },

            "& .fc-toolbar-title": {
              fontSize: { xs: "14px", md: "18px" },
              color: "text.primary",
            },

            "& .fc-button": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[800]
                  : theme.palette.grey[200],
              border: "none",
              color: "text.primary",
            },

            "& .fc-button-active": {
              backgroundColor: "primary.main !important",
              color: "#fff !important",
            },

            "& .fc-event": {
              fontSize: { xs: "10px", md: "13px" },
              padding: { xs: "1px 2px", md: "4px 6px" },
              border: "none",
            },

            "& .fc-list": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : "#fff",
            },

            "& .fc-list-event": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[900]
                  : "#fff",
              borderColor: "divider",
            },

            "& .fc-list-event:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[800]
                  : theme.palette.grey[100],
            },
          }}
        >
          <FullCalendar
            key={i18n.language}
            height="auto"
            contentHeight="auto"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            locale={localeMap[i18n.language] || "en"}
            direction={isRTL ? "rtl" : "ltr"}

            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: isMobile
                ? "dayGridMonth"
                : "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}

            initialView="dayGridMonth"
            selectable
            select={handleDateClick}
            eventClick={handleEventClick}
            events={events}
          />
        </Box>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" sx={{ ml: 8 }}>
        <DialogTitle>{t("addEvent")}</DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              required
              label={t("eventTitle")}
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <Box display="flex" gap={1}>
              {["#3b82f6", "#ef4444", "#10b981", "#a855f7", "#f59e0b"].map(
                (c) => (
                  <Box
                    key={c}
                    onClick={() => setForm({ ...form, color: c })}
                    sx={{
                      width: 28,
                      height: 28,
                      backgroundColor: c,
                      cursor: "pointer",
                      borderRadius: "50%",
                      border:
                        form.color === c ? "2px solid #000" : "none",
                    }}
                  />
                )
              )}
            </Box>

            <Box display="flex" gap={1}>
              <Button fullWidth variant="outlined" onClick={() => setOpen(false)}>
                {t("cancel")}
              </Button>

              <Button fullWidth variant="contained" onClick={handleSave}>
                {t("save")}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        sx={{ ml: 16 }}
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert sx={{ ml: 16 }} severity={toast.severity} variant="filled">
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Calendar;