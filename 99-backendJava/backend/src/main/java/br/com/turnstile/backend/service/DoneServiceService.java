package br.com.turnstile.backend.service;

import br.com.turnstile.backend.model.*;
import br.com.turnstile.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class DoneServiceService {

    @Autowired
    private DoneServiceRepository doneServiceRepository;

    @Autowired
    private AssistedRepository assistedRepository;

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private ServiceTypeRepository serviceTypeRepository;

    @Autowired
    private PersonRepository personRepository; // Para buscar o voluntário pelo telefone, se necessário

    /**
     * Registra um serviço concluído.
     * @param volunteerId ID do Voluntário que prestou o serviço (vem do login/sessão).
     * @param qrCodeId ID do QR Code da pessoa atendida.
     * @param serviceName Nome do Serviço prestado (Ex: "Consulta odonto").
     * @return O registro de serviço salvo.
     */
    @Transactional
    public DoneService registerService(Long volunteerId, Integer qrCodeId, String serviceName) {
        
        // 1. Buscar o Voluntário
        Volunteer volunteer = volunteerRepository.findById(volunteerId)
                .orElseThrow(() -> new IllegalArgumentException("Voluntário não encontrado com ID: " + volunteerId));
        
        // 2. Buscar o Atendido pelo QR Code
        Assisted assisted = assistedRepository.findByQrCodeId(qrCodeId)
                .orElseThrow(() -> new IllegalArgumentException("QR Code inválido ou pessoa não registrada: " + qrCodeId));
        
        // 3. Buscar o Tipo de Serviço
        ServiceType serviceType = serviceTypeRepository.findById(serviceName)
                .orElseThrow(() -> new IllegalArgumentException("Tipo de serviço não cadastrado: " + serviceName));

        // 4. Criar o Registro
        DoneService newDoneService = new DoneService();
        newDoneService.setVolunteer(volunteer);
        newDoneService.setAssisted(assisted);
        newDoneService.setServiceType(serviceType);
        newDoneService.setDataRegistro(LocalDateTime.now());
        
        // 5. Salvar
        DoneService savedService = doneServiceRepository.save(newDoneService);

        // 6. Lógica de Negócio Adicional (Ex: Kit Bucal)
        if (serviceType.getIsKitBucal()) {
            // Futuramente, esta lógica pode ser mais complexa,
            // por exemplo, registrando a entrega em outra tabela ou campo da Assisted.
            System.out.println("LOG: Kit Higiene Bucal entregue para o QR Code: " + qrCodeId);
            // Por enquanto, apenas registramos no console/log.
        }
        
        return savedService;
    }
}