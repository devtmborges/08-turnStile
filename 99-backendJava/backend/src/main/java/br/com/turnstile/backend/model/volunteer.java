package br.com.turnstile.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;

@Entity
public class Volunteer {

    // A chave primária é a mesma ID da Pessoa (relação 1:1)
    @Id
    private Long id;
    
    // Flags booleanas para diferentes funções (simplificando sua ideia inicial de booleans)
    private Boolean isStaff = false;
    private Boolean isVolunteer1 = true; // Exemplo de Voluntário de Serviço 1
    private Boolean isVolunteer2 = false; // Exemplo de Voluntário de Serviço 2

    @OneToOne
    @MapsId // Mapeia a PK desta entidade para a PK da Person
    @JoinColumn(name = "person_id")
    private Person person;

    // --- Construtor Padrão ---
    public Volunteer() {}

    // --- Getters e Setters ---

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