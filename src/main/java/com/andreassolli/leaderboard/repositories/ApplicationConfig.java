package com.andreassolli.leaderboard.repositories;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class ApplicationConfig {

    @Value("DATABASEURL")
    private String databaseUrl;

    @Bean
    public DataSource dataSource(){
        return DataSourceBuilder
                .create()
                .url("jdbc:"+databaseUrl)
                .build();
    }
}
