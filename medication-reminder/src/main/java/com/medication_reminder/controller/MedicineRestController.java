package com.medication_reminder.controller;

import com.medication_reminder.model.Medicine;
import com.medication_reminder.service.MedicineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicine")
public class MedicineRestController {

    private final MedicineService medicineService;

    public MedicineRestController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @GetMapping("/list")
    public List<Medicine> listMedicines(@RequestParam(required = false) String name) {
        if (name == null || name.isBlank()) {
            return medicineService.getAllMedicines();
        }
        return medicineService.getAllMedicinesByNameContaining(name);
    }

    @GetMapping("/show/{id}")
    public ResponseEntity<Medicine> getMedicine(@PathVariable Long id) {
        try {
            Medicine medicine = medicineService.getMedicineById(id);
            return ResponseEntity.ok(medicine);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/save")
    public void saveMedicine(@RequestBody Medicine medicine) {
        medicineService.saveMedicine(medicine);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Long id) {
        System.out.println("Chamou delete com ID: " + id);
        boolean deleted = medicineService.deleteById(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}