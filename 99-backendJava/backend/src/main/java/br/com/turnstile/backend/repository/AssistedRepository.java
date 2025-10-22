package br.com.turnstile.backend.repository;

import br.com.turnstile.backend.model.Assisted;
import br.com.turnstile.backend.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssistedRepository extends JpaRepository<Assisted, Long> {

    // Método para buscar um Atendido pelo número do QR Code
    Optional<Assisted> findByQrCodeId(Integer qrCodeId);

    // Método para buscar a entrada Assisted correspondente a uma Person (para o responsável)
    Optional<Assisted> findByPerson(Person person);

    // Método para buscar todas as crianças ligadas a um Responsável
    List<Assisted> findByResponsible(Person responsible);
}