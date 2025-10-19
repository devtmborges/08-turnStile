package br.com.turnstile.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // Permite conexões do localhost do dev (5173), 127.0.0.1 e o IP da sua rede (10.86.36.157).
                .allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173", "http://10.86.36.157:5173", "http://10.86.36.157", "*") 
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") 
                .allowedHeaders("*") 
                .allowCredentials(true) 
                .maxAge(3600);
    }
}