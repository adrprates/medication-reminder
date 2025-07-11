package com.medication_reminder.service.impl;

import com.medication_reminder.embedded.ReminderMedicineId;
import com.medication_reminder.model.Medicine;
import com.medication_reminder.model.Reminder;
import com.medication_reminder.model.ReminderMedicine;
import com.medication_reminder.repository.MedicineRepository;
import com.medication_reminder.repository.ReminderMedicineRepository;
import com.medication_reminder.repository.ReminderRepository;
import com.medication_reminder.service.ReminderMedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReminderMedicineImpl implements ReminderMedicineService {

    @Autowired
    ReminderMedicineRepository reminderMedicineRepository;

    @Autowired
    ReminderRepository reminderRepository;

    @Autowired
    MedicineRepository medicineRepository;

    @Override
    public void addMedicines(Long reminderId, List<Long> medicinesId) {
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new RuntimeException("Reminder not found"));

        for (Long medicineId : medicinesId) {
            Medicine medicine = medicineRepository.findById(medicineId)
                    .orElseThrow(() -> new RuntimeException("Medicine not found"));

            ReminderMedicineId id = new ReminderMedicineId(reminderId, medicineId);

            if (!reminderMedicineRepository.existsById(id)) {
                ReminderMedicine rm = new ReminderMedicine();
                rm.setId(id);
                rm.setReminder(reminder);
                rm.setMedicine(medicine);

                reminderMedicineRepository.save(rm);
            }
        }
    }
}