package br.com.turnstile.backend.repository;

import java.util.List;
import br.com.turnstile.backend.model.Person;
import br.com.turnstile.backend.model.DoneService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonRepository extends JpaRepository<Person, Long> {
    
    // Método para buscar uma Pessoa pelo telefone, crucial para o login/identificação
    Optional<Person> findByTelefone(String telefone);
}