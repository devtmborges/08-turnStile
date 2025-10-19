package br.com.turnstile.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.validation.constraints.NotNull; // << NOVO: Necessário para @NotNull

// Removido: import jakarta.persistence.GeneratedValue;
// Removido: import jakarta.persistence.GenerationType;

@Entity
public class Assisted {

    @Id 
    private Long id; 

    // O QR Code ID não é @NotNull porque menores não o terão, mas o responsável sim
    @Column(unique = true) 
    private Integer qrCodeId;
    
    // A Pessoa associada a este registro de atendimento
    @OneToOne
    @MapsId 
    @JoinColumn(name = "person_id")
    @NotNull // O Assisted DEVE estar associado a uma Person
    private Person person;
    
    // Linka este atendido (criança) ao seu responsável
    @ManyToOne
    @JoinColumn(name = "responsible_id")
    private Person responsible; 
    
    // --- Construtor Padrão ---
    public Assisted() {}

    // ------------------------------------
    // --- GETTERS E SETTERS (COMPLETOS)---
    // ------------------------------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQrCodeId() {
        return qrCodeId;
    }

    public void setQrCodeId(Integer qrCodeId) {
        this.qrCodeId = qrCodeId;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public Person getResponsible() {
        return responsible;
    }

    public void setResponsible(Person responsible) {
        this.responsible = responsible;
    }
}