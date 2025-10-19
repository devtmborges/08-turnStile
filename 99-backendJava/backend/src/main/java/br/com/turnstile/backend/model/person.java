package br.com.turnstile.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
// Removendo imports de relacionamento que Person não usa: ManyToOne, OneToOne, JoinColumn, MapsId

import jakarta.validation.constraints.NotNull; // << NOVO: Necessário para @NotNull
import java.time.LocalDateTime; // << NOVO: Necessário para LocalDateTime

@Entity
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @NotNull
    private String nome;

    @Column(unique = true)
    private String telefone; 
    
    private String email;

    private Boolean isMember = false; 
    
    private Boolean isMinor = false; 

    private LocalDateTime dataRegistro = LocalDateTime.now();

    // --- Construtor Padrão ---
    public Person() {}

    // ------------------------------------
    // --- GETTERS E SETTERS (COMPLETOS)---
    // ------------------------------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getIsMember() {
        return isMember;
    }

    public void setIsMember(Boolean isMember) {
        this.isMember = isMember;
    }

    public Boolean getIsMinor() {
        return isMinor;
    }

    public void setIsMinor(Boolean isMinor) {
        this.isMinor = isMinor;
    }

    public LocalDateTime getDataRegistro() {
        return dataRegistro;
    }

    public void setDataRegistro(LocalDateTime dataRegistro) {
        this.dataRegistro = dataRegistro;
    }
}