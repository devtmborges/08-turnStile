package br.com.turnstile.backend.repository;

import java.util.List;
import br.com.turnstile.backend.model.Person;
import br.com.turnstile.backend.model.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {
    
    // JpaRepository já fornece todos os métodos básicos (findById, findAll, save, delete)
    // Não precisamos de métodos customizados aqui por enquanto.
}