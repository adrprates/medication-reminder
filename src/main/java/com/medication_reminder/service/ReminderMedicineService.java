package com.medication_reminder.service;


import com.medication_reminder.model.Medicine;

import java.util.List;

public interface ReminderMedicineService {

    void addMedicines(Long reminderId, List<Long> medicinesId);
}
