package com.medication_reminder.embedded;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReminderMedicineId implements Serializable {

    @Column(name = "reminder_id")
    private Long reminderId;

    @Column(name = "medicine_id")
    private Long medicineId;
}