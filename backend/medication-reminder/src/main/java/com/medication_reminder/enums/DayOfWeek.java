package com.medication_reminder.enums;

public enum DayOfWeek {

    SUNDAY("Domingo"),
    MONDAY("Segunda"),
    TUESDAY("Terça"),
    WEDNESDAY("Quarta"),
    THURSDAY("Quinta"),
    FRIDAY("Sexta"),
    SATURDAY("Sábado");

    private final String label;

    DayOfWeek(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}