package br.com.turnstile.backend.init;

import br.com.turnstile.backend.model.Person;
import br.com.turnstile.backend.model.ServiceType;
import br.com.turnstile.backend.model.Volunteer;
import br.com.turnstile.backend.repository.PersonRepository;
import br.com.turnstile.backend.repository.ServiceTypeRepository;
import br.com.turnstile.backend.repository.VolunteerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final ServiceTypeRepository serviceTypeRepository;
    private final PersonRepository personRepository;
    private final VolunteerRepository volunteerRepository;
    private static final int IDADE_LIMITE_MENOR = 14; 

    public DataLoader(ServiceTypeRepository serviceTypeRepository, PersonRepository personRepository, VolunteerRepository volunteerRepository) {
        this.serviceTypeRepository = serviceTypeRepository;
        this.personRepository = personRepository;
        this.volunteerRepository = volunteerRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("--- Iniciando DataLoader: Inserindo dados iniciais ---");

        // 1. INSERIR TIPOS DE SERVIÇO FIXOS (apenas se a tabela estiver vazia)
        if (serviceTypeRepository.count() == 0) {
            List<ServiceType> services = Arrays.asList(
                createService("Registro", "Registro de Entrada / Cadastro"),
                createService("Lanche", "Distribuição de Alimentos"),
                createService("Orientação", "Orientação/Direcionamento"),
                createService("Aconselhamento em assistência social", "Suporte Social"),
                createService("Aconselhamento jurídico", "Suporte Jurídico"),
                createServiceWithKit("Consulta odonto", "Atendimento Dentário Completo"),
                createService("Cabeleireiro", "Corte de Cabelo"),
                createService("Consulta pediatra", "Atendimento Médico Pediátrico"),
                createService("Serviços gerais", "Atendimento de Apoio/Informação"),
                createService("Oficina 1", "Oficina de Arte"),
                createService("Oficina 9", "Oficina de Informática")
            );
            serviceTypeRepository.saveAll(services);
            System.out.println("-> " + services.size() + " Tipos de Serviço inseridos.");
        }

        // 2. INSERIR VOLUNTÁRIO DE TESTE (Garantir que os dados não existam para evitar conflito)
        if (personRepository.findByTelefone("11987654321").isEmpty()) {
            Person p1 = new Person();
            p1.setNome("Voluntário Teste");
            p1.setTelefone("11987654321");
            p1.setEmail("teste@catrasanta.com");
            
            // CORREÇÃO: Adiciona data de nascimento válida (maior de 14 anos)
            p1.setDataNascimento(LocalDate.of(1990, 1, 1)); 
            p1.setIsMinor14(false); // Já é adulto (maior de 14)

            Person savedP1 = personRepository.save(p1);

            Volunteer v1 = new Volunteer();
            v1.setPerson(savedP1);
            v1.setIsStaff(true);
            v1.setIsVolunteer1(true);
            volunteerRepository.save(v1);
            System.out.println("-> Voluntário de Teste (Tel: 11987654321) inserido.");
        }
        
        System.out.println("--- DataLoader Finalizado ---");
    }

    private ServiceType createService(String nome, String descricao) {
        ServiceType s = new ServiceType();
        s.setNome(nome);
        s.setDescricao(descricao);
        s.setIsKitBucal(false);
        return s;
    }

    private ServiceType createServiceWithKit(String nome, String descricao) {
        ServiceType s = createService(nome, descricao);
        s.setIsKitBucal(true);
        return s;
    }
}