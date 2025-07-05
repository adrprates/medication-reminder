package com.medication_reminder.repository;

import com.medication_reminder.model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    List<Reminder> findReminderByTitleContainingIgnoreCase(String title);
}