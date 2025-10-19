package br.com.turnstile.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
// import de Person é necessário se estiver no mesmo pacote, mas para segurança, vamos adicioná-lo
// Se Person estiver no mesmo pacote, o import abaixo não é estritamente necessário, mas ajuda em muitos IDEs.
// No entanto, vou assumir que você precisa do import de Person em outras classes para evitar erro de 'cannot find symbol'
// e que, aqui, como estão no mesmo pacote, o erro é por estarem faltando em outros lugares.

// Removidos: import jakarta.persistence.GeneratedValue;
// Removidos: import jakarta.persistence.GenerationType;
// Removidos: import jakarta.persistence.Column;
// Removidos: import jakarta.persistence.ManyToOne;

@Entity
public class Volunteer {

    // A chave primária é a mesma ID da Pessoa (relação 1:1)
    @Id
    private Long id;
    
    // Flags booleanas para diferentes funções
    private Boolean isStaff = false;
    private Boolean isVolunteer1 = true;
    private Boolean isVolunteer2 = false;

    @OneToOne
    @MapsId // Mapeia a PK desta entidade para a PK da Person
    @JoinColumn(name = "person_id")
    private Person person;

    // --- Construtor Padrão ---
    public Volunteer() {}

    // ------------------------------------
    // --- GETTERS E SETTERS (COMPLETOS)---
    // ------------------------------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIsStaff() {
        return isStaff;
    }

    public void setIsStaff(Boolean isStaff) {
        this.isStaff = isStaff;
    }

    public Boolean getIsVolunteer1() {
        return isVolunteer1;
    }

    public void setIsVolunteer1(Boolean isVolunteer1) {
        this.isVolunteer1 = isVolunteer1;
    }

    public Boolean getIsVolunteer2() {
        return isVolunteer2;
    }

    public void setIsVolunteer2(Boolean isVolunteer2) {
        this.isVolunteer2 = isVolunteer2;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }
}