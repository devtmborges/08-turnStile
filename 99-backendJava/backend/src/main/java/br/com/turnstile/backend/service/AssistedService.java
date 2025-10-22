package br.com.turnstile.backend.service;

import br.com.turnstile.backend.model.Assisted;
import br.com.turnstile.backend.model.Person;
import br.com.turnstile.backend.repository.AssistedRepository;
import br.com.turnstile.backend.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class AssistedService {

    // Idade limite para ser considerado menor (14 anos)
    private static final int IDADE_LIMITE_MENOR = 14;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private AssistedRepository assistedRepository;

    // Record para receber os dados de registro da criança (usado na Controller)
    public record MinorRegistration(String nome, String dataNascimento, Integer qrCodeId) {}
    
    /**
     * Registra o Responsável (com QR Code) e as crianças associadas (com QR Code individual).
     * @param qrCodeId ID do QR Code do responsável.
     * @param responsibleName Nome do Responsável.
     * @param responsiblePhone Telefone do Responsável.
     * @param responsibleBirthDate Data de Nascimento do Responsável (formato YYYY-MM-DD).
     * @param minors Lista de objetos com Nome, Data de Nasc. e QR ID da criança.
     * @return Lista de todos os Assisted registrados.
     */
    @Transactional
    public List<Assisted> registerFamilyGroup(Integer qrCodeId, String responsibleName, String responsiblePhone, String responsibleBirthDate, List<MinorRegistration> minors) {
        
        // 1. Verificar se o QR Code do RESPONSÁVEL já está em uso
        if (assistedRepository.findByQrCodeId(qrCodeId).isPresent()) {
            throw new IllegalArgumentException("O QR Code do responsável (" + qrCodeId + ") já está em uso.");
        }
        
        List<Assisted> registered = new ArrayList<>();
        LocalDate responsibleDob = LocalDate.parse(responsibleBirthDate);
        
        // 2. REGISTRAR O RESPONSÁVEL
        Person responsiblePerson = new Person();
        responsiblePerson.setNome(responsibleName);
        responsiblePerson.setTelefone(responsiblePhone);
        responsiblePerson.setDataNascimento(responsibleDob);
        
        // CUIDADO: calcularIdade() é um método que deve existir na sua classe Person.java!
        // Se este método não existir, o compilador irá falhar aqui.
        responsiblePerson.setIsMinor14(responsiblePerson.calcularIdade() < IDADE_LIMITE_MENOR);
        
        // Regra de Negócio: Responsável deve ser maior de 14 anos
        if (responsiblePerson.getIsMinor14()) {
             throw new IllegalArgumentException("O responsável deve ser maior de 14 anos.");
        }
        
        Person savedResponsiblePerson = personRepository.save(responsiblePerson);
        
        Assisted responsibleAssisted = new Assisted();
        responsibleAssisted.setPerson(savedResponsiblePerson);
        responsibleAssisted.setQrCodeId(qrCodeId); 
        responsibleAssisted.setResponsible(null); 
        registered.add(assistedRepository.save(responsibleAssisted));

        // 3. REGISTRAR AS CRIANÇAS (COM QR CODE INDIVIDUAL E ANINHADO)
        for (MinorRegistration minor : minors) {
            LocalDate minorDob = LocalDate.parse(minor.dataNascimento());
            
            // 3.1. Validação: Checar se o QR Code da CRIANÇA já está em uso
            if (minor.qrCodeId() != null && assistedRepository.findByQrCodeId(minor.qrCodeId()).isPresent()) {
                 throw new IllegalArgumentException("O QR Code da criança (" + minor.qrCodeId() + ") já está em uso.");
            }
            
            Person minorPerson = new Person();
            minorPerson.setNome(minor.nome());
            minorPerson.setTelefone(responsiblePhone);
            minorPerson.setDataNascimento(minorDob);
            minorPerson.setIsMinor14(minorPerson.calcularIdade() < IDADE_LIMITE_MENOR);
            
            // Regra: Criança DEVE ser menor de 14 anos para ser registrada como 'minor'
            if (!minorPerson.getIsMinor14()) {
                 throw new IllegalArgumentException("A criança " + minor.nome() + " é maior de 14 anos e deve ser registrada como responsável individualmente.");
            }
            
            Person savedMinorPerson = personRepository.save(minorPerson);
            
            Assisted minorAssisted = new Assisted();
            minorAssisted.setPerson(savedMinorPerson);
            minorAssisted.setQrCodeId(minor.qrCodeId()); // QR Code individual da criança
            minorAssisted.setResponsible(savedResponsiblePerson); // Liga a criança ao Responsável
            registered.add(assistedRepository.save(minorAssisted));
        }
        
        return registered;
    }
    
    // Busca todos os membros de um grupo pelo QR Code (para exibição)
    @Transactional(readOnly = true)
    public List<Assisted> findGroupMembersByQrCode(Integer qrCodeId) {
        Assisted checkAssisted = assistedRepository.findByQrCodeId(qrCodeId)
            .orElseThrow(() -> new IllegalArgumentException("QR Code inválido ou não registrado."));
        
        Person currentPerson = checkAssisted.getPerson();
        
        // Se a pessoa escaneada for uma CRIANÇA, subimos para buscar o RESPONSÁVEL.
        if (checkAssisted.getResponsible() != null) {
            currentPerson = checkAssisted.getResponsible(); // Usa o responsável como ponto de partida
        }
        
        // Encontra o registro principal do responsável (a pessoa que não tem responsible_id setado e tem QR setado)
        Optional<Assisted> responsibleAssistedOpt = assistedRepository.findByPerson(currentPerson);
        
        Assisted responsibleAssisted = responsibleAssistedOpt
                .orElseThrow(() -> new IllegalStateException("Falha na estrutura de dados: Responsável não encontrado na tabela Assisted."));
        
        // Encontra todas as crianças ligadas a este responsável
        List<Assisted> minorAssistedList = assistedRepository.findByResponsible(currentPerson);
        
        // Monta a lista final (Responsável na frente)
        List<Assisted> groupList = new ArrayList<>();
        groupList.add(responsibleAssisted);
        groupList.addAll(minorAssistedList);
        
        return groupList;
    }
}