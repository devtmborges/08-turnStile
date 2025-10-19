package br.com.turnstile.backend.controller;

import br.com.turnstile.backend.model.Assisted;
import br.com.turnstile.backend.service.AssistedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/assisted")
public class AssistedController {

    @Autowired
    private AssistedService assistedService;

    // DTO para a requisição de registro de grupo
    // LINHA 20
    private record GroupRegistrationRequest(
        Integer qrCodeId, 
        String responsibleName, 
        String responsiblePhone, 
        List<String> minorNames
    ) {} // <<<< VERIFIQUE ESTA CHAVE DE FECHAMENTO!

    /**
     * Endpoint para registrar um grupo familiar (Responsável + Crianças) na entrada.
     */
    @PostMapping("/register-group")
    public ResponseEntity<?> registerGroup(@RequestBody GroupRegistrationRequest request) {
        // Validação básica
        if (request.qrCodeId() == null || request.qrCodeId() < 1 || request.qrCodeId() > 300) {
            return ResponseEntity.badRequest().body("ID de QR Code inválido. Deve ser entre 1 e 300.");
        }
        
        try {
            List<Assisted> registered = assistedService.registerFamilyGroup(
                request.qrCodeId(), 
                request.responsibleName(), 
                request.responsiblePhone(), 
                request.minorNames()
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(
                String.format("Grupo com QR Code %d e %d membros registrados com sucesso.", 
                request.qrCodeId(), registered.size())
            );
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno ao registrar o grupo familiar: " + e.getMessage());
        }
    }
    
    /**
     * NOVO ENDPOINT: Busca os membros do grupo pelo QR Code (Para exibição no frontend dos stands).
     */
    @GetMapping("/group/{qrCodeId}")
    public ResponseEntity<?> getGroupMembers(@PathVariable Integer qrCodeId) {
        try {
            List<Assisted> members = assistedService.findGroupMembersByQrCode(qrCodeId);
            return ResponseEntity.ok(members);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno ao buscar grupo.");
        }
    }
}