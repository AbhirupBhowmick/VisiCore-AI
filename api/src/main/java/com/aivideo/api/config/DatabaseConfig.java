package com.aivideo.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Bean
    public DataSource dataSource() {
        String finalUrl = dbUrl;
        
        // Render and other cloud providers often provide URLs starting with postgresql:// or postgres://
        // Java JDBC requires jdbc:postgresql://
        if (finalUrl != null && !finalUrl.startsWith("jdbc:")) {
            if (finalUrl.startsWith("postgres://")) {
                finalUrl = "jdbc:postgresql://" + finalUrl.substring("postgres://".length());
            } else if (finalUrl.startsWith("postgresql://")) {
                finalUrl = "jdbc:postgresql://" + finalUrl.substring("postgresql://".length());
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
