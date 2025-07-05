package com.medication_reminder.service;

import com.medication_reminder.model.Medicine;

import java.util.List;

public interface MedicineService {

    List<Medicine> getAllMedicines();
    List<Medicine> getAllMedicinesByNameContaining(String name);
    void saveMedicine(Medicine medicine);
    Medicine getMedicineById(Long id);
    void deleteMedicineById(Long id);
    boolean deleteById(Long id);
}
