# Estágio 1: Usar uma imagem leve do JDK para rodar a aplicação
FROM eclipse-temurin:21-jdk-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o arquivo .jar gerado para dentro do container
# Dica: Ajuste o caminho conforme seu gerenciador (target/ ou build/libs/)
COPY target/*.jar app.jar

# Expõe a porta que o Spring Boot usa (geralmente 8080)
EXPOSE 8081

# Comando para iniciar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]