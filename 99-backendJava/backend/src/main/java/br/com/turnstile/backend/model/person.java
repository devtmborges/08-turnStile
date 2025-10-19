package br.com.turnstile.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

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

    // A flag "member" que você mencionou (apenas para controle interno, se for necessário)
    private Boolean isMember = false; 

    private LocalDateTime dataRegistro = LocalDateTime.now();

    // --- Construtor Padrão ---
    public Person() {}

    // --- Getters e Setters (Necessários para todos os campos) ---
    // ... (Coloque aqui todos os Getters e Setters)
}