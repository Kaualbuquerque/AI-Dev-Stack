package kaua.AI_Dev_Stack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

@SpringBootApplication
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class AiDevStackApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiDevStackApplication.class, args);

		System.out.println("Servidor rodando: http://localhost:8081/swagger-ui");

	}
}
