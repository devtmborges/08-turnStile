package br.com.turnstile.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;

@Entity
public class ServiceType {
    
    // Usaremos uma String (o nome do serviço) como ID para simplificar o cadastro (Ex: "Corte de Cabelo")
    @Id
    private String nome; 

    @NotNull
    private String descricao;

    // --- Construtor Padrão ---
    public ServiceType() {}

    // --- Getters e Setters ---
    
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
}