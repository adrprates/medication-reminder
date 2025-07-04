package com.medication_reminder.controller;

import com.medication_reminder.dto.ReminderDto;
import com.medication_reminder.dto.ReminderResponseDto;
import com.medication_reminder.enums.DayOfWeek;
import com.medication_reminder.model.Reminder;
import com.medication_reminder.service.ReminderMedicineService;
import com.medication_reminder.service.ReminderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reminder")
public class ReminderRestController {

    private final ReminderService reminderService;
    private final ReminderMedicineService reminderMedicineService;

    public ReminderRestController(ReminderService reminderService,
                                  ReminderMedicineService reminderMedicineService) {
        this.reminderService = reminderService;
        this.reminderMedicineService = reminderMedicineService;
    }

    @GetMapping("/list")
    public List<ReminderResponseDto> listReminders(@RequestParam(required = false) String title) {
        List<Reminder> reminders;
        if (title == null || title.isBlank()) {
            reminders = reminderService.getAllReminders();
        } else {
            reminders = reminderService.getAllReminderByTitleContaining(title);
        }

        return reminders.stream()
                .map(r -> new ReminderResponseDto(
                        r.getId(),
                        r.getTitle(),
                        r.getHour() != null ? r.getHour().toString() : null,
                        r.getWeekDays().stream().map(Enum::name).toList(),
                        r.getMedicines().stream()
                                .map(rm -> rm.getMedicine().getName())
                                .toList()
                ))
                .toList();
    }


    @GetMapping("/show/{id}")
    public ResponseEntity<ReminderDto> getReminderById(@PathVariable Long id) {
        try {
            ReminderDto dto = reminderService.getReminderByIdDto(id);
            return ResponseEntity.ok(dto);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping("/save")
    public ResponseEntity<Void> saveReminder(@Valid @RequestBody ReminderDto dto) {
        try {
            Reminder reminder = new Reminder();
            reminder.setId(dto.getId());
            reminder.setTitle(dto.getTitle());
            reminder.setHour(LocalTime.parse(dto.getHour()));

            Set<DayOfWeek> days = dto.getWeekDays().stream()
                    .map(String::toUpperCase)
                    .map(DayOfWeek::valueOf)
                    .collect(Collectors.toSet());

            reminder.setWeekDays(days);

            reminder.setNote(dto.getNote());

            reminderService.saveReminder(reminder);
            reminderMedicineService.addMedicines(reminder.getId(), dto.getMedicineIds());

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteReminder(@PathVariable Long id) {
        System.out.println("Chamou delete com ID: " + id);
        boolean deleted = reminderService.deleteById(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
