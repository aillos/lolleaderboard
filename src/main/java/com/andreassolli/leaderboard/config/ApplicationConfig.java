package com.andreassolli.leaderboard.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class ApplicationConfig {

    @Value("${DATABASEURL}")
    private String databaseUrl;

    private String getDatabase(){
        return databaseUrl;

    }

    @Bean
    public DataSource dataSource(){
        return DataSourceBuilder
                .create()
                .url("jdbc:"+getDatabase())
                .build();
    }
}
