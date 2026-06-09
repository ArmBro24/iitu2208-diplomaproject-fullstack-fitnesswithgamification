package com.example.diploma.config;

import com.example.diploma.event.ChallengeCompletedEvent;
import com.example.diploma.event.TrainingLogApprovedEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.Map;

@Configuration
public class KafkaConsumerConfig {

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, TrainingLogApprovedEvent> trainingKafkaListenerContainerFactory() {
        return createFactory(TrainingLogApprovedEvent.class);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, ChallengeCompletedEvent> challengeKafkaListenerContainerFactory() {
        return createFactory(ChallengeCompletedEvent.class);
    }

    private <T> ConcurrentKafkaListenerContainerFactory<String, T> createFactory(Class<T> eventClass) {
        JsonDeserializer<T> jsonDeserializer = new JsonDeserializer<>(eventClass, false);
        jsonDeserializer.addTrustedPackages("com.example.diploma.event");

        ErrorHandlingDeserializer<T> errorHandlingDeserializer = new ErrorHandlingDeserializer<>(jsonDeserializer);

        DefaultKafkaConsumerFactory<String, T> consumerFactory = new DefaultKafkaConsumerFactory<>(
                Map.of(
                        ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092",
                        ConsumerConfig.GROUP_ID_CONFIG, "gamification-group",
                        ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class,
                        ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, ErrorHandlingDeserializer.class
                ),
                new StringDeserializer(),
                errorHandlingDeserializer
        );

        ConcurrentKafkaListenerContainerFactory<String, T> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        return factory;
    }
}