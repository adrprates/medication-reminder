package com.medication_reminder.repository;

import com.medication_reminder.enums.DayOfWeek;
import com.medication_reminder.model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    List<Reminder> findReminderByTitleContainingIgnoreCase(String title);

    @Query("SELECT r FROM Reminder r WHERE r.hour = :hour AND :weekDay MEMBER OF r.weekDays")
    List<Reminder> findAllByHourAndWeekDay(@Param("hour") LocalTime hour, @Param("weekDay") DayOfWeek weekDay);
}