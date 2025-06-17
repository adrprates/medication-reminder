package com.medication_reminder.repository;

import com.medication_reminder.embedded.ReminderMedicineId;
import com.medication_reminder.model.ReminderMedicine;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReminderMedicineRepository extends JpaRepository<ReminderMedicine, ReminderMedicineId> {

    List<ReminderMedicine> findAllByReminderId(Long reminderId);
    void deleteById(@NonNull ReminderMedicineId id);
}