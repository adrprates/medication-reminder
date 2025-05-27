package com.medication_reminder.controller;

import com.medication_reminder.model.Medicine;
import com.medication_reminder.service.MedicineService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @GetMapping("/medicine/create")
    public String create(Model model) {
        model.addAttribute("medicine", new Medicine());
        return "medicine/create";
    }

    @PostMapping("/medicine/save")
    public String save(@ModelAttribute @Valid Medicine medicine, BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("medicine", medicine);
            if (medicine.getId() == null) {
                return "medicine/create";
            } else {
                return "medicine/edit";
            }
        }
        medicineService.saveMedicine(medicine);
        return "redirect:/medicine/list";
    }

    @GetMapping("/medicine/list")
    public String list(@RequestParam(required = false) String name, Model model) {
        if(name == null || name.isEmpty()) {
            model.addAttribute("medicines", medicineService.getAllMedicines());
        } else{
            model.addAttribute("medicines", medicineService.getAllMedicinesByNameContaining(name));
        }
        return "medicine/list";
    }

    @GetMapping("/medicine/show/{id}")
    public String show(@PathVariable("id") Long id, Model model) {
        model.addAttribute("medicine", medicineService.getMedicineById(id));
        return "medicine/show";
    }

    @GetMapping("/medicine/edit/{id}")
    public String edit(@PathVariable (value = "id") Long id, Model model) {
        Medicine medicine = medicineService.getMedicineById(id);
        model.addAttribute("medicine", medicine);
        return "medicine/edit";
    }

    @GetMapping("/medicine/delete/{id}")
    public String delete(@PathVariable (value = "id") Long id) {
        medicineService.deleteMedicineById(id);
        return "redirect:/medicine/list";
    }
}