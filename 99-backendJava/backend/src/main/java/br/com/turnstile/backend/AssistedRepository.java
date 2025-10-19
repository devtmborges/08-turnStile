package br.com.turnstile.backend.repository;

import br.com.turnstile.backend.model.Assisted;
import br.com.turnstile.backend.model.Person; // Import necessário
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List; // Import necessário

public interface AssistedRepository extends JpaRepository<Assisted, Long> {
    
    // Método obrigatório para buscar um Atendido pelo número do QR Code
    // Resolve os 3 erros de 'cannot find symbol' nos Services.
    Optional<Assisted> findByQrCodeId(Integer qrCodeId); 

    // Método para buscar todos os membros do grupo pelo responsável (usado em AssistedService)
    List<Assisted> findByResponsible(Person responsible);
}