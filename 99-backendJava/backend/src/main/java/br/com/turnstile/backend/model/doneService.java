package br.com.turnstile.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

// Removidos: import jakarta.persistence.Column;
// Removidos: import jakarta.persistence.OneToOne;
// Removidos: import jakarta.persistence.MapsId;

@Entity
public class DoneService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // O Voluntário que prestou o serviço (FK para Volunteer)
    @ManyToOne
    @JoinColumn(name = "volunteer_id", nullable = false)
    @NotNull
    private Volunteer volunteer;

    // A Pessoa Atendida (FK para Assisted)
    @ManyToOne
    @JoinColumn(name = "assisted_id", nullable = false)
    @NotNull
    private Assisted assisted;

    // O Tipo de Serviço (FK para ServiceType)
    @ManyToOne
    @JoinColumn(name = "service_type_name", nullable = false)
    @NotNull
    private ServiceType serviceType; 
    
    private LocalDateTime dataRegistro; // Removido .now() da declaração para usar no construtor ou setter.

    // --- Construtor Padrão ---
    public DoneService() {
        this.dataRegistro = LocalDateTime.now(); // Inicializa o timestamp aqui
    }

    // ------------------------------------
    // --- GETTERS E SETTERS (COMPLETOS)---
    // ------------------------------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Volunteer getVolunteer() {
        return volunteer;
    }

    public void setVolunteer(Volunteer volunteer) {
        this.volunteer = volunteer;
    }

    public Assisted getAssisted() {
        return assisted;
    }

    public void setAssisted(Assisted assisted) {
        this.assisted = assisted;
    }

    public ServiceType getServiceType() {
        return serviceType;
    }

    public void setServiceType(ServiceType serviceType) {
        this.serviceType = serviceType;
    }

    public LocalDateTime getDataRegistro() {
        return dataRegistro;
    }

    public void setDataRegistro(LocalDateTime dataRegistro) {
        this.dataRegistro = dataRegistro;
    }
}