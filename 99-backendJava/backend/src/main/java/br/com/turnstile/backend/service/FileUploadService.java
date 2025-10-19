package br.com.turnstile.backend.service;

import br.com.turnstile.backend.model.Person;
import br.com.turnstile.backend.model.Volunteer;
import br.com.turnstile.backend.repository.PersonRepository;
import br.com.turnstile.backend.repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class FileUploadService {

    @Autowired
    private PersonRepository personRepository;
    
    @Autowired
    private VolunteerRepository volunteerRepository; // Para associar os Voluntários/Staff

    /**
     * Processa um arquivo CSV para carregar dados de pessoas (incluindo Voluntários).
     * O formato esperado por linha é: Nome,Telefone,Email,isVolunteer/Staff(S/N)
     */
    @Transactional
    public List<Person> processPersonCsvUpload(MultipartFile file) throws Exception {
        
        List<Person> savedPersons = new ArrayList<>();
        int lineCount = 0;
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            
            // Pula o cabeçalho
            reader.readLine();
            
            while ((line = reader.readLine()) != null) {
                lineCount++;
                String[] parts = line.split(",");
                
                if (parts.length < 4) {
                    System.err.println("Linha " + lineCount + " ignorada: formato inválido.");
                    continue;
                }
                
                // Mapeamento das colunas (Exemplo: 0: Nome, 1: Telefone, 2: Email, 3: IsVolunteer, 4: IsStaff)
                String nome = parts[0].trim();
                String telefone = parts[1].trim();
                String email = parts[2].trim();
                
                // Conversão simples para boolean basedo na coluna 3 (Voluntário) e 4 (Staff)
                boolean isVolunteer = parts[3].trim().equalsIgnoreCase("S");
                boolean isStaff = parts.length > 4 && parts[4].trim().equalsIgnoreCase("S");
                
                // Evita duplicatas por Telefone (crucial para o login)
                if (personRepository.findByTelefone(telefone).isPresent()) {
                    System.out.println("Pessoa com telefone " + telefone + " já existe. Ignorando linha " + lineCount);
                    continue;
                }
                
                // 1. Cria a Entidade Person
                Person person = new Person();
                person.setNome(nome);
                person.setTelefone(telefone);
                person.setEmail(email);
                // Menor de idade e Membro ficamos como False por padrão, mas pode ser adicionado no CSV
                
                Person savedPerson = personRepository.save(person);
                savedPersons.add(savedPerson);

                // 2. Se for Voluntário ou Staff, cria a Entidade Volunteer
                if (isVolunteer || isStaff) {
                    Volunteer volunteer = new Volunteer();
                    volunteer.setPerson(savedPerson);
                    volunteer.setIsVolunteer1(isVolunteer); // Assumindo Volunteer1 para todos os voluntários
                    volunteer.setIsStaff(isStaff);
                    volunteerRepository.save(volunteer);
                }
            }
        }
        
        System.out.println("Total de " + savedPersons.size() + " novas pessoas processadas e salvas.");
        return savedPersons;
    }
}