package br.com.turnstile.backend.service;

import br.com.turnstile.backend.model.Person;
import br.com.turnstile.backend.model.Volunteer;
import br.com.turnstile.backend.repository.PersonRepository;
import br.com.turnstile.backend.repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VolunteerService {

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private VolunteerRepository volunteerRepository;

    /**
     * Tenta encontrar e autenticar um voluntário pelo número de telefone.
     *
     * @param telefone O número de telefone fornecido pelo usuário.
     * @return O objeto Volunteer (com a PK) se encontrado e for um voluntário.
     * @throws IllegalArgumentException Se o telefone não for encontrado ou se a pessoa não for voluntária.
     */
    public Volunteer authenticateVolunteer(String telefone) {
        // 1. Encontrar a Pessoa pelo Telefone
        Optional<Person> personOpt = personRepository.findByTelefone(telefone);

        if (personOpt.isEmpty()) {
            throw new IllegalArgumentException("Telefone não encontrado. Verifique se o seu número está cadastrado.");
        }

        Person person = personOpt.get();

        // 2. Tentar encontrar a entrada correspondente em Volunteer
        // A PK do Volunteer é a mesma PK da Person, logo usamos person.getId()
        Optional<Volunteer> volunteerOpt = volunteerRepository.findById(person.getId());

        if (volunteerOpt.isEmpty()) {
            // Se a pessoa existe (tabela Person), mas não é voluntária (tabela Volunteer)
            throw new IllegalArgumentException("Usuário encontrado, mas não está cadastrado como Voluntário ativo.");
        }

        return volunteerOpt.get();
    }
}