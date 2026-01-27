package kaua.AI_Dev_Stack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

@SpringBootApplication
public class AiDevStackApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiDevStackApplication.class, args);

		System.out.println("Servidor rodando!!");

	}
}
