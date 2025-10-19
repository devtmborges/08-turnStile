package br.com.turnstile.backend.controller;

import br.com.turnstile.backend.model.Volunteer;
import br.com.turnstile.backend.service.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/volunteer")
public class VolunteerController {

    @Autowired
    private VolunteerService volunteerService;

    // Classe interna simples para retorno de sucesso (DTO)
    private static class VolunteerInfo {
        public Long id;
        public String nome;
        public String funcao; // Podemos mapear as flags booleans para uma "funcao"
        
        public VolunteerInfo(Volunteer volunteer) {
            this.id = volunteer.getId();
            // A informação do nome está na Person, precisamos buscar...
            // Por enquanto, vamos retornar apenas o ID do voluntário, que é o que o frontend precisa.
            
            // NOTE: Para obter o nome e função, o VolunteerService precisaria carregar a entidade Person.
            // Para simplificar agora, o frontend usará apenas o ID.
            this.nome = volunteer.getPerson().getNome(); 
            this.funcao = getFuncao(volunteer);
        }

        // Método simples para derivar uma "função" do voluntário para exibição no frontend
        private String getFuncao(Volunteer v) {
            if (v.getIsStaff()) return "Staff/Coordenador";
            if (v.getIsVolunteer1()) return "Voluntário Serviço 1";
            if (v.getIsVolunteer2()) return "Voluntário Serviço 2";
            return "Voluntário Geral";
        }
    }


    /**
     * Endpoint de login simplificado (identificação) pelo número de telefone.
     * O frontend enviará o telefone e receberá o ID único do voluntário para usar nos registros.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String telefone) {
        try {
            Volunteer volunteer = volunteerService.authenticateVolunteer(telefone);
            
            // Retorna o ID e informações úteis do voluntário
            return ResponseEntity.ok(new VolunteerInfo(volunteer));
            
        } catch (IllegalArgumentException e) {
            // Retorna erro se a autenticação falhar
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            // Erro genérico
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno no servidor.");
        }
    }
}