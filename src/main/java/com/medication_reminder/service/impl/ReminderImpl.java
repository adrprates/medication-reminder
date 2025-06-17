package com.medication_reminder.service.impl;

import com.medication_reminder.model.Reminder;
import com.medication_reminder.repository.ReminderRepository;
import com.medication_reminder.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReminderImpl implements ReminderService {

    @Autowired
    private ReminderRepository reminderRepository;

    @Override
    public List<Reminder> geAllReminders() {
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
}
