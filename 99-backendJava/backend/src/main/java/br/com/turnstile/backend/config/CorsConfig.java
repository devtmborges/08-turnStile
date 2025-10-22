package br.com.turnstile.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuração explícita e permissiva do CORS para permitir que o frontend (Vite/React) acesse a API.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Aplica o CORS a todos os endpoints

                // Removemos o wildcard "*" pois ele não é compatível com allowCredentials=true.
                // Listamos explicitamente todas as origens locais possíveis.
                .allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173", "http://192.168.25.106", "http://192.168.25.106:5173") 
                
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") 
                .allowedHeaders("*") 
                .allowCredentials(true) 
                .maxAge(3600);
    }
}