package br.com.turnstile.backend.repository;

import java.util.List;
import br.com.turnstile.backend.model.Person;
import br.com.turnstile.backend.model.DoneService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoneServiceRepository extends JpaRepository<DoneService, Long> {
    
    // Repositório de registro de serviço.
}