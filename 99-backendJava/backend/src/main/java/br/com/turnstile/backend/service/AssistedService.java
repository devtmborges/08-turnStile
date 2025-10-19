package br.com.turnstile.backend.service;

import br.com.turnstile.backend.model.Assisted;
import br.com.turnstile.backend.model.Person;
import br.com.turnstile.backend.repository.AssistedRepository;
import br.com.turnstile.backend.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.ArrayList;

@Service
public class AssistedService {

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private AssistedRepository assistedRepository;

    /**
     * Registra o Responsável (com QR Code) e as crianças associadas.
     * @param qrCodeId O número do QR Code (apenas para o responsável).
     * @param responsibleName Nome do Responsável.
     * @param responsiblePhone Telefone do Responsável.
     * @param minorNames Lista de nomes das crianças (menores de idade).
     * @return Lista de todos os Assisted registrados.
     */
    @Transactional
    public List<Assisted> registerFamilyGroup(Integer qrCodeId, String responsibleName, String responsiblePhone, List<String> minorNames) {
        
        if (assistedRepository.findByQrCodeId(qrCodeId).isPresent()) {
            throw new IllegalArgumentException("O QR Code " + qrCodeId + " já está em uso.");
        }
        
        List<Assisted> registered = new ArrayList<>();

        // 1. REGISTRAR O RESPONSÁVEL (A PESSOA QUE CARREGA O QR CODE)
        Person responsiblePerson = new Person();
        responsiblePerson.setNome(responsibleName);
        responsiblePerson.setTelefone(responsiblePhone);
        responsiblePerson.setIsMinor(false); // Responsável é Adulto
        Person savedResponsiblePerson = personRepository.save(responsiblePerson);
        
        Assisted responsibleAssisted = new Assisted();
        responsibleAssisted.setPerson(savedResponsiblePerson);
        responsibleAssisted.setQrCodeId(qrCodeId); // QR Code fica no responsável
        // O responsável não tem responsável acima dele, este campo é nulo
        registered.add(assistedRepository.save(responsibleAssisted));

        // 2. REGISTRAR AS CRIANÇAS E ASSOCIÁ-LAS AO RESPONSÁVEL
        for (String minorName : minorNames) {
            Person minorPerson = new Person();
            minorPerson.setNome(minorName);
            minorPerson.setTelefone(responsiblePhone); // O telefone de contato é o mesmo
            minorPerson.setIsMinor(true); // Criança é Menor de Idade
            Person savedMinorPerson = personRepository.save(minorPerson);
            
            Assisted minorAssisted = new Assisted();
            minorAssisted.setPerson(savedMinorPerson);
            // minorAssisted.qrCodeId é NULO (não carrega QR)
            minorAssisted.setResponsible(savedResponsiblePerson); // Liga a criança ao Responsável
            registered.add(assistedRepository.save(minorAssisted));
        }
        
        return registered;
    }
    
    // NOVO MÉTODO: Para buscar todas as pessoas de um grupo pelo QR Code (para exibição)
    @Transactional(readOnly = true)
    public List<Assisted> findGroupMembersByQrCode(Integer qrCodeId) {
        Assisted responsibleAssisted = assistedRepository.findByQrCodeId(qrCodeId)
            .orElseThrow(() -> new IllegalArgumentException("QR Code inválido ou não registrado."));
        
        Person responsiblePerson = responsibleAssisted.getPerson();
        
        // Encontra todos os Assisted cujo campo 'responsible' seja o responsiblePerson
        List<Assisted> minorAssistedList = assistedRepository.findByResponsible(responsiblePerson);
        
        // Adiciona o responsável (que foi encontrado pela busca do QR Code)
        minorAssistedList.add(0, responsibleAssisted);
        
        return minorAssistedList;
    }
}