package com.example.diploma.kafka;


import com.example.diploma.event.ChallengeCompletedEvent;
import com.example.diploma.event.PointsAwardedEvent;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.Map;

@Configuration
public class KafkaConsumerConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, PointsAwardedEvent>
    pointsAwardedKafkaListenerContainerFactory() {
        return factoryFor(PointsAwardedEvent.class);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, ChallengeCompletedEvent>
    challengeCompletedKafkaListenerContainerFactory() {
        return factoryFor(ChallengeCompletedEvent.class);
    }

    private <T> ConcurrentKafkaListenerContainerFactory<String, T> factoryFor(Class<T> eventClass) {
        JsonDeserializer<T> jsonDeserializer = new JsonDeserializer<>(eventClass);
        jsonDeserializer.addTrustedPackages("com.example.diploma.event");
        jsonDeserializer.setUseTypeHeaders(false);
        jsonDeserializer.ignoreTypeHeaders();

        ErrorHandlingDeserializer<T> errorHandlingDeserializer =
                new ErrorHandlingDeserializer<>(jsonDeserializer);

        DefaultKafkaConsumerFactory<String, T> consumerFactory =
                new DefaultKafkaConsumerFactory<>(
                        Map.of("bootstrap.servers", bootstrapServers),
                        new StringDeserializer(),
                        errorHandlingDeserializer
                );

        ConcurrentKafkaListenerContainerFactory<String, T> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(consumerFactory);
        return factory;
    }
}