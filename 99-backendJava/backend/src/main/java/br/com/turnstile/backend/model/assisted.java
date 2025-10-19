package br.com.turnstile.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.validation.constraints.NotNull;
import jakarta.persistence.Column;

@Entity
public class Assisted {

    // A chave primária é a mesma ID da Pessoa (relação 1:1)
    @Id 
    private Long id; 

    // O ID do QR Code (de 1 a 300) - Este campo precisa ser único
    @NotNull
    @Column(unique = true) 
    private Integer qrCodeId;
    
    // A Pessoa associada a este QR Code
    @OneToOne
    @MapsId // Mapeia a PK desta entidade para a PK da Person
    @JoinColumn(name = "person_id")
    private Person person;
    
    // --- Construtor Padrão ---
    public Assisted() {}

    // --- Getters e Setters ---
    
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
}