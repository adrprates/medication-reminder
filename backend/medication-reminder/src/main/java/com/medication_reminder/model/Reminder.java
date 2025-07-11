package com.medication_reminder.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.medication_reminder.enums.DayOfWeek;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Data
@Table(name = "reminders")
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "hour", nullable = false)
    private LocalTime hour;

    @ElementCollection(targetClass = DayOfWeek.class)
    @CollectionTable(
        name = "reminder_week_days",
        joinColumns = @JoinColumn(name = "reminder_id")
    )
    @Column(name = "week_day")
    @Enumerated(EnumType.STRING)
    private Set<DayOfWeek> weekDays = new HashSet<>();

    @OneToMany(mappedBy = "reminder", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ReminderMedicine> medicines = new ArrayList<>();


    @Column(name = "note", nullable = true)
    private String note;

    @Column(name = "device_token")
    private String deviceToken;

    public List<DayOfWeek> getOrderedWeekDays() {
        return weekDays.stream()
                .sorted(Comparator.comparingInt(Enum::ordinal))
                .collect(Collectors.toList());
    }
}