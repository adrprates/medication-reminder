package com.medication_reminder.service;

import com.medication_reminder.dto.ReminderDetailDto;
import com.medication_reminder.dto.ReminderDto;
import com.medication_reminder.model.Reminder;

import java.util.List;

public interface ReminderService {

    List<Reminder> getAllReminders();
    List<Reminder> getAllReminderByTitleContaining(String title);
    void saveReminder(Reminder reminder);
    Reminder getReminderById(Long id);
    void deleteReminderById(Long id);
    ReminderDto getReminderByIdDto(Long id);
    ReminderDetailDto getReminderDetailById(Long id);
    boolean deleteById(Long id);
}
