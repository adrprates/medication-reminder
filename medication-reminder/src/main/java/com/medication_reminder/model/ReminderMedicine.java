package com.medication_reminder.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.medication_reminder.embedded.ReminderMedicineId;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "reminders_medicines")
public class ReminderMedicine {

    @EmbeddedId
    private ReminderMedicineId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("reminderId")
    @JoinColumn(name = "reminder_id", nullable = false)
    @JsonBackReference
    private Reminder reminder;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("medicineId")
    @JsonBackReference
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;
}