package com.medication_reminder.service.impl;

import com.medication_reminder.dto.MedicineDto;
import com.medication_reminder.dto.ReminderDetailDto;
import com.medication_reminder.dto.ReminderDto;
import com.medication_reminder.dto.ReminderMedicineDto;
import com.medication_reminder.model.Medicine;
import com.medication_reminder.model.Reminder;
import com.medication_reminder.repository.MedicineRepository;
import com.medication_reminder.repository.ReminderMedicineRepository;
import com.medication_reminder.repository.ReminderRepository;
import com.medication_reminder.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ReminderImpl implements ReminderService {

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private ReminderMedicineRepository reminderMedicineRepository;

    @Override
    public List<Reminder> getAllReminders() {
        return reminderRepository.findAll();
    }

    @Override
    public List<Reminder> getAllReminderByTitleContaining(String title) {
        List<Reminder> reminders;
        reminders = reminderRepository.findReminderByTitleContainingIgnoreCase(title);
        return reminders;
    }

    @Override
    public void saveReminder(Reminder reminder) {
        reminderRepository.save(reminder);
    }

    @Override
    public Reminder getReminderById(Long id) {
        Optional<Reminder> optional = reminderRepository.findById(id);
        Reminder reminder = null;
        if (optional.isPresent()) {
            reminder = optional.get();
        } else{
            throw new RuntimeException("Lembrete não encontrado para o id " + id);
        }
        return reminder;
    }

    @Override
    public void deleteReminderById(Long id) {
        reminderRepository.deleteById(id);
    }

    public boolean deleteById(Long id) {
        if (reminderRepository.existsById(id)) {
            reminderMedicineRepository.deleteByReminderId(id);
            reminderRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public ReminderDto getReminderByIdDto(Long id) {
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Reminder não encontrado"));

        ReminderDto dto = new ReminderDto();
        dto.setId(reminder.getId());
        dto.setTitle(reminder.getTitle());

        dto.setHour(reminder.getHour().format(DateTimeFormatter.ofPattern("HH:mm")));

        Set<String> weekDays = reminder.getWeekDays().stream()
                .map(Enum::name)
                .collect(Collectors.toSet());
        dto.setWeekDays(weekDays);

        List<Long> medicineIds = reminder.getMedicines().stream()
                .map(rm -> rm.getMedicine().getId())
                .collect(Collectors.toList());
        dto.setMedicineIds(medicineIds);

        dto.setNote(reminder.getNote());

        return dto;
    }

    public ReminderDetailDto getReminderDetailById(Long id) {
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Reminder não encontrado"));

        ReminderDetailDto dto = new ReminderDetailDto();
        dto.setId(reminder.getId());
        dto.setTitle(reminder.getTitle());
        dto.setHour(reminder.getHour().format(DateTimeFormatter.ofPattern("HH:mm")));

        Set<String> weekDays = reminder.getWeekDays().stream()
                .map(Enum::name)
                .collect(Collectors.toSet());
        dto.setWeekDays(weekDays);

        List<ReminderMedicineDto> medicines = reminder.getMedicines().stream()
                .map(rm -> {
                    ReminderMedicineDto rmDto = new ReminderMedicineDto();
                    rmDto.setReminderId(reminder.getId());
                    rmDto.setMedicineId(rm.getMedicine().getId());

                    MedicineDto medDto = new MedicineDto();
                    medDto.setId(rm.getMedicine().getId());
                    medDto.setName(rm.getMedicine().getName());
                    medDto.setDosage(rm.getMedicine().getDosage());
                    medDto.setFormat(rm.getMedicine().getFormat());

                    rmDto.setMedicine(medDto);

                    return rmDto;
                }).collect(Collectors.toList());
        dto.setMedicines(medicines);

        dto.setNote(reminder.getNote());

        return dto;
    }

}
