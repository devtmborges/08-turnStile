package br.com.turnstile.backend.controller;

import br.com.turnstile.backend.model.Person;
import br.com.turnstile.backend.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/data")
public class DataUploadController {

    @Autowired
    private FileUploadService fileUploadService;

    /**
     * Endpoint para fazer o upload de um arquivo CSV de pessoas/voluntários.
     * Requer um arquivo de formato: Nome,Telefone,Email,isVolunteer(S/N),isStaff(S/N)
     */
    @PostMapping("/upload-persons")
    public ResponseEntity<?> uploadPersonsFile(@RequestParam("file") MultipartFile file) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("O arquivo está vazio.");
        }
        
        if (!file.getContentType().equals("text/csv")) {
             // Aceita csv e tipos comuns de excel exportado como csv
             String contentType = file.getContentType();
             if (!(contentType.equals("text/csv") || contentType.equals("application/vnd.ms-excel") || contentType.equals("application/csv"))) {
                return ResponseEntity.badRequest().body("Formato de arquivo não suportado. Use CSV.");
             }
        }
        
        try {
            List<Person> savedPersons = fileUploadService.processPersonCsvUpload(file);
            
            return ResponseEntity.ok(
                String.format("Upload de dados concluído. %d novas pessoas registradas com sucesso.", savedPersons.size())
            );
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao processar o arquivo: " + e.getMessage());
        }
    }
}