package com.aivideo.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String defaultUsername;

    @Value("${spring.datasource.password}")
    private String defaultPassword;

    @Bean
    public DataSource dataSource() throws URISyntaxException {
        String finalUrl = dbUrl;
        String username = defaultUsername;
        String password = defaultPassword;
        
        // If the URL contains postgresql:// or postgres://, it might have embedded credentials
        if (finalUrl != null && (finalUrl.startsWith("postgres://") || finalUrl.startsWith("postgresql://") || finalUrl.startsWith("jdbc:postgresql://"))) {
            
            // Normalize to a standard URI format for parsing
            String cleanUri = finalUrl.replace("jdbc:postgresql://", "postgresql://");
            URI uri = new URI(cleanUri);
            
            // Extract embedded username and password if they exist
            if (uri.getUserInfo() != null) {
                String[] auth = uri.getUserInfo().split(":");
                if (auth.length > 0) username = auth[0];
                if (auth.length > 1) password = auth[1];
            }
            
            // Construct the final valid JDBC URL without the credentials part
            String host = uri.getHost();
            int port = uri.getPort() != -1 ? uri.getPort() : 5432;
            String path = uri.getPath();
            
            finalUrl = "jdbc:postgresql://" + host + ":" + port + path;
            
            // Append query parameters if any (e.g. ?sslmode=require)
            if (uri.getQuery() != null) {
                finalUrl += "?" + uri.getQuery();
            }
        }

        return DataSourceBuilder.create()
                .url(finalUrl)
                .username(username)
                .password(password)
                .driverClassName("org.postgresql.Driver")
                .build();
    }
}
