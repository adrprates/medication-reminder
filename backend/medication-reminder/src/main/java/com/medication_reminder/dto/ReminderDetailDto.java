package com.medication_reminder.dto;

import java.util.List;
import java.util.Set;

public class ReminderDetailDto {
    private Long id;
    private String title;
    private String hour;
    private Set<String> weekDays;
    private List<ReminderMedicineDto> medicines;
    private String note;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getHour() {
        return hour;
    }

    public void setHour(String hour) {
        this.hour = hour;
    }

    public Set<String> getWeekDays() {
        return weekDays;
    }

    public void setWeekDays(Set<String> weekDays) {
        this.weekDays = weekDays;
    }

    public List<ReminderMedicineDto> getMedicines() {
        return medicines;
    }

    public void setMedicines(List<ReminderMedicineDto> medicines) {
        this.medicines = medicines;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
