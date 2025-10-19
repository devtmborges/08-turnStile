package br.com.turnstile.backend.controller;

import br.com.turnstile.backend.model.DoneService;
import br.com.turnstile.backend.service.DoneServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/done-service")
public class DoneServiceController {

    @Autowired
    private DoneServiceService doneServiceService;

    // DTO (Data Transfer Object) para a requisição de registro de serviço
    private record ServiceRegistrationRequest(
        Long volunteerId,      // ID do Voluntário que está logado (do celular)
        Integer qrCodeId,      // ID do QR Code lido
        String serviceName     // Nome do serviço prestado (Ex: "Consulta odonto", "Lanche")
    ) {}

    /**
     * Endpoint para um voluntário registrar a conclusão de um serviço para um QR Code.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerDoneService(@RequestBody ServiceRegistrationRequest request) {
        
        // 1. Validação básica de entrada
        if (request.volunteerId() == null || request.qrCodeId() == null || request.serviceName() == null || request.serviceName().isEmpty()) {
            return ResponseEntity.badRequest().body("Dados de registro incompletos.");
        }
        
        // 2. Validação do QR Code
        if (request.qrCodeId() < 1 || request.qrCodeId() > 300) {
            return ResponseEntity.badRequest().body("ID de QR Code inválido. Deve ser entre 1 e 300.");
        }
        
        try {
            // Chama a lógica de negócio principal
            DoneService savedService = doneServiceService.registerService(
                request.volunteerId(),
                request.qrCodeId(),
                request.serviceName()
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(
                String.format("Serviço '%s' registrado com sucesso para o QR Code %d. Registro ID: %d", 
                savedService.getServiceType().getNome(), 
                savedService.getAssisted().getQrCodeId(), // Pega o QR ID do Assisted
                savedService.getId())
            );
            
        } catch (IllegalArgumentException e) {
            // Erros de regras de negócio (Voluntário não encontrado, QR Code inválido, Serviço inexistente)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            // Erro genérico
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno ao registrar o serviço: " + e.getMessage());
        }
    }
}