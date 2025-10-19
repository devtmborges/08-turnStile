package br.com.turnstile.backend.repository;

import java.util.List;
import br.com.turnstile.backend.model.Person;
import br.com.turnstile.backend.model.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceTypeRepository extends JpaRepository<ServiceType, String> {
    
    // O JpaRepository usa Long como tipo de PK por padrão, mas aqui usamos String
    // porque a PK da entidade ServiceType é o nome do serviço (String).
}