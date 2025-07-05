package com.medication_reminder.repository;

import com.medication_reminder.embedded.ReminderMedicineId;
import com.medication_reminder.model.ReminderMedicine;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ReminderMedicineRepository extends JpaRepository<ReminderMedicine, ReminderMedicineId> {

    List<ReminderMedicine> findAllByReminderId(Long reminderId);
    void deleteById(@NonNull ReminderMedicineId id);

    @Modifying
    @Transactional
    @Query("DELETE FROM ReminderMedicine rm WHERE rm.medicine.id = :medicineId")
    void deleteByMedicineId(@Param("medicineId") Long medicineId);

    @Modifying
    @Transactional
    @Query("DELETE FROM ReminderMedicine rm WHERE rm.reminder.id = :reminderId")
    void deleteByReminderId(@Param("reminderId") Long reminderId);

}