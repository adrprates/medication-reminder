package com.medication_reminder.controller;

import com.medication_reminder.enums.DayOfWeek;
import com.medication_reminder.model.Medicine;
import com.medication_reminder.model.Reminder;
import com.medication_reminder.service.MedicineService;
import com.medication_reminder.service.ReminderMedicineService;
import com.medication_reminder.service.ReminderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@RequestMapping(value = "/reminder/web")
@Controller
public class ReminderController {

    @Autowired
    private ReminderService reminderService;

    @Autowired
    private ReminderMedicineService reminderMedicineService;

    @Autowired
    private MedicineService medicineService;

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("reminder", new Reminder());
        model.addAttribute("medicines", medicineService.getAllMedicines());
        return "reminder/create";
    }

    @PostMapping("/save")
    public String save(@ModelAttribute @Valid Reminder reminder,
                       @RequestParam(required = false) List<Long> medicineIds,
                       @RequestParam(required = false) List<DayOfWeek> weekDays,
                       BindingResult bindingResult,
                       Model model) {

        if (weekDays == null || weekDays.isEmpty()) {
            bindingResult.rejectValue("weekDays", "error.reminder", "Selecione ao menos um dia da semana.");
        }
        if (medicineIds == null || medicineIds.isEmpty()) {
            bindingResult.rejectValue("medicineIds", "error.reminder", "Selecione ao menos um remédio.");
        }

        if (bindingResult.hasErrors()) {
            model.addAttribute("reminder", reminder);
            model.addAttribute("medicines", medicineService.getAllMedicines());
            model.addAttribute("medicineIds", medicineIds != null ? medicineIds : new ArrayList<>());
            model.addAttribute("weekDays", weekDays != null ? weekDays : new ArrayList<>());
            return reminder.getId() == null ? "reminder/create" : "reminder/edit";
        }

        reminder.setWeekDays(new HashSet<>(weekDays));
        reminderService.saveReminder(reminder);
        reminderMedicineService.addMedicines(reminder.getId(), medicineIds);

        return "redirect:/reminder/list";
    }

    @GetMapping("/list")
    public String listReminders(@RequestParam(required = false) String title, Model model) {
        List<Reminder> reminders;
        if (title != null && !title.isBlank()) {
            reminders = reminderService.getAllReminderByTitleContaining(title);
        } else {
            reminders = reminderService.getAllReminders();
        }
        model.addAttribute("reminders", reminders);
        return "reminder/list";
    }

    @GetMapping("/show/{id}")
    public String show(@PathVariable("id") Long id, Model model) {
        model.addAttribute("reminder", reminderService.getReminderById(id));
        return "reminder/show";
    }

    @GetMapping("/edit/{id}")
    public String edit(@PathVariable("id") Long id, Model model) {
        Reminder reminder = reminderService.getReminderById(id);
        List<Medicine> medicines = medicineService.getAllMedicines();

        List<Long> medicineIds = reminder.getMedicines().stream()
                .map(rm -> rm.getMedicine().getId())
                .toList();

        model.addAttribute("reminder", reminder);
        model.addAttribute("medicines", medicines);
        model.addAttribute("medicineIds", medicineIds != null ? medicineIds : new ArrayList<>());

        return "reminder/edit";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable (value = "id") Long id) {
        reminderService.deleteReminderById(id);
        return "redirect:/reminder/list";
    }

}