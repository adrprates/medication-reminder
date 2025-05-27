package com.medication_reminder.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "medicines")
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "dosage", nullable = false)
    private String dosage;

    @Column(name = "format", nullable = false)
    private String format;

    @Column(name = "note")
    private String note;
}
