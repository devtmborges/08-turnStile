package br.com.turnstile.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

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
    private Assisted assisted; // Agora faz a relação com a tabela que tem o QR Code

    // O Tipo de Serviço (FK para ServiceType)
    @ManyToOne
    @JoinColumn(name = "service_type_name", nullable = false)
    @NotNull
    private ServiceType serviceType; 
    
    private LocalDateTime dataRegistro = LocalDateTime.now();

    // --- Construtores, Getters e Setters aqui ---
    // ...
}