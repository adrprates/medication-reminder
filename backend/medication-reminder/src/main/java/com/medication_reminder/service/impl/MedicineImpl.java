package com.medication_reminder.service.impl;

import com.medication_reminder.model.Medicine;
import com.medication_reminder.repository.MedicineRepository;
import com.medication_reminder.repository.ReminderMedicineRepository;
import com.medication_reminder.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicineImpl implements MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private ReminderMedicineRepository reminderMedicineRepository;

    @Override
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    @Override
    public List<Medicine> getAllMedicinesByNameContaining(String name) {
        return medicineRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public void saveMedicine(Medicine medicine) {
        medicineRepository.save(medicine);
    }

    @Override
    public Medicine getMedicineById(Long id) {
        Optional<Medicine> optional = medicineRepository.findById(id);
        Medicine medicine = null;
        if (optional.isPresent()) {
            medicine = optional.get();
        } else{
            throw new RuntimeException("Medicamento não encontrado para o id " + id);
        }
        return medicine;
    }

    @Override
    public void deleteMedicineById(Long id) {
        medicineRepository.deleteById(id);
    }

    @Override
    public boolean deleteById(Long id) {
        if (medicineRepository.existsById(id)) {
            reminderMedicineRepository.deleteByMedicineId(id);
            medicineRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
