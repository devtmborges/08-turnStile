package br.com.turnstile.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull; // << NOVO: Import necessário para @NotNull

// Removido: import jakarta.persistence.GeneratedValue;
// Removido: import jakarta.persistence.GenerationType;
// Removido: import jakarta.persistence.ManyToOne;
// Removido: import jakarta.persistence.OneToOne;
// Removido: import jakarta.persistence.JoinColumn;
// Removido: import jakarta.persistence.MapsId;

@Entity
public class ServiceType {
    
    // Usaremos o nome (String) como ID
    @Id
    private String nome; 

    @NotNull
    private String descricao;
    
    // Indica se este serviço envolve a distribuição do Kit Higiene Bucal
    @Column(columnDefinition = "boolean default false")
    private Boolean isKitBucal = false;

    // --- Construtor Padrão ---
    public ServiceType() {}

    // ------------------------------------
    // --- GETTERS E SETTERS (COMPLETOS)---
    // ------------------------------------

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Boolean getIsKitBucal() {
        return isKitBucal;
    }

    public void setIsKitBucal(Boolean isKitBucal) {
        this.isKitBucal = isKitBucal;
    }
}