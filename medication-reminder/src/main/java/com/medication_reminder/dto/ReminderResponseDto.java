package com.medication_reminder.dto;

import java.util.List;

public record ReminderResponseDto(
        Long id,
        String title,
        String hour,
        List<String> weekDays,
        List<String> medicineNames) {}