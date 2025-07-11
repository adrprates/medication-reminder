package com.medication_reminder.dto;

import com.medication_reminder.enums.DayOfWeek;

import java.time.LocalTime;
import java.util.List;
import java.util.Set;

public class ReminderDto {
    private Long id;
    private String title;
    private String hour;
    private Set<String> weekDays;
    private List<Long> medicineIds;
    private String note;
    private String deviceToken;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getHour() { return hour; }
    public void setHour(String hour) { this.hour = hour; }

    public Set<String> getWeekDays() { return weekDays; }
    public void setWeekDays(Set<String> weekDays) { this.weekDays = weekDays; }

    public List<Long> getMedicineIds() { return medicineIds; }
    public void setMedicineIds(List<Long> medicineIds) { this.medicineIds = medicineIds; }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getDeviceToken() {
        return deviceToken;
    }

    public void setDeviceToken(String deviceToken) {
        this.deviceToken = deviceToken;
    }
}
